"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [selectedType, setSelectedType] = useState('normal');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Create particles
    const newParticles = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const normalSizes = [
    { size: 'L', count: 8303, color: '#3b82f6' },
    { size: 'M', count: 6977, color: '#8b5cf6' },
    { size: 'XL', count: 3277, color: '#ec4899' },
    { size: 'S', count: 3693, color: '#10b981' },
    { size: '2XL', count: 2057, color: '#f59e0b' },
    { size: '3XL', count: 655, color: '#ef4444' },
  ];

  const poloSizes = [
    { size: 'M', count: 932, color: '#64748b' },
    { size: 'L', count: 888, color: '#475569' },
    { size: 'S', count: 829, color: '#334155' },
    { size: 'XL', count: 706, color: '#1e293b' },
    { size: '2XL', count: 298, color: '#0f172a' },
  ];

  const currentSizes = selectedType === 'normal' ? normalSizes : poloSizes;

  return (
    <div className="page">
      {/* Animated Background */}
      <div className="animated-bg">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.id * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Top Navigation */}
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
                <button className="dropdown-item" onClick={() => router.push('/order')}>
                   สั่งซื้อเสื้อ
                </button>
                <button className="dropdown-item">
                   ประวัติการสั่งซื้อ
                </button>
                <button className="dropdown-item logout" onClick={() => router.push('/login')}>
                   ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">✨ ฉลองเมือง 243 ปี</div>
          <h1 className="hero-title">
            เสื้อเฉลิมฉลอง
            <span className="gradient-text">เมือง 243 ปี</span>
          </h1>
          <p className="hero-subtitle">
            หอการค้าจังหวัดศรีสะเกษร่วมกับบริษัทประชารัฐรักสามัคคีศรีสะเกษ (วิสาหกิจเพื่อสังคม) จำกัด จัดจำหน่ายเสื้อสู่ขวัญบ้าน บายศรีเมือง รุ่งเรือง 243 ปีโดยรายได้จากการขายเสื้อหลังหักค่าใช้จ่าย จะนำมาเป็นเงินจัดงาน สู่ขวัญบ้าน บายศรีเมือง รุ่งเรือง 243 ปี
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => router.push('/order')}>
              <span>สั่งซื้อเลย</span>
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-secondary" onClick={() => window.open('https://www.facebook.com/share/p/1CyNAH9ARu/', '_blank')}>
              <span>ดูรายละเอียด</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="content-container">
        
        {/* Product Showcase */}
        <section className="product-showcase">
          <div className="showcase-grid">
            <div className="product-image-card">
              <div className="image-wrapper">
                <img src="/shirt_243_black.jpg" alt="เสื้อ 243 ปี" />
                <div className="image-overlay">
                </div>
              </div>
              <div className="price-banner">
                <span className="price-label">ราคาพิเศษ</span>
                <span className="price-amount">198 บาท</span>
              </div>
            </div>

            <div className="product-info-card">
              <div className="info-header">
                <h2>ข้อมูลสินค้า</h2>
                <span className="stock-badge"> พร้อมส่ง</span>
              </div>
              
              <div className="stats-showcase">
                <div className="stat-box stat-primary">
                  <div className="stat-icon"></div>
                  <div className="stat-content">
                    <span className="stat-number">31,619</span>
                    <span className="stat-label">ตัว</span>
                  </div>
                  <span className="stat-description">เสื้อสีขาว</span>
                </div>
                
                <div className="stat-box stat-secondary">
                  <div className="stat-icon"></div>
                  <div className="stat-content">
                    <span className="stat-number">1,899</span>
                    <span className="stat-label">รายการ</span>
                  </div>
                  <span className="stat-description">ออเดอร์ทั้งหมด</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Size Selection */}
        <section className="size-section">
          <div className="section-header">
            <h2 className="section-title">เลือกแบบเสื้อที่คุณชอบ</h2>
            <p className="section-subtitle">เรามีให้เลือก 2 แบบ พร้อมหลากหลายไซซ์</p>
          </div>

          <div className="type-selector">
            <button
              className={`type-btn ${selectedType === 'normal' ? 'active' : ''}`}
              onClick={() => setSelectedType('normal')}
            >
              <span className="type-icon"></span>
              <span className="type-name">เสื้อสีขาว</span>
              <span className="type-count">27,328 ตัว</span>
            </button>
            
            <button
              className={`type-btn ${selectedType === 'polo' ? 'active' : ''}`}
              onClick={() => setSelectedType('polo')}
            >
              <span className="type-icon"></span>
              <span className="type-name">เสื้อโปโลดำ</span>
              <span className="type-count">4,291 ตัว</span>
            </button>
          </div>

          <div className="sizes-display">
            <h3 className="sizes-title">
              ไซซ์ที่มีจำหน่าย - {selectedType === 'normal' ? 'เสื้อสีขาว' : 'เสื้อโปโลดำ'}
            </h3>
            <div className="sizes-grid">
              {currentSizes.map((item, index) => (
                <div
                  key={index}
                  className="size-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="size-header">
                    <span className="size-name">{item.size}</span>
                    <div 
                      className="size-indicator"
                      style={{ background: item.color }}
                    />
                  </div>
                  <div className="size-count">{item.count.toLocaleString()}</div>
                  <div className="size-label">ตัว</div>
                  <div 
                    className="size-progress"
                    style={{
                      width: `${(item.count / Math.max(...currentSizes.map(s => s.count))) * 100}%`,
                      background: item.color
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="page-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="footer-icon"></div>
              <span>พัฒนาโดย</span>
            </div>
            <p className="footer-uni">นักศึกษามหาวิทยาลัยราชภัฏศรีสะเกษ</p>
            <div className="footer-team">
              <span>นาย สมพง ใยคำ</span>
              <span>นาย สุพัน ชัยนอก</span>
              <span>นาย สรรพสิทธิ์ ยาเคน</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}