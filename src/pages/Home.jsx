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
      <section className="relative w-full py-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-black gradient-text-animated leading-tight">
            Perfect Your Resume
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Get instant, professional feedback with AI-powered analysis
          </p>
          <div className="pt-8">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary text-xl px-12 py-5 shadow-lg hover:shadow-xl group"
            >
              <span className="flex items-center gap-3">
                Get Started
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 px-6 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Instant Analysis
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Upload your resume and receive comprehensive AI-powered feedback in seconds
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Detailed Scoring
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Get scored on formatting, content quality, and ATS optimization
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Actionable Tips
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Receive specific, implementable suggestions to improve immediately
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-32 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="space-y-4">
              <div className="text-7xl font-black gradient-text-animated">
                {stats.resumes.toLocaleString()}+
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Resumes Analyzed
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Helping job seekers worldwide
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-7xl font-black gradient-text-animated">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Happy Users
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Trusted by professionals
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-7xl font-black gradient-text-animated">
                {stats.avgScore}%
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Average Improvement
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                After implementing our tips
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          <h2 className="text-5xl md:text-6xl font-black text-center gradient-text-animated">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-20">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-black">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Upload Your Resume
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Upload a PDF or paste your resume text directly into the platform
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-black">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                AI Analysis
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Our AI analyzes formatting, content, keywords, and ATS compatibility
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-black">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Get Feedback
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Review your scores, strengths, weaknesses, and actionable suggestions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Resumes Section */}
      <section className="w-full py-32 px-6 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-black gradient-text-animated">
              Sample Resume Scores
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See how different resume styles perform
            </p>
          </div>

          <div className="space-y-24">
            {sampleResumes.map((resume, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Score Display */}
                  <div className="flex-shrink-0 text-center">
                    <div className={`w-48 h-48 rounded-3xl bg-gradient-to-br ${resume.color} flex flex-col items-center justify-center shadow-2xl`}>
                      <div className="text-7xl font-black text-white">
                        {resume.score}
                      </div>
                      <div className="text-lg font-bold text-white/90 mt-2">
                        Score
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <h3 className="text-4xl font-black text-gray-900 dark:text-gray-100">
                      {resume.title}
                    </h3>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                      {resume.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {resume.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-5 py-2 text-base font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="w-full py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-black gradient-text-animated">
              Frequently Asked Questions
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-6 cursor-pointer"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex justify-between items-center gap-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex-1">
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-40 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-black gradient-text-animated">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of job seekers who have improved their resumes
          </p>
          <div className="pt-8">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary text-2xl px-16 py-6 shadow-xl hover:shadow-2xl group"
            >
              <span className="flex items-center gap-4">
                Get Started for Free
                <svg className="w-7 h-7 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-500 dark:text-gray-500">
            <p className="text-base">
              © 2024 Resume Critiquer. AI-powered resume analysis and feedback.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
