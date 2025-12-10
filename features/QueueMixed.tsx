
import React from 'react';
import { ProblemData, ProblemType } from '../types';
import { getRandomName, COLORS } from '../utils/helpers';

export const generateQueueMixed = (): ProblemData => {
  const name1 = getRandomName();
  // 0: Front Count + Back Rank (Existing)
  // 1: Front Rank + Back Count (New variation)
  const mode = Math.random() < 0.5 ? 0 : 1; 

  if (mode === 0) {
      const frontCount = Math.floor(Math.random() * 5) + 2; // 2-6 people in front
      const backRank = Math.floor(Math.random() * 5) + 3;   // 3-7th from back
      const total = frontCount + backRank;
      
      return {
        type: ProblemType.QUEUE_MIXED,
        question: `排队检查身体！${name1}的前面有 ${frontCount} 人，从后往前数他是第 ${backRank} 个。这队一共有多少人？`,
        numbers: [frontCount, backRank, total, 0], // 0 indicates mode 0
        names: [name1],
        formulaText: `${frontCount} + ${backRank} = ${total}`,
        conceptText: "公式：前面的人数 + 从后数的排名",
        answerText: `一共有 ${total} 人`,
        steps: [
          "准备好了吗？点击开始！",
          `第一步：先看看${name1}的前面，一共有 ${frontCount} 个人。(蓝色数字)`,
          `第二步：再看后面，从后往前数${name1}是第 ${backRank} 个。(黄色数字：1, 2, 3...)`,
          `第三步：两部分加起来，刚好就是所有人！`
        ]
      };
  } else {
      const frontRank = Math.floor(Math.random() * 5) + 3; // e.g. 3rd, 4th...
      const backCount = Math.floor(Math.random() * 5) + 2; // e.g. 2 people behind
      const total = frontRank + backCount;

      return {
        type: ProblemType.QUEUE_MIXED,
        question: `排队检查身体！${name1}从前往后数排第 ${frontRank} 个，他后面还有 ${backCount} 人。这队一共有多少人？`,
        numbers: [frontRank, backCount, total, 1], // 1 indicates mode 1
        names: [name1],
        formulaText: `${frontRank} + ${backCount} = ${total}`,
        conceptText: "公式：从前数的排名 + 后面的人数",
        answerText: `一共有 ${total} 人`,
        steps: [
            "准备好了吗？点击开始！",
            `第一步：从前往后数，${name1}排在第 ${frontRank} 个。(蓝色数字)`,
            `第二步：看看${name1}的后面，还有 ${backCount} 个人。(黄色数字：1, 2, 3...)`,
            `第三步：两部分加起来，刚好就是所有人！`
        ]
      };
  }
};

