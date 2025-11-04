import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [error, setError] = useState('');

  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, [currentUser.uid]);

  async function fetchHistory() {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'analyses'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAnalyses(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load history: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(analysisId) {
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      await deleteDoc(doc(db, 'analyses', analysisId));
      setAnalyses(analyses.filter(a => a.id !== analysisId));
      if (selectedAnalysis?.id === analysisId) {
        setSelectedAnalysis(null);
      }
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      alert('Failed to log out');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading your analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                New Analysis
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">{currentUser?.email}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No analyses yet</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Analyze Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* List of Analyses */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Your Analyses ({analyses.length})
              </h2>

              {analyses.map(analysis => (
                <div
                  key={analysis.id}
                  onClick={() => setSelectedAnalysis(analysis)}
                  className={`card cursor-pointer transition hover:shadow-xl ${
                    selectedAnalysis?.id === analysis.id ? 'ring-2 ring-blue-600 dark:ring-blue-400' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(analysis.id);
                      }}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  {analysis.critique?.overallScore && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Score:</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {analysis.critique.overallScore}/10
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {analysis.resumeText}
                  </p>
                </div>
              ))}
            </div>

            {/* Selected Analysis Detail */}
            <div className="lg:col-span-2">
              {selectedAnalysis ? (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold dark:text-white">Analysis Details</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(selectedAnalysis.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedAnalysis.critique.overallScore}/10
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{selectedAnalysis.critique.summary}</p>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="text-lg font-bold mb-3 flex items-center dark:text-white">
                        <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.critique.strengths.map((strength, idx) => (
                          <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                            <span className="text-green-500 dark:text-green-400 mr-2 mt-1">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-bold mb-3 flex items-center dark:text-white">
                        <span className="text-yellow-600 dark:text-yellow-400 mr-2">!</span>
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.critique.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                            <span className="text-yellow-500 dark:text-yellow-400 mr-2 mt-1">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Detailed Feedback */}
                  <div className="card">
                    <h3 className="text-lg font-bold mb-3 dark:text-white">Detailed Feedback</h3>

                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-600 dark:border-blue-400 pl-4">
                        <h4 className="font-semibold mb-1 dark:text-white">Formatting & Structure</h4>
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Score:</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedAnalysis.critique.formatting.score}/10</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{selectedAnalysis.critique.formatting.feedback}</p>
                      </div>

                      <div className="border-l-4 border-green-600 dark:border-green-400 pl-4">
                        <h4 className="font-semibold mb-1 dark:text-white">Content Quality</h4>
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Score:</span>
                          <span className="text-green-600 dark:text-green-400 font-bold">{selectedAnalysis.critique.content.score}/10</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{selectedAnalysis.critique.content.feedback}</p>
                      </div>

                      <div className="border-l-4 border-purple-600 dark:border-purple-400 pl-4">
                        <h4 className="font-semibold mb-1 dark:text-white">ATS Optimization</h4>
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Score:</span>
                          <span className="text-purple-600 dark:text-purple-400 font-bold">{selectedAnalysis.critique.atsScore}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="card">
                    <h3 className="text-lg font-bold mb-3 dark:text-white">Actionable Suggestions</h3>
                    <ol className="space-y-3">
                      {selectedAnalysis.critique.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="bg-blue-600 dark:bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Select an analysis to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}