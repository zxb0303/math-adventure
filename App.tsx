
import React, { useState } from 'react';
import { ProblemSolver } from './components/ProblemSolver';
import { ProblemType } from './types';

const PROBLEMS = [
  { id: ProblemType.BETWEEN, title: "之间有几个？", icon: "↔️", color: "bg-indigo-500" },
  { id: ProblemType.QUEUE_FB, title: "排队：前后求总数", icon: "🚶", color: "bg-blue-500" },
  { id: ProblemType.QUEUE_RANK, title: "排队：第几求总数", icon: "🔢", color: "bg-sky-500" },
  { id: ProblemType.QUEUE_MIXED, title: "排队：排名+数量", icon: "➕", color: "bg-teal-500" },
  { id: ProblemType.BOOK, title: "看书页数", icon: "📖", color: "bg-amber-500" },
  { id: ProblemType.HOLIDAY, title: "放假天数", icon: "📅", color: "bg-rose-500" },
  { id: ProblemType.DELAY, title: "推迟几天？", icon: "⏰", color: "bg-purple-500" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ProblemType>(ProblemType.BETWEEN);

  const activeProblem = PROBLEMS.find(p => p.id === activeTab) || PROBLEMS[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero Section */}
      <header className="bg-white border-b border-slate-200 py-3 px-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative z-10">
        <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-600 tracking-tight flex items-center gap-2 whitespace-nowrap">
            数学小探险 🚀
            </h1>
            <div className="hidden md:block w-px h-6 bg-slate-300"></div>
            <p className="text-slate-500 text-sm md:text-lg font-medium whitespace-nowrap">
            一年级解决问题专项训练
            </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="w-[96%] max-w-[1400px] mx-auto mt-6">
        <div className="flex flex-wrap justify-center gap-3">
          {PROBLEMS.map((prob) => (
            <button
              key={prob.id}
              onClick={() => setActiveTab(prob.id)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm md:text-base shadow-sm border
                ${activeTab === prob.id 
                  ? `${prob.color} text-white border-transparent shadow-md scale-105` 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }
              `}
            >
              <span>{prob.icon}</span>
              <span>{prob.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full mt-4">
        <ProblemSolver 
            key={activeProblem.id}
            type={activeProblem.id}
            title={activeProblem.title}
            icon={activeProblem.icon}
            colorClass={activeProblem.color}
        />
      </main>
      
      <footer className="text-center text-slate-400 text-sm mt-12 pb-8">
        <p>快乐学习 · 天天向上</p>
      </footer>
    </div>
  );
}
