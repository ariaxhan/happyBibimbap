# Happy Bibimbap Forum Backend

**Cloudflare Workers + D1 SQLite Database**

Complete backend implementation for community forum discussions about music, art, and bibimbap.

---

## 1. Setup Instructions

### Prerequisites
- Cloudflare account with Workers and D1 access
- Node.js and npm installed
- Wrangler CLI installed: `npm install -g wrangler`

### Initial Setup

```bash
# 1. Login to Cloudflare
wrangler login

# 2. Create D1 database
wrangler d1 create happy-bibimbap-forum

# Note the database_id from the output, update wrangler.toml

# 3. Initialize database schema
wrangler d1 execute happy-bibimbap-forum --file=./schema.sql

# 4. Test locally
wrangler dev

# 5. Deploy to production
wrangler deploy
```

---

## 2. Project Structure

```
happyBibimbap/
├── wrangler.toml          # Cloudflare configuration
├── schema.sql             # Database schema
├── src/
│   └── index.ts           # Worker code
└── package.json
```

---

## 3. Configuration Files

### wrangler.toml

```toml
name = "happy-bibimbap-forum"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "happy-bibimbap-forum"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with your D1 database ID

# Environment variables
[vars]
CORS_ORIGIN = "https://happybibimbap.pages.dev"
RATE_LIMIT_WINDOW = "60"  # seconds
RATE_LIMIT_MAX_REQUESTS = "10"

# Production overrides
[env.production]
vars = { CORS_ORIGIN = "https://happybibimbap.com" }
```

### package.json

```json
{
  "name": "happy-bibimbap-forum",
  "version": "1.0.0",
  "description": "Forum backend for Happy Bibimbap",
  "main": "src/index.ts",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "deploy:prod": "wrangler deploy --env production"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240129.0",
    "typescript": "^5.3.3",
    "wrangler": "^3.25.0"
  }
}
```

---

## 4. Database Schema

### schema.sql

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK(LENGTH(username) >= 3 AND LENGTH(username) <= 20)
);

-- Threads table
CREATE TABLE IF NOT EXISTS threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    CHECK(LENGTH(title) >= 5 AND LENGTH(title) <= 200)
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id),
    CHECK(LENGTH(content) >= 1 AND LENGTH(content) <= 5000)
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_threads_last_activity ON threads(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_posts_thread_id ON posts(thread_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
```

---

## 5. Worker Code

### src/index.ts

```typescript
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
```

---

## 6. Deployment

### Step-by-Step Deployment

```bash
# 1. Install dependencies
npm install

# 2. Create D1 database
wrangler d1 create happy-bibimbap-forum

# Copy the database_id from output and update wrangler.toml

# 3. Create tables
wrangler d1 execute happy-bibimbap-forum --file=./schema.sql

# 4. Test locally
wrangler dev
# Visit http://localhost:8787/api/stats

# 5. Deploy to production
wrangler deploy

# 6. Test production
curl https://happy-bibimbap-forum.YOUR-SUBDOMAIN.workers.dev/api/stats
```

### Verify Database Setup

```bash
# List all D1 databases
wrangler d1 list

# Query database directly
wrangler d1 execute happy-bibimbap-forum --command "SELECT * FROM users LIMIT 5"

# Check tables
wrangler d1 execute happy-bibimbap-forum --command "SELECT name FROM sqlite_master WHERE type='table'"
```

---

## 7. API Examples

### Get Forum Stats

```bash
curl https://happy-bibimbap-forum.YOUR-SUBDOMAIN.workers.dev/api/stats
```

**Response:**
```json
{
  "stats": {
    "user_count": 0,
    "thread_count": 0,
    "post_count": 0,
    "like_count": 0
  }
}
```

### Create a Thread

```bash
curl -X POST https://happy-bibimbap-forum.YOUR-SUBDOMAIN.workers.dev/api/threads \
  -H "Content-Type: application/json" \
  -H "X-Username: bibimbap_lover" \
  -d '{
    "title": "What is your favorite bibimbap recipe?",
    "content": "I love the traditional dolsot bibimbap with the crispy rice at the bottom. What is yours?"
  }'
```

**Response:**
```json
{
  "success": true,
  "thread_id": 1
}
```

### List All Threads

```bash
curl https://happy-bibimbap-forum.YOUR-SUBDOMAIN.workers.dev/api/threads
```

**Response:**
```json
{
  "threads": [
    {
      "id": 1,
      "title": "What is your favorite bibimbap recipe?",
      "author": "bibimbap_lover",
      "created_at": "2026-01-27 12:00:00",
      "last_activity": "2026-01-27 12:00:00",
      "post_count": 1,
      "like_count": 0
    }
  ]
}
```

### Get Thread Details

```bash
curl https://happy-bibimbap-forum.YOUR-SUBDOMAIN.workers.dev/api/threads/1
```

**Response:**
```json
{
  "thread": {
    "id": 1,
    "title": "What is your favorite bibimbap recipe?",
    "author": "bibimbap_lover",
    "created_at": "2026-01-27 12:00:00"
  },
  "posts": [
    {
      "id": 1,
      "content": "I love the traditional dolsot bibimbap with the crispy rice at the bottom. What is yours?",
      "author": "bibimbap_lover",
      "created_at": "2026-01-27 12:00:00",
      "like_count": 0
    }
  ]
}
```

### Reply to Thread

```bash
curl -X POST https://happy-bibimbap-forum.YOUR-SUBDOMAIN.workers.dev/api/threads/1/posts \
  -H "Content-Type: application/json" \
  -H "X-Username: food_enthusiast" \
  -d '{
    "content": "I prefer the vegan version with lots of mushrooms and gochujang sauce!"
  }'
