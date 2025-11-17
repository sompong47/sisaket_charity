import styles from "./page.module.css";

export default function RegisterPage() {
  return (
    <main className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h1 className={styles.title}>ลงทะเบียนผู้ใช้งาน</h1>

        <form className={styles.registerForm}>
          <label className={styles.label}>ชื่อ - นามสกุล</label>
          <input className={styles.input} type="text" placeholder="กรอกชื่อ - นามสกุล" />

          <label className={styles.label}>เบอร์โทรศัพท์</label>
          <input className={styles.input} type="tel" placeholder="กรอกเบอร์โทรศัพท์" />

          <label className={styles.label}>รหัสผ่าน</label>
          <input className={styles.input} type="password" placeholder="ตั้งรหัสผ่าน" />

          <label className={styles.label}>ยืนยันรหัสผ่าน</label>
          <input className={styles.input} type="password" placeholder="กรอกรหัสผ่านอีกครั้ง" />

          <button type="submit" className={styles.btnSubmit}>
            ลงทะเบียน
          </button>
        </form>

        <p className={styles.loginText}>
          มีบัญชีอยู่แล้ว? <a className={styles.loginLink} href="/login">เข้าสู่ระบบ</a>
        </p>
      </div>
    </main>
  );
}
