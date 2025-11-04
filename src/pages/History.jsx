import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [error, setError] = useState('');
  
  const { currentUser, logout } = useAuth();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                New Analysis
              </button>
              <span className="text-sm text-gray-600">{currentUser?.email}</span>
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 mb-4">No analyses yet</p>
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
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Your Analyses ({analyses.length})
              </h2>
              
              {analyses.map(analysis => (
                <div
                  key={analysis.id}
                  onClick={() => setSelectedAnalysis(analysis)}
                  className={`card cursor-pointer transition hover:shadow-xl ${
                    selectedAnalysis?.id === analysis.id ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
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
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  
                  {analysis.critique?.overallScore && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Score:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {analysis.critique.overallScore}/10
                      </span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
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
                        <h3 className="text-xl font-bold">Analysis Details</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(selectedAnalysis.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-4xl font-bold text-blue-600">
                        {selectedAnalysis.critique.overallScore}/10
                      </div>
                    </div>
                    <p className="text-gray-700">{selectedAnalysis.critique.summary}</p>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="text-lg font-bold mb-3 flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.critique.strengths.map((strength, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="text-green-500 mr-2 mt-1">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-bold mb-3 flex items-center">
                        <span className="text-yellow-600 mr-2">!</span>
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.critique.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="text-yellow-500 mr-2 mt-1">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Detailed Feedback */}
                  <div className="card">
                    <h3 className="text-lg font-bold mb-3">Detailed Feedback</h3>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-600 pl-4">
                        <h4 className="font-semibold mb-1">Formatting & Structure</h4>
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 mr-2">Score:</span>
                          <span className="text-blue-600 font-bold">{selectedAnalysis.critique.formatting.score}/10</span>
                        </div>
                        <p className="text-gray-700">{selectedAnalysis.critique.formatting.feedback}</p>
                      </div>

                      <div className="border-l-4 border-green-600 pl-4">
                        <h4 className="font-semibold mb-1">Content Quality</h4>
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 mr-2">Score:</span>
                          <span className="text-green-600 font-bold">{selectedAnalysis.critique.content.score}/10</span>
                        </div>
                        <p className="text-gray-700">{selectedAnalysis.critique.content.feedback}</p>
                      </div>

                      <div className="border-l-4 border-purple-600 pl-4">
                        <h4 className="font-semibold mb-1">ATS Optimization</h4>
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 mr-2">Score:</span>
                          <span className="text-purple-600 font-bold">{selectedAnalysis.critique.atsScore}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="card">
                    <h3 className="text-lg font-bold mb-3">Actionable Suggestions</h3>
                    <ol className="space-y-3">
                      {selectedAnalysis.critique.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <p className="text-gray-500">Select an analysis to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}