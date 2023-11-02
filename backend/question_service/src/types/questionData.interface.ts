export interface QuestionData {
  title: string;
  category: string;
  difficulty: number;
  link: string;
  description: string;
  [key: string]: any; // This allows any key-value pair
}

export interface QuestionDataFromFrontend {
  title: string;
  category: string;
  difficulty: number;
  link: string;
  description: string;
  uuid?: string;
}
