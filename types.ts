export enum ProblemType {
  BETWEEN = 'BETWEEN',
  QUEUE_FB = 'QUEUE_FB',
  QUEUE_RANK = 'QUEUE_RANK',
  BOOK = 'BOOK',
  HOLIDAY = 'HOLIDAY',
  DELAY = 'DELAY'
}

export interface ProblemData {
  type: ProblemType;
  question: string;
  numbers: number[]; // Store key numbers [a, b, result, etc]
  names: string[];
  answerText: string;
  formulaText: string;
  conceptText: string; // Explanation of the formula logic
  steps: string[]; // Descriptions for each step of the animation
}

// Config for the visualizer
export interface VisualState {
  step: number; // 0: Intro, 1: Draw Base, 2: Highlight 1, 3: Highlight 2, 4: Result
  data: ProblemData | null;
}