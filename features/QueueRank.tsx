
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
      `第一步：从前往后数，${name1}排第 ${frontRank}。(蓝色数字)`,
      `第二步：从后往前数，${name1}排第 ${backRank}。(黄色数字，注意看！${name1}身上有两个数字)`,
      `第三步：${name1}被数了两次，所以要把重复的一次减掉。`
    ]
  };
};

export const QueueRankVisualizer: React.FC<{ data: ProblemData; step: number }> = ({ data, step }) => {
  const [frontRank, backRank, total] = data.numbers;
  const items = Array.from({ length: total }, (_, i) => i + 1);
  const meIndex = frontRank - 1; // 0-based

  return (
    <svg viewBox={`0 0 ${total * 45 + 50} 180`} className="w-full h-full max-h-[400px]">
      <defs>
        <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.primary} />
        </marker>
        <marker id="arrowhead-yellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.secondary} />
        </marker>
      </defs>

      {items.map((_, i) => {
        const x = 40 + i * 45;
        const isMe = i === meIndex;
        let fill = COLORS.pale;
        let stroke = 'none';
        let strokeWidth = 0;
        
        // Visibility Logic:
        const isVisible = step >= 1 && (step >= 2 || i <= meIndex);
        
        // Progressive coloring & Number Logic
        let displayNum = i + 1; // Default global index
        
        // Step 1: Front Group coloring
        if (step >= 1 && i <= meIndex) {
            fill = COLORS.primary;
            displayNum = i + 1; // 1, 2, 3...
        } 
        
        // Step 2: Back Group coloring
        if (step >= 2 && i >= meIndex) {
            if (isMe) {
                // Special handling for Me in Step 2+
                fill = '#ffffff'; // White background to show numbers clearly
                stroke = COLORS.highlight; // Highlight border
                strokeWidth = 2;
            } else {
                fill = COLORS.secondary;
                displayNum = total - i; 
            }
        }
        
        // Step 3: Highlight collision/result
        if (step >= 3 && isMe) {
            strokeWidth = 3;
            stroke = COLORS.highlight;
        }

        // Delay logic
        // If step 1: delay proportional to i
        // If step 2: delay proportional to (total - i) (reverse flow visual)
        let delay = 0;
        if (step === 1 && isVisible) delay = i * 60;
        if (step === 2 && i >= meIndex) delay = (total - i) * 60;

        return (
          <g key={i} className="transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
             style={{ 
                 opacity: isVisible ? 1 : 0, 
                 transformBox: 'fill-box',
                 transformOrigin: 'center',
                 transform: isVisible ? 'scale(1)' : 'scale(0.5)',
                 transitionDelay: `${delay}ms`
             }}>
             <rect x={x - 15} y={60} width={30} height={40} rx={4} fill={fill} stroke={stroke} strokeWidth={strokeWidth} 
                   className="transition-colors duration-500"/>
             
             {/* Text Content */}
             {isMe && step >= 2 ? (
                 // Double Number Display for Overlap
                 <g>
                     {/* Blue Number (Front Rank) */}
                     <text x={x} y={75} textAnchor="middle" fill={COLORS.primary} fontSize="12" fontWeight="bold">
                        {frontRank}
                     </text>
                     {/* Divider Line */}
                     <line x1={x-10} y1={80} x2={x+10} y2={80} stroke="#e2e8f0" strokeWidth="1" />
                     {/* Yellow Number (Back Rank) */}
                     <text x={x} y={93} textAnchor="middle" fill={COLORS.secondary} fontSize="12" fontWeight="bold">
                        {backRank}
                     </text>
                 </g>
             ) : (
                 // Single Number Display
                 <text x={x} y={85} textAnchor="middle" fill={fill === COLORS.pale ? '#94a3b8' : 'white'} fontSize="16" fontWeight="bold">
                     {displayNum}
                 </text>
             )}
             
             {/* Global Position Index (The "Seat Number") */}
             <text x={x} y={115} textAnchor="middle" fill="#cbd5e1" fontSize="10">
                 {i + 1}
             </text>

             {/* Show name */}
             {isMe && <text x={x} y={50} textAnchor="middle" fill={COLORS.text} fontSize="12" fontWeight="bold">{data.names[0]}</text>}
          </g>
        );
      })}
      
      {/* Front Arrow */}
      <g className={`transition-all duration-700 delay-500 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <line x1={20} y1={30} x2={40 + meIndex * 45} y2={30} stroke={COLORS.primary} strokeWidth="3" markerEnd="url(#arrowhead-blue)" />
          <text x={20} y={20} fill={COLORS.primary} fontSize="12">第 {frontRank} 个</text>
      </g>
      
      {/* Back Arrow */}
      <g className={`transition-all duration-700 delay-500 ${step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <line x1={40 + (total - 1) * 45 + 20} y1={135} x2={40 + meIndex * 45} y2={135} stroke={COLORS.secondary} strokeWidth="3" markerEnd="url(#arrowhead-yellow)" />
          <text x={40 + (total - 1) * 45} y={150} textAnchor="end" fill={COLORS.secondary} fontSize="12">倒数第 {backRank} 个</text>
      </g>
    </svg>
  );
};
