'use client';

import styles from './page.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // สร้าง particles ตอนโหลดหน้า
  useEffect(() => {
    const container = document.querySelector(`.${styles.animatedBg}`);
    if (!container) return;
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
      {/* Animated Background */}
      <div className={styles.animatedBg}></div>

      {/* TOP NAVIGATION */}
      <nav className={`${styles.topNavigation} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.navLogo}>
            <div className={styles.logoIcon}></div>
            <span className={styles.logoText}>เสื้อเฉลิมฉลองเมือง 243 ปี</span>
          </div>

          <div className={styles.navMenu}>
            <button
              className={styles.userBtn}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className={styles.userAvatar}></span>
              <span>สมชัน</span>
              <span className={styles.dropdownArrow}>▼</span>
            </button>

            {showUserMenu && (
              <div className={styles.userDropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownAvatar}></span>
                  <span className={styles.dropdownName}>นาย สมชัน</span>
                </div>

                <button
                  className={styles.dropdownItem}
                  onClick={() => router.push('/order')}
                >
                   สั่งซื้อเสื้อ
                </button>

                <button
                  className={styles.dropdownItem}
                  onClick={() => router.push('/orders')}
                >
                   ประวัติการสั่งซื้อ
                </button>

                <button
                  className={`${styles.dropdownItem} ${styles.logout}`}
                  onClick={() => router.push('/login')}
                >
                   ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* REGISTER FORM */}
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.logoBox}>
            <img src="/site-logo.png" alt="logo" className={styles.logo} />
          </div>

          <h2 className={styles.registerTitle}>ลงทะเบียนผู้ใช้งาน</h2>


          <div className={styles.formSection}>
            <label>ชื่อ - นามสกุล</label>
            <input type="text" placeholder="กรอกชื่อ - นามสกุล" />

            <label>เบอร์โทรศัพท์</label>
            <input type="tel" placeholder="กรอกเบอร์โทรศัพท์" />

            <label>รหัสผ่าน</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="ตั้งรหัสผ่าน"
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '' : '👁️'}
              </span>
            </div>

            <label>ยืนยันรหัสผ่าน</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '' : '👁️'}
              </span>
            </div>

            <button className={styles.registerBtn}>ลงทะเบียน</button>
             <p className={styles.loginText}>
          มีบัญชีอยู่แล้ว? <a className={styles.loginLink} href="/login">เข้าสู่ระบบ</a>
        </p>
          </div>
        </div>
      </div>
    </div>
  );
}