"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();
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
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Sarabun", sans-serif;
          color: #ffffff;
          overflow-x: hidden;
          background: #0a0a0a;
        }

        .orders-page-wrapper {
          position: relative;
          z-index: 10;
          min-height: 100vh;
        }

        /* Navigation */
        .top-navigation {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 0;
          transition: all 0.3s ease;
        }

        .top-navigation.scrolled {
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
          font-family: "Inter", sans-serif;
        }

        .logo-icon {
          font-size: 2rem;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }

        .logo-text {
          background: linear-gradient(135deg, #fff 0%, #b0bec5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-menu {
          position: relative;
        }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(176, 190, 197, 0.3);
        }

        .user-avatar {
          font-size: 1.5rem;
        }

        .dropdown-arrow {
          font-size: 0.75rem;
          transition: transform 0.3s ease;
        }

        .user-btn:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 1rem);
          right: 0;
          min-width: 280px;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, rgba(144, 164, 174, 0.2), rgba(96, 125, 139, 0.2));
        }

        .dropdown-avatar {
          font-size: 2rem;
        }

        .dropdown-name {
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .dropdown-item {
          width: 100%;
          padding: 1rem 1.25rem;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9375rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          padding-left: 1.5rem;
        }

        .dropdown-item.logout {
          color: #ff6b6b;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dropdown-item.logout:hover {
          background: rgba(255, 107, 107, 0.1);
        }

        /* Animated Background */
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, #607d8b, #455a64, #263238);
          z-index: -1;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float 12s infinite linear;
        }

        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh);
            opacity: 0;
          }
        }

        /* Content */
        .orders-container {
          padding: 120px 30px 30px;
          max-width: 1300px;
          margin: auto;
          position: relative;
          z-index: 1;
        }

        .orders-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 30px;
        }

        .orders-header h1 {
          color: white;
          font-size: 32px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
        }

        .top-button {
          align-self: flex-end;
          margin-top: -40px;
        }

        /* Summary Cards */
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 30px;
        }

        .card {
          padding: 25px;
          border-radius: 14px;
          color: white;
          text-align: left;
          box-shadow: 0 4px 18px rgba(0,0,0,0.08);
        }

        .card h2 {
          font-size: 28px;
          margin-bottom: 4px;
        }

        .card.purple { background: #6a5af9; }
        .card.green { background: #38c964; }
        .card.blue  { background: #00b7ff; }
        .card.orange{ background: #ff9900; }

        /* Order Section */
        .orders-list {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .list-title {
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: 600;
          color: #000;
        }

        .no-orders-box {
          text-align: center;
          padding: 40px 20px;
          color: #777;
        }

        .no-orders-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .no-orders-box h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .no-orders-box p {
          margin-bottom: 20px;
        }

        .no-orders-box a {
          color: white;
          text-decoration: none;
        }

        /* Buttons */
        .btn-primary {
          background: #6a5af9;
          padding: 11px 28px;
          border-radius: 10px;
          border: none;
          font-size: 16px;
          color: white;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .dev-name {
          font-weight: 700;
          margin-top: -4px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .summary-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .summary-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="orders-page-wrapper">
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

        {/* CONTENT */}
        <div className="orders-container">
          <header className="orders-header">
            <h1> ประวัติการสั่งซื้อเสื้อ</h1>
            <p className="subtitle">รายการคำสั่งซื้อเสื้อเฉลิมฉลองเมือง 243 ปี</p>

            <button className="btn-primary top-button">
              ➕ สั่งซื้อเสื้อใหม่
            </button>
          </header>

          {/* การ์ดสรุป 4 ช่อง */}
          <section className="summary-cards">
            <div className="card purple">
              <h2>0</h2>
              <p>คำสั่งซื้อทั้งหมด</p>
            </div>

            <div className="card green">
              <h2>0</h2>
              <p>เสื้อที่สั่งทั้งหมด</p>
            </div>

            <div className="card blue">
              <h2>฿0</h2>
              <p>ยอดรวมที่จ่าย</p>
            </div>

            <div className="card orange">
              <h2>0</h2>
              <p>สถานะที่หลากหลาย</p>
            </div>
          </section>

          {/* รายการคำสั่งซื้อ */}
          <section className="orders-list">
            <h2 className="list-title"> รายการคำสั่งซื้อ</h2>

            <div className="no-orders-box">
              <div className="no-orders-icon"></div>
              <h3>ยังไม่มีประวัติการสั่งซื้อ</h3>
              <p>เมื่อคุณสั่งซื้อเสื้อแล้ว ประวัติจะแสดงที่นี่</p>
              <button className="btn-primary">
                <a href="/">➕ สั่งซื้อเสื้อเลย</a>
              </button>
            </div>
          </section>

          <footer className="footer">
            <p>พัฒนาโดย</p>
            <p className="dev-name">นาย สมพง ใยคำ</p>
            <p className="dev-name">นาย สุพัน ชัยนอก</p>
            <p className="dev-name">นาย สรรพสิทธิ์ ยาเคน</p>
            
            <p>PS Intelligent Unit - มหาวิทยาลัยราชภัฏศรีสะเกษ</p>
          </footer>
        </div>
      </div>
    </>
  );
}