# Forum Frontend Components

Complete React frontend implementation for the Happy Bibimbap forum system.

---

## 1. API Utility (`src/utils/forumApi.js`)

```javascript
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
```

---

## 2. Forum Home Page (`src/pages/Forum.js`)

```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/NavBar';
import ForumThreadList from '../components/ForumThreadList';
import ForumCreateThread from '../components/ForumCreateThread';
import { getThreads } from '../utils/forumApi';
import '../styles.css';

function Forum() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadThreads();
  }, []);

  async function loadThreads() {
    try {
      setLoading(true);
      setError(null);
      const data = await getThreads();
      setThreads(data.threads || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleThreadCreated(newThread) {
    setThreads(prev => [newThread, ...prev]);
    setShowCreateModal(false);
  }

  return (
    <div className="container">
      <Navbar />

      <motion.div
        className="forum-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="forum-header">
          <h1 className="forum-title">Happy Bibimbap Community Forum</h1>
          <p className="forum-description">
            Share your thoughts, recipes, and experiences with fellow bibimbap enthusiasts!
          </p>
          <button
            className="button-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Start New Discussion
          </button>
        </div>

        {loading && (
          <div className="loading-state">
            <p>Loading discussions...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={loadThreads} className="button-secondary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <ForumThreadList threads={threads} />
        )}
      </motion.div>

      {showCreateModal && (
        <ForumCreateThread
          onClose={() => setShowCreateModal(false)}
          onThreadCreated={handleThreadCreated}
        />
      )}
    </div>
  );
}

export default Forum;
```

---

## 3. Thread Detail Page (`src/pages/ForumThread.js`)

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/NavBar';
import ForumPost from '../components/ForumPost';
import ForumReplyForm from '../components/ForumReplyForm';
import { getThread } from '../utils/forumApi';
import '../styles.css';

