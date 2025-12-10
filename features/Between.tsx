
import React from 'react';
import { ProblemData, ProblemType } from '../types';
import { getRandomName, COLORS } from '../utils/helpers';

export const generateBetween = (): ProblemData => {
  const name1 = getRandomName();
  let name2 = getRandomName([name1]);
  const a = Math.floor(Math.random() * 5) + 1; // 1-5
  const gap = Math.floor(Math.random() * 5) + 2; // Gap of 2-6
  const b = a + gap + 1;
  const ans = b - a - 1;
  return {
    type: ProblemType.BETWEEN,
    question: `排队啦！${name1}排在第 ${a} 个，${name2}排在第 ${b} 个。请问他们之间有几个人？`,
    numbers: [a, b, ans],
    names: [name1, name2],
    formulaText: `${b} - ${a} - 1 = ${ans}`,
    conceptText: "公式：大数 - 小数 - 1",
    answerText: `之间有 ${ans} 个人`,
    steps: [
      "准备好了吗？点击开始！",
      `第一步：画出排队的队伍。找到第 ${a} 个和第 ${b} 个。`,
      `第二步：我们要找的是他们“中间”的人 (不包括头尾)。`,
      `第三步：数一数，或者用减法算一算！`
    ]
  };
};

export const BetweenVisualizer: React.FC<{ data: ProblemData; step: number }> = ({ data, step }) => {
  const [a, b, ans] = data.numbers;
  const totalItems = b + 2;
  const items = Array.from({ length: totalItems }, (_, i) => i + 1);

  return (
    <svg viewBox={`0 0 ${items.length * 50 + 20} 150`} className="w-full h-full max-h-[300px]">
      {step >= 1 && items.map((num, i) => {
        const x = 30 + i * 50;
        const isA = num === a;
        const isB = num === b;
        const isBetween = num > a && num < b;
        
        let fill = COLORS.pale;
        let scale = 1;
        
        if (step >= 2 && (isA || isB)) {
          fill = isA ? COLORS.primary : COLORS.secondary;
          scale = 1.2;
        }
        if (step >= 3 && isBetween) {
          fill = COLORS.highlight;
        }

        return (
          <g key={num} className="transition-all duration-700 ease-out" 
             style={{ 
               transformBox: 'fill-box', 
               transformOrigin: 'center', 
               transform: `scale(${scale})`,
               opacity: 1 
             }}>
             {/* Line connector */}
             {i > 0 && <line x1={x - 40} y1={75} x2={x - 10} y2={75} stroke="#cbd5e1" strokeWidth="2" />}
             
             {/* Shape */}
             <circle cx={x} cy={75} r={18} fill={fill} className="transition-colors duration-500" />
             <text x={x} y={80} textAnchor="middle" fill={fill === COLORS.pale ? '#64748b' : 'white'} fontSize="14" fontWeight="bold">{num}</text>
             
             {/* Labels */}
             <g className={`transition-opacity duration-500 ${step >= 2 && isA ? 'opacity-100' : 'opacity-0'}`}>
                <text x={x} y={40} textAnchor="middle" fill={COLORS.primary} fontSize="12" fontWeight="bold">{data.names[0]}</text>
             </g>
             <g className={`transition-opacity duration-500 ${step >= 2 && isB ? 'opacity-100' : 'opacity-0'}`}>
                <text x={x} y={40} textAnchor="middle" fill={COLORS.secondary} fontSize="12" fontWeight="bold">{data.names[1]}</text>
             </g>
             
             {/* Count indicators */}
             <g className={`transition-all duration-500 ${step >= 3 && isBetween ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
               <text x={x} y={115} textAnchor="middle" fill={COLORS.highlight} fontSize="10" fontWeight="bold">1</text>
             </g>
          </g>
        );
      })}
      
      {/* Arc for visual grouping */}
      <path 
        d={`M ${30 + a * 50} 110 Q ${30 + ((a+b)/2 -1) * 50} 150 ${30 + (b-2) * 50} 110`} 
        fill="none" 
        stroke={COLORS.highlight} 
        strokeWidth="2" 
        strokeDasharray="5,5"
        className={`transition-all duration-1000 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}
        style={{ strokeDashoffset: step >= 3 ? 0 : 100 }}
      />
    </svg>
  );
};
