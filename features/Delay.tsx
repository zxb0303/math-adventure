
import React from 'react';
import { ProblemData, ProblemType } from '../types';
import { COLORS, WEEKDAYS } from '../utils/helpers';

export const generateDelay = (): ProblemData => {
  const today = Math.floor(Math.random() * 7);
  const delay = Math.floor(Math.random() * 5) + 1;
  const target = (today + delay) % 7;
  return {
    type: ProblemType.DELAY,
    question: `今天是星期${WEEKDAYS[today]}，再过 ${delay} 天是星期几？`,
    numbers: [today, delay, target],
    names: [],
    formulaText: `往后数 ${delay} 格`,
    conceptText: "公式：(今天 + 推迟天数) 循环数一数",
    answerText: `是星期${WEEKDAYS[target]}`,
    steps: [
      "准备好了吗？点击开始！",
      `第一步：找到“今天”是星期${WEEKDAYS[today]}。`,
      `第二步：顺时针往后数 ${delay} 个格子。(跳一跳)`,
      `第三步：停下的位置就是答案啦！`
    ]
  };
};

export const DelayVisualizer: React.FC<{ data: ProblemData; step: number }> = ({ data, step }) => {
  const [todayIdx, delay, targetIdx] = data.numbers; // 0-6 index
  
  // Circle configuration
  const centerX = 200;
  const centerY = 175;
  const radius = 100;
  
  const getCoords = (index: number, offsetR = 0) => {
      const angleDeg = (index * (360 / 7)) - 90;
      const angleRad = angleDeg * (Math.PI / 180);
      return {
          x: centerX + (radius + offsetR) * Math.cos(angleRad),
          y: centerY + (radius + offsetR) * Math.sin(angleRad)
      };
  };

  return (
      <svg viewBox="0 0 400 350" className="w-full h-full">
          {/* Background Ring */}
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />

          {step >= 1 && WEEKDAYS.map((day, i) => {
              const { x, y } = getCoords(i);
              const isToday = i === todayIdx;
              const isTarget = i === targetIdx;
              
              let fill = 'white';
              let stroke = '#cbd5e1';
              let strokeWidth = 2;
              let scale = 1;
              let labelColor = COLORS.text;
              
              if (isToday) { 
                  fill = '#fff7ed'; 
                  stroke = COLORS.secondary; 
                  strokeWidth = 3;
                  labelColor = COLORS.secondary;
                  scale = 1.1;
              }
              
              if (step >= 3 && isTarget) { 
                  fill = '#dcfce7'; 
                  stroke = COLORS.success; 
                  strokeWidth = 3;
                  labelColor = COLORS.success;
                  scale = 1.1;
              }

              return (
                  <g key={i} className="transition-all duration-500" style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${scale})` }}>
                      <circle cx={x} cy={y} r={28} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
                      <text x={x} y={y + 5} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">{day}</text>
                      
                      {step >= 1 && isToday && (
                           <text x={x} y={y - 35} textAnchor="middle" fill={COLORS.secondary} fontSize="12" fontWeight="bold">今天</text>
                      )}
                      {step >= 3 && isTarget && (
                           <text x={x} y={y - 35} textAnchor="middle" fill={COLORS.success} fontSize="12" fontWeight="bold">这里</text>
                      )}
                  </g>
              )
          })}
          
          {/* Jump Arc Animation */}
           {step >= 2 && (() => {
               const startP = getCoords(todayIdx, 45); // Outer arc
               const endP = getCoords(targetIdx, 45);
               
               // SVG Arc logic
               const largeArc = delay > 3 ? 1 : 0;
               
               return (
                   <g className="animate-pulse">
                       <path 
                           d={`M ${startP.x} ${startP.y} A ${radius + 45} ${radius + 45} 0 ${largeArc} 1 ${endP.x} ${endP.y}`} 
                           fill="none" 
                           stroke={COLORS.primary} 
                           strokeWidth="3" 
                           strokeDasharray="6,4" 
                           markerEnd="url(#arrowhead-blue-curve)"
                           className="transition-all duration-1000"
                       />
                       <text x={centerX} y={centerY} textAnchor="middle" fill={COLORS.primary} fontSize="28" fontWeight="bold">
                           +{delay}天
                       </text>
                       <defs>
                          <marker id="arrowhead-blue-curve" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.primary} />
                          </marker>
                       </defs>
                   </g>
               );
           })()}
      </svg>
  )
};
