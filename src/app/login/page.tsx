"use client";
import "./login.css";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="login-card">

        {/* โลโก้ */}
        <div className="logo-box">
          <img src="site-logo.png" alt="logo1" className="logo" />
        </div>

        <a href="/" className="back-link">กลับไปหน้าแรก</a>


        <h2 className="login-title">เข้าสู่ระบบ</h2>

        {/* ปุ่ม Google */}
        <button className="google-btn">
          <img src="google-color.png" className="google-icon" />
          Continue with Google
        </button>

        {/* ฟอร์ม */}
        <div className="form-section">
          <label>เบอร์โทรศัพท์</label>
          <input type="text" placeholder="กรอกเบอร์โทรศัพท์" />

          <label>รหัสผ่าน</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=".........."
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button className="login-btn">เข้าสู่ระบบ</button>
        </div>

      </div>
    </div>
  );
}
