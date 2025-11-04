import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/openai';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import FileUpload from '../components/upload/FileUpload';
import InteractiveGraph from '../components/InteractiveGraph';
import InteractiveBackground from '../components/InteractiveBackground';

export default function Dashboard() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [critique, setCritique] = useState(null);
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState('upload'); // 'upload' or 'paste'

  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
      const result = await analyzeResume(text, jobDescription);

      if (result.success) {
        setCritique(result.analysis);

        // Save to Firestore
        const analysisId = `${currentUser.uid}_${Date.now()}`;
        await setDoc(doc(db, 'analyses', analysisId), {
          userId: currentUser.uid,
          resumeText: text.substring(0, 500), // Save preview
          jobDescription: jobDescription || null,
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
    setJobDescription('');
    setError('');
  }

  return (
    <div className="min-h-screen relative gradient-bg overflow-hidden">
      {/* Interactive Mouse-Tracking Background */}
      <InteractiveBackground />

      {/* Animated Background Elements */}
      <div className="parallax-bg">
        <div className="absolute top-10 right-20 w-96 h-96 bg-purple-300/10 dark:bg-purple-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-10 left-20 w-[500px] h-[500px] bg-indigo-300/10 dark:bg-indigo-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-300/10 dark:bg-pink-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-purple-100/50 dark:border-purple-900/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Resume Critiquer
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border border-purple-200/50 dark:border-purple-700/50 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => navigate('/history')}
                className="px-5 py-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text font-bold hover:scale-105 transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50 shadow-md hover:shadow-lg"
              >
                View History
              </button>
              <div className="px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentUser?.email}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary text-sm px-5 py-2.5">
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
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Analyze Your Resume</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload a PDF or paste your resume text, optionally add a job description for targeted analysis
            </p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Tab Switcher */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setUploadMode('upload')}
                className={`pb-3 px-1 font-medium transition flex items-center gap-2 ${
                  uploadMode === 'upload'
                    ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Upload PDF
              </button>
              <button
                onClick={() => setUploadMode('paste')}
                className={`pb-3 px-1 font-medium transition flex items-center gap-2 ${
                  uploadMode === 'paste'
                    ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Paste Text
              </button>
            </div>

            {/* Upload Mode */}
            {uploadMode === 'upload' && (
              <div className="space-y-6">
                <FileUpload onTextExtracted={handleTextExtracted} />

                {/* Job Description (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Job Description (Optional)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows="8"
                    className="input-field font-mono text-sm"
                    placeholder="Paste the job description here for targeted resume analysis..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Add a job description to get targeted feedback on how well your resume matches the position
                  </p>
                </div>
              </div>
            )}

            {/* Paste Mode */}
            {uploadMode === 'paste' && (
              <form onSubmit={handlePasteSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

                {/* Job Description (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Job Description (Optional)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows="8"
                    className="input-field font-mono text-sm"
                    placeholder="Paste the job description here for targeted resume analysis..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Add a job description to get targeted feedback on how well your resume matches the position
                  </p>
                </div>

                <button type="submit" className="btn-primary w-full">
                  Analyze Resume with AI
                </button>
              </form>
            )}
          </div>
        )}

        {analyzing && (
          <div className="card text-center py-16 max-w-2xl mx-auto card-glow scale-in">
            {/* Animated Gradient Spinner */}
            <div className="relative mx-auto w-24 h-24 mb-8">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin"></div>

              {/* Inner circle mask */}
              <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-800"></div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-xl animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-30 animate-pulse"></div>
            </div>

            {/* Text Content */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Analyzing Your Resume
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                Our AI is carefully reviewing your resume...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This usually takes 10-30 seconds
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {critique && !analyzing && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Analysis</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered feedback</p>
                </div>
                <button onClick={handleNewAnalysis} className="btn-primary">
                  New Analysis
                </button>
              </div>
            </div>

            {/* Overall Score */}
            <div className="card card-glow slide-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Overall Grade
                  </h3>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative text-6xl font-black score-glow bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {critique.overallScore}/10
                  </div>
                </div>
              </div>
              <div className="p-5 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{critique.summary}</p>
              </div>
            </div>

            {/* Visual Score Breakdown */}
            <div className="card card-glow slide-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Score Breakdown
                </h3>
              </div>

              <div className="space-y-6">
                {/* Formatting Score */}
                <div className="group">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Formatting & Structure</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{critique.formatting.score}/10</span>
                  </div>
                  <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${critique.formatting.score * 10}%`,
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{critique.formatting.feedback}</p>
                </div>

                {/* Content Score */}
                <div className="group">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Content Quality</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{critique.content.score}/10</span>
                  </div>
                  <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${critique.content.score * 10}%`,
                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{critique.content.feedback}</p>
                </div>

                {/* ATS Score */}
                <div className="group">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">ATS Optimization</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{critique.atsScore}/10</span>
                  </div>
                  <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${critique.atsScore * 10}%`,
                        boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Job Match Score (only shown if job description was provided) */}
                {critique.jobMatch && (
                  <div className="group">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Job Match Score</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{critique.jobMatch.score}/10</span>
                    </div>
                    <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${critique.jobMatch.score * 10}%`,
                          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{critique.jobMatch.feedback}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card slide-in-left" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Keep These Strengths
                  </h3>
                </div>
                <ul className="space-y-3">
                  {critique.strengths.map((strength, idx) => (
                    <li key={idx} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-all">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 dark:text-green-400 text-sm font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card slide-in-right" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Areas to Improve
                  </h3>
                </div>
                <ul className="space-y-3">
                  {critique.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-all">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mt-0.5">
                        <span className="text-amber-600 dark:text-amber-400 text-sm font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interactive Detailed Feedback Graphs */}
            <div className="card slide-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Interactive Performance Analysis
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Hover over the bars to see detailed feedback for each metric
              </p>
              <InteractiveGraph critique={critique} />
            </div>

            {/* Suggestions */}
            <div className="card">
              <h3 className="text-lg font-bold mb-3 dark:text-white">Actionable Suggestions</h3>
              <ol className="space-y-3">
                {critique.suggestions.map((suggestion, idx) => (
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
        )}
      </div>
    </div>
  );
}