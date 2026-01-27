import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toggleLike } from '../utils/forumApi';

function ForumPost({ post, threadId, isOriginalPost, onLikeChange }) {
  const [liked, setLiked] = useState(false);
  // Backend returns like_count (snake_case)
  const [likeCount, setLikeCount] = useState(post.like_count || post.likes || 0);
  const [liking, setLiking] = useState(false);
  const [animating, setAnimating] = useState(false);

  async function handleLike() {
    if (liking) return;

    try {
      setLiking(true);
      const newLiked = !liked;

      // Trigger heart pulse animation when liking
      if (newLiked) {
        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);
      }

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
            {new Date(post.created_at || post.createdAt).toLocaleString('en-US', {
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
          className={`like-button ${liked ? 'liked' : ''} ${animating ? 'animating' : ''}`}
          onClick={handleLike}
          disabled={liking}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`${liked ? 'Unlike' : 'Like'} this post. Currently ${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`}
          aria-pressed={liked}
        >
          <motion.span
            className="like-icon"
            aria-hidden="true"
            animate={animating ? {
              scale: [1, 1.4, 0.9, 1.2, 0.95, 1.05, 1],
            } : {}}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          >
            {liked ? String.fromCodePoint(0x2764, 0xFE0F) : String.fromCodePoint(0x1F90D)}
          </motion.span>
          <span className="like-count">{likeCount}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ForumPost;
