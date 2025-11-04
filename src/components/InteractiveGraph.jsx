import { useState } from 'react';

export default function InteractiveGraph({ critique }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const metrics = [
    {
      name: 'Formatting',
      score: critique.formatting.score,
      color: 'from-indigo-500 to-purple-500',
      lightBg: 'bg-indigo-50',
      darkBg: 'dark:bg-indigo-900/20',
      feedback: critique.formatting.feedback
    },
    {
      name: 'Content',
      score: critique.content.score,
      color: 'from-green-500 to-emerald-500',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
      feedback: critique.content.feedback
    },
    {
      name: 'ATS Score',
      score: critique.atsScore,
      color: 'from-purple-500 to-pink-500',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20',
      feedback: 'Applicant Tracking System compatibility score'
    }
  ];

  const maxScore = 10;

  return (
    <div className="space-y-6">
      {/* Interactive Bar Chart */}
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-50/50 via-indigo-50/50 to-pink-50/50 dark:from-purple-900/10 dark:via-indigo-900/10 dark:to-pink-900/10 border border-purple-200/30 dark:border-purple-700/30">
        <div className="grid grid-cols-3 gap-6 items-end h-64">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center cursor-pointer group"
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Score Label */}
              <div className={`absolute -top-8 transition-all duration-300 ${hoveredBar === idx ? 'scale-125 -translate-y-2' : 'scale-100'}`}>
                <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${metric.color} text-white font-bold text-sm shadow-lg`}>
                  {metric.score}/10
                </div>
              </div>

              {/* Animated Bar */}
              <div
                className={`relative w-full rounded-t-xl bg-gradient-to-t ${metric.color} transition-all duration-700 ease-out group-hover:brightness-110`}
                style={{
                  height: `${(metric.score / maxScore) * 100}%`,
                  boxShadow: hoveredBar === idx ? '0 0 40px rgba(168, 85, 247, 0.6)' : '0 0 20px rgba(168, 85, 247, 0.3)',
                  transform: hoveredBar === idx ? 'scaleY(1.05)' : 'scaleY(1)',
                  transformOrigin: 'bottom'
                }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent animate-pulse rounded-t-xl"></div>

                {/* Glow Effect on Hover */}
                {hoveredBar === idx && (
                  <div className={`absolute -inset-1 bg-gradient-to-t ${metric.color} blur-xl opacity-50 -z-10 rounded-t-xl`}></div>
                )}
              </div>

              {/* Label */}
              <div className={`mt-4 text-center transition-all duration-300 ${hoveredBar === idx ? 'scale-110' : 'scale-100'}`}>
                <p className={`font-bold ${hoveredBar === idx ? 'text-transparent bg-gradient-to-r ' + metric.color + ' bg-clip-text' : 'text-gray-700 dark:text-gray-300'}`}>
                  {metric.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Baseline */}
        <div className="absolute bottom-[60px] left-8 right-8 h-0.5 bg-gray-300 dark:bg-gray-700"></div>

        {/* Y-axis labels */}
        <div className="absolute left-2 bottom-[60px] top-8 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span>10</span>
          <span>7.5</span>
          <span>5</span>
          <span>2.5</span>
          <span>0</span>
        </div>
      </div>

      {/* Feedback Detail on Hover */}
      {hoveredBar !== null && (
        <div className={`p-5 rounded-xl ${metrics[hoveredBar].lightBg} ${metrics[hoveredBar].darkBg} border-2 border-${hoveredBar === 0 ? 'indigo' : hoveredBar === 1 ? 'green' : 'purple'}-300/50 dark:border-${hoveredBar === 0 ? 'indigo' : hoveredBar === 1 ? 'green' : 'purple'}-700/50 slide-in-up`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${metrics[hoveredBar].color}`}></div>
            <h4 className="font-bold text-gray-900 dark:text-white">{metrics[hoveredBar].name} - {metrics[hoveredBar].score}/10</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {metrics[hoveredBar].feedback}
          </p>
        </div>
      )}

      {/* Radar Chart Alternative View */}
      <div className="relative aspect-square max-w-md mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background Grid */}
          {[2, 4, 6, 8, 10].map((level, idx) => (
            <polygon
              key={idx}
              points="100,20 173,80 173,140 100,180 27,140 27,80"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-300 dark:text-gray-700"
              style={{
                transform: `translate(100px, 90px) scale(${level / 10}) translate(-100px, -90px)`
              }}
            />
          ))}

          {/* Axis Lines */}
          <line x1="100" y1="90" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-gray-600" />
          <line x1="100" y1="90" x2="173" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-gray-600" />
          <line x1="100" y1="90" x2="173" y2="140" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-gray-600" />
          <line x1="100" y1="90" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-gray-600" />
          <line x1="100" y1="90" x2="27" y2="140" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-gray-600" />
          <line x1="100" y1="90" x2="27" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-gray-600" />

          {/* Data Polygon */}
          <polygon
            points={`
              100,${90 - (critique.formatting.score / 10) * 70}
              ${100 + Math.cos(Math.PI / 6) * (critique.content.score / 10) * 73},${90 - Math.sin(Math.PI / 6) * (critique.content.score / 10) * 60}
              ${100 + Math.cos(Math.PI / 6) * (critique.atsScore / 10) * 73},${90 + Math.sin(Math.PI / 6) * (critique.atsScore / 10) * 50}
              100,${90 + (critique.overallScore / 10) * 90}
              ${100 - Math.cos(Math.PI / 6) * (critique.formatting.score / 10) * 73},${90 + Math.sin(Math.PI / 6) * (critique.formatting.score / 10) * 50}
              ${100 - Math.cos(Math.PI / 6) * (critique.content.score / 10) * 73},${90 - Math.sin(Math.PI / 6) * (critique.content.score / 10) * 60}
            `}
            fill="url(#radarGradient)"
            stroke="url(#radarStroke)"
            strokeWidth="2"
            className="opacity-80"
          />

          {/* Data Points */}
          {[
            { x: 100, y: 90 - (critique.formatting.score / 10) * 70 },
            { x: 100 + Math.cos(Math.PI / 6) * (critique.content.score / 10) * 73, y: 90 - Math.sin(Math.PI / 6) * (critique.content.score / 10) * 60 },
            { x: 100 + Math.cos(Math.PI / 6) * (critique.atsScore / 10) * 73, y: 90 + Math.sin(Math.PI / 6) * (critique.atsScore / 10) * 50 }
          ].map((point, idx) => (
            <circle
              key={idx}
              cx={point.x}
              cy={point.y}
              r="4"
              className="fill-purple-500 dark:fill-purple-400 cursor-pointer hover:r-6 transition-all"
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
            />
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="rgb(168, 85, 247)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" />
              <stop offset="50%" stopColor="rgb(168, 85, 247)" />
              <stop offset="100%" stopColor="rgb(236, 72, 153)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          Formatting
        </div>
        <div className="absolute top-1/4 right-0 translate-x-12 text-xs font-bold text-green-600 dark:text-green-400">
          Content
        </div>
        <div className="absolute bottom-1/4 right-0 translate-x-12 text-xs font-bold text-purple-600 dark:text-purple-400">
          ATS
        </div>
      </div>
    </div>
  );
}
