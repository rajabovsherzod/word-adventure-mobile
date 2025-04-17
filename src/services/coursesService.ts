import AsyncStorage from "@react-native-async-storage/async-storage";
import { GrammarCourse, ICourseService } from "../models/CourseTypes";
import GRAMMAR_COURSES from "../models/CourseData";

class CoursesService implements ICourseService {
  private courses: GrammarCourse[] = [];
  private readonly STORAGE_KEY = "@word_adventure:purchased_courses";
  private readonly PROGRESS_KEY = "@word_adventure:courses_progress";
  private userCoins: number = 0;

  constructor() {
    this.initializeFromStorage();
  }

  private async initializeFromStorage() {
    try {
      // Sotib olingan kurslarni yuklash
      const purchasedCoursesJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      const purchasedCourses: string[] = purchasedCoursesJson
        ? JSON.parse(purchasedCoursesJson)
        : [];

      // Kurslar progressini yuklash
      const progressJson = await AsyncStorage.getItem(this.PROGRESS_KEY);
      const progress: { [courseId: string]: number } = progressJson
        ? JSON.parse(progressJson)
        : {};

      // Sotib olingan kurslarni belgilash va progress qo'shish
      this.courses = GRAMMAR_COURSES.map((course) => ({
        ...course,
        purchased: purchasedCourses.includes(course.id),
        progress: progress[course.id] || 0,
      }));

      console.log("Courses loaded:", this.courses.length);
      console.log("Purchased courses:", purchasedCourses.length);
    } catch (error) {
      console.error("Error initializing courses:", error);
      this.courses = [...GRAMMAR_COURSES];
    }
  }

  // Barcha kurslarni olish
  async getAllCourses(): Promise<GrammarCourse[]> {
    // Har safar yangilangan kurslarni qaytarish
    await this.initializeFromStorage();
    return this.courses;
  }

  // Bitta kursni ID bo'yicha olish
  async getCourseById(id: string): Promise<GrammarCourse | null> {
    await this.initializeFromStorage();
    const course = this.courses.find((c) => c.id === id) || null;
    return course;
  }

  // Kursni sotib olish
  async purchaseCourse(id: string, userCoins: number): Promise<boolean> {
    try {
      // Foydalanuvchi tangalarini saqlash
      this.userCoins = userCoins;

      // Kursni topish
      const courseToUpdate = this.courses.find((c) => c.id === id);
      if (!courseToUpdate) {
        console.error(`Course with ID ${id} not found`);
        return false;
      }

      // Yetarli tanga borligini tekshirish
      if (userCoins < courseToUpdate.price) {
        console.error(`Not enough coins to purchase course ${id}`);
        return false;
      }

      // Sotib olingan kurslar ro'yxatini olish
      const purchasedCoursesJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      const purchasedCourses: string[] = purchasedCoursesJson
        ? JSON.parse(purchasedCoursesJson)
        : [];

      // Kurs allaqachon sotib olinganligini tekshirish
      if (purchasedCourses.includes(id)) {
        console.log(`Course ${id} is already purchased`);
        return true;
      }

      // Kursni sotib olinganlar ro'yxatiga qo'shish
      purchasedCourses.push(id);
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(purchasedCourses)
      );

      // Kursni yangilash
      this.courses = this.courses.map((c) =>
        c.id === id ? { ...c, purchased: true } : c
      );

      console.log(`Course ${id} purchased successfully`);
      return true;
    } catch (error) {
      console.error("Error purchasing course:", error);
      return false;
    }
  }

  // Kurs progressini yangilash
  async updateCourseProgress(
    courseId: string,
    progress: number
  ): Promise<boolean> {
    try {
      // Progress qiymatini tekshirish (0-100 oralig'ida)
      const validProgress = Math.max(0, Math.min(100, progress));

      // Kursni yangilash
      const courseToUpdate = this.courses.find((c) => c.id === courseId);
      if (!courseToUpdate) {
        console.error(`Course with ID ${courseId} not found`);
        return false;
      }

      // Progressni saqlash
      const progressJson = await AsyncStorage.getItem(this.PROGRESS_KEY);
      const progressData: { [courseId: string]: number } = progressJson
        ? JSON.parse(progressJson)
        : {};

      progressData[courseId] = validProgress;
      await AsyncStorage.setItem(
        this.PROGRESS_KEY,
        JSON.stringify(progressData)
      );

      // Kursni yangilash
      this.courses = this.courses.map((c) =>
        c.id === courseId ? { ...c, progress: validProgress } : c
      );

      console.log(`Course ${courseId} progress updated to ${validProgress}%`);
      return true;
    } catch (error) {
      console.error("Error updating course progress:", error);
      return false;
    }
  }

  // Darsni yakunlangan deb belgilash
  async updateLessonStatus(
    courseId: string,
    moduleId: string,
    lessonId: string,
    completed: boolean
  ): Promise<boolean> {
    try {
      // Lokal holatni yangilash
      const courseIndex = this.courses.findIndex((c) => c.id === courseId);
      if (courseIndex === -1) return false;

      const course = { ...this.courses[courseIndex] };
      const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
      if (moduleIndex === -1) return false;

      const module = { ...course.modules[moduleIndex] };
      const lessonIndex = module.lessons.findIndex((l) => l.id === lessonId);
      if (lessonIndex === -1) return false;

      // Darsni yakunlangan deb belgilash
      const updatedLessons = [...module.lessons];
      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        completed,
      };

      // Modulni yangilash
      const updatedModules = [...course.modules];
      const allLessonsCompleted = updatedLessons.every((l) => l.completed);

      updatedModules[moduleIndex] = {
        ...module,
        lessons: updatedLessons,
        completed: allLessonsCompleted,
      };

      // Kursni yangilash
      const updatedCourses = [...this.courses];
      updatedCourses[courseIndex] = {
        ...course,
        modules: updatedModules,
      };

      this.courses = updatedCourses;

      // Kurs umumiy progressini hisoblash va yangilash
      const totalLessons = course.modules.reduce(
        (total, m) => total + m.lessons.length,
        0
      );

      const completedLessons = course.modules.reduce(
        (total, m) => total + m.lessons.filter((l) => l.completed).length,
        0
      );

      const progress = Math.round((completedLessons / totalLessons) * 100);
      await this.updateCourseProgress(courseId, progress);

      return true;
    } catch (error) {
      console.error("Error updating lesson status:", error);
      return false;
    }
  }

  // Kurs mavjud bo'lgan daraja nomlari ro'yxatini olish
  async getAvailableLevels(): Promise<string[]> {
    const levels = Array.from(
      new Set(this.courses.map((course) => course.level))
    );
    return levels;
  }

  // Daraja bo'yicha kurslarni filtrlash
  async getCoursesByLevel(level: string): Promise<GrammarCourse[]> {
    return this.courses.filter((course) => course.level === level);
  }
}

export default new CoursesService();
