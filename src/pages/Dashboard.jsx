import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/openai';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import FileUpload from '../components/upload/FileUpload';

export default function Dashboard() {
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [critique, setCritique] = useState(null);
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState('upload'); // 'upload' or 'paste'
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      alert('Failed to log out: ' + error.message);
    }
  }

  async function handleAnalyze(textToAnalyze) {
    const text = textToAnalyze || resumeText;
    
    if (!text.trim()) {
      setError('Please provide resume text');
      return;
    }

    setAnalyzing(true);
    setError('');
    setCritique(null);

    try {
      const result = await analyzeResume(text);
      
      if (result.success) {
        setCritique(result.analysis);
        
        // Save to Firestore
        const analysisId = `${currentUser.uid}_${Date.now()}`;
        await setDoc(doc(db, 'analyses', analysisId), {
          userId: currentUser.uid,
          resumeText: text.substring(0, 500), // Save preview
          critique: result.analysis,
          createdAt: new Date().toISOString(),
          userEmail: currentUser.email
        });
      } else {
        setError(result.error || 'Failed to analyze resume');
      }
    } catch (err) {
      setError('Analysis failed: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleTextExtracted(text) {
    setResumeText(text);
    handleAnalyze(text);
  }

  function handlePasteSubmit(e) {
    e.preventDefault();
    handleAnalyze();
  }

  function handleNewAnalysis() {
    setCritique(null);
    setResumeText('');
    setError('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Resume Critiquer</h1>
            <div className="flex items-center space-x-4">
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
        {!critique && !analyzing && (
          <div className="card max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Analyze Your Resume</h2>
            <p className="text-gray-600 mb-6">
              Upload a PDF or paste your resume text to get instant AI-powered feedback
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Tab Switcher */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setUploadMode('upload')}
                className={`pb-3 px-1 font-medium transition ${
                  uploadMode === 'upload'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📄 Upload PDF
              </button>
              <button
                onClick={() => setUploadMode('paste')}
                className={`pb-3 px-1 font-medium transition ${
                  uploadMode === 'paste'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ✏️ Paste Text
              </button>
            </div>

            {/* Upload Mode */}
            {uploadMode === 'upload' && (
              <FileUpload onTextExtracted={handleTextExtracted} />
            )}

            {/* Paste Mode */}
            {uploadMode === 'paste' && (
              <form onSubmit={handlePasteSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Text
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows="15"
                    className="input-field font-mono text-sm"
                    placeholder="Paste your resume text here..."
                    required
                  />
                </div>
                
                <button type="submit" className="btn-primary w-full">
                  Analyze Resume with AI
                </button>
              </form>
            )}
          </div>
        )}

        {analyzing && (
          <div className="card text-center py-12 max-w-2xl mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Analyzing your resume with AI...</p>
            <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
          </div>
        )}

        {critique && !analyzing && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Resume Analysis</h2>
                  <p className="text-gray-600 mt-1">AI-powered feedback</p>
                </div>
                <button onClick={handleNewAnalysis} className="btn-primary">
                  New Analysis
                </button>
              </div>
            </div>

            {/* Overall Score */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Overall Score</h3>
                <div className="text-4xl font-bold text-blue-600">
                  {critique.overallScore}/10
                </div>
              </div>
              <p className="text-gray-700">{critique.summary}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {critique.strengths.map((strength, idx) => (
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
                  {critique.weaknesses.map((weakness, idx) => (
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
                    <span className="text-blue-600 font-bold">{critique.formatting.score}/10</span>
                  </div>
                  <p className="text-gray-700">{critique.formatting.feedback}</p>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold mb-1">Content Quality</h4>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 mr-2">Score:</span>
                    <span className="text-green-600 font-bold">{critique.content.score}/10</span>
                  </div>
                  <p className="text-gray-700">{critique.content.feedback}</p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h4 className="font-semibold mb-1">ATS Optimization</h4>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 mr-2">Score:</span>
                    <span className="text-purple-600 font-bold">{critique.atsScore}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="card">
              <h3 className="text-lg font-bold mb-3">Actionable Suggestions</h3>
              <ol className="space-y-3">
                {critique.suggestions.map((suggestion, idx) => (
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
        )}
      </div>
    </div>
  );
}