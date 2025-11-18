'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './zizes.module.css';

// ==================== INTERFACES ====================
interface SwiperProps {
  children: React.ReactNode;
}

interface SwiperSlideProps {
  children: React.ReactNode;
}

interface ShirtType {
  id: string;
  label: string;
  image: string;
}

interface Quantities {
  [key: string]: number;
}

// ==================== SWIPER COMPONENTS ====================
const Swiper: React.FC<SwiperProps> = ({ children }) => {
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
  ['SSS', 'SS', 'S'],
  ['M', 'L', 'XL'],
  ['2XL', '3XL', '4XL'],
  ['5XL', '6XL', '7XL'],
  ['8XL', '9XL', '10XL']
];

const PRICE_PER_SHIRT = 198;
const BASE_SHIPPING = 50;
const ADDITIONAL_SHIPPING = 10;

const SHIRT_TYPES: ShirtType[] = [
  { id: 'traditional', label: 'เสื้อสีปกติ', image: '/ssk1.jpg' },
  { id: 'polo', label: 'เสื้อไว้ทุกข์', image: '/ssk.jpg' }
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

  // Lock scroll when modal is open
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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
    if (!selectedType) {
      alert('กรุณาเลือกแบบเสื้อ');
      return;
    }

    if (getTotalQuantity() === 0) {
      alert('กรุณาเลือกขนาดและจำนวนเสื้อ');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmOrder = () => {
    const shirtTypeLabel = SHIRT_TYPES.find(t => t.id === selectedType)?.label || '';

    const orderData = {
      orderNumber: `ORD${Date.now()}`,
      shirtType: shirtTypeLabel,
      sizes: getSelectedSizes(),
      totalQuantity: getTotalQuantity(),
      shirtPrice: getTotalPrice(),
      shippingCost: getShippingCost(),
      grandTotal: getGrandTotal(),
    };

    console.log('Order Data:', orderData);
    setShowConfirmModal(false);
    router.push('/slip'); // ← ไปหน้า slip เลยโดยไม่มี alert
  };

  const handleCancelOrder = () => {
    setShowConfirmModal(false);
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
              <div className={styles.userDropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownAvatar}></span>
                  <span className={styles.dropdownName}>ผู้ใช้งาน</span>
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
            <h1 className={styles.orderTitle}>เลือกแบบและขนาดเสื้อ</h1>
          </div>

          {/* Steps Navigation */}
          <div className={styles.stepsNav}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <span>ข้อมูลผู้สั่งซื้อ</span>
            </div>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <div className={styles.stepNumber}>2</div>
              <span>เลือกแบบและขนาดเสื้อ</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <span>ชำระเงิน</span>
            </div>
          </div>

          {/* Image Slider */}
          <div className={styles.imageSlider}>
            <Swiper>
              {SLIDER_IMAGES.map((image, index) => (
                <SwiperSlide key={index}>
                  <img src={image.src} alt={image.alt} className={styles.sliderImage} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Form Section */}
          <div className={styles.formSection}>
            {/* Shirt Type Selection */}
            <div className={styles.sectionTitle}>
              <h2 className={styles.sectionText}>เลือกรูปแบบเสื้อ</h2>
            </div>

            <div className={styles.shirtTypeGrid}>
              {SHIRT_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`${styles.shirtTypeCard} ${selectedType === type.id ? styles.active : ''}`}
                >
                  <img src={type.image} className={styles.typeImage} alt={type.label} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            {/* Size Selection */}
            <div className={styles.sectionTitle}>
              <h2 className={styles.sectionText}>เลือกขนาดและจำนวน</h2>
            </div>

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
                  <div className={styles.summaryRow}>
                    <span>จำนวนเสื้อ:</span>
                    <strong>{getTotalQuantity()} ตัว</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>ราคาเสื้อ:</span>
                    <strong>{getTotalPrice().toLocaleString()} บาท</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>ค่าจัดส่ง:</span>
                    <strong>{getShippingCost().toLocaleString()} บาท</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>รวมทั้งหมด:</span>
                    <strong className={styles.totalPrice}>{getGrandTotal().toLocaleString()} บาท</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <button 
              className={styles.btnPrimaryOrder}
              onClick={handleSubmit}
              disabled={!selectedType || getTotalQuantity() === 0}
            >
              🛒 สั่งซื้อเลย {getTotalQuantity() > 0 ? `(${getGrandTotal().toLocaleString()} บาท)` : ''}
            </button>

            <button 
              className={styles.btnSecondaryOrder}
              onClick={() => router.push('/order')}
            >
              ← กลับไปแก้ไขข้อมูล
            </button>
          </div>

          {/* Info Box */}
          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>ℹ️</div>
            <div className={styles.infoContent}>
              <h3 className={styles.infoTitle}>ข้อมูลสำคัญ</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>ราคา:</strong> {PRICE_PER_SHIRT} บาทต่อตัว
                </div>
                <div className={styles.infoItem}>
                  <strong>การชำระเงิน:</strong> โอนเงินผ่านบัญชีธนาคาร
                </div>
                <div className={styles.infoItem}>
                  <strong>การจัดส่ง:</strong> ค่าจัดส่งตัวแรก {BASE_SHIPPING} บาท ตัวถัดไป {ADDITIONAL_SHIPPING} บาท
                </div>
              </div>
              <p className={styles.infoNote}>
                หลักฐานการจ่ายเงินต้องได้รับการตรวจสอบก่อนดำเนินการจัดส่ง ระบบจะไม่สามารถยกเลิกคำสั่งซื้อได้หลังจากชำระเงินแล้ว 
                (วิธีการโอนเงินจะแสดงในขั้นตอนถัดไป) จำเป็นต้องโอนเงิน ภายใน 243 ปี 
                โอนมากหรือน้อยกว่าราคาจะไม่ได้รับการยืนยันคำสั่งซื้อทันใจ
              </p>
            </div>
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
              <div className={styles.pricingRow}>
                <span>จำนวนรวม:</span>
                <strong>{getTotalQuantity()} ตัว</strong>
              </div>
              <div className={styles.pricingRow}>
                <span>ราคาเสื้อ:</span>
                <strong>฿{getTotalPrice().toLocaleString()}</strong>
              </div>
              <div className={styles.pricingRow}>
                <span>ค่าจัดส่ง:</span>
                <strong>฿{getShippingCost().toLocaleString()}</strong>
              </div>
              <div className={styles.pricingRow}>
                <span>ราคารวมทั้งหมด:</span>
                <strong className={styles.totalPrice}>฿{getGrandTotal().toLocaleString()}</strong>
              </div>
            </div>

            <div className={styles.modalButtons}>
              <button className={styles.confirmBtn} onClick={handleConfirmOrder}>
                ยืนยันสั่งซื้อ
              </button>
              <button className={styles.cancelBtn} onClick={handleCancelOrder}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}