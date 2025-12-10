
import { ProblemType, ProblemData } from '../types';
import { generateBetween } from '../features/Between';
import { generateQueueFB } from '../features/QueueFB';
import { generateQueueRank } from '../features/QueueRank';
import { generateQueueMixed } from '../features/QueueMixed';
import { generateBook } from '../features/Book';
import { generateHoliday } from '../features/Holiday';
import { generateDelay } from '../features/Delay';

export const generateProblem = (type: ProblemType): ProblemData => {
  switch (type) {
    case ProblemType.BETWEEN: return generateBetween();
    case ProblemType.QUEUE_FB: return generateQueueFB();
    case ProblemType.QUEUE_RANK: return generateQueueRank();
    case ProblemType.QUEUE_MIXED: return generateQueueMixed();
    case ProblemType.BOOK: return generateBook();
    case ProblemType.HOLIDAY: return generateHoliday();
    case ProblemType.DELAY: return generateDelay();
    default:
        throw new Error("Unknown problem type");
  }
};
