'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './slippage.module.css';
import Image from "next/image";

// ==================== TYPES ====================
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
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);

  // =============== Load LocalStorage ===============
  useEffect(() => {
    try {
      const data = localStorage.getItem("orderData");
      if (!data) {
        router.push("/");
        return;
      }
      setOrderData(JSON.parse(data));
    } catch (error) {
      router.push("/");
    }
  }, []);

  if (!orderData) {
    return <div className={styles.loading}>กำลังโหลดข้อมูล...</div>;
  }

  // ==================== HANDLERS ====================
  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText('123-4-56789-0');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('ไม่สามารถคัดลอกได้');
    }
  };

  const handleDownloadSlip = async () => {
    try {
      const useScreenshot = window.confirm(
        '🎯 เพื่อความคมชัดสูงสุด แนะนำให้ใช้:\n\n' +
        '✅ Windows: กด Win + Shift + S\n' +
        '✅ Mac: กด Cmd + Shift + 4\n' +
        '✅ Chrome: กด F12 > Ctrl+Shift+P > "Capture node screenshot"\n\n' +
        'คลิก OK เพื่อบันทึกด้วย html2canvas (อาจเบลอเล็กน้อย)\n' +
        'คลิก Cancel เพื่อใช้ Screenshot แทน'
      );

      if (!useScreenshot) return;

      const slipElement = document.querySelector(`.${styles.slipCard}`) as HTMLElement;
      if (!slipElement) return;

      const images = slipElement.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(slipElement, {
        scale: 4,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `slip_${orderData.orderNumber}.png`;
        link.click();
        URL.revokeObjectURL(url);
        alert('✓ บันทึกสำเร็จ!\n\nหากรูปยังเบลอ แนะนำให้ใช้ Screenshot แทนนะครับ');
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ เกิดข้อผิดพลาด\nกรุณาใช้ Screenshot แทน:\n\n' +
            'Windows: Win + Shift + S\n' +
            'Mac: Cmd + Shift + 4');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // ==================== RENDER ====================
  return (
    <>
      {/* Main Header */}
      <div className={styles.mainHeader}>
        <h1 className={styles.mainHeaderTitle}>สั่งซื้อเสื้อเฉลิมฉลองเมือง 243 ปี</h1>
      </div>

      {/* Steps Navigation */}
      <div className={styles.stepsContainer}>
        <div className={styles.stepsWrapper}>
          <div className={styles.stepsNav}>
            <div className={`${styles.stepItem} ${styles.completed}`}>
              <div className={styles.stepNumber}>1</div>
              <span className={styles.stepText}>ข้อมูลผู้สั่งซื้อ</span>
            </div>
            <div className={`${styles.stepItem} ${styles.completed}`}>
              <div className={styles.stepNumber}>2</div>
              <span className={styles.stepText}>เลือกแบบและขนาดเสื้อ</span>
            </div>
            <div className={`${styles.stepItem} ${styles.active}`}>
              <div className={styles.stepNumber}>3</div>
              <span className={styles.stepText}>ชำระเงิน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
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
                  <span className={styles.sectionIcon}>👤</span> ข้อมูลผู้สั่งซื้อ
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
                  <span className={styles.sectionIcon}>🛒</span> รายละเอียดสินค้า
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
                <div className={styles.paymentTitle}>💳 ข้อมูลการชำระเงิน</div>
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
                  <Image
                    src="/qr.jpg"
                    alt="QR สำหรับชำระเงิน"
                    width={160}
                    height={160}
                    className={styles.qrImage}
                    unoptimized
                    quality={100}
                    priority
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={handleCopyAccount}>
                  {copied ? '✓ คัดลอกแล้ว' : '📋 คัดลอกเลขบัญชี'}
                </button>
                <button className={styles.secondaryButton} onClick={handleBackToHome}>
                  🏠 กลับหน้าหลัก
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
    </>
  );
}