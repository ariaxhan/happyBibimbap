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
              {new Date(thread.created_at || thread.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
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
