'use client';

import styles from './page.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api'; // ✅ เรียกใช้ API

export default function RegisterPage() {
  const router = useRouter();
  
  // ✅ สร้างตัวแปรเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // State ของ UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ฟังก์ชันอัปเดตข้อมูลเวลาพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ ฟังก์ชันกดยืนยันการลงทะเบียน
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // ห้ามรีเฟรชหน้า

    // เช็คว่ารหัสผ่านตรงกันไหม
    if (formData.password !== formData.confirmPassword) {
      return alert('❌ รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
    }

    setLoading(true);
    try {
      // ส่งข้อมูลไป Backend
      await api.post('/api/users/register', {
        name: formData.fullName,
        phone: formData.phone,
        password: formData.password
      });

      // ✅ สำคัญ: สมัครเสร็จปุ๊บ เด้งไปหน้า Login ทันที (ไม่มี Alert แจ้งเตือนแล้ว)
      router.push('/login');

    } catch (error: any) {
      console.error('Register Error:', error);
      const msg = error.response?.data?.message || 'ลงทะเบียนไม่สำเร็จ';
      alert(`❌ เกิดข้อผิดพลาด: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Effect Scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect Particles
  useEffect(() => {
    const container = document.querySelector(`.${styles.animatedBg}`);
    if (!container) return;
    // ล้าง particle เก่าก่อนสร้างใหม่ (กันมันเยอะเกินถ้า re-render)
    container.innerHTML = ''; 
    for (let i = 0; i < 55; i++) {
      const p = document.createElement('div');
      p.className = styles.particle;
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = Math.random() * 100 + 'vh';
      p.style.animationDelay = Math.random() * 12 + 's';
      container.appendChild(p);
    }
  }, []);

  return (
    <div className={styles.registerPageWrapper}>
      <div className={styles.animatedBg}></div>

      <nav className={`${styles.topNavigation} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.navLogo}>
            <div className={styles.logoIcon}></div>
            <span className={styles.logoText}>เสื้อเฉลิมฉลองเมือง 243 ปี</span>
          </div>
           {/* ส่วน Menu ถ้ามีก็ใส่ตรงนี้ */}
        </div>
      </nav>

      {/* REGISTER FORM */}
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.logoBox}>
            {/* เช็คว่ามีไฟล์รูป site-logo.png ในโฟลเดอร์ public ไหม */}
            <img src="/site-logo.png" alt="logo" className={styles.logo} />
          </div>

          <h2 className={styles.registerTitle}>ลงทะเบียนผู้ใช้งาน</h2>

          <form className={styles.formSection} onSubmit={handleRegister}>
            
            <label>ชื่อ - นามสกุล</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="กรอกชื่อ - นามสกุล" 
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label>เบอร์โทรศัพท์</label>
            <input 
              type="tel" 
              name="phone"
              placeholder="กรอกเบอร์โทรศัพท์" 
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>รหัสผ่าน</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="ตั้งรหัสผ่าน"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <label>ยืนยันรหัสผ่าน</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <button 
              type="submit"
              className={styles.registerBtn}
              disabled={loading}
            >
              {loading ? 'กำลังบันทึก...' : 'ลงทะเบียน'}
            </button>

            <p className={styles.loginText}>
              มีบัญชีอยู่แล้ว? <Link className={styles.loginLink} href="/login">เข้าสู่ระบบ</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}