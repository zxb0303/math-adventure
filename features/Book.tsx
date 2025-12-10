
import React from 'react';
import { ProblemData, ProblemType } from '../types';
import { COLORS } from '../utils/helpers';

export const generateBook = (): ProblemData => {
  const start = Math.floor(Math.random() * 10) + 1;
  const count = Math.floor(Math.random() * 8) + 2;
  const end = start + count - 1;
  return {
    type: ProblemType.BOOK,
    question: `读书打卡！今天从第 ${start} 页看到第 ${end} 页。今天一共看了几页书？`,
    numbers: [start, end, count],
    names: [],
    formulaText: `${end} - ${start} + 1 = ${count}`,
    conceptText: "公式：末页 - 起始页 + 1 (头尾都算)",
    answerText: `一共看了 ${count} 页`,
    steps: [
      "准备好了吗？点击开始！",
      `第一步：找到开始的第 ${start} 页，把它圈出来。`,
      `第二步：一直读到第 ${end} 页，把它也圈出来。`,
      `第三步：中间的都读了，因为头尾都算了，所以公式是 “末-初+1”。`
    ]
  };
};

export const BookVisualizer: React.FC<{ data: ProblemData; step: number }> = ({ data, step }) => {
  const [start, end] = data.numbers;
  const span = end - start;
  // Show a few extra pages for context
  const items = Array.from({ length: span + 5 }, (_, i) => start - 2 + i).filter(n => n > 0);
  
  return (
    <svg viewBox={`0 0 ${items.length * 60 + 20} 150`} className="w-full h-full max-h-[300px]">
       {step >= 1 && items.map((num, i) => {
           const x = 40 + i * 60;
           const isStart = num === start;
           const isEnd = num === end;
           const isInRange = num >= start && num <= end;
           
           let fill = 'white';
           let stroke = '#cbd5e1';
           let strokeWidth = 2;

           // Step logic for coloring
           if (step >= 1 && (isStart)) { stroke = COLORS.primary; strokeWidth = 3; }
           if (step >= 2 && isInRange) { fill = '#eff6ff'; stroke = COLORS.primary; } // Range
           if (step >= 2 && (isEnd)) { stroke = COLORS.secondary; strokeWidth = 3; } // End
           if (step >= 3 && isInRange) { fill = '#dcfce7'; stroke = COLORS.success; } // Result

           return (
               <g key={num} className="transition-all duration-500">
                  <rect x={x - 25} y={40} width={50} height={60} rx={4} fill={fill} stroke={stroke} strokeWidth={strokeWidth} 
                        style={{ transition: 'fill 0.5s, stroke 0.5s' }}/>
                  {/* Page Lines decoration */}
                  <line x1={x-15} y1={55} x2={x+15} y2={55} stroke={stroke === '#cbd5e1' ? '#e2e8f0' : stroke} strokeWidth="1"/>
                  <line x1={x-15} y1={65} x2={x+15} y2={65} stroke={stroke === '#cbd5e1' ? '#e2e8f0' : stroke} strokeWidth="1"/>
                  
                  <text x={x} y={85} textAnchor="middle" fill={COLORS.text} fontSize="14" fontWeight="bold">{num}</text>
                  
                  <g className={`transition-opacity duration-500 ${step >= 1 && isStart ? 'opacity-100' : 'opacity-0'}`}>
                      <text x={x} y={30} textAnchor="middle" fill={COLORS.primary} fontSize="12">开始</text>
                  </g>
                  <g className={`transition-opacity duration-500 ${step >= 2 && isEnd ? 'opacity-100' : 'opacity-0'}`}>
                    <text x={x} y={120} textAnchor="middle" fill={COLORS.secondary} fontSize="12">结束</text>
                  </g>
               </g>
           )
       })}
    </svg>
  )
};
