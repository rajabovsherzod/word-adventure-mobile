export type LessonWord = {
  id: string;
  english: string;
  uzbek: string;
  example: string;
  level: "beginner" | "medium" | "advanced";
};

export type LessonStage = {
  id: string;
  name: string;
  type: "memorize" | "test" | "write" | "practice";
  completed: boolean;
  score: number;
};

export type Lesson = {
  id: string;
  name: string;
  level: "beginner" | "medium" | "advanced";
  order: number;
  words: LessonWord[];
  stages: LessonStage[];
  completed: boolean;
  progress: number;
  coins: number;
};

export type LessonCard = {
  id: string;
  title: string;
  level: "beginner" | "medium" | "advanced";
  description: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lessons: Lesson[];
};
