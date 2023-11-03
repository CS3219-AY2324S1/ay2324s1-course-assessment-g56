export interface Question {
  title: string;
  description: string;
  categories: QuestionCategory[];
  difficulty: QuestionDifficulty;
  link: string;
}

export enum QuestionDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

type QuestionDifficultyNumber = 1 | 2 | 3;

const questionCategories = [
  'Two Pointers',
  'Same Direction Two Pointers',
  'Opposite Direction Two Pointers',
  'Binary Search',
  'Binary Search on Answer',
  'Divide and Conquer',
  'Breadth First Search/BFS',
  'Topological Sort',
  'Depth First Search/DFS',
  'Dynamic Programming/DP',
  'Backpack DP',
  'Coordinate DP',
  'Partition DP',
  'Memoization Search',
  'Interval DP',
  'State Compression DP',
  'Game DP',
  'Two Sequences DP',
  'Tree DP',
  'Sort',
  'External Sort',
  'Quick Select',
  'Euler Path',
  'Simulation',
  'Sweep Line',
  'Enumerate',
  'Shortest Path',
  'Greedy',
  'Minimum Spanning Tree/MST',
  'Array',
  'Prefix Sum Array',
  'String',
  'Linked List',
  'Doubly Linked List',
  'Queue',
  'Monotonic Queue',
  'Deque',
  'Stack',
  'Monotonic Stack',
  'Binary Tree',
  'Tree',
  'Binary Search Tree',
  'Iterator',
  'Heap',
  'Graph',
  'Bipartite Graph',
  'Hash Table',
  'Trie',
  'Union Find',
  'Binary Indexed Tree/BIT/Fenwick Tree',
  'Segment Tree',
  'Balanced Binary Tree',
  'Game Theory',
  'Mathmatics',
  'Computational Geometry',
  'Binary',
  'Data Stream',
  'Sliding Window',
] as const;

export type QuestionCategory = (typeof questionCategories)[number];

export const QuestionDifficultyToNumberMap: Record<
  QuestionDifficulty,
  QuestionDifficultyNumber
> = Object.freeze({
  [QuestionDifficulty.EASY]: 1,
  [QuestionDifficulty.MEDIUM]: 2,
  [QuestionDifficulty.HARD]: 3,
});

export const NumberToQuestionDifficultyMap: Record<
  QuestionDifficultyNumber,
  QuestionDifficulty
> = Object.freeze({
  1: QuestionDifficulty.EASY,
  2: QuestionDifficulty.MEDIUM,
  3: QuestionDifficulty.HARD,
});

type QuestionDifficultyColour = 'green' | 'orange' | 'red';

export const QuestionDifficultyToColourMap: Record<
  QuestionDifficulty,
  QuestionDifficultyColour
> = Object.freeze({
  [QuestionDifficulty.EASY]: 'green',
  [QuestionDifficulty.MEDIUM]: 'orange',
  [QuestionDifficulty.HARD]: 'red',
});

export interface QuestionRowData {
  uuid: string;
  slug: string;
  title: string;
  description: string;
  categories: QuestionCategory[];
  difficulty: QuestionDifficulty;
  link: string;
}
