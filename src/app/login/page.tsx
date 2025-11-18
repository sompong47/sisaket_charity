'use client';

import './login.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api'; // ✅ 1. เรียกใช้ตัวกลาง API

export default function LoginPage() {
  const router = useRouter();
  
  // ✅ 2. สร้างตัวแปรเก็บข้อมูล
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // เอาไว้เช็คว่ากำลังโหลดอยู่ไหม

  // State ของ UI เดิม
  const [showPassword, setShowPassword] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = document.querySelector('.animated-bg');
    if (!container) return;
    for (let i = 0; i < 55; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = Math.random() * 100 + 'vh';
      p.style.animationDelay = Math.random() * 12 + 's';
      container.appendChild(p);
    }
  }, []);

  // ✅ 3. ฟังก์ชันล็อกอิน
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช
    setLoading(true);

    try {
      // ยิง API ไปที่ Backend
      // (หมายเหตุ: เช็ค Backend ดีๆ ว่ารับ 'phone' หรือ 'email')
      const { data } = await api.post('/api/users/login', {
        phone: phone, 
        password: password
      });

      // ถ้าสำเร็จ: บันทึก Token ลงเครื่อง
      localStorage.setItem('token', data.token);
      // บันทึกข้อมูล user เก็บไว้โชว์ (ถ้ามีส่งกลับมา)
      if(data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      alert('เข้าสู่ระบบสำเร็จ! 🎉');
      router.push('/'); // เด้งไปหน้าแรก

    } catch (error: any) {
      console.error('Login Error:', error);
      const message = error.response?.data?.message || 'เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง';
      alert(`❌ เกิดข้อผิดพลาด: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Animated Background */}
      <div className="animated-bg"></div>

      {/* TOP NAVIGATION */}
      <nav className={`top-navigation ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon"></div>
            <span className="logo-text">เสื้อเฉลิมฉลองเมือง 243 ปี</span>
          </div>
          
          {/* หน้า Login ปกติจะไม่โชว์เมนู User ขวาบน แต่ถ้าจะคงไว้ก็ตามดีไซน์เดิมครับ */}
          <div className="nav-menu">
            {/* ... (ส่วน Menu Code เดิม) ... */}
          </div>
        </div>
      </nav>

      {/* LOGIN FORM */}
      <div className="login-container">
        <div className="login-card">
          <div className="logo-box">
            <img src="/site-logo.png" alt="logo" className="logo" />
          </div>

          <Link href="/" className="back-link">กลับไปหน้าหลัก</Link>

          <p className="register-text">
            ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
          </p>

          <h2 className="login-title">เข้าสู่ระบบ</h2>

          <button className="google-btn" type="button">
            <img src="/google-color.png" alt="Google" className="google-icon" />
            Continue with Google
          </button>

          {/* ✅ เปลี่ยน div เป็น form เพื่อให้กด Enter แล้วล็อกอินได้ */}
          <form className="form-section" onSubmit={handleLogin}>
            <label>เบอร์โทรศัพท์</label>
            <input 
              type="text" 
              placeholder="กรอกเบอร์โทรศัพท์" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label>รหัสผ่าน</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder=".........."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <button 
              className="login-btn" 
              type="submit" 
              disabled={loading} // ห้ามกดรัวๆ
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'กำลังโหลด...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}