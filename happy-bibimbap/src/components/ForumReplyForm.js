import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPost, getThread } from '../utils/forumApi';

function ForumReplyForm({ threadId, onPostCreated }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) {
      setError('Please enter your reply');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await createPost(threadId, {
        content: content.trim(),
      });

      // Backend returns { success: true, post_id }
      // Fetch the full thread to get the complete post data
      const threadData = await getThread(threadId);
      const fullPost = threadData.posts.find(p => p.id === response.post_id);
      
      if (fullPost) {
        onPostCreated(fullPost);
      } else {
        // Fallback: reload thread if we can't find the new post
        onPostCreated(null);
      }
      
      setContent('');
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
