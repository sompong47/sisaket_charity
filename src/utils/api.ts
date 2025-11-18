import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// ✅ เพิ่มส่วนนี้: Interceptor (ตัวดักจับก่อนส่งข้อมูล)
api.interceptors.request.use(
  (config) => {
    // ไปดึง Token จาก localStorage มา
    const token = localStorage.getItem('token');
    if (token) {
      // ถ้ามี Token ให้แนบไปใน Header ชื่อ Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;