export const QueueMixedVisualizer: React.FC<{ data: ProblemData; step: number }> = ({ data, step }) => {
  const [val1, val2, total, modeRaw] = data.numbers;
  const mode = modeRaw ?? 0; // Default to 0 if undefined
  
  const items = Array.from({ length: total }, (_, i) => i + 1);
  const meIndex = mode === 0 ? val1 : val1 - 1;

  return (
    <svg viewBox={`0 0 ${total * 45 + 50} 180`} className="w-full h-full max-h-[400px]">
      <defs>
        <marker id="arrowhead-blue-mix" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.primary} />
        </marker>
        <marker id="arrowhead-yellow-mix" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.secondary} />
        </marker>
      </defs>

      {items.map((_, i) => {
        const x = 40 + i * 45;
        const isMe = i === meIndex;
        
        let isBlueGroup = false;
        let isYellowGroup = false;

        if (mode === 0) {
            isBlueGroup = i < meIndex;
            isYellowGroup = i >= meIndex;
        } else {
            isBlueGroup = i <= meIndex;
            isYellowGroup = i > meIndex;
        }

        let fill = COLORS.pale;
        let stroke = 'none';
        let strokeWidth = 0;
        
        // Visibility Logic
        let isVisible = false;
        if (step >= 1) {
            if (isBlueGroup) isVisible = true;
            if (step >= 2) isVisible = true;
        }
        
        // Coloring & Number Logic
        let displayNum = i + 1; // Default global

        if (step >= 1 && isBlueGroup) {
            fill = COLORS.primary;
            // Mode 0: Just counting 1, 2, 3...
            // Mode 1: Ranking 1, 2, 3...
            displayNum = i + 1;
        }
        if (step >= 2 && isYellowGroup) {
            fill = COLORS.secondary;
            if (mode === 0) {
                // Mode 0: Back Rank. 
                // e.g. Total 5. Last person is 1. Me is 3. 
                // Num = Total - i
                displayNum = total - i;
            } else {
                // Mode 1: Back Count.
                // e.g. Me is 3. Next person is 1.
                // Num = i - meIndex
                displayNum = i - meIndex;
            }
        }
        
        // Me Highlight
        if (isMe) {
            stroke = '#000';
            strokeWidth = step >= 2 ? 1 : 0;
            if (step >= 1) isVisible = true; 
        }

        let delay = 0;
        if (step === 1 && isBlueGroup) delay = i * 60;
        if (step === 2 && isYellowGroup) delay = (i - meIndex) * 60;


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
             
             {/* Labels */}
             {isMe && <text x={x} y={50} textAnchor="middle" fill={COLORS.text} fontSize="12" fontWeight="bold">{data.names[0]}</text>}
             
             {/* Dynamic Count Number Inside Box */}
             <text x={x} y={85} textAnchor="middle" fill={fill === COLORS.pale ? '#94a3b8' : 'white'} fontSize="16" fontWeight="bold">
                 {displayNum}
             </text>
             
             {/* Global Index Below Box */}
             <text x={x} y={115} textAnchor="middle" fill="#cbd5e1" fontSize="10">
                 {i + 1}
             </text>
          </g>
        );
      })}
      
      {/* Blue Indicator */}
      <g className={`transition-all duration-700 delay-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          {mode === 0 ? (
             /* Mode 0: Front Count */
             <>
                <path d={`M 25 30 L 25 20 L ${25 + val1 * 45} 20 L ${25 + val1 * 45} 30`} 
                    fill="none" stroke={COLORS.primary} strokeWidth="2" />
                <text x={25 + (val1 * 45) / 2} y={15} textAnchor="middle" fill={COLORS.primary} fontSize="12">前面 {val1} 人</text>
             </>
          ) : (
             /* Mode 1: Front Rank */
             <>
                <line x1={20} y1={30} x2={40 + meIndex * 45} y2={30} 
                    stroke={COLORS.primary} strokeWidth="2" markerEnd="url(#arrowhead-blue-mix)" />
                <text x={20} y={20} textAnchor="start" fill={COLORS.primary} fontSize="12">第 {val1} 个</text>
             </>
          )}
      </g>
      
      {/* Yellow Indicator */}
      <g className={`transition-all duration-700 delay-500 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {mode === 0 ? (
             /* Mode 0: Back Rank */
             <>
                <line x1={40 + (total - 1) * 45 + 20} y1={135} x2={40 + meIndex * 45} y2={135} 
                    stroke={COLORS.secondary} strokeWidth="3" markerEnd="url(#arrowhead-yellow-mix)" />
                <text x={40 + (total - 1) * 45} y={150} textAnchor="end" fill={COLORS.secondary} fontSize="12">
                    从后往前第 {val2} 个
                </text>
             </>
          ) : (
             /* Mode 1: Back Count */
             <>
                <path d={`M ${40 + meIndex * 45 + 25} 120 L ${40 + meIndex * 45 + 25} 130 L ${40 + (total - 1) * 45 + 25} 130 L ${40 + (total - 1) * 45 + 25} 120`} 
                    fill="none" stroke={COLORS.secondary} strokeWidth="2" />
                <text x={(40 + meIndex * 45 + 25 + 40 + (total - 1) * 45 + 25) / 2} y={145} textAnchor="middle" fill={COLORS.secondary} fontSize="12">
                    后面 {val2} 人
                </text>
             </>
          )}
      </g>
    </svg>
  );
};
