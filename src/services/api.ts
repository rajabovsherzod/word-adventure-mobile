import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// API Base URL ni dinamik aniqlash
let BASE_URL = "";

// Mahalliy server port
const SERVER_PORT = "3000";

// Dinamik URL aniqlovchi funksiya
const getBaseUrl = async () => {
  try {
    // Avval saqlangan manzilni tekshirish
    const savedUrl = await AsyncStorage.getItem("API_BASE_URL");
    if (savedUrl) {
      console.log("API: Using saved custom URL:", savedUrl);
      return savedUrl;
    }

    // Android emulator
    if (Platform.OS === "android" && __DEV__) {
      // Android emulator o'zining maxsus IP manzili
      return `http://10.0.2.2:${SERVER_PORT}/api`;
    }

    // iOS simulator
    if (Platform.OS === "ios" && __DEV__) {
      return `http://localhost:${SERVER_PORT}/api`;
    }

    // Development muhitida fizik qurilma (Wi-Fi orqali)
    if (__DEV__) {
      // O'zingizning kompyuteringiz IP manzili
      const defaultDeviceUrl = `http://192.168.1.40:${SERVER_PORT}/api`;
      return defaultDeviceUrl;
    }

    // Production muhit
    return "https://word-adventure-api.com/api";
  } catch (error) {
    console.error("API: Error getting base URL:", error);
    // Xatolik yuz berganda default URL ga qaytish
    if (__DEV__) {
      return `http://192.168.1.40:${SERVER_PORT}/api`;
    }
    return "https://word-adventure-api.com/api";
  }
};

// Dastlabki URL o'rnatish
getBaseUrl().then((url) => {
  BASE_URL = url;
  console.log("API using URL:", BASE_URL);
  console.log("Platform:", Platform.OS, "DEV mode:", __DEV__);
});

// API konfiguratsiyasini yangilash funksiyasi
export const updateApiBaseUrl = async (newUrl: string) => {
  try {
    await AsyncStorage.setItem("API_BASE_URL", newUrl);
    BASE_URL = newUrl;
    console.log("API: Base URL updated to:", newUrl);
    return true;
  } catch (error) {
    console.error("API: Error updating base URL:", error);
    return false;
  }
};

// Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 sekund (oshirilgan timeout)
});

// URL ni har bir so'rovda dinamik yangilash
api.interceptors.request.use(
  async (config) => {
    try {
      // Har bir so'rovda eng so'nggi URL ni olish
      const currentBaseUrl = await getBaseUrl();
      config.baseURL = currentBaseUrl;

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
