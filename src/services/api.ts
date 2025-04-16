import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Base URL for API
let BASE_URL = "";

// IP manzili - kompyuteringizning haqiqiy IP manzili
const SERVER_IP = "172.20.10.2";

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
        console.log("API Request with Token");
      } else {
        console.log("API Request without Token");
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
    console.log("API: Login javobi:", JSON.stringify(response.data));

    const { token, user } = response.data;

    if (token && user) {
      console.log("API: Token va foydalanuvchi ma'lumotlari saqlanmoqda");
      // Avval AsyncStorage tozalash
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      // isAdmin qiymatini ANIQ boolean ga o'girish
      const isAdminValue = user.isAdmin === true;
      console.log("API: isAdmin qiymati:", isAdminValue, typeof isAdminValue);

      // User obyektini yangilash
      const updatedUser = {
        ...user,
        isAdmin: isAdminValue,
      };

      // Yangi ma'lumotlarni saqlash
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      // To'liq javob strukturasini log qilish
      console.log(
        "API: User is admin:",
        updatedUser.isAdmin,
        typeof updatedUser.isAdmin
      );

      return {
        token,
        user: updatedUser,
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
  console.log("API: Logging out...");
  try {
    // Token va foydalanuvchi ma'lumotlarini o'chirish
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    // Qo'shimcha keshlarni tozalash
    await AsyncStorage.getAllKeys().then((keys) => {
      // Progress va progress-related keys o'chirish
      const keysToRemove = keys.filter(
        (key) =>
          key.startsWith("progress_") ||
          key.startsWith("learned_words_") ||
          key.startsWith("lesson_")
      );
      if (keysToRemove.length > 0) {
        console.log("API: Clearing cached data:", keysToRemove);
        AsyncStorage.multiRemove(keysToRemove);
      }
    });

    console.log("API: Successfully logged out");
  } catch (error) {
    console.error("API: Error during logout:", error);
  }
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const checkAuth = async () => {
  try {
    console.log("API: Checking authentication...");
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("API: No token found");
      return null;
    }

    console.log("API: Token found, checking validity");
    const response = await api.get("/auth/me");
    console.log("API: Auth check response:", response.status);

    const userData = response.data.user;
    console.log(
      "API: User data:",
      userData ? JSON.stringify(userData) : "No user data"
    );

    if (!userData) {
      console.log("API: User data missing in response");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      return null;
    }

    // isAdmin qiymatini boolean qiymatga majburiy o'girish
    if (userData.isAdmin !== undefined) {
      userData.isAdmin = userData.isAdmin === true;
    }

    // Store updated user data
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    console.log(
      "API: User is admin:",
      userData.isAdmin,
      typeof userData.isAdmin
    );

    return {
      user: {
        ...userData,
        isAdmin: userData.isAdmin === true,
      },
      token,
    };
  } catch (error) {
    console.error("API: CheckAuth error:", error);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    return null;
  }
};

// Admin endpoints
export const getAllUsers = async () => {
  try {
    console.log("API: Getting all users");
    const response = await api.get("/users");
    console.log("API: Get all users response:", response.data);

    if (response.data) {
      return response.data;
    } else {
      console.error("API: Empty response from server for getAllUsers");
      return [];
    }
  } catch (error) {
    console.error("API: Error getting all users:", error);
    if (error instanceof Error) {
      console.error("API: Error message:", error.message);
    }
    throw error;
  }
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

    // Javob bo'sh bo'lmasin
    if (!response.data) {
      console.error("API: Empty response from server");
      throw new Error("Empty response from server");
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

    console.log("API: Lesson progress initialized successfully");

    // Response.data.data.lessons bo'lmasa ham xatolik qaytarmaslik
    if (response.data && response.data.success) {
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (
        response.data.data &&
        Array.isArray(response.data.data.lessons)
      ) {
        return response.data.data.lessons;
      } else {
        console.log("API: Unexpected success response format:", response.data);
        return [];
      }
    } else {
      console.error(
        "API: Server error or unsuccessful response:",
        response.data
      );
      return [];
    }
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
  completedWord: string,
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

    if (!completedWord) {
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
      completedWord,
      isCorrect,
      words,
    });

    const response = await api.patch(`/progress/update-stage`, {
      lessonId,
      stage,
      completedWord,
      isCorrect,
      words,
    });

    console.log("API: Stage progress updated:", response.data);

    // Response.data.data.lessons bo'lmasa ham xatolik qaytarmaslik
    if (response.data && response.data.success) {
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (
        response.data.data &&
        Array.isArray(response.data.data.lessons)
      ) {
        return response.data.data.lessons;
      } else {
        console.log("API: Unexpected success response format:", response.data);
        return [];
      }
    } else {
      console.error(
        "API: Server error or unsuccessful response:",
        response.data
      );
      return [];
    }
  } catch (error) {
    console.error("API: Error updating stage progress:", error);
    if (error instanceof Error) {
      console.error("API: Error message:", error.message);
    }
    throw error;
  }
};
