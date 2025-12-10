
import React from 'react';
import { ProblemData, ProblemType } from '../types';
import { BetweenVisualizer } from '../features/Between';
import { QueueFBVisualizer } from '../features/QueueFB';
import { QueueRankVisualizer } from '../features/QueueRank';
import { BookVisualizer } from '../features/Book';
import { HolidayVisualizer } from '../features/Holiday';
import { DelayVisualizer } from '../features/Delay';

interface VisualizerProps {
  data: ProblemData;
  step: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({ data, step }) => {
  return (
    <div className="w-full h-80 bg-white rounded-2xl shadow-inner border border-slate-100 p-4 flex items-center justify-center overflow-hidden relative">
      {step === 0 && (
        <div className="text-center pop-in">
          <div className="text-6xl mb-4">🤔</div>
          <p className="text-slate-500 text-lg">准备好开始了吗？</p>
        </div>
      )}

      {data.type === ProblemType.BETWEEN && <BetweenVisualizer data={data} step={step} />}
      {data.type === ProblemType.QUEUE_FB && <QueueFBVisualizer data={data} step={step} />}
      {data.type === ProblemType.QUEUE_RANK && <QueueRankVisualizer data={data} step={step} />}
      {data.type === ProblemType.BOOK && <BookVisualizer data={data} step={step} />}
      {data.type === ProblemType.HOLIDAY && <HolidayVisualizer data={data} step={step} />}
      {data.type === ProblemType.DELAY && <DelayVisualizer data={data} step={step} />}
    </div>
  );
};
