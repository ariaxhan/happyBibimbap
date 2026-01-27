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
