import {
  getUserProgress as apiGetUserProgress,
  initializeLessonProgress as apiInitializeLessonProgress,
  updateStageProgress as apiUpdateStageProgress,
} from "./api";

export interface IStageProgress {
  completed: boolean;
  completedWords: string[];
  remainingWords: string[];
}

export interface IMatchStageProgress {
  completed: boolean;
  progress: number;
}

export interface ILessonProgress {
  lessonId: string;
  stages: {
    memorize: IStageProgress;
    match: IMatchStageProgress;
    arrange: IStageProgress;
    write: IStageProgress;
  };
  totalProgress: number;
  isUnlocked: boolean;
}

export interface IProgress {
  _id: string;
  userId: string;
  lessons: ILessonProgress[];
}

class ProgressService {
  async getUserProgress(): Promise<IProgress> {
    try {
      const response = await apiGetUserProgress();
      return response.data.data;
    } catch (error) {
      console.error("Progress Service: getUserProgress error:", error);
      throw error;
    }
  }

  async initializeLessonProgress(
    lessonId: string,
    words: string[]
  ): Promise<IProgress> {
    try {
      const response = await apiInitializeLessonProgress(lessonId, words);
      return response.data.data;
    } catch (error) {
      console.error("Progress Service: initializeLessonProgress error:", error);
      throw error;
    }
  }

  async updateStageProgress(
    lessonId: string,
    stage: string,
    completedWord: string
  ): Promise<IProgress> {
    try {
      const response = await apiUpdateStageProgress(
        lessonId,
        stage,
        completedWord
      );
      return response.data.data;
    } catch (error) {
      console.error("Progress Service: updateStageProgress error:", error);
      throw error;
    }
  }
}

export default new ProgressService();
