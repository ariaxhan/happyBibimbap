import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/NavBar";
import PageTransition from "../components/PageTransition";
import ForumThreadList from "../components/ForumThreadList";
import ForumCreateThread from "../components/ForumCreateThread";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessToast from "../components/SuccessToast";
import { getThreads } from "../utils/forumApi";
import "../styles.css";
import "../microinteractions.css";

function Forum() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    if (newThread) {
      setThreads((prev) => [newThread, ...prev]);
    } else {
      // Reload threads if thread not found
      loadThreads();
    }
    setShowCreateModal(false);
    // Show success toast
    setSuccessMessage("Discussion created successfully!");
    setShowSuccess(true);
  }

  return (
    <PageTransition>
      <div className="container">
        <Navbar />

        <motion.div
          className="page-content forum-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="forum-header">
            <h1 className="forum-title">Happy Bibimbap Community Forum</h1>
            <p className="forum-description">
              Share your thoughts, recipes, and experiences with fellow bibimbap
              enthusiasts!
            </p>
            <motion.button
              className="button-primary"
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start New Discussion
            </motion.button>
          </div>

          {loading && (
            <div className="loading-state" role="status" aria-live="polite">
              <LoadingSpinner
                size="lg"
                message="Loading discussions..."
                variant="dots"
              />
            </div>
          )}

          {error && (
            <div className="error-state" role="alert" aria-live="assertive">
              <p>Error: {error}</p>
              <button onClick={loadThreads} className="button-secondary">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && <ForumThreadList threads={threads} />}
        </motion.div>

        {showCreateModal && (
          <ForumCreateThread
            onClose={() => setShowCreateModal(false)}
            onThreadCreated={handleThreadCreated}
          />
        )}

        <SuccessToast
          message={successMessage}
          show={showSuccess}
          onHide={() => setShowSuccess(false)}
          duration={3000}
        />
      </div>
    </PageTransition>
  );
}

export default Forum;
