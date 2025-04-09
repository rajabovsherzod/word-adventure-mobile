import { LessonCard, Lesson, LessonStage, LessonWord } from "../types/lesson";

const createStages = (): LessonStage[] => {
  return [
    {
      id: "1",
      name: "O'zlashtirish",
      type: "memorize",
      completed: false,
      score: 0,
    },
    {
      id: "2",
      name: "Test",
      type: "test",
      completed: false,
      score: 0,
    },
    {
      id: "3",
      name: "Yozish",
      type: "write",
      completed: false,
      score: 0,
    },
    {
      id: "4",
      name: "Amaliyot",
      type: "practice",
      completed: false,
      score: 0,
    },
  ];
};

// Beginner level words
const beginnerWords: LessonWord[] = [
  // Lesson 1 - Basic Greetings
  {
    id: "b1",
    english: "hello",
    uzbek: "salom",
    example: "Hello, how are you?",
    level: "beginner",
  },
  {
    id: "b2",
    english: "goodbye",
    uzbek: "xayr",
    example: "Goodbye, see you tomorrow!",
    level: "beginner",
  },
  {
    id: "b3",
    english: "please",
    uzbek: "iltimos",
    example: "Please help me.",
    level: "beginner",
  },
  {
    id: "b4",
    english: "thank you",
    uzbek: "rahmat",
    example: "Thank you for your help.",
    level: "beginner",
  },
  {
    id: "b5",
    english: "welcome",
    uzbek: "xush kelibsiz",
    example: "Welcome to our home.",
    level: "beginner",
  },
  {
    id: "b6",
    english: "morning",
    uzbek: "tong",
    example: "Good morning!",
    level: "beginner",
  },
  {
    id: "b7",
    english: "evening",
    uzbek: "kech",
    example: "Good evening!",
    level: "beginner",
  },
  {
    id: "b8",
    english: "night",
    uzbek: "tun",
    example: "Good night!",
    level: "beginner",
  },
  {
    id: "b9",
    english: "yes",
    uzbek: "ha",
    example: "Yes, I understand.",
    level: "beginner",
  },
  {
    id: "b10",
    english: "no",
    uzbek: "yo'q",
    example: "No, thank you.",
    level: "beginner",
  },
  // Add more words for other lessons...
];

// Medium level words
const mediumWords: LessonWord[] = [
  // Lesson 1 - Daily Activities
  {
    id: "m1",
    english: "work",
    uzbek: "ishlash",
    example: "I work at a company.",
    level: "medium",
  },
  {
    id: "m2",
    english: "study",
    uzbek: "o'qish",
    example: "I study English every day.",
    level: "medium",
  },
  {
    id: "m3",
    english: "eat",
    uzbek: "yemoq",
    example: "I eat breakfast at 8 AM.",
    level: "medium",
  },
  {
    id: "m4",
    english: "sleep",
    uzbek: "uxlamoq",
    example: "I sleep early at night.",
    level: "medium",
  },
  {
    id: "m5",
    english: "walk",
    uzbek: "yurmoq",
    example: "I walk to school.",
    level: "medium",
  },
  {
    id: "m6",
    english: "read",
    uzbek: "o'qimoq",
    example: "I read books every evening.",
    level: "medium",
  },
  {
    id: "m7",
    english: "write",
    uzbek: "yozmoq",
    example: "I write in my journal.",
    level: "medium",
  },
  {
    id: "m8",
    english: "listen",
    uzbek: "tinglamoq",
    example: "I listen to music.",
    level: "medium",
  },
  {
    id: "m9",
    english: "speak",
    uzbek: "gapirmoq",
    example: "I speak three languages.",
    level: "medium",
  },
  {
    id: "m10",
    english: "watch",
    uzbek: "tomosha qilmoq",
    example: "I watch TV in the evening.",
    level: "medium",
  },
  // Add more words for other lessons...
];

// Advanced level words
const advancedWords: LessonWord[] = [
  // Lesson 1 - Business & Professional
  {
    id: "a1",
    english: "negotiate",
    uzbek: "muzokaralar olib bormoq",
    example: "We need to negotiate the terms.",
    level: "advanced",
  },
  {
    id: "a2",
    english: "implement",
    uzbek: "amalga oshirmoq",
    example: "We will implement the new system.",
    level: "advanced",
  },
  {
    id: "a3",
    english: "analyze",
    uzbek: "tahlil qilmoq",
    example: "Please analyze the data.",
    level: "advanced",
  },
  {
    id: "a4",
    english: "collaborate",
    uzbek: "hamkorlik qilmoq",
    example: "We collaborate with other teams.",
    level: "advanced",
  },
  {
    id: "a5",
    english: "delegate",
    uzbek: "topshirmoq",
    example: "I delegate tasks to my team.",
    level: "advanced",
  },
  {
    id: "a6",
    english: "facilitate",
    uzbek: "yengillashtirmoq",
    example: "She facilitates team meetings.",
    level: "advanced",
  },
  {
    id: "a7",
    english: "innovate",
    uzbek: "yangilik kiritmoq",
    example: "We need to innovate our processes.",
    level: "advanced",
  },
  {
    id: "a8",
    english: "optimize",
    uzbek: "optimallashtimoq",
    example: "Let's optimize our workflow.",
    level: "advanced",
  },
  {
    id: "a9",
    english: "prioritize",
    uzbek: "ustuvor qilmoq",
    example: "We must prioritize our tasks.",
    level: "advanced",
  },
  {
    id: "a10",
    english: "strategize",
    uzbek: "strategiya ishlab chiqmoq",
    example: "Let's strategize our approach.",
    level: "advanced",
  },
  // Add more words for other lessons...
];

const createLessons = (
  level: "beginner" | "medium" | "advanced",
  words: LessonWord[]
): Lesson[] => {
  const lessons: Lesson[] = [];

  for (let i = 0; i < 5; i++) {
    const lessonWords = words.slice(i * 10, (i + 1) * 10);
    lessons.push({
      id: `${level}-${i + 1}`,
      name: `${i + 1}-Dars`,
      level: level,
      order: i + 1,
      words: lessonWords,
      stages: createStages(),
      completed: false,
      progress: 0,
      coins: 5,
    });
  }

  return lessons;
};

export const lessonCards: LessonCard[] = [
  {
    id: "beginner",
    title: "Boshlang'ich",
    level: "beginner",
    description: "Ingliz tilini o'rganishni boshlash uchun asosiy so'zlar",
    totalLessons: 5,
    completedLessons: 0,
    progress: 0,
    lessons: createLessons("beginner", beginnerWords),
  },
  {
    id: "medium",
    title: "O'rta",
    level: "medium",
    description: "Kundalik hayotda ishlatiladigan so'zlar va iboralar",
    totalLessons: 5,
    completedLessons: 0,
    progress: 0,
    lessons: createLessons("medium", mediumWords),
  },
  {
    id: "advanced",
    title: "Yuqori",
    level: "advanced",
    description: "Professional va biznes sohasidagi murakkab atamalar",
    totalLessons: 5,
    completedLessons: 0,
    progress: 0,
    lessons: createLessons("advanced", advancedWords),
  },
];
