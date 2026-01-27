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
                  {formatTimeAgo(thread.last_activity || thread.lastActivity)}
                </span>
              </p>
            </div>
            <div className="thread-item-stats">
              <span className="thread-stat">
                {thread.post_count || thread.postCount || 0} {(thread.post_count || thread.postCount || 0) === 1 ? 'reply' : 'replies'}
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'recently';

  // Handle SQLite timestamp format "YYYY-MM-DD HH:MM:SS"
  const past = new Date(timestamp.replace(' ', 'T') + 'Z');

  // Check if date is valid
  if (isNaN(past.getTime())) return 'recently';

  const now = new Date();
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
