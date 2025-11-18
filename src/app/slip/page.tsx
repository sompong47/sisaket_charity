'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api'; // ✅ เรียกใช้ API
import styles from './slippage.module.css';

// Interface ให้ตรงกับข้อมูลจาก Backend
interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  items: {
    productName: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  createdAt: string;
}

export default function SlipPage() {
  const router = useRouter();
  
  // UI State
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'ผู้ใช้งาน' });

  // Data State
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. โหลดข้อมูลออเดอร์ล่าสุด
  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }

        // ดึงข้อมูล User มาแสดงใน Navbar
        const savedUser = localStorage.getItem('user');
        if (savedUser) setCurrentUser(JSON.parse(savedUser));

        // ดึงประวัติการสั่งซื้อ (ตัวแรกสุดคือตัวล่าสุด)
        const { data } = await api.get('/api/orders/my-orders');
        
        if (data.data && data.data.length > 0) {
           setOrderData(data.data[0]); // ✅ เอาตัวล่าสุดมาโชว์
        } else {
           // ถ้าไม่มีออเดอร์เลย ให้กลับหน้าแรก
           router.push('/');
        }

      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();

    // Scroll Effect
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Particles Effect
  useEffect(() => {
    const bg = document.querySelector(`.${styles.animatedBg}`);
    if (bg && bg.children.length === 0) {
      for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = styles.particle;
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 15 + 's';
        p.style.animationDuration = (Math.random() * 10 + 10) + 's';
        bg.appendChild(p);
      }
    }
  }, []);

  // ฟังก์ชันคัดลอกเลขบัญชี
  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText('123-4-56789-0'); // ⚠️ แก้เลขบัญชีจริงที่นี่
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('ไม่สามารถคัดลอกได้');
    }
  };

  const handleGoToHistory = () => {
    router.push('/orders'); // ไปหน้าประวัติเพื่อแจ้งโอน
  };

  // Helper คำนวณยอด (Optional: ถ้าอยากโชว์แยกย่อย)
  const calculateDetails = () => {
    if (!orderData) return { shirtPrice: 0, shipping: 0, qty: 0 };
    const qty = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
    const shirtPrice = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = orderData.totalAmount - shirtPrice; // คำนวณส่วนต่างเป็นค่าส่ง
    return { shirtPrice, shipping, qty };
  };

  if (loading) return <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>กำลังโหลดข้อมูล...</div>;
  if (!orderData) return null;

  const { shirtPrice, shipping, qty } = calculateDetails();

  return (
    <div className={styles.page}>
      <div className={styles.animatedBg}></div>

      {/* Navigation */}
      <nav className={`${styles.topNavigation} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.navLogo}>
            <span className={styles.logoText}>เสื้อเฉลิมฉลอง ศรีสะเกษ 243 ปี</span>
          </div>
          <div className={styles.navMenu}>
            <button className={styles.userBtn} onClick={() => setShowDropdown(!showDropdown)}>
              <span className={styles.userAvatar}></span>
              <span className={styles.userText}>{currentUser.name}</span>
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            {showDropdown && (
              <div className={styles.userDropdown}>
                <div className={styles.dropdownHeader}>
                   <span className={styles.dropdownAvatar}></span>
                   <span className={styles.dropdownName}>{currentUser.name}</span>
                </div>
                <button className={styles.dropdownItem} onClick={() => router.push('/order')}>สั่งซื้อเสื้อ</button>
                <button className={styles.dropdownItem} onClick={() => router.push('/orders')}>ประวัติการสั่งซื้อ</button>
                <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={() => {
                    localStorage.clear(); router.push('/login');
                }}>ออกจากระบบ</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={styles.orderContent}>
        <div className={styles.orderContainer}>
          <div className={styles.orderHeader}>
            <h1 className={styles.orderTitle}>ชำระเงิน</h1>
          </div>

          {/* Steps Navigation */}
          <div className={styles.stepsNav}>
            <div className={`${styles.step} ${styles.completed}`}><div className={styles.stepNumber}>1</div><span>ข้อมูลผู้สั่งซื้อ</span></div>
            <div className={`${styles.step} ${styles.completed}`}><div className={styles.stepNumber}>2</div><span>เลือกแบบและขนาด</span></div>
            <div className={`${styles.step} ${styles.stepActive}`}><div className={styles.stepNumber}>3</div><span>ชำระเงิน</span></div>
          </div>

          {/* Slip Card */}
          <div className={styles.slipCard}>
            <div className={styles.slipHeader}>
              <div className={styles.successIcon}>✔︎</div>
              <h1 className={styles.slipTitle}>สั่งซื้อสำเร็จ!</h1>
              <p className={styles.slipSubtitle}>กรุณาชำระเงินและแจ้งโอนผ่านเมนู "ประวัติการสั่งซื้อ"</p>
            </div>

            <div className={styles.slipContent}>
              {/* Order Number */}
              <div className={styles.orderNumber}>
                <div className={styles.orderLabel}>หมายเลขคำสั่งซื้อ</div>
                <div className={styles.orderCode}>{orderData.orderNumber}</div>
              </div>

              {/* Customer Info */}
              <div className={styles.infoSection}>
                <div className={styles.sectionTitle}>ข้อมูลผู้สั่งซื้อ</div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>ชื่อ-นามสกุล</span><span className={styles.infoValue}>{orderData.customer.name}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>เบอร์โทร</span><span className={styles.infoValue}>{orderData.customer.phone}</span></div>
                {/* <div className={styles.infoRow}><span className={styles.infoLabel}>ที่อยู่</span><span className={styles.infoValue}>{orderData.customer.address || '-'}</span></div> */}
              </div>

              {/* Order Details */}
              <div className={styles.infoSection}>
                <div className={styles.sectionTitle}>รายละเอียดสินค้า</div>
                {orderData.items.map((item, i) => (
                    <div key={i} className={styles.infoRow}>
                        <span className={styles.infoLabel}>{item.productName} ({item.size})</span>
                        <span className={styles.infoValue}>x {item.quantity}</span>
                    </div>
                ))}
                <div className={styles.infoRow}><span className={styles.infoLabel}>วันที่สั่งซื้อ</span><span className={styles.infoValue}>{new Date(orderData.createdAt).toLocaleDateString('th-TH')}</span></div>
              </div>

              {/* Price Summary */}
              <div className={styles.priceSummary}>
                <div className={styles.priceRow}><span>จำนวนรวม</span><strong>{qty} ตัว</strong></div>
                <div className={styles.priceRow}><span>ราคารวมสินค้า</span><strong>฿{shirtPrice.toLocaleString()}</strong></div>
                <div className={styles.priceRow}><span>ค่าจัดส่ง</span><strong>฿{shipping.toLocaleString()}</strong></div>
                <div className={`${styles.priceRow} ${styles.total}`}><span>ยอดชำระทั้งหมด</span><strong>฿{orderData.totalAmount.toLocaleString()}</strong></div>
              </div>

              {/* Payment Section */}
              <div className={styles.paymentSection}>
                <div className={styles.paymentTitle}>ช่องทางการชำระเงิน</div>
                <div className={styles.bankInfo}>
                  <div className={styles.bankRow}><span className={styles.bankLabel}>ธนาคาร</span><span className={styles.bankValue}>กสิกรไทย</span></div>
                  <div className={styles.bankRow}><span className={styles.bankLabel}>ชื่อบัญชี</span><span className={styles.bankValue}>นายสมชาย ใจดี</span></div>
                  <div className={styles.bankRow}><span className={styles.bankLabel}>เลขบัญชี</span><span className={`${styles.bankValue} ${styles.accountNumber}`}>123-4-56789-0</span></div>
                </div>
                {/* ถ้ามีรูป QR Code ให้ใส่ใน folder public แล้วแก้ src */}
                <div className={styles.qrCode}><img src="/qr.jpg" alt="QR Code" className={styles.qrImage} onError={(e) => e.currentTarget.style.display='none'} /></div>
              </div>

              {/* Buttons */}
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={handleCopyAccount}>
                  {copied ? '✓ คัดลอกแล้ว' : '📋 คัดลอกเลขบัญชี'}
                </button>
                <button className={styles.secondaryButton} onClick={handleGoToHistory}>
                  📤 แจ้งโอนเงิน (ไปหน้าประวัติ)
                </button>
              </div>

              {/* Notes */}
              <div className={styles.notes}>
                <div className={styles.notesTitle}>⚠️ หมายเหตุ</div>
                <ul className={styles.notesList}>
                  <li>กรุณาชำระเงินภายใน 24 ชั่วโมง</li>
                  <li>เมื่อโอนแล้ว กดปุ่ม <strong>"แจ้งโอนเงิน"</strong> เพื่อแนบสลิป</li>
                  <li>สินค้าจะจัดส่งภายใน 3-5 วันทำการหลังตรวจสอบยอดเงิน</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}