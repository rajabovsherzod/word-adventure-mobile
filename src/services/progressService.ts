import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUserProgress,
  initializeLessonProgress,
  updateStageProgress,
} from "./api";

interface IStageProgress {
  completed: boolean;
  completedWords: string[];
  remainingWords: string[];
}

interface IMatchStageProgress {
  completed: boolean;
  progress: number;
}

interface ILessonProgress {
  userId: string;
  lessonId: string;
  completedPercentage?: number;
  stages: {
    memorize: IStageProgress;
    match: IMatchStageProgress;
    arrange: IStageProgress;
    write: IStageProgress;
  };
}

interface IProgress {
  lessons: ILessonProgress[];
}

const PROGRESS_STORAGE_KEY = "user_progress_cache";
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

class ProgressService {
  private progress: IProgress = { lessons: [] };
  private isProgressLoaded = false;
  private syncQueue: Array<() => Promise<void>> = [];
  private isSyncing = false;

  constructor() {
    this.loadCachedProgress();
    this.startSyncQueue();
  }

  private async loadCachedProgress() {
    try {
      const cachedProgress = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      if (cachedProgress) {
        this.progress = JSON.parse(cachedProgress);
        this.isProgressLoaded = true;
      }
    } catch (error) {
      console.error("Failed to load cached progress:", error);
    }
  }

