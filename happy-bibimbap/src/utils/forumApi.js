// Forum API utility functions
const API_BASE = 'https://happy-bibimbap-forum.ariaxhan.workers.dev/api';

/**
 * Get username from localStorage
 */
function getUsername() {
  let username = localStorage.getItem('forum_username');
  if (!username) {
    username = prompt('Choose a username (3-20 characters, letters/numbers/underscore only):');
    if (username && username.length >= 3 && username.length <= 20) {
      localStorage.setItem('forum_username', username);
    }
  }
  return username;
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add username header if needed for write operations
    if (options.method === 'POST' || options.method === 'DELETE') {
      const username = getUsername();
      if (username) {
        headers['X-Username'] = username;
      }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Get all forum threads
 */
export async function getThreads() {
  return apiFetch('/threads');
}

/**
 * Get a single thread with all its posts
 */
export async function getThread(threadId) {
  return apiFetch(`/threads/${threadId}`);
}

/**
 * Create a new thread
 */
export async function createThread(data) {
  return apiFetch('/threads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Create a new post (reply) in a thread
 */
export async function createPost(threadId, data) {
  return apiFetch(`/threads/${threadId}/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Toggle like on a post (like if not liked, unlike if already liked)
 */
export async function toggleLike(postId) {
  return apiFetch(`/posts/${postId}/like`, {
    method: 'POST',
  });
}

/**
 * Get forum statistics
 */
export async function getStats() {
  return apiFetch('/stats');
}
