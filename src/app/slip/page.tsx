"use client";

import { useState } from "react";
import styles from "./SlipPage.module.css";

export default function SlipPage() {
  const [file, setFile] = useState(null);

  const handleUpload = (e: any) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>อัปโหลดสลิปการโอนเงิน</h1>

      <p className={styles.desc}>
        กรุณาอัปโหลดหลักฐานการชำระเงิน เพื่อยืนยันคำสั่งซื้อของคุณ
      </p>

      <div className={styles.uploadBox}>
        <input type="file" onChange={handleUpload} accept="image/*" />

        {file && (
          <div className={styles.preview}>
            <img src={URL.createObjectURL(file)} alt="slip preview" />
          </div>
        )}
      </div>

      <button className={styles.confirmBtn}>
        ยืนยันการสั่งซื้อ
      </button>
    </div>
  );
}
