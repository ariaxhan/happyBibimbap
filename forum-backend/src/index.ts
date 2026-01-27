/**
 * Happy Bibimbap Forum API
 * Cloudflare Workers + D1
 */

interface Env {
  DB: D1Database;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW: string;
  RATE_LIMIT_MAX_REQUESTS: string;
}

// CORS headers helper
function getCorsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Username',
    'Access-Control-Max-Age': '86400',
  };
}

// Response helper
function jsonResponse(data: any, status = 200, corsOrigin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(corsOrigin),
    },
  });
}

// Error response helper
function errorResponse(message: string, status = 400, corsOrigin: string): Response {
  return jsonResponse({ error: message }, status, corsOrigin);
}

// Rate limiting (simple in-memory, resets on worker restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, window: number, maxRequests: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + window * 1000 });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Get or create user
async function getOrCreateUser(db: D1Database, username: string): Promise<number> {
  // Validate username
  if (!username || username.length < 3 || username.length > 20) {
    throw new Error('Username must be 3-20 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }

  // Try to get existing user
  const existing = await db
    .prepare('SELECT id FROM users WHERE username = ?')
    .bind(username)
    .first<{ id: number }>();

  if (existing) {
    return existing.id;
  }

  // Create new user
  const result = await db
    .prepare('INSERT INTO users (username) VALUES (?) RETURNING id')
    .bind(username)
    .first<{ id: number }>();

  if (!result) {
    throw new Error('Failed to create user');
  }

  return result.id;
}

// Router
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsOrigin = env.CORS_ORIGIN || '*';

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: getCorsHeaders(corsOrigin),
      });
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitWindow = parseInt(env.RATE_LIMIT_WINDOW || '60');
    const rateLimitMax = parseInt(env.RATE_LIMIT_MAX_REQUESTS || '10');

    if (!checkRateLimit(ip, rateLimitWindow, rateLimitMax)) {
      return errorResponse('Rate limit exceeded. Please try again later.', 429, corsOrigin);
    }

    try {
      // GET /api/threads - List all threads
      if (path === '/api/threads' && method === 'GET') {
        const threads = await env.DB.prepare(`
          SELECT
            t.id,
            t.title,
            t.created_at,
            t.last_activity,
            u.username as author,
            (SELECT COUNT(*) FROM posts WHERE thread_id = t.id) as post_count,
            (SELECT COUNT(*) FROM likes WHERE post_id IN (SELECT id FROM posts WHERE thread_id = t.id)) as like_count
          FROM threads t
          JOIN users u ON t.author_id = u.id
          ORDER BY t.last_activity DESC
          LIMIT 50
        `).all();

        return jsonResponse({ threads: threads.results }, 200, corsOrigin);
      }

      // POST /api/threads - Create new thread
      if (path === '/api/threads' && method === 'POST') {
        const username = request.headers.get('X-Username');
        if (!username) {
          return errorResponse('Username required in X-Username header', 401, corsOrigin);
        }

        const body = await request.json() as { title: string; content: string };

        if (!body.title || body.title.length < 5 || body.title.length > 200) {
          return errorResponse('Title must be 5-200 characters', 400, corsOrigin);
        }

        if (!body.content || body.content.length < 1 || body.content.length > 5000) {
          return errorResponse('Content must be 1-5000 characters', 400, corsOrigin);
        }

        const userId = await getOrCreateUser(env.DB, username);

        // Create thread and first post in a transaction
        const threadResult = await env.DB.prepare(
          'INSERT INTO threads (title, author_id) VALUES (?, ?) RETURNING id'
        ).bind(body.title, userId).first<{ id: number }>();

        if (!threadResult) {
          return errorResponse('Failed to create thread', 500, corsOrigin);
        }

        await env.DB.prepare(
          'INSERT INTO posts (thread_id, author_id, content) VALUES (?, ?, ?)'
        ).bind(threadResult.id, userId, body.content).run();

        return jsonResponse({
          success: true,
          thread_id: threadResult.id
        }, 201, corsOrigin);
      }

      // GET /api/threads/:id - Get thread with posts
      if (path.match(/^\/api\/threads\/\d+$/) && method === 'GET') {
        const threadId = parseInt(path.split('/').pop()!);

        const thread = await env.DB.prepare(`
          SELECT
            t.id,
            t.title,
            t.created_at,
            u.username as author
          FROM threads t
          JOIN users u ON t.author_id = u.id
          WHERE t.id = ?
        `).bind(threadId).first();

        if (!thread) {
          return errorResponse('Thread not found', 404, corsOrigin);
        }

        const posts = await env.DB.prepare(`
          SELECT
            p.id,
            p.content,
            p.created_at,
            u.username as author,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
          FROM posts p
          JOIN users u ON p.author_id = u.id
          WHERE p.thread_id = ?
          ORDER BY p.created_at ASC
        `).bind(threadId).all();

        return jsonResponse({
          thread,
          posts: posts.results
        }, 200, corsOrigin);
      }

      // POST /api/threads/:id/posts - Reply to thread
      if (path.match(/^\/api\/threads\/\d+\/posts$/) && method === 'POST') {
        const threadId = parseInt(path.split('/')[3]);
        const username = request.headers.get('X-Username');

        if (!username) {
          return errorResponse('Username required in X-Username header', 401, corsOrigin);
        }

        const body = await request.json() as { content: string };

        if (!body.content || body.content.length < 1 || body.content.length > 5000) {
          return errorResponse('Content must be 1-5000 characters', 400, corsOrigin);
        }

        const userId = await getOrCreateUser(env.DB, username);

        // Check thread exists
        const thread = await env.DB.prepare('SELECT id FROM threads WHERE id = ?')
          .bind(threadId).first();

        if (!thread) {
          return errorResponse('Thread not found', 404, corsOrigin);
        }

        // Create post and update thread last_activity
        const postResult = await env.DB.prepare(
          'INSERT INTO posts (thread_id, author_id, content) VALUES (?, ?, ?) RETURNING id'
        ).bind(threadId, userId, body.content).first<{ id: number }>();

        await env.DB.prepare(
          'UPDATE threads SET last_activity = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(threadId).run();

        return jsonResponse({
          success: true,
          post_id: postResult?.id
        }, 201, corsOrigin);
      }

      // POST /api/posts/:id/like - Like a post
      if (path.match(/^\/api\/posts\/\d+\/like$/) && method === 'POST') {
        const postId = parseInt(path.split('/')[3]);
        const username = request.headers.get('X-Username');

        if (!username) {
          return errorResponse('Username required in X-Username header', 401, corsOrigin);
        }

        const userId = await getOrCreateUser(env.DB, username);

        // Check if already liked
        const existing = await env.DB.prepare(
          'SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?'
        ).bind(userId, postId).first();

        if (existing) {
          // Unlike
          await env.DB.prepare(
            'DELETE FROM likes WHERE user_id = ? AND post_id = ?'
          ).bind(userId, postId).run();

          return jsonResponse({ success: true, liked: false }, 200, corsOrigin);
        } else {
          // Like
          await env.DB.prepare(
            'INSERT INTO likes (user_id, post_id) VALUES (?, ?)'
          ).bind(userId, postId).run();

          return jsonResponse({ success: true, liked: true }, 200, corsOrigin);
        }
      }

      // GET /api/stats - Forum statistics
      if (path === '/api/stats' && method === 'GET') {
        const stats = await env.DB.prepare(`
          SELECT
            (SELECT COUNT(*) FROM users) as user_count,
            (SELECT COUNT(*) FROM threads) as thread_count,
            (SELECT COUNT(*) FROM posts) as post_count,
            (SELECT COUNT(*) FROM likes) as like_count
        `).first();

        return jsonResponse({ stats }, 200, corsOrigin);
      }

      // 404 - Not found
      return errorResponse('Endpoint not found', 404, corsOrigin);

    } catch (error: any) {
      console.error('Error:', error);
      return errorResponse(error.message || 'Internal server error', 500, corsOrigin);
    }
  },
};
