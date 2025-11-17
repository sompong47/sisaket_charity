'use client';

import './login.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
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

  // สร้าง particles ตอนโหลดหน้า (ตรวจว่า .animated-bg มีอยู่)
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

          <div className="nav-menu">
            <button
              className="user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="user-avatar"></span>
              <span className="user-text">สมชัน</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-avatar"></span>
                  <span className="dropdown-name">นาย สมชัน</span>
                </div>

                <button
                  className="dropdown-item"
                  onClick={() => router.push('/order')}
                >
                  สั่งซื้อเสื้อ
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => router.push('/orders')}
                >
                  ประวัติการสั่งซื้อ
                </button>

                <button
                  className="dropdown-item logout"
                  onClick={() => router.push('/login')}
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* LOGIN FORM */}
      <div className="login-container">
        <div className="login-card">
          <div className="logo-box">
            {/* ถ้าไฟล์ site-logo.png อยู่ในโฟลเดอร์ public ให้ใช้ path เริ่มด้วย / */}
            <img src="/site-logo.png" alt="logo" className="logo" />
          </div>

          <Link href="/" className="back-link">กลับไปหน้าแรก</Link>

          <p className="register-text">
            ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
          </p>

          <h2 className="login-title">เข้าสู่ระบบ</h2>

          <button className="google-btn">
            <img src="/google-color.png" alt="Google" className="google-icon" />
            Continue with Google
          </button>

          <div className="form-section">
            <label>เบอร์โทรศัพท์</label>
            <input type="text" placeholder="กรอกเบอร์โทรศัพท์" />

            <label>รหัสผ่าน</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder=".........."
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <button className="login-btn">เข้าสู่ระบบ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
