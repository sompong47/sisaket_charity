"use client";

import "./styles.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="container">
      {/* ส่วนบน */}
      <section className="top-section">
        <div className="poster-box">
          <img src="/shirt_243_black.jpg" alt="เสื้อฉลองเมือง 243 ปี" />
          <span className="tag">ราคา 199฿</span>
        </div>

        <div className="info-box">
          <h1>เสื้อเฉลิมฉลองเมือง 243 ปี</h1>
          <p>
            โครงการจัดทำเสื้อเพื่อเฉลิมฉลองประวัติศาสตร์ของเมืองที่มีความสำคัญทางวัฒนธรรม
            เพื่อให้ประชาชนร่วมกันภาคภูมิใจใน "เมือง 243 ปี"
          </p>

          {/* ปุ่มไปหน้า order */}
          <button className="btn-buy" onClick={() => router.push("/order")}>
            🛒 สั่งซื้อเสื้อเลย!
          </button>
        </div>

        <div className="side-stats">
          <div className="card pink">
            <p>จำนวนการผลิต</p>
            <h3>30,777 ตัว</h3>
          </div>
          <div className="card purple">
            <p>ยอดจองรวม</p>
            <h3>1,829 รายการ</h3>
          </div>
        </div>
      </section>

      {/* ข้อมูลสินค้า */}
      <section
        className="summary-section"
        style={{ fontSize: "0.85rem", padding: "8px 0" }}
      >
        <h2 style={{ fontSize: "1rem", margin: "0 0 8px 0" }}>
          เลือกดูข้อมูลแต่ละแบบ
        </h2>

        <div
          className="summary-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "8px",
          }}
        >
          <div
            className="summary-box green"
            style={{ padding: "8px", borderRadius: "6px" }}
          >
            <p style={{ margin: 0, fontSize: "0.75rem" }}>ยอดขายรวม</p>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>26,718 ตัว</h3>
          </div>

          <div
            className="summary-box teal"
            style={{ padding: "8px", borderRadius: "6px" }}
          >
            <p style={{ margin: 0, fontSize: "0.75rem" }}>จำนวนออเดอร์</p>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>1,486 รายการ</h3>
          </div>
        </div>
      </section>

      {/* สถิติไซซ์ */}
      <section className="stats-section">
        <h1>📊 สถิติไซซ์ที่ขายดี</h1>
        <div className="bar-list">
          {[
            ["M", 9811],
            ["L", 9027],
            ["XL", 5448],
            ["2XL", 2002],
            ["3XL", 1233],
            ["4XL", 875],
            ["S", 817],
            ["5XL", 381],
            ["6XL", 106],
            ["7XL", 63],
            ["8XL", 31],
          ].map(([size, val]) => (
            <div key={size} className="bar-item">
              <span>{size}</span>
              <div className="bar">
                <div
                  className="bar-fill"
                  style={{ width: `${(Number(val) / 9811) * 100}%` }}
                ></div>
              </div>
              <span className="bar-val">{val.toLocaleString()} ตัว</span>
            </div>
          ))}
        </div>
      </section>

      {/* ปุ่มสั่งซื้อ */}
      <section className="cta-section">
        <h2>พร้อมสั่งซื้อแล้วหรือยัง?</h2>
        <p>มีจำนวนจำกัด รีบจองก่อนสินค้าหมดนะครับ!</p>

        {/* ปุ่มไปหน้า order */}
        <button className="btn-order" onClick={() => router.push("/order")}>
          🛍️ สั่งซื้อเลย
        </button>
      </section>
    </main>
  );
}
