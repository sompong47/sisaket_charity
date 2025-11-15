'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import styles from './zizes.module.css';

// ==================== TYPES ====================
interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  acceptMarketing: boolean;
}

interface ZizesPageProps {
  customerData?: FormData | null;
  onBack?: () => void;
  onOrderComplete?: (orderData: any) => void;
}

type ShirtType = 'traditional' | 'polo' | null;
type Quantities = { [key: string]: number };

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

const SHIRT_TYPES = [
  { id: 'traditional', label: 'เสื้อสีปกติ', image: '/ssk1.jpg' },
  { id: 'polo', label: 'เสื้อไว้ทุกข์', image: '/ssk.jpg' }
] as const;

const SLIDER_IMAGES = [
  { src: '/gf.jpg', alt: 'รูปที่ 1' },
  { src: '/ssk2.jpg', alt: 'รูปที่ 2' },
  { src: '/sisaket2.jpg', alt: 'รูปที่ 3' }
];

// ==================== HELPER FUNCTIONS ====================
const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD${year}${month}${day}${random}`;
};

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('th-TH', options);
};

// ==================== MAIN COMPONENT ====================
export default function ZizesPage({ customerData, onBack, onOrderComplete }: ZizesPageProps) {
  const router = useRouter();

  // State
  const [selectedType, setSelectedType] = useState<ShirtType>(null);
  const [quantities, setQuantities] = useState<Quantities>({
    SSS: 0, SS: 0, S: 0, M: 0, L: 0, XL: 0,
    "2XL": 0, "3XL": 0, "4XL": 0, "5XL": 0,
    "6XL": 0, "7XL": 0, "8XL": 0, "9XL": 0, "10XL": 0,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ===================================
  // 🔒 ล็อก scroll เมื่อเปิด Modal
  // ===================================
  useEffect(() => {
    let scrollY = 0;

    if (showConfirmModal) {
      scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      scrollY = parseInt(document.body.style.top || "0") * -1;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    }
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

  const handleSubmit = (): void => {
    if (!selectedType) {
      alert('กรุณาเลือกแบบเสื้อ');
      return;
    }

    if (getTotalQuantity() === 0) {
      alert('กรุณาเลือกขนาดและจำนวนเสื้อ');
      return;
    }

    // แสดง Modal ยืนยัน
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = (): void => {
    const shirtTypeLabel = SHIRT_TYPES.find(t => t.id === selectedType)?.label || '';

    // สร้างข้อมูลคำสั่งซื้อครบชุด
    const orderData = {
      orderNumber: generateOrderNumber(),
      customerName: customerData ? `${customerData.firstName} ${customerData.lastName}` : 'สมชัย จงรัมย์',
      phone: customerData?.phone || '0984567897',
      email: customerData?.email || 'somjai422@gmail.com',
      address: customerData?.address || 'hghghghghghgh',
      shirtType: shirtTypeLabel,
      sizes: getSelectedSizes(),
      totalQuantity: getTotalQuantity(),
      shirtPrice: getTotalPrice(),
      shippingCost: getShippingCost(),
      grandTotal: getGrandTotal(),
      orderDate: formatDate(new Date())
    };

    // ปิด modal
    setShowConfirmModal(false);

    // 🔥 บันทึกข้อมูลลง localStorage
    try {
      localStorage.setItem('orderData', JSON.stringify(orderData));
      
      // ถ้ามี callback ให้ส่งให้ callback
      if (onOrderComplete) {
        onOrderComplete(orderData);
      }
      
      // เปลี่ยนหน้าไป /slip
      router.push('/slip');
      
    } catch (error) {
      console.error('Error saving order data:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleCancelOrder = (): void => {
    setShowConfirmModal(false);
  };

  const handleBackClick = (): void => {
    if (onBack) {
      onBack();
    } else {
      router.push('/order');
    }
  };

  // ==================== RENDER HELPERS ====================
  const renderHeader = () => (
    <div className={styles.header}>
      <h1 className={styles.pageTitle}>สั่งซื้อเสื้อเฉลิมฉลองเมือง 243 ปี</h1>
    </div>
  );

  const renderStepsNav = () => (
    <div className={styles.stepsNav}>
      <div className={styles.step}>
        <div className={styles.stepNumber}>1</div>
        <span>ข้อมูลผู้สั่งซื้อ</span>
      </div>
      <div className={`${styles.step} ${styles.stepActive}`}>
        <div className={styles.stepNumber}>2</div>
        <span>เลือกแบบและขนาดเสื้อ</span>
      </div>
    </div>
  );

  const renderImageSlider = () => (
    <div className={styles.leftSection}>
      <div className={styles.imageSlider}>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
        >
          {SLIDER_IMAGES.map((image, index) => (
            <SwiperSlide key={index}>
              <img 
                src={image.src} 
                className={styles.sliderImage} 
                alt={image.alt} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );

  const renderPriceBox = () => (
    <div className={styles.priceBox}>
      <h3 className={styles.priceBoxTitle}>รูปแบบสินค้า</h3>
      <div className={styles.priceGrid}>
        <div className={styles.priceItem}>
          <strong>ราคา:</strong> {PRICE_PER_SHIRT} บาท/ตัว
        </div>
        <div className={styles.priceItem}>
          <strong>ส่วนลดรวม:</strong> 1 ตัว
        </div>
        <div className={styles.priceItem}>
          <strong>รวมทั้งหมด:</strong> {PRICE_PER_SHIRT} บาท
        </div>
        <div className={styles.priceItem}>
          <strong>ค่าจัดส่ง:</strong> {BASE_SHIPPING} บาท
        </div>
      </div>
    </div>
  );

  const renderShirtTypeSelection = () => (
    <>
      <h2 className={styles.sectionTitle}>เลือกรูปแบบเสื้อ</h2>
      <div className={styles.shirtTypeGrid}>
        {SHIRT_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id as 'traditional' | 'polo')}
            className={`${styles.shirtTypeCard} ${
              selectedType === type.id ? styles.active : ''
            }`}
          >
            <img 
              src={type.image} 
              className={styles.typeImage} 
              alt={type.label} 
            />
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </>
  );

  const renderSizeSelection = () => (
    <>
      <h2 className={styles.sectionTitle}>เลือกขนาดและจำนวน</h2>
      <div className={styles.sizeSelection}>
        {SIZES.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.sizeRow}>
            {row.map(size => (
              <div key={size} className={styles.sizeItem}>
                <span className={styles.sizeLabel}>{size}</span>
                <div className={styles.qtyControl}>
                  <button onClick={() => handleQuantityChange(size, -1)}>
                    -
                  </button>
                  <input 
                    type="text" 
                    readOnly 
                    value={quantities[size]} 
                  />
                  <button onClick={() => handleQuantityChange(size, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );

  const renderSummary = () => {
    if (getTotalQuantity() === 0) return null;

    return (
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
            <strong>{getGrandTotal().toLocaleString()} บาท</strong>
          </div>
        </div>
      </div>
    );
  };

  const renderButtons = () => (
    <>
      <button 
        className={styles.submitButton} 
        onClick={handleSubmit}
        disabled={!selectedType || getTotalQuantity() === 0}
      >
        🛒 สั่งซื้อเลย {getTotalQuantity() > 0 ? `(${getGrandTotal().toLocaleString()} บาท)` : ''}
      </button>

      <button className={styles.backButton} onClick={handleBackClick}>
        ← กลับไปหน้าแก้ไขข้อมูล
      </button>
    </>
  );

  const renderInfoBox = () => (
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
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className={`${styles.container} ${showConfirmModal ? styles["no-scroll-container"] : ""}`}>
      {renderHeader()}
      {renderStepsNav()}

      <div className={styles.wrapper}>
        {renderImageSlider()}

        <div className={styles.rightSection}>
          {renderPriceBox()}
          {renderShirtTypeSelection()}
          {renderSizeSelection()}
          {renderSummary()}
          {renderButtons()}
          {renderInfoBox()}
        </div>
      </div>

      {/* Modal ยืนยันการสั่งซื้อ */}
      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={handleCancelOrder}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>❓</div>
            <h2 className={styles.modalTitle}>ยืนยันการสั่งซื้อ</h2>
            
            <div className={styles.modalInfo}>
              <p><strong>ชื่อ-นามสกุล:</strong> {customerData ? `${customerData.firstName} ${customerData.lastName}` : 'สมชัย จงรัมย์'}</p>
              <p><strong>โทรศัพท์:</strong> {customerData?.phone || '0984567897'}</p>
              <p><strong>อีเมล:</strong> {customerData?.email || 'somjai422@gmail.com'}</p>
              <p><strong>ที่อยู่:</strong> {customerData?.address || 'hghghghghghgh'}</p>
              <p><strong>รูปแบบเสื้อ:</strong> {SHIRT_TYPES.find(t => t.id === selectedType)?.label}</p>
            </div>

            <div className={styles.modalSummary}>
              <h3>รายการสั่งซื้อ:</h3>
              <p>{getSelectedSizes()}</p>
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