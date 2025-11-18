'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './slippage.module.css';

interface OrderData {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  shirtType: string;
  sizes: string;
  totalQuantity: number;
  shirtPrice: number;
  shippingCost: number;
  grandTotal: number;
  orderDate: string;
}

export default function SlipPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const bg = document.querySelector(`.${styles.animatedBg}`);
    if (bg && bg.children.length === 0) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = styles.particle;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        bg.appendChild(particle);
      }
    }
  }, []);

  // Load data from localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem("orderData");
      if (!data) {
        // For demo purposes, use mock data
        setOrderData({
          orderNumber: 'ORD2024111700001',
          customerName: 'สมชัย ใจดี',
          phone: '098-456-7897',
          email: 'somchai@email.com',
          address: '123 ถนนมิตรภาพ อ.เมือง จ.ศรีสะเกษ 33000',
          shirtType: 'เสื้อสีปกติ',
          sizes: 'M: 2 ตัว, L: 1 ตัว',
          totalQuantity: 3,
          shirtPrice: 594,
          shippingCost: 70,
          grandTotal: 664,
          orderDate: new Date().toLocaleDateString('th-TH')
        });
        return;
      }
      setOrderData(JSON.parse(data));
    } catch (error) {
      console.error('Error loading order data:', error);
    }
  }, []);

  if (!orderData) {
    return (
      <div className={styles.page}>
        <div className={styles.animatedBg}></div>
        <div className={styles.loading}>กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText('123-4-56789-0');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('ไม่สามารถคัดลอกได้');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className={styles.page}>
      {/* Animated Background */}
      <div className={styles.animatedBg}></div>

      {/* Navigation */}
      <nav className={`${styles.topNavigation} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.navLogo}>
            <span className={styles.logoIcon}></span>
            <span className={styles.logoText}>เสื้อเฉลิมฉลอง ศรีสะเกษ 243 ปี</span>
          </div>
          <div className={styles.navMenu}>
            <button 
  className={styles.userBtn}
  onClick={() => setShowDropdown(!showDropdown)}
>
  <span className={styles.userAvatar}></span>
  <span className={styles.userText}>บัญชีของฉัน</span>
  <span className={styles.dropdownArrow}>▼</span>
</button>

{showDropdown && (
  <div className="user-dropdown">
    <div className="dropdown-header">
      <span className="dropdown-avatar"></span>
      <span className="dropdown-name">นาย สมชัน</span>
    </div>
    <button className="dropdown-item" onClick={() => router.push('/order')}>
       สั่งซื้อเสื้อ
    </button>
    <button
                  className="dropdown-item"
                  onClick={() => router.push('/orders')}
                >
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

      {/* Main Content */}
      <div className={styles.orderContent}>
        <div className={styles.orderContainer}>
          {/* Header */}
          <div className={styles.orderHeader}>
            <h1 className={styles.orderTitle}>ชำระเงิน</h1>
          </div>

          {/* Steps Navigation */}
          <div className={styles.stepsNav}>
            <div className={`${styles.step} ${styles.completed}`}>
              <div className={styles.stepNumber}>1</div>
              <span>ข้อมูลผู้สั่งซื้อ</span>
            </div>
            <div className={`${styles.step} ${styles.completed}`}>
              <div className={styles.stepNumber}>2</div>
              <span>เลือกแบบและขนาดเสื้อ</span>
            </div>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <div className={styles.stepNumber}>3</div>
              <span>ชำระเงิน</span>
            </div>
          </div>

          {/* Slip Card */}
          <div className={styles.slipCard}>
            {/* Slip Header */}
            <div className={styles.slipHeader}>
              <div className={styles.successIcon}>✔︎</div>
              <h1 className={styles.slipTitle}>สั่งซื้อสำเร็จ!</h1>
              <p className={styles.slipSubtitle}>กรุณาชำระเงินภายใน 2 ชั่วโมง</p>
            </div>

            {/* Slip Content */}
            <div className={styles.slipContent}>
              {/* Order Number */}
              <div className={styles.orderNumber}>
                <div className={styles.orderLabel}>หมายเลขคำสั่งซื้อ</div>
                <div className={styles.orderCode}>{orderData.orderNumber}</div>
              </div>

              {/* Customer Info */}
              <div className={styles.infoSection}>
                <div className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}></span> ข้อมูลผู้สั่งซื้อ
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ชื่อ-นามสกุล</span>
                  <span className={styles.infoValue}>{orderData.customerName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>เบอร์โทร</span>
                  <span className={styles.infoValue}>{orderData.phone}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>อีเมล</span>
                  <span className={styles.infoValue}>{orderData.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ที่อยู่จัดส่ง</span>
                  <span className={styles.infoValue}>{orderData.address}</span>
                </div>
              </div>

              {/* Order Details */}
              <div className={styles.infoSection}>
                <div className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}></span> รายละเอียดสินค้า
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>รูปแบบเสื้อ</span>
                  <span className={styles.infoValue}>{orderData.shirtType}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ขนาดที่เลือก</span>
                  <span className={styles.infoValue}>{orderData.sizes}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>วันที่สั่งซื้อ</span>
                  <span className={styles.infoValue}>{orderData.orderDate}</span>
                </div>
              </div>

              {/* Price Summary */}
              <div className={styles.priceSummary}>
                <div className={styles.priceRow}>
                  <span>จำนวนเสื้อ</span>
                  <strong>{orderData.totalQuantity} ตัว</strong>
                </div>
                <div className={styles.priceRow}>
                  <span>ราคารวมสินค้า</span>
                  <strong>฿{orderData.shirtPrice.toLocaleString()}</strong>
                </div>
                <div className={styles.priceRow}>
                  <span>ค่าจัดส่ง</span>
                  <strong>฿{orderData.shippingCost.toLocaleString()}</strong>
                </div>
                <div className={`${styles.priceRow} ${styles.total}`}>
                  <span>ยอดชำระทั้งหมด</span>
                  <strong>฿{orderData.grandTotal.toLocaleString()}</strong>
                </div>
              </div>

              {/* Payment Section */}
              <div className={styles.paymentSection}>
                <div className={styles.paymentTitle}> ข้อมูลการชำระเงิน</div>
                <div className={styles.bankInfo}>
                  <div className={styles.bankRow}>
                    <span className={styles.bankLabel}>ธนาคาร</span>
                    <span className={styles.bankValue}>กสิกรไทย</span>
                  </div>
                  <div className={styles.bankRow}>
                    <span className={styles.bankLabel}>ชื่อบัญชี</span>
                    <span className={styles.bankValue}>นายสมชาย ใจดี</span>
                  </div>
                  <div className={styles.bankRow}>
                    <span className={styles.bankLabel}>เลขบัญชี</span>
                    <span className={`${styles.bankValue} ${styles.accountNumber}`}>
                      123-4-56789-0
                    </span>
                  </div>
                </div>
                <div className={styles.qrCode}>
                  <img
                    src="qr.jpg"
                    alt="QR Code"
                    className={styles.qrImage}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={handleCopyAccount}>
                  {copied ? '✓ คัดลอกแล้ว' : ' คัดลอกเลขบัญชี'}
                </button>
                <button className={styles.secondaryButton} onClick={handleBackToHome}>
                   กลับหน้าหลัก
                </button>
              </div>

              {/* Notes */}
              <div className={styles.notes}>
                <div className={styles.notesTitle}>⚠️ หมายเหตุ</div>
                <ul className={styles.notesList}>
                  <li>กรุณาชำระเงินภายใน 2 ชั่วโมง</li>
                  <li>โอนแล้วแจ้งสลิปที่ Line: @sisaket243</li>
                  <li>จัดส่งภายใน 3-5 วันทำการหลังชำระเงิน</li>
                  <li>ติดต่อสอบถาม 098-456-7897</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}