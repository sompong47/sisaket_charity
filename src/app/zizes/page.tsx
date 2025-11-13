'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FormData } from '../order/app';
import styles from './zizes.module.css';

interface ZizesPageProps {
  customerData?: FormData | null;
  onBack?: () => void;
}

export default function ZizesPage({ customerData, onBack }: ZizesPageProps) {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<'traditional' | 'polo' | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    SSS: 0, SS: 0, S: 0,
    M: 0, L: 0, XL: 0,
    '2XL': 0, '3XL': 0, '4XL': 0,
    '5XL': 0, '6XL': 0, '7XL': 0,
    '8XL': 0, '9XL': 0, '10XL': 0
  });

  const sizes = [
    ['SSS', 'SS', 'S'],
    ['M', 'L', 'XL'],
    ['2XL', '3XL', '4XL'],
    ['5XL', '6XL', '7XL'],
    ['8XL', '9XL', '10XL']
  ];

  const handleQuantityChange = (size: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, prev[size] + delta)
    }));
  };

  const getTotalQuantity = () =>
    Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const getTotalPrice = () => getTotalQuantity() * 198;

  const handleSubmit = () => {
    if (!selectedType) {
      alert('กรุณาเลือกแบบเสื้อ');
      return;
    }
    if (getTotalQuantity() === 0) {
      alert('กรุณาเลือกขนาดและจำนวนเสื้อ');
      return;
    }

    const selectedSizes = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size, qty]) => `${size}: ${qty} ตัว`)
      .join(', ');

    alert(`✅ สั่งซื้อสำเร็จ!
แบบ: ${selectedType === 'traditional' ? 'แบบดั้งเดิม' : 'แบบโปโล'}
ขนาด: ${selectedSizes}
จำนวนรวม: ${getTotalQuantity()} ตัว
ราคารวม: ${getTotalPrice()} บาท`);

    // สมมติไปหน้าชำระเงิน
    // router.push('/payment');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>สั่งซื้อเสื้อเฉลิมฉลองเมือง 243 ปี</h1>
      </div>

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

      <div className={styles.wrapper}>
        {/* ซ้าย: รูปสินค้า + ข้อมูล */}
        <div className={styles.leftSection}>
          <img src="/sisaket.jpg" alt="เสื้อเฉลิมฉลอง 243 ปี" className={styles.productImage} />
          <div className={styles.infoBox}>
            <h3>รายละเอียดราคา</h3>
            <p>• ราคาต่อตัว 198 บาท</p>
            <p>• ค่าส่งตัวแรก 50 บาท</p>
            <p>• ตัวถัดไปเพิ่มตัวละ 10 บาท</p>
          </div>
        </div>

        {/* ขวา: เลือกรูปแบบและขนาด */}
        <div className={styles.rightSection}>
          <h2 className={styles.sectionTitle}>เลือกรูปแบบเสื้อ</h2>

          <div className={styles.shirtTypeGrid}>
            <button
              className={`${styles.shirtTypeCard} ${selectedType === 'traditional' ? styles.active : ''}`}
              onClick={() => setSelectedType('traditional')}
            >
              เสื้อแบบดั้งเดิม 243 ปี
            </button>

            <button
              className={`${styles.shirtTypeCard} ${selectedType === 'polo' ? styles.active : ''}`}
              onClick={() => setSelectedType('polo')}
            >
              เสื้อโปโล
            </button>
          </div>

          <h2 className={styles.sectionTitle}>เลือกขนาดและจำนวน</h2>

          <div className={styles.sizeSelection}>
            {sizes.map((row, i) => (
              <div key={i} className={styles.sizeRow}>
                {row.map(size => (
                  <div key={size} className={styles.sizeItem}>
                    <span>{size}</span>
                    <div className={styles.qtyControl}>
                      <button onClick={() => handleQuantityChange(size, -1)}>-</button>
                      <input value={quantities[size]} readOnly />
                      <button onClick={() => handleQuantityChange(size, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <p>จำนวนทั้งหมด: <strong>{getTotalQuantity()} ตัว</strong></p>
            <p>ราคารวม: <strong>{getTotalPrice()} บาท</strong></p>
          </div>

          <button className={styles.submitButton} onClick={handleSubmit}>
            🛒 สั่งซื้อเลย ({getTotalPrice()} บาท)
          </button>

          <button className={styles.backButton} onClick={() => router.push('/order')}>
            ← กลับไปหน้ากรอกข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
