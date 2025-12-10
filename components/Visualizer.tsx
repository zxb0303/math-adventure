
import React from 'react';
import { ProblemData, ProblemType } from '../types';
import { BetweenVisualizer } from '../features/Between';
import { QueueFBVisualizer } from '../features/QueueFB';
import { QueueRankVisualizer } from '../features/QueueRank';
import { QueueMixedVisualizer } from '../features/QueueMixed';
import { BookVisualizer } from '../features/Book';
import { HolidayVisualizer } from '../features/Holiday';
import { DelayVisualizer } from '../features/Delay';

interface VisualizerProps {
  data: ProblemData;
  step: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({ data, step }) => {
  return (
    <div className="w-full h-80 lg:h-[400px] bg-slate-50/50 rounded-3xl shadow-inner border border-slate-100 p-4 md:p-8 flex items-center justify-center overflow-hidden relative group transition-all duration-500">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {step === 0 && (
        <div className="text-center pop-in relative z-10">
          <div className="text-8xl mb-6 animate-bounce">🤔</div>
          <p className="text-slate-400 text-xl font-bold">准备好开始了吗？</p>
          <p className="text-slate-300 text-sm mt-2">点击左侧按钮开始演示</p>
        </div>
      )}

      {/* Render Active Visualizer */}
      {data.type === ProblemType.BETWEEN && <BetweenVisualizer data={data} step={step} />}
      {data.type === ProblemType.QUEUE_FB && <QueueFBVisualizer data={data} step={step} />}
      {data.type === ProblemType.QUEUE_RANK && <QueueRankVisualizer data={data} step={step} />}
      {data.type === ProblemType.QUEUE_MIXED && <QueueMixedVisualizer data={data} step={step} />}
      {data.type === ProblemType.BOOK && <BookVisualizer data={data} step={step} />}
      {data.type === ProblemType.HOLIDAY && <HolidayVisualizer data={data} step={step} />}
      {data.type === ProblemType.DELAY && <DelayVisualizer data={data} step={step} />}
    </div>
  );
};
