
import React from 'react';
import { ProblemData, ProblemType } from '../types';
import { getRandomName, COLORS } from '../utils/helpers';

export const generateQueueFB = (): ProblemData => {
  const name1 = getRandomName();
  const front = Math.floor(Math.random() * 6) + 1;
  const back = Math.floor(Math.random() * 6) + 1;
  const total = front + back + 1;
  return {
    type: ProblemType.QUEUE_FB,
    question: `${name1}在排队，他前面有 ${front} 人，后面有 ${back} 人。这队一共有多少人？`,
    numbers: [front, back, total],
    names: [name1],
    formulaText: `${front} + ${back} + 1 = ${total}`,
    conceptText: "公式：前面人数 + 后面人数 + 1 (自己)",
    answerText: `一共有 ${total} 人`,
    steps: [
      "准备好了吗？点击开始！",
      `第一步：先看看${name1}在哪里。(那个不同颜色的小人)`,
      `第二步：加上前面的 ${front} 个人。`,
      `第三步：再加上后面的 ${back} 个人。别忘了${name1}自己哦！`
    ]
  };
};

export const QueueFBVisualizer: React.FC<{ data: ProblemData; step: number }> = ({ data, step }) => {
  const [front, back, total] = data.numbers;
  
  // Calculate visualization items
  const items = [];
  for(let i=0; i<front; i++) items.push({ type: 'front', id: `f${i}` });
  items.push({ type: 'me', id: 'me' });
  for(let i=0; i<back; i++) items.push({ type: 'back', id: `b${i}` });

  return (
    <svg viewBox={`0 0 ${items.length * 45 + 50} 150`} className="w-full h-full max-h-[300px]">
      {items.map((item, i) => {
        const x = 40 + i * 45;
        let opacity = 0;
        let color = COLORS.pale;
        let label = '';
        let transformY = 0;

        if (step >= 1 && item.type === 'me') { opacity = 1; color = COLORS.highlight; label = "我"; }
        if (step >= 2 && item.type === 'front') { opacity = 1; color = COLORS.primary; }
        if (step >= 3 && item.type === 'back') { opacity = 1; color = COLORS.secondary; }

        // Animation effect: items slide in slightly from top
        if (opacity === 0) transformY = -20;

        return (
          <g key={item.id} style={{ opacity, transform: `translateY(${transformY}px)` }} className="transition-all duration-500 ease-out">
             <rect x={x - 15} y={50} width={30} height={50} rx={8} fill={color} />
             <circle cx={x} cy={40} r={12} fill={color} />
             {label && <text x={x} y={20} textAnchor="middle" fill={COLORS.highlight} fontSize="14" fontWeight="bold">{label}</text>}
             <text x={x} y={120} textAnchor="middle" fill="#94a3b8" fontSize="10">{i + 1}</text>
          </g>
        );
      })}
      
      {/* Bracket for Front */}
      <g className={`transition-opacity duration-700 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <path d={`M 25 30 L 25 20 L ${25 + front * 45} 20 L ${25 + front * 45} 30`} fill="none" stroke={COLORS.primary} strokeWidth="2" />
          <text x={25 + (front * 45) / 2} y={15} textAnchor="middle" fill={COLORS.primary} fontSize="12">{front} 人</text>
      </g>
      
      {/* Bracket for Back */}
      <g className={`transition-opacity duration-700 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <path d={`M ${25 + (front + 1) * 45} 30 L ${25 + (front + 1) * 45} 20 L ${25 + (total) * 45} 20 L ${25 + (total) * 45} 30`} fill="none" stroke={COLORS.secondary} strokeWidth="2" />
          <text x={25 + (front + 1) * 45 + (back * 45) / 2} y={15} textAnchor="middle" fill={COLORS.secondary} fontSize="12">{back} 人</text>
      </g>
    </svg>
  );
};