  private async saveProgressToCache() {
    try {
      await AsyncStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(this.progress)
      );
    } catch (error) {
      console.error("Failed to save progress to cache:", error);
    }
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries = RETRY_ATTEMPTS
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return this.retryOperation(operation, retries - 1);
      }
      throw error;
    }
  }

  private async startSyncQueue() {
    while (true) {
      if (this.syncQueue.length > 0 && !this.isSyncing) {
        this.isSyncing = true;
        const operation = this.syncQueue.shift();
        if (operation) {
          try {
            await operation();
          } catch (error) {
            console.error("Sync operation failed:", error);
          }
        }
        this.isSyncing = false;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  private addToSyncQueue(operation: () => Promise<void>) {
    this.syncQueue.push(operation);
  }

  async getUserProgress() {
    try {
      console.log("progressService: Getting user progress");
      const response = await getUserProgress();

      // Log the raw data for debugging
      console.log(
        "progressService: RAW API RESPONSE:",
        JSON.stringify(response.data)
      );

      // Backenddan qaytgan javob Array ko'rinishida yoki object ichida data field bo'lishi mumkin
      if (response.data) {
        if (Array.isArray(response.data)) {
          // Agar to'g'ridan-to'g'ri array qaytsa
          console.log("progressService: Progress data is direct array");
          return response.data;
        } else if (response.data.success && Array.isArray(response.data.data)) {
          // Agar success va data field bo'lsa
          console.log("progressService: Progress data is in data field");
          return response.data.data;
        } else {
          console.error(
            "progressService: Unexpected response format",
            response.data
          );
          return [];
        }
      } else {
        console.error("progressService: No data in response");
        return [];
      }
    } catch (error) {
      console.error("progressService: Error getting user progress", error);
      if (error instanceof Error) {
        console.error("progressService: Error message:", error.message);
      }
      // Return empty array to prevent UI errors
      return [];
    }
  }

  async initializeProgress(lessonId: string, words: string[]) {
    try {
      console.log(
        "progressService: Initializing progress for lesson:",
        lessonId
      );
      console.log("progressService: With words:", words);

      // initializeLessonProgress metodini chaqirish
      const response = await this.initializeLessonProgress(lessonId, words);
      console.log(
        "progressService: Lesson progress initialized successfully",
        response
      );
      return response;
    } catch (error) {
      console.error("progressService: Error initializing progress:", error);
      return null; // Xato yuz berganda null qaytarish
    }
  }

  async updateProgress(
    lessonId: string,
    stage: string,
    word: string,
    isCorrect: boolean,
    words: string[]
  ) {
    try {
      console.log("progressService: Updating progress for lesson:", lessonId);
      console.log("progressService: Stage:", stage);
      console.log("progressService: Word:", word);
      console.log("progressService: Is correct:", isCorrect);

      // Make API call to update progress
      const response = await updateStageProgress(
        lessonId,
        stage,
        word,
        isCorrect,
        words
      );
      console.log("progressService: Progress updated successfully", response);
      return response;
    } catch (error) {
      console.error("progressService: Error updating progress:", error);
      throw error;
    }
  }

  async initializeLessonProgress(
    lessonId: string,
    words: string[]
  ): Promise<IProgress> {
    try {
      await this.getUserProgress();

      const existingLesson = this.progress.lessons.find(
        (l) => String(l.lessonId) === String(lessonId)
      );

      if (existingLesson) {
        return this.progress;
      }

      try {
        // Call API to initialize lesson progress
        const response = await initializeLessonProgress(lessonId, words);

        // Process the response based on its format
        if (Array.isArray(response)) {
          this.progress.lessons = response;
          await this.saveProgressToCache();
        } else if (response && Array.isArray(response.lessons)) {
          this.progress.lessons = response.lessons;
          await this.saveProgressToCache();
        } else {
          console.log(
            "Unexpected response format from initializeLessonProgress:",
            response
          );

          // Fallback: Create local progress data
          this.createLocalLessonProgress(lessonId, words);
        }
      } catch (apiError) {
        console.error("API initialization error:", apiError);
        // Create local progress data on API error
        this.createLocalLessonProgress(lessonId, words);
      }

      return this.progress;
    } catch (error) {
      console.error("Error in initializeLessonProgress:", error);

      // Create local progress on any error
      this.createLocalLessonProgress(lessonId, words);
      return this.progress;
    }
  }

  // Helper to create local lesson progress
  private createLocalLessonProgress(lessonId: string, words: string[]) {
    const existingLesson = this.progress.lessons.find(
      (l) => String(l.lessonId) === String(lessonId)
    );

    if (!existingLesson) {
      const newLessonProgress: ILessonProgress = {
        userId: "local",
        lessonId,
        completedPercentage: 0,
        stages: {
          memorize: {
            completed: false,
            completedWords: [],
            remainingWords: [...words],
          },
          match: {
            completed: false,
            progress: 0,
          },
          arrange: {
            completed: false,
            completedWords: [],
            remainingWords: [...words],
          },
          write: {
            completed: false,
            completedWords: [],
            remainingWords: [...words],
          },
        },
      };

      this.progress.lessons.push(newLessonProgress);
      this.saveProgressToCache();
    }
  }

  async updateStageProgress(
    lessonId: string,
    stage: string,
    word: string,
    isCorrect: boolean,
    words: string[]
  ): Promise<IProgress> {
    try {
      await this.getUserProgress();

      let lessonProgress = this.progress.lessons.find(
        (l) => String(l.lessonId) === String(lessonId)
      );

      if (!lessonProgress) {
        await this.initializeLessonProgress(lessonId, words);
        lessonProgress = this.progress.lessons.find(
          (l) => String(l.lessonId) === String(lessonId)
        );
      }

      if (lessonProgress) {
        // Update local progress immediately
        this.updateLocalProgress(lessonProgress, stage, word, isCorrect);
        await this.saveProgressToCache();

        // Call API to update progress
        try {
          const response = await updateStageProgress(
            lessonId,
            stage,
            word,
            isCorrect,
            words
          );

          // API response could be an array or object with 'lessons' field
          if (Array.isArray(response)) {
            this.progress.lessons = response;
            await this.saveProgressToCache();
          } else if (response && Array.isArray(response.lessons)) {
            this.progress.lessons = response.lessons;
            await this.saveProgressToCache();
          } else {
            console.log(
              "Unexpected API response format for updateStageProgress:",
              response
            );
          }
        } catch (apiError) {
          console.error("API update error, using local data:", apiError);
          // Error during API call still falls back to local data
        }
      }

      return this.progress;
    } catch (error) {
      console.error("Progress Service: updateStageProgress error:", error);
      return this.progress; // Return existing progress on error
    }
  }

  private updateLocalProgress(
    lessonProgress: ILessonProgress,
    stage: string,
    word: string,
    isCorrect: boolean
  ) {
    if (!isCorrect) return;

    if (stage === "match") {
      const matchStage = lessonProgress.stages.match;
      matchStage.progress = 100;
      matchStage.completed = true;
    } else {
      const stageData = lessonProgress.stages[stage] as IStageProgress;
      if (!stageData.completedWords) stageData.completedWords = [];
      if (!stageData.remainingWords) stageData.remainingWords = [];

      if (!stageData.completedWords.includes(word)) {
        stageData.completedWords.push(word);
      }

      stageData.remainingWords = stageData.remainingWords.filter(
        (w) => w !== word
      );
      stageData.completed = stageData.remainingWords.length === 0;
    }
  }

  getLessonProgress(lessonId: string): ILessonProgress | undefined {
    return this.progress.lessons.find(
      (l) => String(l.lessonId) === String(lessonId)
    );
  }
}

export default new ProgressService();
