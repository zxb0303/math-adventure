
import React, { useState, useEffect } from 'react';
import { ProblemType, ProblemData } from '../types';
import { generateProblem } from '../utils/generator';
import { Visualizer } from './Visualizer';

interface ProblemSolverProps {
  type: ProblemType;
  title: string;
  icon: string;
  colorClass: string;
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({ type, title, icon, colorClass }) => {
  const [data, setData] = useState<ProblemData | null>(null);
  const [step, setStep] = useState(0);

  // Initial load
  useEffect(() => {
    handleNewProblem();
  }, [type]);

  const handleNewProblem = () => {
    setStep(0);
    setTimeout(() => {
        setData(generateProblem(type));
    }, 100);
  };

  const handleNextStep = () => {
    // Max step index is 3 (corresponding to steps[3]). 
    // If current step is 3, next action is to reset.
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      handleNewProblem();
    }
  };

  if (!data) return <div>Loading...</div>;

  const isFinished = step >= 3;
  
  // Progress bar width
  const progress = (step / 3) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-slate-100 w-[96%] max-w-[1400px] mx-auto my-4 transition-all duration-500">
      {/* Header */}
      <div className={`px-8 py-5 ${colorClass} text-white flex items-center justify-between`}>
        <div className="flex items-center gap-4">
            <span className="text-4xl bg-white/20 p-2 rounded-2xl shadow-sm">{icon}</span>
            <div>
                <h2 className="text-3xl font-bold tracking-wide">{title}</h2>
                <div className="text-white/80 text-sm font-medium mt-1 opacity-90">逐步点击下方按钮进行解题</div>
            </div>
        </div>
        <button 
            onClick={handleNewProblem}
            className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 backdrop-blur-sm"
        >
            <span>换一题</span> 
            <span className="text-lg">🔄</span>
        </button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Question, Steps, Result & Controls */}
            {/* Using justify-between ensures the controls stay at the bottom while the content above grows */}
            <div className="lg:col-span-4 flex flex-col justify-between order-2 lg:order-1 h-full min-h-[350px]">
                
                {/* TOP SECTION: Content that grows */}
                <div className="space-y-6">
                    {/* Question Bubble */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                         <div className={`absolute -left-2 top-6 w-4 h-4 bg-slate-50 border-l border-b border-slate-200 transform rotate-45 hidden lg:block`}></div>
                         <div className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-wider">题目描述</div>
                         <h3 className="text-2xl text-slate-800 font-medium leading-relaxed">
                            {data.question}
                        </h3>
                    </div>

                    {/* Step Instruction */}
                    <div className="min-h-[80px]">
                        {step > 0 && data.steps[step] ? (
                             <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl animate-pop-in shadow-sm">
                                <div className="font-bold text-xs text-amber-600 mb-1 uppercase">当前步骤</div>
                                <div className="text-lg font-bold">{data.steps[step]}</div>
                             </div>
                        ) : (
                            <div className="bg-slate-50 border border-slate-100 text-slate-400 p-4 rounded-xl">
                                点击“开始解题”迈出第一步！
                            </div>
                        )}
                    </div>

                    {/* Result Reveal - Moved here so it doesn't push the buttons when they are justified to bottom */}
                    {/* We keep the container present but invisible to reserve some space or just animate it in. */}
                    {/* Actually, justify-between pushes sections apart. If we insert this in the top flow, it pushes down into the empty space. */}
                    <div className={`transition-all duration-700 transform ease-out ${isFinished ? 'opacity-100 translate-y-0 max-h-40' : 'opacity-0 translate-y-4 max-h-0 overflow-hidden'}`}>
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
                             <div className="text-sm font-bold text-yellow-600 uppercase mb-1">最终答案</div>
                             <div className="text-3xl font-black text-yellow-800">{data.answerText}</div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: Controls that stay anchored */}
                <div className="space-y-6 pt-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                         <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>进度</span>
                            <span>{Math.round(progress)}%</span>
                         </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className={`h-full ${colorClass.replace('bg-', 'bg-')} transition-all duration-700 ease-out relative`} 
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={handleNextStep}
                        className={`
                            w-full py-5 rounded-2xl font-black text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-[0.98]
                            flex items-center justify-center gap-3
                            ${isFinished 
                                ? 'bg-green-500 text-white shadow-green-200 hover:bg-green-600' 
                                : `${colorClass} text-white shadow-indigo-200 hover:brightness-110`
                            }
                        `}
                    >
                        {step === 0 ? 
                            <><span>🚀</span> <span>开始解题</span></> : 
                        step >= 3 ? 
                            <><span>🏁</span> <span>挑战下一题</span></> : 
                            <><span>👇</span> <span>下一步</span></>
                        }
                    </button>
                </div>
            </div>

            {/* Right Column: Visualization */}
            <div className="lg:col-span-8 order-1 lg:order-2">
                <Visualizer data={data} step={step} />
                
                {/* Formula Bar (Below visualizer) */}
                <div className={`mt-6 transition-all duration-700 delay-300 transform ${isFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg text-xl">💡</span>
                            <div>
                                <div className="text-xs font-bold text-indigo-400 uppercase">解题思路</div>
                                <div className="text-indigo-800 font-medium">{data.conceptText}</div>
                            </div>
                        </div>
                        <div className="bg-white px-6 py-2 rounded-xl border border-indigo-100 text-2xl font-mono font-bold text-indigo-600 shadow-sm">
                            {data.formulaText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
