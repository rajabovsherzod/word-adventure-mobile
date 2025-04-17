// Kurs tiplari va interfeyslari
export type CourseLevel =
  | "Beginner"
  | "Elementary"
  | "Pre-Intermediate"
  | "Intermediate"
  | "Upper-Intermediate"
  | "Advanced";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // daqiqalarda
  videoUrl?: string;
  completed: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  completed: boolean;
}

export interface GrammarCourse {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  price: number; // coinlarda
  imageUrl: string;
  duration: number; // soatlarda
  modules: CourseModule[];
  rating: number; // 5 ballik sistemada
  purchased: boolean;
  progress: number; // foizlarda
  authorName: string;
  authorAvatar?: string;
  tags: string[]; // Business, Travel, Academic va h.k.
}

// Kurslar ma'lumotlarini o'qish va saqlash uchun servis intereyslar
export interface ICourseService {
  getAllCourses(): Promise<GrammarCourse[]>;
  getCourseById(id: string): Promise<GrammarCourse | null>;
  purchaseCourse(id: string, coins: number): Promise<boolean>;
  updateCourseProgress(courseId: string, progress: number): Promise<boolean>;
  updateLessonStatus(
    courseId: string,
    moduleId: string,
    lessonId: string,
    completed: boolean
  ): Promise<boolean>;
}