function ForumThread() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadThread();
  }, [threadId]);

  async function loadThread() {
    try {
      setLoading(true);
      setError(null);
      const data = await getThread(threadId);
      setThread(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePostCreated(newPost) {
    setThread(prev => ({
      ...prev,
      posts: [...prev.posts, newPost],
      postCount: prev.postCount + 1,
    }));
  }

  function handlePostLiked(postId, newLikeCount) {
    setThread(prev => ({
      ...prev,
      posts: prev.posts.map(post =>
        post.id === postId ? { ...post, likes: newLikeCount } : post
      ),
    }));
  }

  if (loading) {
    return (
      <div className="container">
        <Navbar />
        <div className="loading-state">
          <p>Loading thread...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Navbar />
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={loadThread} className="button-secondary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container">
        <Navbar />
        <div className="error-state">
          <p>Thread not found</p>
          <button onClick={() => navigate('/forum')} className="button-secondary">
            Back to Forum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />

      <motion.div
        className="thread-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button
          className="back-button"
          onClick={() => navigate('/forum')}
        >
          ← Back to Forum
        </button>

        <div className="thread-header">
          <h1 className="thread-title">{thread.title}</h1>
          <div className="thread-meta">
            <span className="thread-author">Started by {thread.author}</span>
            <span className="thread-date">
              {new Date(thread.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="thread-count">{thread.postCount} replies</span>
          </div>
        </div>

        <div className="posts-list">
          {thread.posts.map((post, index) => (
            <ForumPost
              key={post.id}
              post={post}
              threadId={threadId}
              isOriginalPost={index === 0}
              onLikeChange={handlePostLiked}
            />
          ))}
        </div>

        <ForumReplyForm
          threadId={threadId}
          onPostCreated={handlePostCreated}
        />
      </motion.div>
    </div>
  );
}

export default ForumThread;
```

---

## 4. Thread List Component (`src/components/ForumThreadList.js`)

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ForumThreadList({ threads }) {
  if (!threads || threads.length === 0) {
    return (
      <div className="empty-state">
        <p>No discussions yet. Be the first to start one!</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="thread-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {threads.map(thread => (
        <motion.div
          key={thread.id}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link to={`/forum/${thread.id}`} className="thread-item">
            <div className="thread-item-content">
              <h3 className="thread-item-title">{thread.title}</h3>
              <p className="thread-item-meta">
                <span className="thread-item-author">by {thread.author}</span>
                <span className="thread-item-separator">•</span>
                <span className="thread-item-time">
                  {formatTimeAgo(thread.lastActivity)}
                </span>
              </p>
            </div>
            <div className="thread-item-stats">
              <span className="thread-stat">
                {thread.postCount} {thread.postCount === 1 ? 'reply' : 'replies'}
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;

  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default ForumThreadList;
```

---

## 5. Post Component (`src/components/ForumPost.js`)

```javascript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { likePost, unlikePost } from '../utils/forumApi';

function ForumPost({ post, threadId, isOriginalPost, onLikeChange }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [liking, setLiking] = useState(false);

  async function handleLike() {
    if (liking) return;

    try {
      setLiking(true);
      const newLiked = !liked;

      if (newLiked) {
        await likePost(threadId, post.id);
        setLikeCount(prev => prev + 1);
      } else {
        await unlikePost(threadId, post.id);
        setLikeCount(prev => prev - 1);
      }

      setLiked(newLiked);
      onLikeChange(post.id, newLiked ? likeCount + 1 : likeCount - 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setLiking(false);
    }
  }

  return (
    <motion.div
      className={`forum-post ${isOriginalPost ? 'original-post' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="post-header">
        <div className="post-avatar">
          {post.author.charAt(0).toUpperCase()}
        </div>
        <div className="post-info">
          <span className="post-author">{post.author}</span>
          <span className="post-time">
            {new Date(post.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </span>
        </div>
        {isOriginalPost && (
          <span className="original-badge">Original Post</span>
        )}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <motion.button
          className={`like-button ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={liking}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="like-icon">{liked ? '❤️' : '🤍'}</span>
          <span className="like-count">{likeCount}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ForumPost;
```

---

## 6. Reply Form Component (`src/components/ForumReplyForm.js`)

```javascript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPost } from '../utils/forumApi';

function ForumReplyForm({ threadId, onPostCreated }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!author.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const newPost = await createPost(threadId, {
        author: author.trim(),
        content: content.trim(),
      });

      onPostCreated(newPost);
      setContent('');
      setAuthor('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      className="reply-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="reply-form-title">Add a Reply</h3>

      <form onSubmit={handleSubmit} className="reply-form">
        <div className="form-group">
          <label htmlFor="author">Your Name</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter your name"
            className="form-input"
            disabled={submitting}
            maxLength={50}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Reply</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="form-textarea"
            disabled={submitting}
            rows={5}
            maxLength={2000}
            required
          />
          <span className="char-count">
            {content.length}/2000 characters
          </span>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="button-primary"
          disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Post Reply'}
        </button>
      </form>
    </motion.div>
  );
}

export default ForumReplyForm;
```

---

## 7. Create Thread Component (`src/components/ForumCreateThread.js`)

```javascript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createThread } from '../utils/forumApi';

function ForumCreateThread({ onClose, onThreadCreated }) {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!author.trim() || !title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const newThread = await createThread({
        author: author.trim(),
        title: title.trim(),
        content: content.trim(),
      });

      onThreadCreated(newThread);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="modal-title">Start New Discussion</h2>
            <button
              className="modal-close"
              onClick={onClose}
              type="button"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="create-thread-form">
            <div className="form-group">
              <label htmlFor="create-author">Your Name</label>
              <input
                id="create-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter your name"
                className="form-input"
                disabled={submitting}
                maxLength={50}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-title">Discussion Title</label>
              <input
                id="create-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your discussion about?"
                className="form-input"
                disabled={submitting}
                maxLength={200}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-content">Your Message</label>
              <textarea
                id="create-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start the conversation..."
                className="form-textarea"
                disabled={submitting}
                rows={8}
                maxLength={2000}
                required
              />
              <span className="char-count">
                {content.length}/2000 characters
              </span>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="button-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button-primary"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Discussion'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ForumCreateThread;
```

---

## 8. CSS Additions for `src/styles.css`

Add these styles to the existing `styles.css` file:

```css
/* ========================================
   FORUM STYLES
   ======================================== */

/* Forum Container */
.forum-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.forum-header {
  text-align: center;
  margin-bottom: 40px;
}

.forum-title {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.forum-description {
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 20px;
  opacity: 0.9;
}

/* Thread List */
.thread-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.thread-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.thread-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.thread-item-content {
  flex: 1;
}

.thread-item-title {
  font-size: 1.3rem;
  color: #d74d8b;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.thread-item-meta {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.thread-item-author {
  font-weight: 500;
}

.thread-item-separator {
  color: #ccc;
}

.thread-item-time {
  color: #888;
}

.thread-item-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.thread-stat {
  background: #f0f0f0;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  color: #666;
}

/* Thread Detail */
.thread-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.back-button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: #d74d8b;
  font-weight: 600;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thread-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thread-title {
  font-size: 2rem;
  color: #d74d8b;
  margin: 0 0 15px 0;
}

.thread-meta {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: #666;
  flex-wrap: wrap;
}

.thread-author {
  font-weight: 600;
}

.thread-date,
.thread-count {
  color: #888;
}

/* Posts */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.forum-post {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.forum-post.original-post {
  background: linear-gradient(135deg, rgba(227, 121, 169, 0.1), rgba(238, 146, 88, 0.1));
  border: 2px solid rgba(215, 77, 139, 0.3);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.post-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d74d8b, #f1823c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.post-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-author {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.post-time {
  font-size: 0.85rem;
  color: #888;
}

.original-badge {
  background: #d74d8b;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.post-content {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #333;
}

.post-content p {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f5f5;
  border: 2px solid transparent;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.like-button:hover {
  background: #fff;
  border-color: #d74d8b;
}

.like-button.liked {
  background: rgba(215, 77, 139, 0.1);
  border-color: #d74d8b;
}

.like-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.like-icon {
  font-size: 1.1rem;
}

.like-count {
  font-weight: 600;
  color: #666;
}

/* Reply Form */
.reply-form-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reply-form-title {
  font-size: 1.5rem;
  color: #d74d8b;
  margin: 0 0 20px 0;
}

.reply-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Form Elements */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #d74d8b;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  font-size: 0.85rem;
  color: #888;
  text-align: right;
}

.form-error {
  background: rgba(255, 0, 0, 0.1);
  color: #d32f2f;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 4px solid #d32f2f;
}

/* Buttons */
.button-primary {
  background: linear-gradient(135deg, #d74d8b, #f1823c);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(215, 77, 139, 0.3);
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(215, 77, 139, 0.4);
}

.button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.button-secondary {
  background: white;
  color: #d74d8b;
  border: 2px solid #d74d8b;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-secondary:hover {
  background: #d74d8b;
  color: white;
}

.button-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 2px solid #f0f0f0;
}

.modal-title {
  font-size: 1.8rem;
  color: #d74d8b;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #d74d8b;
}

.create-thread-form {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

/* States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  margin: 20px 0;
}

.loading-state p,
.error-state p,
.empty-state p {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 20px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .forum-title {
    font-size: 1.8rem;
  }

  .thread-title {
    font-size: 1.5rem;
  }

  .thread-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .thread-item-stats {
    align-items: flex-start;
  }

  .thread-meta {
    flex-direction: column;
    gap: 8px;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header {
    padding: 20px;
  }

  .create-thread-form {
    padding: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
```

---

## 9. Router Updates for `src/App.js`

Replace the existing `App.js` content with:

```javascript
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AboutMe from './pages/AboutMe';
import ContactMe from './pages/ContactMe';
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import Portfolio from './pages/Portfolio';
import Forum from './pages/Forum';
import ForumThread from './pages/ForumThread';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/contactme" element={<ContactMe />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:threadId" element={<ForumThread />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

## 10. NavBar Update for `src/components/NavBar.js`

Replace the existing `NavBar.js` content with:

```javascript
import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="nav-link">Home</a>
      <a href="/introduction" className="nav-link">Introduction</a>
      <a href="/portfolio" className="nav-link">Portfolio</a>
      <a href="/forum" className="nav-link">Forum</a>
      <a href="/aboutme" className="nav-link">About Me</a>
      <a href="/contactme" className="nav-link">Contact Me</a>
    </nav>
  );
};

export default Navbar;
```

---

## Integration Guide

### Step 1: Create the API utility

```bash
mkdir -p /Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap/src/utils
```

Create `/Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap/src/utils/forumApi.js` with the content from section 1.

### Step 2: Create page components

Create `/Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap/src/pages/Forum.js` with content from section 2.

Create `/Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap/src/pages/ForumThread.js` with content from section 3.

### Step 3: Create component files

Create the following components in `/Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap/src/components/`:
- `ForumThreadList.js` (section 4)
- `ForumPost.js` (section 5)
- `ForumReplyForm.js` (section 6)
- `ForumCreateThread.js` (section 7)

### Step 4: Update styles

Append the CSS from section 8 to `/Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap/src/styles.css`

### Step 5: Update routing and navigation

Update `/Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap/src/App.js` with content from section 9.

Update `/Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap/src/components/NavBar.js` with content from section 10.

### Step 6: Test the integration

1. Start the React dev server:
   ```bash
   cd /Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap
   npm start
   ```

2. Navigate to `http://localhost:3000/forum` to see the forum home page.

3. Test the following flows:
   - View forum home with thread list
   - Create a new thread
   - View a thread and its posts
   - Reply to a thread
   - Like/unlike posts
   - Navigate back to forum

### API Integration Notes

- The API base is set to `/api` which will be proxied to your Cloudflare Workers backend
- All API calls include proper error handling
- Loading states are managed for better UX
- Failed requests show user-friendly error messages

### Features Implemented

✅ Forum home page with thread list
✅ Thread creation modal with form validation
✅ Thread detail page with all posts
✅ Reply form with character limits
✅ Like/unlike functionality on posts
✅ Smooth animations using framer-motion
✅ Mobile responsive design
✅ Gradient aesthetic matching Happy Bibimbap theme
✅ Error handling and loading states
✅ Time formatting (relative and absolute)
✅ Character count indicators
✅ Original post badge
✅ User avatars (generated from first letter)

---

## File Structure Summary

```
happy-bibimbap/
└── src/
    ├── utils/
    │   └── forumApi.js              # API utility functions
    ├── pages/
    │   ├── Forum.js                 # Forum home page
    │   └── ForumThread.js           # Thread detail page
    ├── components/
    │   ├── ForumThreadList.js       # Thread list component
    │   ├── ForumPost.js             # Single post component
    │   ├── ForumReplyForm.js        # Reply form component
    │   ├── ForumCreateThread.js     # Create thread modal
    │   └── NavBar.js                # Updated with Forum link
    ├── styles.css                   # Updated with forum styles
    └── App.js                       # Updated with forum routes
```

---

## Next Steps

1. Ensure your Cloudflare Workers backend is deployed and accessible
2. Configure CORS on the backend to allow requests from your React dev server
3. Test all CRUD operations end-to-end
4. Consider adding:
   - User authentication
   - Thread categories
   - Search functionality
   - Edit/delete post functionality
   - Pagination for large thread lists
   - Rich text editor for posts
