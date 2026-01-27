import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createThread, getThreads } from '../utils/forumApi';

function ForumCreateThread({ onClose, onThreadCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await createThread({
        title: title.trim(),
        content: content.trim(),
      });

      // Backend returns { success: true, thread_id }
      // Fetch the full thread data from the threads list
      const threadsData = await getThreads();
      const fullThread = threadsData.threads.find(t => t.id === response.thread_id);
      
      if (fullThread) {
        onThreadCreated(fullThread);
      } else {
        // Fallback: reload threads if we can't find the new thread
        onThreadCreated(null);
      }
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-thread-title"
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 id="create-thread-title" className="modal-title">Start New Discussion</h2>
            <button
              className="modal-close"
              onClick={onClose}
              type="button"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="create-thread-form">
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
