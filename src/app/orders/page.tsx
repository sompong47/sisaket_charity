"use client";
import "./orders.css";

export default function OrdersPage() {
  return (
    <div className="orders-container">

      <header className="orders-header">
        <h1>🔄 ประวัติการสั่งซื้อเสื้อ</h1>
        <p className="subtitle">รายการคำสั่งซื้อเสื้อเฉลิมฉลองเมือง 243 ปี</p>

        <button className="btn-primary top-button">
          ➕ สั่งซื้อเสื้อใหม่
        </button>
      </header>

      {/* การ์ดสรุป 4 ช่อง */}
      <section className="summary-cards">

        <div className="card purple">
          <h2>0</h2>
          <p>คำสั่งซื้อทั้งหมด</p>
        </div>

        <div className="card green">
          <h2>0</h2>
          <p>เสื้อที่สั่งทั้งหมด</p>
        </div>

        <div className="card blue">
          <h2>฿0</h2>
          <p>ยอดรวมที่จ่าย</p>
        </div>

        <div className="card orange">
          <h2>0</h2>
          <p>สถานะที่หลากหลาย</p>
        </div>
      </section>

      {/* รายการคำสั่งซื้อ */}
      <section className="orders-list">
        <h2 className="list-title">📋 รายการคำสั่งซื้อ</h2>

        <div className="no-orders-box">
          <div className="no-orders-icon">📦</div>
          <h3>ยังไม่มีประวัติการสั่งซื้อ</h3>
          <p>เมื่อคุณสั่งซื้อเสื้อแล้ว ประวัติจะเเสดงที่นี่</p>
          <button className="btn-primary"><a href="/">➕ สั่งซื้อเสื้อเลย</a></button>
        </div>
      </section>

      <footer className="footer">
        <p>พัฒนาโดย</p>
        <p className="dev-name">นาย สมพง ใยคำ</p>
        <p className="dev-name">นาย สุพัน ชัยนอก</p>
        <p className="dev-name">นาย สรรพสิทธิ์ ยาเคน</p>
        
        <p>PS Intelligent Unit - มหาวิทยาลัยราชภัฏศรีสะเกษ</p>
      </footer>
      
    </div>
  );
}
