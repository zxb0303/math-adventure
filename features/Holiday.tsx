
import React from 'react';
import { ProblemData, ProblemType } from '../types';
import { COLORS, WEEKDAYS } from '../utils/helpers';

export const generateHoliday = (): ProblemData => {
  const startIdx = Math.floor(Math.random() * 4); // 0-3 (Mon-Thu)
  const duration = Math.floor(Math.random() * 3) + 2; // 2-4 days
  const endIdx = startIdx + duration - 1;
  const count = endIdx - startIdx + 1;
  return {
    type: ProblemType.HOLIDAY,
    question: `放假啦！从星期${WEEKDAYS[startIdx]}放假到星期${WEEKDAYS[endIdx]}。一共放了几天假？`,
    numbers: [startIdx + 1, endIdx + 1, count], // Store 1-based index
    names: [],
    formulaText: `${endIdx + 1} - ${startIdx + 1} + 1 = ${count}`,
    conceptText: "公式：结束序号 - 开始序号 + 1 (头尾都算)",
    answerText: `放了 ${count} 天假`,
    steps: [
      "准备好了吗？点击开始！",
      `第一步：在日历上圈出开始的星期${WEEKDAYS[startIdx]}。`,
      `第二步：一直圈到星期${WEEKDAYS[endIdx]}。`,
      `第三步：头尾都休息了，数一数绿色的格子有几个？`
    ]
  };
};

export const HolidayVisualizer: React.FC<{ data: ProblemData; step: number }> = ({ data, step }) => {
  const [startIdx1, endIdx1] = data.numbers; // 1-based
  // Visualization spans full week usually
  const items = [1, 2, 3, 4, 5, 6, 7]; 
  
  return (
    <svg viewBox="0 0 450 150" className="w-full h-full max-h-[300px]">
       {step >= 1 && items.map((num, i) => {
           const x = 35 + i * 60;
           const isStart = num === startIdx1;
           const isEnd = num === endIdx1;
           const isInRange = num >= startIdx1 && num <= endIdx1;
           
           let fill = 'white';
           let stroke = '#cbd5e1';
           let strokeWidth = 2;

           if (step >= 1 && (isStart)) { stroke = COLORS.primary; strokeWidth = 3; }
           if (step >= 2 && isInRange) { fill = '#fff1f2'; stroke = COLORS.highlight; }
           if (step >= 2 && (isEnd)) { stroke = COLORS.secondary; strokeWidth = 3; }
           if (step >= 3 && isInRange) { fill = '#dcfce7'; stroke = COLORS.success; }

           return (
               <g key={num} className="transition-all duration-500">
                  {/* Calendar Paper Look */}
                  <rect x={x - 25} y={40} width={50} height={50} rx={8} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
                  {/* Top Bar of calendar */}
                  <rect x={x - 25} y={40} width={50} height={15} rx={8} fill={stroke === '#cbd5e1' ? '#cbd5e1' : stroke} />
                  
                  <text x={x} y={75} textAnchor="middle" fill={COLORS.text} fontSize="14" fontWeight="bold">周{WEEKDAYS[num-1]}</text>
                  
                  {step >= 1 && isStart && <text x={x} y={30} textAnchor="middle" fill={COLORS.primary} fontSize="12">开始</text>}
                  {step >= 2 && isEnd && <text x={x} y={110} textAnchor="middle" fill={COLORS.secondary} fontSize="12">结束</text>}
               </g>
           )
       })}
    </svg>
  )
};
