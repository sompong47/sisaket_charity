'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './orderPage.module.css';

// ==================== INTERFACES ====================
interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  acceptMarketing: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

// ==================== SWIPER COMPONENTS ====================
interface SwiperProps {
  children: React.ReactNode;
}

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

interface SwiperSlideProps {
  children: React.ReactNode;
}

const SwiperSlide: React.FC<SwiperSlideProps> = ({ children }) => (
  <div className={styles.swiperSlide}>{children}</div>
);

// ==================== MAIN COMPONENT ====================
export default function OrderPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
    acceptMarketing: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);

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

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[-\s]/g, '');
    const phoneRegex = /^0\d{8,9}$/;
    return phoneRegex.test(cleaned);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'กรุณากรอกชื่อ';
    if (!formData.lastName.trim()) newErrors.lastName = 'กรุณากรอกนามสกุล';
    if (!formData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง';
    }
    if (!formData.address.trim()) newErrors.address = 'กรุณากรอกที่อยู่สำหรับจัดส่ง';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    console.log('📦 Form submitted:', formData);
    router.push('/zizes');
  };

  const handleGoHome = () => {
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
            <h1 className={styles.orderTitle}>สั่งซื้อเสื้อเฉลิมฉลองเมือง 243 ปี</h1>
          </div>

          {/* Steps Navigation */}
          <div className={styles.stepsNav}>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <div className={styles.stepNumber}>1</div>
              <span>ข้อมูลผู้สั่งซื้อ</span>
            </div>
            <div className={styles.step}>
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
              <SwiperSlide>
                <img src="/sisaket10.jpg" alt="เสื้อแบบที่ 1" className={styles.sliderImage} />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/sisaket4.jpg" alt="เสื้อแบบที่ 2" className={styles.sliderImage} />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/sisaket2.jpg" alt="เสื้อแบบที่ 3" className={styles.sliderImage} />
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Form Section */}
          <div className={styles.formSection}>
            <div className={styles.formContent}>
              {/* Section Title */}
              <div className={styles.sectionTitle}>
                <h2 className={styles.sectionText}>ข้อมูลผู้สั่งซื้อ</h2>
              </div>

              {/* Name Fields */}
              <div className={styles.fieldGroup}>
                <div className={styles.fieldWrapper}>
                  <label className={styles.label}>
                    ชื่อ <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="ชื่อจริง"
                    className={errors.firstName ? styles.inputError : styles.input}
                  />
                  {errors.firstName && <p className={styles.errorText}>{errors.firstName}</p>}
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.label}>
                    นามสกุล <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="นามสกุล"
                    className={errors.lastName ? styles.inputError : styles.input}
                  />
                  {errors.lastName && <p className={styles.errorText}>{errors.lastName}</p>}
                </div>
              </div>

              {/* Phone */}
              <div className={styles.fieldWrapper}>
                <label className={styles.label}>
                  เบอร์โทรศัพท์ <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08x-xxx-xxxx"
                  className={errors.phone ? styles.inputError : styles.input}
                />
                {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className={styles.fieldWrapper}>
                <label className={styles.label}>อีเมล</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={styles.input}
                />
              </div>

              {/* Address */}
              <div className={styles.fieldWrapper}>
                <label className={styles.label}>
                  ที่อยู่สำหรับจัดส่ง <span className={styles.required}>*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="ที่อยู่ สำหรับจัดส่ง"
                  className={errors.address ? styles.textareaError : styles.textarea}
                />
                {errors.address && <p className={styles.errorText}>{errors.address}</p>}
              </div>

              {/* Note */}
              <div className={styles.fieldWrapper}>
                <label className={styles.label}>หมายเหตุ</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={2}
                  placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                  className={styles.textarea}
                />
              </div>

              {/* Checkbox */}
              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  name="acceptMarketing"
                  id="acceptMarketing"
                  checked={formData.acceptMarketing}
                  onChange={(e) => {
                    handleChange(e);
                    setShowDeliveryInfo(e.target.checked);
                  }}
                  className={styles.checkbox}
                />
                <label htmlFor="acceptMarketing" className={styles.checkboxLabel}>
                  ต้องการให้จัดส่งเสื้อทางไปรษณีย์
                  <span className={styles.checkboxNote}>
                    หากไม่เลือก ท่านจะต้องซื้อด้วยตนเอง
                  </span>
                </label>
              </div>

              {showDeliveryInfo && (
                <div className={styles.deliveryInfoBox}>
                  <strong>กรุณาตรวจสอบที่อยู่ให้ถูกต้อง</strong>
                  <br />
                  เสื้อจะถูกจัดส่งภายใน 3–7 วันทำการหลังจากยืนยันการชำระเงิน
                </div>
              )}

              {/* Buttons */}
              <button 
                onClick={handleSubmit} 
                className={styles.btnPrimaryOrder}
                type="button"
              >
                ถัดไป: เลือกแบบและขนาดเสื้อ →
              </button>

              <button 
                type="button" 
                className={styles.btnSecondaryOrder}
                onClick={handleGoHome}
              >
                ← กลับสู่หน้าหลัก
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>ℹ️</div>
            <div className={styles.infoContent}>
              <h3 className={styles.infoTitle}>ข้อมูลสำคัญ</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>ราคา:</strong> 198 บาทต่อตัว
                </div>
                <div className={styles.infoItem}>
                  <strong>การชำระเงิน:</strong> โอนเงินผ่านบัญชีธนาคาร
                </div>
                <div className={styles.infoItem}>
                  <strong>การจัดส่ง:</strong> จัดส่งทั่วประเทศไทย ค่าจัดส่ง ตัวแรก 50 บาท ตัวถัดไปเพิ่มตัวละ 10 บาท
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
    </div>
  );
}