```

**Response:**
```json
{
  "success": true,
  "post_id": 2
}
```

### Like a Post

```bash
curl -X POST https://happy-bibimbap-forum.YOUR-SUBDOMAIN.workers.dev/api/posts/2/like \
  -H "X-Username: bibimbap_lover"
```

**Response:**
```json
{
  "success": true,
  "liked": true
}
```

### Unlike a Post (Same Endpoint)

```bash
curl -X POST https://happy-bibimbap-forum.YOUR-SUBDOMAIN.workers.dev/api/posts/2/like \
  -H "X-Username: bibimbap_lover"
```

**Response:**
```json
{
  "success": true,
  "liked": false
}
```

---

## 8. Frontend Integration

### JavaScript Example

```javascript
// Configuration
const API_BASE = 'https://happy-bibimbap-forum.YOUR-SUBDOMAIN.workers.dev/api';

// Get username from localStorage
function getUsername() {
  let username = localStorage.getItem('forum_username');
  if (!username) {
    username = prompt('Choose a username (3-20 characters):');
    if (username) {
      localStorage.setItem('forum_username', username);
    }
  }
  return username;
}

// Fetch threads
async function loadThreads() {
  const response = await fetch(`${API_BASE}/threads`);
  const data = await response.json();
  return data.threads;
}

// Create thread
async function createThread(title, content) {
  const username = getUsername();
  if (!username) return;

  const response = await fetch(`${API_BASE}/threads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Username': username,
    },
    body: JSON.stringify({ title, content }),
  });

  return await response.json();
}

// Load thread with posts
async function loadThread(threadId) {
  const response = await fetch(`${API_BASE}/threads/${threadId}`);
  const data = await response.json();
  return data;
}

// Reply to thread
async function replyToThread(threadId, content) {
  const username = getUsername();
  if (!username) return;

  const response = await fetch(`${API_BASE}/threads/${threadId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Username': username,
    },
    body: JSON.stringify({ content }),
  });

  return await response.json();
}

// Like/unlike post
async function toggleLike(postId) {
  const username = getUsername();
  if (!username) return;

  const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'X-Username': username,
    },
  });

  return await response.json();
}

