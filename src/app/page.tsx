"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api"; // เรียกใช้ API ตัวกลาง

// Interface สำหรับข้อมูลสถิติ
interface SizeStat {
  size: string;
  count: number;
  color?: string;
}

interface ProductStat {
  id: string;
  name: string;
  image: string;
  totalStock: number;
  sizes: SizeStat[];
}

export default function Page() {
  const router = useRouter();
  
  // UI State
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  
  // Data State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalShirtsSold: 0,
    inventory: [] as ProductStat[]
  });
  const [loading, setLoading] = useState(true);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0); // ใช้ Index แทน Type string เพื่อความชัวร์

  // สีประจำไซซ์ (Mapping)
  const sizeColors: Record<string, string> = {
    'SSS': '#64748b', 'SS': '#94a3b8',
    'S': '#10b981',  // เขียว
    'M': '#8b5cf6',  // ม่วง
    'L': '#3b82f6',  // ฟ้า
    'XL': '#ec4899', // ชมพู
    '2XL': '#f59e0b', // ส้ม
    '3XL': '#ef4444', // แดง
    '4XL': '#7f1d1d', '5XL': '#000000'
  };

  // 1. โหลดข้อมูลเมื่อเข้าเว็บ
  useEffect(() => {
    // 1.1 เช็ค User Login
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}
    }

    // 1.2 ดึงสถิติจาก Backend
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/statistics/public');
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // 1.3 Scroll & Particles Effect
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    setParticles(Array.from({length: 20}, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100
    })));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setShowUserMenu(false);
    router.push('/login');
  };

  // ข้อมูลสินค้าที่เลือกอยู่ปัจจุบัน (สำหรับกราฟ)
  const currentProduct = stats.inventory[selectedProductIndex] || { sizes: [], name: 'กำลังโหลด...', totalStock: 0 };
  
  // จัดเรียงไซซ์และใส่สี
  const displaySizes = currentProduct.sizes.map(s => ({
    ...s,
    color: sizeColors[s.size] || '#cccccc'
  }));
  
  // หาค่ามากสุดเพื่อทำหลอดพลัง (Progress Bar)
  const maxCount = Math.max(...displaySizes.map(s => s.count), 1);

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

      {/* TOP NAVIGATION */}
      <nav className={`top-navigation ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon"></div>
            <span className="logo-text">เสื้อเฉลิมฉลองเมือง 243 ปี</span>
          </div>

          <div className="nav-menu">
            {currentUser ? (
              // ✅ กรณีล็อกอินแล้ว: แสดงชื่อและเมนู
              <>
                <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <span className="user-avatar"></span>
                  <span className="user-text">{currentUser.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <span className="dropdown-avatar"></span>
                      <span className="dropdown-name">คุณ {currentUser.name}</span>
                    </div>
                    <button className="dropdown-item" onClick={() => router.push('/order')}>
                       สั่งซื้อเสื้อ
                    </button>
                    <button className="dropdown-item" onClick={() => router.push('/orders')}>
                       ประวัติการสั่งซื้อ
                    </button>
                    {currentUser.role === 'admin' && (
                        <button className="dropdown-item" onClick={() => router.push('/admin')}>
                           เมนูแอดมิน
                        </button>
                    )}
                    <button className="dropdown-item logout" onClick={handleLogout}>
                       ออกจากระบบ
                    </button>
                  </div>
                )}
              </>
            ) : (
              // ✅ กรณีไม่ได้ล็อกอิน: แสดงปุ่มเข้าสู่ระบบ
              <button className="btn-primary" style={{padding: '8px 20px', fontSize: '14px'}} onClick={() => router.push('/login')}>
                 เข้าสู่ระบบ
              </button>
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
            <span className="gradient-text"> เมือง 243 ปี</span>
          </h1>
          <p className="hero-subtitle">
            หอการค้าจังหวัดศรีสะเกษร่วมกับบริษัทประชารัฐรักสามัคคีศรีสะเกษ จัดจำหน่ายเสื้อที่ระลึก
            รายได้หลังหักค่าใช้จ่ายจะนำมาเป็นเงินจัดงาน "สู่ขวัญบ้าน บายศรีเมือง รุ่งเรือง 243 ปี"
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => router.push(currentUser ? '/order' : '/login')}>
              <span>{currentUser ? 'สั่งซื้อเลย' : 'เข้าสู่ระบบเพื่อสั่งซื้อ'}</span>
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-secondary" onClick={() => window.open('https://www.facebook.com/share/p/1CyNAH9ARu/', '_blank')}>
              <span>ดูรายละเอียดกิจกรรม</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="content-container">
        
        {/* Product Showcase & Stats */}
        <section className="product-showcase">
          <div className="showcase-grid">
            {/* รูปภาพสินค้า (ดึงรูปแรกของสินค้าที่เลือก หรือรูป Default) */}
            <div className="product-image-card">
              <div className="image-wrapper">
                <img 
                    src={currentProduct.image || "/shirt_243_black.jpg"} 
                    alt="เสื้อ 243 ปี" 
                    onError={(e) => e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image'}
                />
                <div className="image-overlay"></div>
              </div>
              <div className="price-banner">
                <span className="price-label">ราคาเดียว</span>
                <span className="price-amount">198 บาท</span>
              </div>
            </div>

            {/* ข้อมูลสถิติ (Real Data) */}
            <div className="product-info-card">
              <div className="info-header">
                <h2>สถิติโครงการ</h2>
                <span className="stock-badge"> อัปเดตล่าสุด</span>
              </div>
              
              <div className="stats-showcase">
                <div className="stat-box stat-primary">
                  <div className="stat-icon">👕</div>
                  <div className="stat-content">
                    {/* ยอดขายจริง */}
                    <span className="stat-number">{stats.totalShirtsSold.toLocaleString()}</span>
                    <span className="stat-label">ตัว</span>
                  </div>
                  <span className="stat-description">ยอดจองทั้งหมด</span>
                </div>
                
                <div className="stat-box stat-secondary">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    {/* จำนวนออเดอร์จริง */}
                    <span className="stat-number">{stats.totalOrders.toLocaleString()}</span>
                    <span className="stat-label">รายการ</span>
                  </div>
                  <span className="stat-description">คำสั่งซื้อทั้งหมด</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Size Selection / Inventory Chart */}
        <section className="size-section">
          <div className="section-header">
            <h2 className="section-title">สินค้าที่มีจำหน่าย</h2>
            <p className="section-subtitle">สต็อกปัจจุบันในระบบ (Real-time Inventory)</p>
          </div>

          {/* ปุ่มเลือกประเภทสินค้า (สร้างตามข้อมูลจริงที่ดึงมา) */}
          {stats.inventory.length > 0 ? (
            <>
                <div className="type-selector">
                    {stats.inventory.map((prod, index) => (
                    <button
                        key={prod.id}
                        className={`type-btn ${selectedProductIndex === index ? 'active' : ''}`}
                        onClick={() => setSelectedProductIndex(index)}
                    >
                        <span className="type-icon" style={{backgroundImage: `url(${prod.image})`, backgroundSize:'cover'}}></span>
                        <span className="type-name">{prod.name}</span>
                        <span className="type-count">เหลือ {prod.totalStock.toLocaleString()}</span>
                    </button>
                    ))}
                </div>

                <div className="sizes-display">
                    <h3 className="sizes-title">
                    จำนวนคงเหลือ - {currentProduct.name}
                    </h3>
                    <div className="sizes-grid">
                    {displaySizes.map((item, index) => (
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
                            width: `${(item.count / maxCount) * 100}%`,
                            background: item.color
                            }}
                        />
                        </div>
                    ))}
                    {displaySizes.length === 0 && <p style={{textAlign:'center', width:'100%', color:'#888'}}>ไม่มีข้อมูลสต็อก</p>}
                    </div>
                </div>
            </>
          ) : (
            <div style={{textAlign:'center', padding:'50px', color:'#888'}}>
                {loading ? 'กำลังโหลดข้อมูลสินค้า...' : 'ยังไม่มีสินค้าในระบบ'}
            </div>
          )}
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
              <span>นาย สมพงษ์ ใยคำ</span>
              <span>นาย สุพัน ชัยนอก</span>
              <span>นาย สรรพสิทธิ์ ยาเคน</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}