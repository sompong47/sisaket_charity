'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import Link from 'next/link';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // State สำหรับ Modal แจ้งชำระเงิน
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [slipFile, setSlipFile] = useState<string | null>(null); // เก็บรูป Base64
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token) { router.push('/login'); return; }
        if (userData) setUser(JSON.parse(userData));

        const { data } = await api.get('/api/orders/my-orders');
        setOrders(data.data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Helper: แปลงไฟล์รูปเป็น Base64 Code
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // เช็คขนาดไฟล์ (อย่าเกิน 5MB เดี๋ยว Database เต็ม)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ รูปภาพต้องมีขนาดไม่เกิน 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันส่งข้อมูลชำระเงิน
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipFile) return alert('กรุณาแนบรูปสลิป');

    setUploading(true);
    try {
      await api.put(`/api/orders/${selectedOrderId}/pay`, {
        slipImage: slipFile,
        paymentDate: new Date().toISOString().split('T')[0], // วันที่ปัจจุบัน
        paymentTime: new Date().toTimeString().split(' ')[0] // เวลาปัจจุบัน
      });

      alert('✅ แจ้งชำระเงินเรียบร้อย!');
      setShowModal(false);
      setSlipFile(null);
      // รีโหลดหน้าเพื่ออัปเดตสถานะ
      window.location.reload();
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.response?.data?.message);
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string, hasSlip: boolean) => {
    if (status === 'pending' && hasSlip) return { bg: '#17a2b8', text: 'รอตรวจสอบ' };
    switch(status) {
        case 'paid': return { bg: '#28a745', text: 'ชำระเงินแล้ว' };
        case 'shipped': return { bg: '#007bff', text: 'จัดส่งแล้ว' };
        default: return { bg: '#ffc107', text: 'รอชำระเงิน' };
    }
  };

  return (
    <div className="orders-page-wrapper">
      <style jsx global>{`
        .orders-page-wrapper { min-height: 100vh; background: #f4f6f9; padding: 80px 20px; font-family: 'Prompt', sans-serif; }
        .container { max-width: 800px; margin: 0 auto; }
        .page-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px; }
        
        .order-card { background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 5px solid #007bff; }
        .order-header { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; color: #666; font-size: 0.9rem; }
        .order-items { margin-bottom: 15px; }
        .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; color: #333; }
        
        .order-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #eee; }
        .total-price { font-size: 1.2rem; font-weight: bold; color: #007bff; }
        .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; color: white; font-weight: bold; }
        
        .btn-pay { background: #ffc107; color: #333; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .btn-pay:hover { background: #e0a800; }

        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; }
        .modal-content { background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 400px; text-align: center; }
        .file-upload-box { border: 2px dashed #ccc; padding: 20px; margin: 20px 0; border-radius: 10px; cursor: pointer; position: relative; }
        .file-upload-box:hover { border-color: #007bff; background: #f8f9fa; }
        .preview-img { max-width: 100%; max-height: 200px; border-radius: 5px; margin-top: 10px; }
        .btn-submit { width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; }
        .btn-close { background: transparent; border: none; color: #999; position: absolute; top: 15px; right: 15px; font-size: 1.5rem; cursor: pointer; }
      `}</style>

      <div className="container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 className="page-title">📦 ประวัติการสั่งซื้อของฉัน</h1>
            <button onClick={() => router.push('/')} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#666'}}>← กลับหน้าหลัก</button>
        </div>

        {loading ? (
          <p style={{textAlign: 'center'}}>กำลังโหลดข้อมูล...</p>
        ) : orders.length === 0 ? (
          <div style={{textAlign: 'center', padding: 50, color: '#888'}}>
             <h2>ยังไม่มีรายการสั่งซื้อ</h2>
             <Link href="/order" style={{color: '#007bff'}}>ไปสั่งซื้อสินค้ากันเถอะ</Link>
          </div>
        ) : (
          orders.map((order: any) => {
            const hasSlip = order.payment?.slipUrl ? true : false;
            const statusInfo = getStatusBadge(order.status, hasSlip);
            
            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span>#{order.orderNumber}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('th-TH')}</span>
                </div>

                <div className="order-items">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="item-row">
                      <span>{item.productName} ({item.size}) x{item.quantity}</span>
                      <span>฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                   <div>
                        <span className="status-badge" style={{background: statusInfo.bg}}>
                            {statusInfo.text}
                        </span>
                        {hasSlip && order.status === 'pending' && <div style={{fontSize: '12px', color: '#17a2b8', marginTop: 5}}>แนบสลิปแล้ว รอตรวจสอบ</div>}
                   </div>

                   <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                      <span className="total-price">฿{order.totalAmount.toLocaleString()}</span>
                      
                      {/* แสดงปุ่มแจ้งชำระเงิน ถ้าสถานะเป็น pending และยังไม่มีสลิป */}
                      {order.status === 'pending' && !hasSlip && (
                          <button 
                            className="btn-pay"
                            onClick={() => {
                                setSelectedOrderId(order._id);
                                setShowModal(true);
                            }}
                          >
                            💸 แจ้งโอน
                          </button>
                      )}
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal แจ้งชำระเงิน */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            <h2>แจ้งชำระเงิน</h2>
            <p style={{color: '#666', fontSize: '14px', marginBottom: 20}}>กรุณาแนบรูปสลิปการโอนเงิน</p>

            <form onSubmit={handleSubmitPayment}>
                <div className="file-upload-box">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0, cursor: 'pointer'}}
                    />
                    {!slipFile ? (
                        <div style={{color: '#aaa'}}>
                           📂 คลิกเพื่อเลือกรูปภาพ
                        </div>
                    ) : (
                        <img src={slipFile} alt="Preview" className="preview-img" />
                    )}
                </div>

                <button type="submit" className="btn-submit" disabled={uploading}>
                    {uploading ? 'กำลังส่งข้อมูล...' : 'ยืนยันการแจ้งโอน'}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}