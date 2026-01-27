import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/NavBar';
import ForumPost from '../components/ForumPost';
import ForumReplyForm from '../components/ForumReplyForm';
import { getThread } from '../utils/forumApi';
import '../styles.css';

function formatDate(timestamp) {
  if (!timestamp) return 'Unknown date';

  // Handle SQLite timestamp format "YYYY-MM-DD HH:MM:SS"
  const date = new Date(timestamp.replace(' ', 'T') + 'Z');

  // Check if date is valid
  if (isNaN(date.getTime())) return 'Unknown date';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function ForumThread() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadThread = useCallback(async () => {
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
  }, [threadId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  function handlePostCreated(newPost) {
    if (newPost) {
      setThread(prev => ({
        ...prev,
        posts: [...prev.posts, newPost],
      }));
    } else {
      // Reload thread if post not found
      loadThread();
    }
  }

  function handlePostLiked(postId, newLikeCount) {
    setThread(prev => ({
      ...prev,
      posts: prev.posts.map(post =>
        post.id === postId ? { ...post, like_count: newLikeCount } : post
      ),
    }));
  }

  if (loading) {
    return (
      <div className="container">
        <Navbar />
        <main className="thread-container">
          <div className="loading-state" role="status" aria-live="polite">
            <p>Loading thread...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Navbar />
        <main className="thread-container">
          <div className="error-state" role="alert" aria-live="assertive">
            <p>Error: {error}</p>
            <button onClick={loadThread} className="button-secondary">
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container">
        <Navbar />
        <main className="thread-container">
          <div className="error-state" role="alert">
            <p>Thread not found</p>
            <button onClick={() => navigate('/forum')} className="button-secondary">
              Back to Forum
            </button>
          </div>
        </main>
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
              {formatDate(thread.created_at || thread.createdAt)}
            </span>
            <span className="thread-count">
              {thread.posts ? thread.posts.length : (thread.post_count || 0)} replies
            </span>
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
