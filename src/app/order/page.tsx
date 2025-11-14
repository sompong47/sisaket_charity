'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
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

// ==================== MAIN COMPONENT ====================
export default function Page() {
  // State Management
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

  // ==================== VALIDATION ====================
  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[-\s]/g, '');
    const phoneRegex = /^0\d{8,9}$/;
    return phoneRegex.test(cleaned);
  };

  // ==================== HANDLERS ====================
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    // Validate required fields
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
      return;
    }

    // Submit form
    console.log('📦 Form submitted:', formData);
    window.location.href = '/zizes';
  };

  // ==================== RENDER ====================
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>สั่งซื้อเสื้อเฉลิมฉลองเมือง 243 ปี</h1>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          {/* Steps Navigation */}
          <div className={styles.stepsNav}>
            <div className={styles.step + ' ' + styles.stepActive}>
              <div className={styles.stepNumber}>1</div>
              <span>ข้อมูลผู้สั่งซื้อ</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <span>เลือกแบบและขนาดเสื้อ</span>
            </div>
          </div>

          <div className={styles.wrapper}>
            {/* Image Slider */}
            <div className={styles.imageSlider}>
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
              >
                <SwiperSlide>
                  <img src="/gf.jpg" alt="เสื้อแบบที่ 1" className={styles.sliderImage} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/ssk2.jpg" alt="เสื้อแบบที่ 2" className={styles.sliderImage} />
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
                  <div className={styles.sectionIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h2 className={styles.sectionText}>ข้อมูลผู้สั่งซื้อ</h2>
                </div>

                {/* First & Last Name */}
                <div className={styles.fieldGroup}>
                  <div>
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

                  <div>
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

                {/* Checkbox for Delivery */}
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    name="acceptMarketing"
                    id="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
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

                  {/* Delivery Info Message */}
                  {showDeliveryInfo && (
                    <div className={styles.deliveryInfoBox}>
                       <strong>กรุณาตรวจสอบที่อยู่ให้ถูกต้อง</strong>
                      <br />
                      เสื้อจะถูกจัดส่งภายใน 3–7 วันทำการหลังจากยืนยันการชำระเงิน
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button onClick={handleSubmit} className={styles.buttonBlue}>
                  ถัดไป: เลือกแบบและขนาดเสื้อ
                </button>

                {/* Secondary Button */}
                <button
                  className={styles.buttonSecondary}
                  onClick={() => alert('กลับสู่หน้าหลัก')}
                  type="button"
                >
                  ← กลับสู่หน้าหลัก
                </button>
              </div>
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