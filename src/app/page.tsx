"use client";

import "./globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [selectedType, setSelectedType] = useState('normal');
  const router = useRouter();

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="header-card">
          <div className="header-flex">
            <div>
              <h1 className="page-title">เสื้อเฉลิมฉลองเมือง 243 ปี</h1>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="main-grid">
          {/* Left Column - Product Image */}
          <div className="product-card">
            <div className="product-image">
              <img 
                src="/shirt_243_black.jpg" 
                alt="เสื้อฉลองเมือง 243 ปี"
              />
            </div>
            
            {/* Product Details */}
            <div className="product-details">
              <div className="price-row">
                <span className="price-label">ราคา</span>
                <span className="price-value">199 บาท</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Form */}
          <div className="order-column">
            {/* Order Button */}
            <button 
              className="btn-order-main"
              onClick={() => router.push('/order')}
            >
              สั่งซื้อเสื้อ
            </button>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card purple">
                <div className="stat-number">31619 ตัว</div>
                <div className="stat-label">เสื้อสีขาว (รอบที่สิน)</div>
              </div>
              
              <div className="stat-card teal">
                <div className="stat-number">1899 ออเดอร์</div>
                <div className="stat-label">จำนวนออเดอร์ (รอบที่สิน)</div>
              </div>
            </div>

            {/* Type Selection */}
            <div className="stats-card">
              <h3 className="stats-title">สถิติการขายเสื้อ</h3>
              
              {/* Tabs */}
              <div className="tab-buttons">
                <button 
                  onClick={() => setSelectedType('normal')}
                  className={`tab-btn ${selectedType === 'normal' ? 'active-blue' : 'inactive'}`}
                >
                  เสื้อสีขาว
                </button>
                <button 
                  onClick={() => setSelectedType('polo')}
                  className={`tab-btn ${selectedType === 'polo' ? 'active-gray' : 'inactive'}`}
                >
                  เสื้อโปโลดำ
                </button>
              </div>

              {/* Size Stats */}
              <div className="stats-info">
                {selectedType === 'normal' && (
                  <div className="info-box blue">
                    <div className="info-text">เสื้อสีขาว: 27328 ตัว</div>
                    <div className="info-text">จำนวนออเดอร์: 1520 รายการ</div>
                  </div>
                )}

                {selectedType === 'polo' && (
                  <div className="info-box gray">
                    <div className="info-text">เสื้อโปโลดำ: 4291 ตัว</div>
                    <div className="info-text">จำนวนออเดอร์: 379 รายการ</div>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="stats-card">
              <h3 className="size-section-title">
                จำนวนเสื้อแล้วเสาะได้ - {selectedType === 'normal' ? 'เสื้อสีขาว' : 'เสื้อโปโลดำ'}
              </h3>
              
              <div className="size-tags">
                {selectedType === 'normal' ? (
                  <>
                    <span className="size-tag blue">L: 8303 ตัว</span>
                    <span className="size-tag blue">2XL: 2057 ตัว</span>
                    <span className="size-tag blue">3XL: 655 ตัว</span>
                    <span className="size-tag blue">M: 6977 ตัว</span>
                    <span className="size-tag blue">S: 3693 ตัว</span>
                    <span className="size-tag blue">XL: 3277 ตัว</span>
                    <span className="size-tag blue">4XL: 799 ตัว</span>
                    <span className="size-tag blue">2XL: 1799 ตัว</span>
                    <span className="size-tag blue">3XL: 640 ตัว</span>
                    <span className="size-tag blue">5XL: 106 ตัว</span>
                    <span className="size-tag blue">6XL: 1 ตัว</span>
                  </>
                ) : (
                  <>
                    <span className="size-tag gray">2XL: 298 ตัว</span>
                    <span className="size-tag gray">3XL: 105 ตัว</span>
                    <span className="size-tag gray">M: 932 ตัว</span>
                    <span className="size-tag gray">XL: 706 ตัว</span>
                    <span className="size-tag gray">4XL: 129 ตัว</span>
                    <span className="size-tag gray">S: 829 ตัว</span>
                    <span className="size-tag gray">XL: 329 ตัว</span>
                    <span className="size-tag gray">L: 888 ตัว</span>
                    <span className="size-tag gray">6XL: 3 ตัว</span>
                    <span className="size-tag gray">4XL: 52 ตัว</span>
                    <span className="size-tag gray">10XL: 1 ตัว</span>
                    <span className="size-tag gray">8XL: 4 ตัว</span>
                    <span className="size-tag gray">7XL: 3 ตัว</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="footer-card">
          <p className="footer-text footer-title">พัฒนาโดย</p>
          <p className="footer-text">นักศึกษามหาวิทยาลัยราชภัฏศรีสะเกษ</p>
          <div className="footer-names">
            <p className="footer-text footer-small">นาย สมพง ใยคำ 6612732131</p>
            <p className="footer-text footer-small">นาย สุพัน ชัยนอก 6612732136</p>
            <p className="footer-text footer-small">นาย สรรพสิทธิ์ ยาเคน 6612732132</p>
          </div>
        </div>
      </div>
    </div>
  );
}