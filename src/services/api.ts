import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// IP manzilini qurilma turiga qarab tanlash
let BASE_URL = "http://10.0.2.2:5000/api"; // Android emulyator uchun

if (Platform.OS === "ios") {
  BASE_URL = "http://localhost:5000/api"; // iOS simulyatori uchun
} else if (!__DEV__) {
  // Production muhitda
  BASE_URL = "https://your-production-api.com/api";
} else {
  // Development muhitda fizik qurilma uchun
  const LOCAL_IP = "192.168.1.13"; // Bizning local IP manzilimiz
  BASE_URL = `http://${LOCAL_IP}:5000/api`;
}

console.log("API using URL:", BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 sekund
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
  (error) => {
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
    console.log("API: Progress ma'lumotlarini olish so'rovi yuborilmoqda");
    const response = await api.get("/progress");
    console.log("API: Progress ma'lumotlari olindi:", response.data);
    return response;
  } catch (error) {
    console.error("API: Progress ma'lumotlarini olishda xatolik:", error);
    throw error;
  }
};

export const initializeLessonProgress = async (
  lessonId: string,
  words: string[]
) => {
  try {
    console.log("API: Dars progressini boshlash so'rovi yuborilmoqda");
    console.log("API: Dars ID:", lessonId);
    console.log("API: So'zlar:", words);

    const response = await api.post("/progress/initialize-lesson", {
      lessonId,
      words,
    });

    console.log("API: Dars progressi boshlandi:", response.data);
    return response;
  } catch (error) {
    console.error("API: Dars progressini boshlashda xatolik:", error);
    throw error;
  }
};

export const updateStageProgress = async (
  lessonId: string,
  stage: string,
  completedWord: string
) => {
  try {
    console.log("API: Bosqich progressini yangilash so'rovi yuborilmoqda");
    console.log("API: Dars ID:", lessonId);
    console.log("API: Bosqich:", stage);
    console.log("API: Tugatilgan so'z:", completedWord);

    const response = await api.patch("/progress/update-stage", {
      lessonId,
      stage,
      completedWord,
    });

    console.log("API: Bosqich progressi yangilandi:", response.data);
    return response;
  } catch (error) {
    console.error("API: Bosqich progressini yangilashda xatolik:", error);
    throw error;
  }
};
