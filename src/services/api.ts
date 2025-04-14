import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Base URL for API
let BASE_URL = "";

// IP manzili - kompyuteringizning haqiqiy IP manzili
const SERVER_IP = "172.20.10.5";

// Set axios defaults
if (Platform.OS === "android") {
  if (__DEV__) {
    // Fizik qurilma uchun
    BASE_URL = `http://${SERVER_IP}:3000/api`;
  } else {
    // Production muhitda
    BASE_URL = "https://word-adventure-api.com/api";
  }
} else if (Platform.OS === "ios") {
  if (__DEV__) {
    // iOS simulyator uchun
    BASE_URL = "http://localhost:3000/api";
  } else {
    // Production muhitda
    BASE_URL = "https://word-adventure-api.com/api";
  }
} else {
  // Qolgan qurilmalar uchun
  BASE_URL = `http://${SERVER_IP}:3000/api`;
}

console.log("API using URL:", BASE_URL);
console.log("Platform:", Platform.OS, "DEV mode:", __DEV__);
console.log("Using server IP:", SERVER_IP);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 sekund (oshirilgan timeout)
});

// Request interceptor - so'rovlarni kuzatish
api.interceptors.request.use(
  async (config) => {
    try {
      console.log("API Request:", config.method?.toUpperCase(), config.url);
      console.log("API Request URL:", config.baseURL + config.url);
      console.log("API Request Body:", config.data);

      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("API Request Token:", token);
      }
      return config;
    } catch (error) {
      console.error("API Request Interceptor Error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - javoblarni kuzatish
api.interceptors.response.use(
  (response) => {
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", response.data);
    return response;
  },
  async (error) => {
    if (error.response) {
      // Server qaytargan xatolik
      console.error("API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // So'rov yuborildi, lekin javob kelmadi
      console.error("API No Response:", error.request);
      console.error("API Error - Network Issue. Check server connection.");

      // Timeout bo'lgan bo'lsa
      if (error.code === "ECONNABORTED") {
        console.error("API Request Timeout - Server not responding");
      }
    } else {
      // So'rov yuborishda xatolik
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    console.log("API: Ro'yxatdan o'tish so'rovi yuborilmoqda");
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    console.log("API: Ro'yxatdan o'tish javobi:", response.data);

    const { token, user } = response.data;

    if (token && user) {
      console.log("API: Token va foydalanuvchi ma'lumotlari saqlanmoqda");
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return {
        token,
        user,
      };
    } else {
      console.error("API: Token yoki foydalanuvchi ma'lumotlari topilmadi");
      throw new Error("Token yoki foydalanuvchi ma'lumotlari topilmadi");
    }
  } catch (error: any) {
    console.error("API: Ro'yxatdan o'tishda xatolik:", error);
    console.error("API: Xatolik tafsilotlari:", error.response?.data);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    console.log("API: Login so'rovi yuborilmoqda");
    console.log("API: Email:", email);

    const response = await api.post("/auth/login", { email, password });
    console.log("API: Login javobi:", response.data);

    const { token, user } = response.data;

    if (token && user) {
      console.log("API: Token va foydalanuvchi ma'lumotlari saqlanmoqda");
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return {
        token,
        user,
      };
    } else {
      console.error("API: Token yoki foydalanuvchi ma'lumotlari topilmadi");
      throw new Error("Token yoki foydalanuvchi ma'lumotlari topilmadi");
    }
  } catch (error: any) {
    console.error("API: Login xatosi:", error);
    console.error("API: Xatolik tafsilotlari:", error.response?.data);
    throw error;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const checkAuth = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    const response = await api.get("/auth/me");
    const user = response.data;

    // Store updated user data
    await AsyncStorage.setItem("user", JSON.stringify(user));

    return {
      user,
      token,
    };
  } catch (error) {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    return null;
  }
};

// Admin endpoints
export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Progress endpoints
export const getUserProgress = async () => {
  try {
    console.log("API: Getting user progress");
    const response = await api.get(`/progress`);
    console.log("API: Got user progress:", response.data);

    // Check if response has proper format
    if (!response.data || !response.data.data) {
      console.error("API: Invalid response format:", response.data);
      throw new Error("Invalid response format for user progress");
    }

    return response.data;
  } catch (error) {
    console.error("API: Error getting user progress:", error);
    if (error instanceof Error) {
      console.error("API: Error message:", error.message);
    }
    throw error;
  }
};

export const initializeLessonProgress = async (
  lessonId: string,
  words: string[]
) => {
  try {
    if (!lessonId) {
      console.error("API: Error - Lesson ID is required");
      throw new Error("Lesson ID is required");
    }

    if (!Array.isArray(words) || words.length === 0) {
      console.error("API: Error - Words array is required and cannot be empty");
      throw new Error("Words array is required and cannot be empty");
    }

    console.log("API: Initializing lesson progress with details:", {
      lessonId,
      words,
      wordCount: words.length,
    });

    // Get token for logs
    const token = await AsyncStorage.getItem("token");
    console.log(
      "API: Using token for initialization (first 10 chars):",
      token ? token.substring(0, 10) + "..." : "No token"
    );

    const response = await api.post("/progress/initialize-lesson", {
      lessonId: lessonId.toString(),
      words,
    });

    if (!response.data || !response.data.success) {
      console.error(
        "API: Server responded but success flag is false:",
        response.data
      );
      throw new Error("Server failed to initialize lesson progress");
    }

    console.log("API: Lesson progress initialized successfully");
    return response.data.data.lessons;
  } catch (error) {
    console.error("API: Error initializing lesson progress:", error);
    if (error instanceof Error) {
      console.error("API: Error message:", error.message);
    }
    if (axios.isAxiosError(error) && error.response) {
      console.error("API: Server error details:", error.response.data);
    }
    throw error;
  }
};

export const updateStageProgress = async (
  lessonId: string,
  stage: string,
  word: string,
  isCorrect: boolean,
  words: string[]
) => {
  try {
    if (!lessonId) {
      throw new Error("Lesson ID is required");
    }

    if (!stage) {
      throw new Error("Stage is required");
    }

    if (!word) {
      throw new Error("Word is required");
    }

    if (typeof isCorrect !== "boolean") {
      throw new Error("isCorrect must be a boolean");
    }

    if (!Array.isArray(words) || words.length === 0) {
      throw new Error("Words array is required and cannot be empty");
    }

    console.log("API: Updating stage progress with full details:", {
      lessonId,
      stage,
      word,
      isCorrect,
      words,
    });

    const response = await api.patch(`/progress/update-stage`, {
      lessonId,
      stage,
      completedWord: word,
      isCorrect,
      words,
    });

    console.log("API: Stage progress updated:", response.data);
    return response.data.data.lessons;
  } catch (error) {
    console.error("API: Error updating stage progress:", error);
    if (error instanceof Error) {
      console.error("API: Error message:", error.message);
    }
    throw error;
  }
};
