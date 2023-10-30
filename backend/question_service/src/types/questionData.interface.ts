export interface QuestionData {
  title: string;
  category: string;
  complexity: number;
  link: string;
  description: string;
  [key: string]: any; // This allows any key-value pair
}