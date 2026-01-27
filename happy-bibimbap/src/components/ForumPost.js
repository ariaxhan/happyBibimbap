import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toggleLike } from '../utils/forumApi';

function ForumPost({ post, threadId, isOriginalPost, onLikeChange }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [liking, setLiking] = useState(false);

  async function handleLike() {
    if (liking) return;

    try {
      setLiking(true);
      const newLiked = !liked;

      // Toggle like on backend (single endpoint handles both like and unlike)
      await toggleLike(post.id);

      // Update local state
      setLiked(newLiked);
      setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
      onLikeChange(post.id, newLiked ? likeCount + 1 : likeCount - 1);
    } catch (error) {
      console.error('Failed to toggle like:', error);
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
