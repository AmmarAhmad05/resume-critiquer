import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import InteractiveBackground from '../components/InteractiveBackground';
import { useState, useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [stats, setStats] = useState({
    resumes: 0,
    users: 0,
    avgScore: 0
  });

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { resumes: 15420, users: 8350, avgScore: 87 };
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;

      setStats({
        resumes: Math.floor(targets.resumes * progress),
        users: Math.floor(targets.users * progress),
        avgScore: Math.floor(targets.avgScore * progress)
      });

      if (current >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const sampleResumes = [
    {
      title: "Software Engineer",
      description: "Modern tech resume with clean formatting and strong keywords",
      score: 92,
      tags: ["ATS-Optimized", "Clean Layout", "Tech Keywords"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Marketing Manager",
      description: "Creative resume showcasing achievements and metrics",
      score: 88,
      tags: ["Results-Driven", "Creative", "Metrics-Focused"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Product Designer",
      description: "Visual resume highlighting design projects and skills",
      score: 90,
      tags: ["Visual Appeal", "Portfolio Links", "Skills Matrix"],
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Data Scientist",
      description: "Technical resume with project highlights and certifications",
      score: 94,
      tags: ["Technical", "Certifications", "Projects"],
      color: "from-green-500 to-emerald-500"
    }
  ];

  const faqs = [
    {
      question: "How does the AI analyze my resume?",
      answer: "Our AI uses advanced natural language processing to evaluate your resume across multiple dimensions including formatting, content quality, keyword optimization, and ATS compatibility. It analyzes structure, quantifiable achievements, industry-specific keywords, and overall presentation to provide comprehensive feedback."
    },
    {
      question: "Is my resume data secure and private?",
      answer: "Absolutely! We take data security seriously. Your resume is encrypted during transmission and storage. We never share your personal information with third parties, and you can delete your data at any time. Our AI processes your resume in a secure environment and doesn't retain copies after analysis."
    },
    {
      question: "What file formats are supported?",
      answer: "We currently support PDF files, which are the industry standard for resume submissions. You can also paste your resume text directly into our platform. We recommend using PDF format as it preserves your formatting and is most compatible with ATS systems."
    },
    {
      question: "How is the resume score calculated?",
      answer: "Your resume score is calculated based on multiple factors: formatting and readability (25%), content quality and impact (30%), ATS optimization and keywords (25%), and overall structure and organization (20%). Each category is analyzed in detail to give you a comprehensive score out of 100."
    },
    {
      question: "Can I analyze multiple versions of my resume?",
      answer: "Yes! We encourage you to analyze multiple versions. This helps you compare different approaches and see which changes improve your score. You can save and compare different versions to track your improvements over time."
    },
    {
      question: "What makes a resume ATS-friendly?",
      answer: "ATS-friendly resumes use standard formatting, clear section headers, common fonts, and relevant keywords. Avoid tables, images, headers/footers, and unusual formatting. Use standard section titles like 'Work Experience' and 'Education'. Our AI specifically checks for these elements and provides guidance."
    },
    {
      question: "How long does the analysis take?",
      answer: "Most resume analyses are completed within 10-30 seconds. The AI works quickly to provide you with instant feedback so you can iterate and improve your resume efficiently."
    },
    {
      question: "Do you offer resume writing services?",
      answer: "Currently, we focus on AI-powered analysis and feedback. However, our detailed suggestions and examples are designed to guide you in improving your resume yourself. We provide actionable recommendations that you can implement immediately."
    }
  ];

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

      {/* Navigation Header */}
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
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text font-bold hover:scale-105 transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50 shadow-md hover:shadow-lg"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 scale-in">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Perfect Your Resume
            </h1>
            <p className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
              with AI-Powered Analysis
            </p>
          </div>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Get instant, professional feedback on your resume with detailed scoring,
            actionable suggestions, and ATS optimization tips.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary text-lg px-8 py-4 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 group"
            >
              <span className="flex items-center gap-3">
                Get Started for Free
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-purple-200/50 dark:border-purple-700/50 text-gray-700 dark:text-gray-200 font-bold hover:bg-white dark:hover:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg"
            >
              I Have an Account
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 slide-in-up">
          {/* Feature 1 */}
          <div className="card group hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Instant Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your resume and receive comprehensive AI-powered feedback in seconds
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card group hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:shadow-pink-500/50 transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Detailed Scoring
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get scored on formatting, content quality, and ATS optimization with visual breakdowns
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card group hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg group-hover:shadow-orange-500/50 transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Actionable Tips
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive specific, implementable suggestions to improve your resume immediately
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 slide-in-up">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="stat-card space-y-2 shimmer">
              <div className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stats.resumes.toLocaleString()}+
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Resumes Analyzed
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Helping job seekers worldwide
              </p>
            </div>

            <div className="stat-card space-y-2 shimmer">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Happy Users
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Trusted by professionals
              </p>
            </div>

            <div className="stat-card space-y-2 shimmer">
              <div className="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {stats.avgScore}%
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Average Score Improvement
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                After implementing our tips
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-32 space-y-12 slide-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card text-center space-y-4 perspective-card">
              <div className="perspective-card-inner">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white text-2xl font-bold shadow-lg icon-float">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">
                  Upload Your Resume
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload a PDF or paste your resume text directly into the platform
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card text-center space-y-4 perspective-card">
              <div className="perspective-card-inner">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full text-white text-2xl font-bold shadow-lg icon-float" style={{ animationDelay: '0.5s' }}>
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">
                  AI Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI analyzes formatting, content, keywords, and ATS compatibility
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card text-center space-y-4 perspective-card">
              <div className="perspective-card-inner">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full text-white text-2xl font-bold shadow-lg icon-float" style={{ animationDelay: '1s' }}>
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">
                  Get Feedback
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Review your scores, strengths, weaknesses, and actionable suggestions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Resumes Section */}
        <div className="mt-32 space-y-12 slide-in-up">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sample Resume Scores
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See how different resume styles perform and get inspired for your own
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleResumes.map((resume, index) => (
              <div key={index} className="resume-card group">
                <div className="space-y-4">
                  {/* Score Badge */}
                  <div className="flex justify-between items-start">
                    <div className={`p-3 bg-gradient-to-br ${resume.color} rounded-xl shadow-lg`}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {resume.score}
                      </div>
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Score
                      </div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {resume.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {resume.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {resume.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Example Button */}
                  <button className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 font-semibold hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-300 group-hover:scale-105">
                    View Example
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-32 space-y-12 slide-in-up">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about our AI-powered resume analysis
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="faq-item"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex-1">
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-32 card max-w-3xl mx-auto text-center space-y-6 card-glow">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join thousands of job seekers who have improved their resumes with AI-powered insights
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary text-lg px-10 py-4 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 group"
          >
            <span className="flex items-center gap-3">
              Get Started for Free
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-purple-100/50 dark:border-purple-900/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              © 2024 Resume Critiquer. AI-powered resume analysis and feedback.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