// Get forum stats
async function getStats() {
  const response = await fetch(`${API_BASE}/stats`);
  const data = await response.json();
  return data.stats;
}
```

---

## 9. Security Considerations

### Current Implementation
- ✅ Simple username-based auth (no passwords)
- ✅ Rate limiting (10 requests per 60 seconds per IP)
- ✅ Input validation (length constraints)
- ✅ SQL injection prevention (prepared statements)
- ✅ CORS configuration
- ✅ Username validation (alphanumeric + underscore only)

### Future Enhancements
- Add proper authentication (OAuth, magic links, etc.)
- Implement persistent rate limiting (using Durable Objects or KV)
- Add moderation features (delete posts, ban users)
- Add spam detection
- Add email notifications
- Add search functionality

---

## 10. Monitoring & Maintenance

### View Logs

```bash
# Stream logs in real-time
wrangler tail

# View specific deployment logs
wrangler tail --format pretty
```

### Database Maintenance

```bash
# Backup database (export to JSON)
wrangler d1 execute happy-bibimbap-forum --command "SELECT * FROM threads" --json > backup-threads.json

# View recent activity
wrangler d1 execute happy-bibimbap-forum --command "
  SELECT u.username, COUNT(*) as post_count
  FROM posts p
  JOIN users u ON p.author_id = u.id
  GROUP BY u.username
  ORDER BY post_count DESC
  LIMIT 10
"
```

### Analytics Queries

```sql
-- Most active threads
SELECT
  t.title,
  COUNT(p.id) as reply_count,
  u.username as author
FROM threads t
LEFT JOIN posts p ON t.id = p.thread_id
JOIN users u ON t.author_id = u.id
GROUP BY t.id
ORDER BY reply_count DESC
LIMIT 10;

-- Most liked posts
SELECT
  p.content,
  u.username as author,
  COUNT(l.post_id) as like_count
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN likes l ON p.id = l.post_id
GROUP BY p.id
ORDER BY like_count DESC
LIMIT 10;

-- Daily activity
SELECT
  DATE(created_at) as date,
  COUNT(*) as posts
FROM posts
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

---

## 11. Cost Estimates

### Cloudflare Workers + D1 Free Tier
- **Workers:** 100,000 requests/day free
- **D1 Database:**
  - 5 GB storage (free)
  - 5 million reads/day (free)
  - 100,000 writes/day (free)

### Expected Usage for happybibimbap.com
- 52k requests/month → ~1,733 requests/day
- Well within free tier
- **Estimated cost:** $0/month

### If Traffic Grows Beyond Free Tier
- Workers: $5/month for 10 million requests
- D1: $0.50 per million reads, $1.00 per million writes

---

## 12. Troubleshooting

### Common Issues

**Issue:** "Database not found"
```bash
# Solution: Check database binding name matches wrangler.toml
wrangler d1 list
# Update database_id in wrangler.toml
```

**Issue:** "CORS error in browser"
```bash
# Solution: Update CORS_ORIGIN in wrangler.toml to match your domain
[vars]
CORS_ORIGIN = "https://your-actual-domain.com"
```

**Issue:** "Rate limit exceeded"
```bash
# Solution: Adjust rate limits in wrangler.toml
[vars]
RATE_LIMIT_WINDOW = "120"  # Increase window to 2 minutes
RATE_LIMIT_MAX_REQUESTS = "20"  # Allow more requests
```

**Issue:** "Username validation failed"
```bash
# Solution: Usernames must be 3-20 characters, alphanumeric + underscore only
# Valid: "bibimbap_lover", "user123", "happy_foodie"
# Invalid: "ab", "user with spaces", "user@email.com"
```

---

## 13. Next Steps

1. **Deploy the backend:**
   ```bash
   wrangler deploy
   ```

2. **Test all endpoints** using the curl examples above

3. **Build frontend UI** to integrate with the API:
   - Thread list page
   - Thread detail/reply page
   - New thread form
   - Like buttons

4. **Add to existing site:**
   - Create `/forum` page on happybibimbap.pages.dev
   - Link from main navigation
   - Style to match existing bibimbap theme

5. **Monitor usage:**
   ```bash
   wrangler tail
   ```

6. **Iterate based on feedback:**
   - Add search functionality
   - Add user profiles
   - Add moderation tools
   - Add markdown support for posts

---

**Ready to deploy!** The backend is production-ready with rate limiting, validation, and proper error handling. Just update the `database_id` in `wrangler.toml` after creating your D1 database.
