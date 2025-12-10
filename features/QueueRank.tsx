
import React from 'react';
import { ProblemData, ProblemType } from '../types';
import { getRandomName, COLORS } from '../utils/helpers';

export const generateQueueRank = (): ProblemData => {
  const name1 = getRandomName();
  const frontRank = Math.floor(Math.random() * 5) + 3;
  const backRank = Math.floor(Math.random() * 5) + 3;
  const total = frontRank + backRank - 1;
  return {
    type: ProblemType.QUEUE_RANK,
    question: `做操啦！从前往后数，${name1}是第 ${frontRank} 个；从后往前数，他是第 ${backRank} 个。这队有多少人？`,
    numbers: [frontRank, backRank, total],
    names: [name1],
    formulaText: `${frontRank} + ${backRank} - 1 = ${total}`,
    conceptText: "公式：从前数 + 从后数 - 1 (减去重复)",
    answerText: `一共有 ${total} 人`,
    steps: [
      "准备好了吗？点击开始！",
      `第一步：从前往后数，${name1}排第 ${frontRank}。(蓝色部分)`,
      `第二步：从后往前数，${name1}排第 ${backRank}。(黄色部分)`,
      `第三步：哎呀，${name1}被数了两次！(颜色重叠) 所以要减去 1。`
    ]
  };
};

export const QueueRankVisualizer: React.FC<{ data: ProblemData; step: number }> = ({ data, step }) => {
  const [frontRank, backRank, total] = data.numbers;
  const items = Array.from({ length: total }, (_, i) => i + 1);
  const meIndex = frontRank - 1; // 0-based

  return (
    <svg viewBox={`0 0 ${total * 45 + 50} 180`} className="w-full h-full max-h-[300px]">
      <defs>
        <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.primary} />
        </marker>
        <marker id="arrowhead-yellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.secondary} />
        </marker>
        <pattern id="mixedPattern" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="10" transform="translate(0,0)" fill={COLORS.primary} />
            <rect width="5" height="10" transform="translate(5,0)" fill={COLORS.secondary} />
        </pattern>
      </defs>

      {items.map((_, i) => {
        const x = 40 + i * 45;
        const isMe = i === meIndex;
        let fill = COLORS.pale;
        
        // Progressive coloring
        if (step >= 1 && i <= meIndex) fill = COLORS.primary; 
        if (step >= 2 && i >= meIndex) {
            // Overlap logic
            if (step >= 1 && i <= meIndex) fill = 'url(#mixedPattern)'; 
            else fill = COLORS.secondary;
        }
        if (step >= 3 && isMe) fill = COLORS.highlight; // Highlight duplication

        return (
          <g key={i} className="transition-all duration-500">
             <rect x={x - 15} y={60} width={30} height={40} rx={4} fill={fill} stroke={isMe ? '#000' : 'none'} strokeWidth={isMe ? 1 : 0} 
                   className="transition-colors duration-500"/>
             <text x={x} y={85} textAnchor="middle" fill={fill === COLORS.pale ? '#94a3b8' : 'white'} fontSize="12">{i + 1}</text>
             
             {isMe && <text x={x} y={50} textAnchor="middle" fill={COLORS.highlight} fontSize="12" fontWeight="bold">我</text>}
          </g>
        );
      })}
      
      {/* Front Arrow */}
      <g className={`transition-all duration-700 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <line x1={20} y1={120} x2={40 + meIndex * 45} y2={120} stroke={COLORS.primary} strokeWidth="3" markerEnd="url(#arrowhead-blue)" />
          <text x={40} y={140} fill={COLORS.primary} fontSize="12">第 {frontRank} 个</text>
      </g>
      
      {/* Back Arrow */}
      <g className={`transition-all duration-700 ${step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <line x1={40 + (total - 1) * 45 + 20} y1={30} x2={40 + meIndex * 45} y2={30} stroke={COLORS.secondary} strokeWidth="3" markerEnd="url(#arrowhead-yellow)" />
          <text x={40 + (total - 1) * 45} y={20} textAnchor="end" fill={COLORS.secondary} fontSize="12">倒数第 {backRank} 个</text>
      </g>
    </svg>
  );
};
