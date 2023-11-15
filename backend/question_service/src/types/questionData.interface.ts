export interface QuestionData {
  title: string;
  categories: QuestionCategory[];
  difficulty: 1 | 2 | 3;
  link: string;
  description: string;
  [key: string]: any; // This allows any key-value pair
}

export const questionCategories = [
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
  'Mathematics',
  'Computational Geometry',
  'Binary',
  'Data Stream',
  'Sliding Window',
] as const;

export type QuestionCategory = (typeof questionCategories)[number];
export interface QuestionDataFromFrontend {
  title: string;
  categories: QuestionCategory[];
  difficulty: 1 | 2 | 3;
  link: string;
  description: string;
  uuid?: string;
}
