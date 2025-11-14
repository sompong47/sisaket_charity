'use client';

import { useState } from 'react';
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

// ==================== MAIN COMPONENT ====================
export default function ZizesPage({ customerData, onBack }: ZizesPageProps) {
  const router = useRouter();

  // State
  const [selectedType, setSelectedType] = useState<ShirtType>(null);
  const [quantities, setQuantities] = useState<Quantities>({
    SSS: 0, SS: 0, S: 0, M: 0, L: 0, XL: 0,
    '2XL': 0, '3XL': 0, '4XL': 0, '5XL': 0,
    '6XL': 0, '7XL': 0, '8XL': 0, '9XL': 0, '10XL': 0
  });

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

    const shirtTypeLabel = SHIRT_TYPES.find(t => t.id === selectedType)?.label || '';

    alert(`✅ สั่งซื้อสำเร็จ!

แบบ: ${shirtTypeLabel}
ขนาด: ${getSelectedSizes()}
จำนวนรวม: ${getTotalQuantity()} ตัว
ราคารวม: ${getGrandTotal().toLocaleString()} บาท`);

    // router.push('/payment');
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
            <strong>การจัดส่ง:</strong> จัดส่งทั่วประเทศไทย ค่าจัดส่ง ตัวแรก {BASE_SHIPPING} บาท ตัวถัดไปเพิ่มตัวละ {ADDITIONAL_SHIPPING} บาท
          </div>
        </div>
        <p className={styles.infoNote}>
          หลักฐานการชำระเงินต้องได้รับการตรวจสอบก่อนดำเนินการจัดส่ง 
          ระบบจะไม่สามารถยกเลิกคำสั่งซื้อได้หลังจากชำระเงินแล้ว 
          (วิธีการโอนเงินจะแสดงในขั้นตอนถัดไป) จำเป็นต้องโอนเงิน ภายใน 243 ปี 
          โอนมากหรือน้อยกว่าราคาจะไม่ได้รับการยืนยันคำสั่งซื้อทันใจ
        </p>
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className={styles.container}>
      {renderHeader()}
      {renderStepsNav()}

      <div className={styles.wrapper}>
        {renderImageSlider()}

        <div className={styles.rightSection}>
          {renderShirtTypeSelection()}
          {renderSizeSelection()}
          {renderSummary()}
          {renderButtons()}
          {renderInfoBox()}
        </div>
      </div>
    </div>
  );
}