// Forum API utility functions
const API_BASE = '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
 * Like a post
 */
export async function likePost(threadId, postId) {
  return apiFetch(`/threads/${threadId}/posts/${postId}/like`, {
    method: 'POST',
  });
}

/**
 * Unlike a post
 */
export async function unlikePost(threadId, postId) {
  return apiFetch(`/threads/${threadId}/posts/${postId}/like`, {
    method: 'DELETE',
  });
}
