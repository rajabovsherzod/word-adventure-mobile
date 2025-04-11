import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// IP manzilini qurilma turiga qarab tanlash
let BASE_URL = "http://10.0.2.2:3000/api"; // Android emulyator uchun default

if (Platform.OS === "ios") {
  BASE_URL = "http://localhost:3000/api"; // iOS simulyatori uchun
}

// MUHIM: Bu qatorni izohga olish kerak, chunki fizik qurilma manzili override qiladi
// BASE_URL = "http://172.20.10.5:3000/api"; // Fizik qurilma uchun

console.log("API using URL:", BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 sekund
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.message);
    if (error.code === "ECONNABORTED") {
      console.error("API Timeout Error");
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
