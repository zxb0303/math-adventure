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
    if (step < 4) {
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
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-slate-100 max-w-3xl mx-auto my-8">
      {/* Header */}
      <div className={`p-6 ${colorClass} text-white flex items-center justify-between`}>
        <div className="flex items-center gap-3">
            <span className="text-3xl bg-white/20 p-2 rounded-xl">{icon}</span>
            <h2 className="text-2xl font-bold tracking-wide">{title}</h2>
        </div>
        <button 
            onClick={handleNewProblem}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
            换一题 🔄
        </button>
      </div>

      <div className="p-6">
        {/* Question Area */}
        <div className="mb-6">
            <h3 className="text-xl text-slate-700 font-medium leading-relaxed">
                {data.question}
            </h3>
        </div>

        {/* Visualization Area */}
        <div className="mb-6 relative">
            <Visualizer data={data} step={step} />
            
            {/* Step Description Toast */}
            {step > 0 && (
                <div className="absolute top-4 left-0 right-0 mx-auto w-max max-w-[90%] bg-white/90 backdrop-blur border border-slate-200 shadow-lg rounded-full px-4 py-2 text-center text-slate-700 font-medium text-sm animate-bounce">
                    {data.steps[step]}
                </div>
            )}
        </div>

        {/* Controls & Formula Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex-1 w-full">
                {/* Steps Progress */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${colorClass.replace('bg-', 'bg-')} transition-all duration-500`} 
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                    <span className="text-xs text-slate-400 font-mono">STEP {step}/3</span>
                </div>

                {/* Formula & Concept Display (appears at end) */}
                <div className={`transition-all duration-500 flex flex-col gap-1 ${isFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 text-indigo-700 font-mono text-lg font-bold w-full text-center shadow-sm">
                        {data.formulaText}
                    </div>
                    <div className="text-center text-slate-500 text-xs md:text-sm font-medium px-2">
                        💡 {data.conceptText}
                    </div>
                </div>
            </div>

            <button 
                onClick={handleNextStep}
                className={`
                    px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 min-w-[160px]
                    ${isFinished 
                        ? 'bg-green-500 text-white shadow-green-200' 
                        : `${colorClass} text-white shadow-indigo-200`
                    }
                `}
            >
                {step === 0 ? "开始解题 ▶" : step >= 3 ? "下一题 🏁" : "下一步 👇"}
            </button>
        </div>

        {/* Final Answer */}
        {step >= 3 && (
            <div className="mt-6 text-center pop-in">
                <span className="inline-block bg-yellow-100 text-yellow-800 px-6 py-3 rounded-2xl text-xl font-bold border-2 border-yellow-200 dashed">
                    🎉 答案：{data.answerText}
                </span>
            </div>
        )}

      </div>
    </div>
  );
};