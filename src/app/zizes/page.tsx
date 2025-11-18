'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api'; // ✅ เรียกใช้ API
import styles from './zizes.module.css';

// ==================== INTERFACES ====================
interface SwiperProps { children: React.ReactNode; }
interface SwiperSlideProps { children: React.ReactNode; }
interface ShirtType { id: string; label: string; image: string; }
interface Quantities { [key: string]: number; }
// ✅ NEW: Interface สำหรับรายการสินค้าในคำสั่งซื้อ (Order Item)
interface OrderItem {
    productName: string;
    size: string;
    quantity: number;
    price: number;
}

// ==================== SWIPER COMPONENTS ====================
const Swiper: React.FC<SwiperProps> = ({ children }) => {
// ... (โค้ด Swiper เหมือนเดิม)
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = React.Children.toArray(children);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);
  
  return (
    <div className={styles.swiperContainer}>
      <div className={styles.swiperWrapper} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides}
      </div>
      <div className={styles.swiperPagination}>
        {slides.map((_, idx) => (
          <span 
            key={idx} 
            className={`${styles.swiperPaginationBullet} ${idx === currentSlide ? styles.swiperPaginationBulletActive : ''}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
};

const SwiperSlide: React.FC<SwiperSlideProps> = ({ children }) => (
  <div className={styles.swiperSlide}>{children}</div>
);

// ==================== CONSTANTS ====================
const SIZES = [
  ['SSS', 'SS', 'S'], ['M', 'L', 'XL'],
  ['2XL', '3XL', '4XL'], ['5XL', '6XL', '7XL'],
  ['8XL', '9XL', '10XL']
];

const PRICE_PER_SHIRT = 198;
const BASE_SHIPPING = 50;
const ADDITIONAL_SHIPPING = 10;

const SHIRT_TYPES: ShirtType[] = [
  { id: 'traditional', label: 'เสื้อสีปกติ', image: '/ssk1.jpg' },
  { id: 'polo', label: 'เสื้อไว้ทุกข์', image: '/ssk.jpg' } // ตรวจสอบ path รูปด้วยนะครับ
];

const SLIDER_IMAGES = [
  { src: '/sisaket10.jpg', alt: 'รูปที่ 1' },
  { src: '/sisaket4.jpg', alt: 'รูปที่ 2' },
  { src: '/sisaket2.jpg', alt: 'รูปที่ 3' }
];

export default function ZizesPage() {
  const router = useRouter();
  
  // State
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Quantities>({
    SSS: 0, SS: 0, S: 0, M: 0, L: 0, XL: 0,
    "2XL": 0, "3XL": 0, "4XL": 0, "5XL": 0,
    "6XL": 0, "7XL": 0, "8XL": 0, "9XL": 0, "10XL": 0,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ เพิ่ม Loading state

  useEffect(() => {
    // ✅ เช็คว่ามีข้อมูลลูกค้าจากหน้าแรกไหม ถ้าไม่มีให้เด้งกลับ
    const customerData = localStorage.getItem('tempOrderCustomer');
    if (!customerData) {
        alert('กรุณากรอกข้อมูลผู้สั่งซื้อก่อน');
        router.push('/order');
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
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

  useEffect(() => {
    if (showConfirmModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showConfirmModal]);

  // ==================== CALCULATIONS ====================
  const getTotalQuantity = (): number => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = (): number => {
    return getTotalQuantity() * PRICE_PER_SHIRT;
  };

  const getShippingCost = (): number => {
    const qty = getTotalQuantity();
    if (qty === 0) return 0;
    return BASE_SHIPPING + (qty - 1) * ADDITIONAL_SHIPPING;
  };

  const getGrandTotal = (): number => {
    return getTotalPrice() + getShippingCost();
  };

  const getSelectedSizes = (): string => {
    return Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size, qty]) => `${size}: ${qty} ตัว`)
      .join(', ');
  };

  // ==================== HANDLERS ====================
  const handleQuantityChange = (size: string, delta: number): void => {
    setQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, prev[size] + delta)
    }));
  };

  const handleSubmit = () => {
    if (!selectedType) return alert('กรุณาเลือกแบบเสื้อ');
    if (getTotalQuantity() === 0) return alert('กรุณาเลือกขนาดและจำนวนเสื้อ');
    setShowConfirmModal(true);
  };

  // ✅ ฟังก์ชันยืนยันการสั่งซื้อ (เชื่อมต่อ Backend)
  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
        // 1. ดึงข้อมูลลูกค้าจาก LocalStorage (ที่กรอกในหน้าแรก)
        const customerDataStr = localStorage.getItem('tempOrderCustomer');
        if (!customerDataStr) {
            alert('ข้อมูลผู้สั่งซื้อหายไป กรุณากรอกใหม่');
            router.push('/order');
            return;
        }
        const customerData = JSON.parse(customerDataStr);

        // 2. เตรียมข้อมูลสินค้า (Items Array)
        const shirtTypeLabel = SHIRT_TYPES.find(t => t.id === selectedType)?.label || 'ไม่ระบุ';
        // ⬇️ แก้ไข Type: ให้ items เป็น OrderItem[] 
        const items: OrderItem[] = [];
        
        Object.entries(quantities).forEach(([size, qty]) => {
            if (qty > 0) {
                items.push({
                    productName: shirtTypeLabel,
                    size: size,
                    quantity: qty,
                    price: PRICE_PER_SHIRT
                });
            }
        });

        // 3. สร้าง Payload ส่งให้ Backend
        const payload = {
            customerName: customerData.name,
            phone: customerData.phone,
            // address: customerData.address, // (Backend ปัจจุบันอาจยังไม่ได้รับ field นี้ แต่ส่งไปเผื่อไว้)
            items: items,
            totalAmount: getGrandTotal(), // ราคารวมส่งแล้ว
        };

        // 4. ยิง API
        await api.post('/api/orders', payload);

        // 5. สำเร็จ! ล้างข้อมูลชั่วคราวและไปหน้าประวัติ
        localStorage.removeItem('tempOrderCustomer');
        alert('✅ สั่งซื้อสำเร็จ! กรุณาไปที่หน้า "ประวัติการสั่งซื้อ" เพื่อแจ้งชำระเงิน');
        router.push('/orders'); // ไปหน้าประวัติ เพื่อให้กดแจ้งโอน

    } catch (error: any) {
        console.error('Order Error:', error);
        alert('❌ เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
    } finally {
        setLoading(false);
        setShowConfirmModal(false);
    }
  };

  const handleCancelOrder = () => {
    setShowConfirmModal(false);
  };

  // ... (โค้ด return JSX ส่วนที่เหลือเหมือนเดิม)
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
              <span className={styles.userText}>บัญชีของฉัน</span>
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            {showDropdown && (
              <div className={styles.userDropdown}>
                <button className="dropdown-item" onClick={() => router.push('/order')}>สั่งซื้อเสื้อ</button>
                <button className="dropdown-item" onClick={() => router.push('/orders')}>ประวัติการสั่งซื้อ</button>
                <button className="dropdown-item logout" onClick={() => {
                    localStorage.removeItem('token');
                    router.push('/login');
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
            <h1 className={styles.orderTitle}>เลือกแบบและขนาดเสื้อ</h1>
          </div>

          <div className={styles.stepsNav}>
            <div className={styles.step}><div className={styles.stepNumber}>1</div><span>ข้อมูลผู้สั่งซื้อ</span></div>
            <div className={`${styles.step} ${styles.stepActive}`}><div className={styles.stepNumber}>2</div><span>เลือกแบบและขนาด</span></div>
            <div className={styles.step}><div className={styles.stepNumber}>3</div><span>ชำระเงิน</span></div>
          </div>

          {/* Image Slider */}
          <div className={styles.imageSlider}>
            <Swiper>
              {SLIDER_IMAGES.map((image, index) => (
                <SwiperSlide key={index}><img src={image.src} alt={image.alt} className={styles.sliderImage} /></SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Form Section */}
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}><h2 className={styles.sectionText}>เลือกรูปแบบเสื้อ</h2></div>
            <div className={styles.shirtTypeGrid}>
              {SHIRT_TYPES.map(type => (
                <button key={type.id} onClick={() => setSelectedType(type.id)} className={`${styles.shirtTypeCard} ${selectedType === type.id ? styles.active : ''}`}>
                  <img src={type.image} className={styles.typeImage} alt={type.label} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.sectionTitle}><h2 className={styles.sectionText}>เลือกขนาดและจำนวน</h2></div>
            <div className={styles.sizeSelection}>
              {SIZES.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.sizeRow}>
                  {row.map(size => (
                    <div key={size} className={styles.sizeItem}>
                      <span className={styles.sizeLabel}>{size}</span>
                      <div className={styles.qtyControl}>
                        <button onClick={() => handleQuantityChange(size, -1)}>-</button>
                        <input type="text" readOnly value={quantities[size]} />
                        <button onClick={() => handleQuantityChange(size, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Summary */}
            {getTotalQuantity() > 0 && (
              <div className={styles.summaryContainer}>
                <div className={styles.summary}>
                  <h3 className={styles.summaryTitle}>สรุปคำสั่งซื้อ</h3>
                  <div className={styles.summaryRow}><span>จำนวนเสื้อ:</span><strong>{getTotalQuantity()} ตัว</strong></div>
                  <div className={styles.summaryRow}><span>ราคาเสื้อ:</span><strong>{getTotalPrice().toLocaleString()} บาท</strong></div>
                  <div className={styles.summaryRow}><span>ค่าจัดส่ง:</span><strong>{getShippingCost().toLocaleString()} บาท</strong></div>
                  <div className={styles.summaryRow}><span>รวมทั้งหมด:</span><strong className={styles.totalPrice}>{getGrandTotal().toLocaleString()} บาท</strong></div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <button 
              className={styles.btnPrimaryOrder} 
              onClick={handleSubmit} 
              disabled={!selectedType || getTotalQuantity() === 0 || loading}
            >
              {loading ? 'กำลังบันทึกข้อมูล...' : `🛒 ยืนยันการสั่งซื้อ (${getGrandTotal().toLocaleString()} บาท)`}
            </button>

            <button className={styles.btnSecondaryOrder} onClick={() => router.push('/order')}>← กลับไปแก้ไขข้อมูล</button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={handleCancelOrder}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>❓</div>
            <h2 className={styles.modalTitle}>ยืนยันการสั่งซื้อ</h2>
            
            <div className={styles.modalInfo}>
              <p><strong>รูปแบบเสื้อ:</strong> {SHIRT_TYPES.find(t => t.id === selectedType)?.label}</p>
              <p><strong>รายการ:</strong> {getSelectedSizes()}</p>
            </div>

            <div className={styles.modalPricing}>
              <div className={styles.pricingRow}><span>จำนวนรวม:</span><strong>{getTotalQuantity()} ตัว</strong></div>
              <div className={styles.pricingRow}><span>ราคาเสื้อ:</span><strong>฿{getTotalPrice().toLocaleString()}</strong></div>
              <div className={styles.pricingRow}><span>ค่าจัดส่ง:</span><strong>฿{getShippingCost().toLocaleString()}</strong></div>
              <div className={styles.pricingRow}><span>ราคารวมทั้งหมด:</span><strong className={styles.totalPrice}>฿{getGrandTotal().toLocaleString()}</strong></div>
            </div>

            <div className={styles.modalButtons}>
              <button className={styles.confirmBtn} onClick={handleConfirmOrder} disabled={loading}>
                {loading ? 'กำลังบันทึก...' : 'ยืนยันสั่งซื้อ'}
              </button>
              <button className={styles.cancelBtn} onClick={handleCancelOrder} disabled={loading}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}