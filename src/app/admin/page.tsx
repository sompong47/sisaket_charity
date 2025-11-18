'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import styles from './adminpage.module.css';

// ==================== INTERFACES ====================
interface OrderItem {
  productName: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  payment?: {
    slipUrl?: string;
    isPaid?: boolean;
    paidAt?: string;
  };
  createdAt: string;
}

// ✅ Interface สำหรับสินค้า
interface Product {
  _id: string;
  productCode: string;
  name: string;
  description: string; // เพิ่มตรงนี้
  price: number;
  images: { url: string }[];
  sizes: { size: string; stock: number }[];
  isActive: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  
  // State UI
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'settings'>('dashboard');
  const [currentUser, setCurrentUser] = useState({ name: 'ผู้ดูแลระบบ' });
  const [loading, setLoading] = useState(true);

  // State Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // State Modal
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState('');
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState('');
  const [productForm, setProductForm] = useState({
    productCode: '', 
    name: '', 
    description: '', 
    price: 0,
    image: '', 
    stockS: 0, stockM: 0, stockL: 0, stockXL: 0, stock2XL: 0
  });

  // ================= LOAD DATA =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await api.get('/api/orders');
      setOrders(ordersRes.data.data || []);

      const productsRes = await api.get('/api/products/admin/all');
      setProducts(productsRes.data.data || []);

    } catch (error: any) {
      console.error("Fetch error", error);
      if (error.response?.status === 401) router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const savedUser = localStorage.getItem('user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ================= PRODUCT LOGIC =================
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.description.trim()) return alert('กรุณากรอกรายละเอียดสินค้า'); // เช็คก่อนส่ง
    if (!confirm(isEditing ? 'บันทึกการแก้ไข?' : 'ยืนยันเพิ่มสินค้า?')) return;

    const payload = {
      productCode: productForm.productCode,
      name: productForm.name,
      description: productForm.description, // ✅ ส่งค่านี้ไปด้วย
      price: Number(productForm.price),
      images: [{ url: productForm.image, isPrimary: true }],
      sizes: [
        { size: 'S', stock: Number(productForm.stockS) },
        { size: 'M', stock: Number(productForm.stockM) },
        { size: 'L', stock: Number(productForm.stockL) },
        { size: 'XL', stock: Number(productForm.stockXL) },
        { size: '2XL', stock: Number(productForm.stock2XL) },
      ],
      isActive: true
    };

    try {
      if (isEditing) {
        await api.put(`/api/products/${editProductId}`, payload);
      } else {
        await api.post('/api/products', payload);
      }
      alert('✅ บันทึกข้อมูลสำเร็จ');
      setShowProductModal(false);
      fetchData(); 
    } catch (error: any) {
      alert('❌ เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('⚠️ ลบสินค้านี้?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      alert('ลบสินค้าเรียบร้อย');
      fetchData();
    } catch (error) {
      alert('ลบไม่สำเร็จ');
    }
  };

  const openEditProduct = (p: Product) => {
    setIsEditing(true);
    setEditProductId(p._id);
    setProductForm({
      productCode: p.productCode,
      name: p.name,
      description: p.description || '', // ✅ ดึงข้อมูลเดิมมาใส่
      price: p.price,
      image: p.images[0]?.url || '',
      stockS: p.sizes.find(s => s.size === 'S')?.stock || 0,
      stockM: p.sizes.find(s => s.size === 'M')?.stock || 0,
      stockL: p.sizes.find(s => s.size === 'L')?.stock || 0,
      stockXL: p.sizes.find(s => s.size === 'XL')?.stock || 0,
      stock2XL: p.sizes.find(s => s.size === '2XL')?.stock || 0, // แก้ไซซ์ให้ตรง (2XL ไม่ใช่ 2xl)
    });
    setShowProductModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert('ไฟล์ใหญ่เกิน 5MB'); // กันไฟล์ใหญ่เกิน
      const reader = new FileReader();
      reader.onloadend = () => setProductForm(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  // ================= ORDER LOGIC =================
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!confirm('เปลี่ยนสถานะ?')) return;
    await api.put(`/api/orders/${id}`, { status: newStatus });
    fetchData();
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('ลบออเดอร์นี้?')) return;
    await api.delete(`/api/orders/${id}`);
    fetchData();
  };

  const getStatusBadge = (status: string) => {
    const map: any = { pending: '#ffc107', paid: '#28a745', shipped: '#007bff', cancelled: '#dc3545' };
    return { bg: map[status] || '#6c757d', text: status.toUpperCase() };
  };

  // Statistics
  const stats = {
    orders: orders.length,
    revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    pending: orders.filter(o => o.status === 'pending').length,
    products: products.length
  };

  if (loading) return <div className={styles.loading}>กำลังโหลดข้อมูล...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.animatedBg}></div>

      {/* Navigation */}
      <nav className={`${styles.topNavigation} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.navLogo}><span className={styles.logoText}> Admin Dashboard</span></div>
          <div className={styles.navMenu}>
            <button className={styles.userBtn} onClick={() => setShowDropdown(!showDropdown)}>
              <span className={styles.userAvatar}></span>
              <span className={styles.userText}>{currentUser.name}</span>
            </button>
            {showDropdown && (
              <div className={styles.userDropdown}>
                <button className={styles.dropdownItem} onClick={() => router.push('/')}>หน้าหลัก</button>
                <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={() => {
                   localStorage.clear(); router.push('/login');
                }}>ออกจากระบบ</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={styles.adminContent}>
        <div className={styles.adminContainer}>
          <div className={styles.adminHeader}><h1 className={styles.adminTitle}>ระบบจัดการร้านค้า</h1></div>

          <div className={styles.tabsContainer}>
            <button className={`${styles.tab} ${activeTab === 'dashboard' ? styles.tabActive : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
            <button className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`} onClick={() => setActiveTab('orders')}>คำสั่งซื้อ</button>
            <button className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`} onClick={() => setActiveTab('products')}>สินค้า</button>
          </div>

          {/* 🟢 TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className={styles.dashboardContent}>
              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statPrimary}`}><div><div className={styles.statValue}>{stats.orders}</div><div className={styles.statLabel}>คำสั่งซื้อทั้งหมด</div></div></div>
                <div className={`${styles.statCard} ${styles.statWarning}`}><div><div className={styles.statValue}>{stats.pending}</div><div className={styles.statLabel}>รอตรวจสอบ</div></div></div>
                <div className={`${styles.statCard} ${styles.statSuccess}`}><div><div className={styles.statValue}>฿{stats.revenue.toLocaleString()}</div><div className={styles.statLabel}>รายได้รวม</div></div></div>
                <div className={`${styles.statCard} ${styles.statInfoBox}`}><div><div className={styles.statValue}>{stats.products}</div><div className={styles.statLabel}>สินค้าในระบบ</div></div></div>
              </div>
            </div>
          )}

          {/* 🟡 TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className={styles.ordersContent}>
              <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
                  <thead><tr><th>Order ID</th><th>ลูกค้า</th><th>สลิป</th><th>ยอดรวม</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>#{order.orderNumber}</td>
                        <td>{order.customer.name}<br/>{order.customer.phone}</td>
                        <td>
                           {order.payment?.slipUrl ? (
                             <button onClick={() => { setSelectedSlip(order.payment!.slipUrl!); setShowSlipModal(true); }} style={{cursor:'pointer'}}>📄 ดูรูป</button>
                           ) : '-'}
                        </td>
                        <td>฿{order.totalAmount.toLocaleString()}</td>
                        <td>
                           <span style={{background: getStatusBadge(order.status).bg, padding: '2px 8px', borderRadius: '10px', color: 'white', fontSize: '12px'}}>
                             {getStatusBadge(order.status).text}
                           </span>
                        </td>
                        <td>
                           <select value={order.status} onChange={(e) => handleStatusUpdate(order._id, e.target.value)} style={{marginRight: 5}}>
                             <option value="pending">รอชำระ</option><option value="paid">ชำระแล้ว</option><option value="shipped">ส่งแล้ว</option><option value="cancelled">ยกเลิก</option>
                           </select>
                           <button onClick={() => handleDeleteOrder(order._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={6} style={{textAlign:'center', padding: 20}}>ไม่มีคำสั่งซื้อ</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 🔴 TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className={styles.productsContent}>
              <div style={{textAlign:'right', marginBottom:'20px'}}>
                <button className={styles.btnPrimary} onClick={() => {
                   setIsEditing(false); 
                   // Reset Form
                   setProductForm({productCode:'', name:'', description:'', price:0, image:'', stockS:0, stockM:0, stockL:0, stockXL:0, stock2XL:0});
                   setShowProductModal(true);
                }}>+ เพิ่มสินค้าใหม่</button>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
                  <thead><tr><th>รูป</th><th>รหัส</th><th>ชื่อสินค้า</th><th>ราคา</th><th>สต็อกรวม</th><th>จัดการ</th></tr></thead>
                  <tbody>
                    {products.map(p => {
                      const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
                      return (
                        <tr key={p._id}>
                          <td><img src={p.images[0]?.url} alt={p.name} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'5px'}}/></td>
                          <td>{p.productCode}</td>
                          <td>{p.name}</td>
                          <td className={styles.priceCell}>฿{p.price.toLocaleString()}</td>
                          <td>{totalStock} ตัว</td>
                          <td>
                            <button onClick={() => openEditProduct(p)} style={{marginRight:'10px'}}>✏️</button>
                            <button onClick={() => handleDeleteProduct(p._id)}>🗑️</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: VIEW SLIP */}
      {showSlipModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSlipModal(false)}>
           <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
             <img src={selectedSlip} style={{maxWidth:'100%', maxHeight:'80vh'}} />
           </div>
        </div>
      )}

      {/* MODAL: MANAGE PRODUCT (ปรับปรุงการจัดวาง) */}
      {showProductModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProductModal(false)}>
           <div className={styles.modalContent} style={{maxWidth:'650px', textAlign:'left'}} onClick={e => e.stopPropagation()}>
             <h2 className={styles.modalProductTitle}>{isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
             
             <form onSubmit={handleProductSubmit} className={styles.modalForm}>
                
                {/* 1. ข้อมูลพื้นฐาน: รหัส, ชื่อ, ราคา */}
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>รหัสสินค้า</label>
                        <input 
                          type="text" 
                          placeholder="เช่น T001" 
                          value={productForm.productCode} 
                          onChange={e => setProductForm({...productForm, productCode: e.target.value})} 
                          required 
                          className={styles.formInput}
                          disabled={isEditing}
                        />
                    </div>
                    <div className={styles.formGroup} style={{gridColumn: 'span 2'}}>
                        <label className={styles.formLabel}>ชื่อสินค้า</label>
                        <input 
                          type="text" 
                          placeholder="ชื่อสินค้าเต็ม" 
                          value={productForm.name} 
                          onChange={e => setProductForm({...productForm, name: e.target.value})} 
                          required 
                          className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>ราคา (บาท)</label>
                        <input 
                          type="number" 
                          placeholder="0" 
                          value={productForm.price} 
                          onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} 
                          required 
                          className={styles.formInput}
                          min="0"
                        />
                    </div>
                </div>

                {/* 2. รายละเอียดสินค้า */}
                <div className={styles.formGroup}>
                   <label className={styles.formLabel}>รายละเอียดสินค้า</label>
                   <textarea 
                      placeholder="อธิบายคุณสมบัติ (เช่น เนื้อผ้าดี, ทรงสวย, เหมาะสำหรับ...) " 
                      value={productForm.description} 
                      onChange={e => setProductForm({...productForm, description: e.target.value})} 
                      required 
                      rows={4}
                      className={styles.formTextarea}
                   />
                </div>

                {/* 3. รูปภาพสินค้า */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>รูปสินค้าหลัก</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.formInput} style={{padding: '10px'}} />
                    {productForm.image && <img src={productForm.image} style={{height:'100px', objectFit:'contain', borderRadius:'5px', border:'1px solid #3b82f6'}} alt="Product Preview" />}
                </div>

                {/* 4. สต็อกสินค้า */}
                <div className={styles.formGroup} style={{marginTop:'15px'}}>
                    <label className={styles.formLabel}>สต็อกสินค้า (จำนวนต่อไซซ์)</label>
                    <div className={styles.formGrid}>
                      {['S','M','L','XL','2XL'].map(size => (
                        <div key={size} className={styles.stockInputGroup}>
                          <span className={styles.formLabel} style={{fontSize:'14px', textAlign:'center', color:'#60a5fa'}}>{size}</span>
                          <input 
                            type="number" 
                            placeholder="0" 
                            value={(productForm as any)[`stock${size}`]} 
                            onChange={e => setProductForm({...productForm, [`stock${size}`]: e.target.value})} 
                            className={styles.formInput}
                            min="0"
                          />
                        </div>
                      ))}
                    </div>
                </div>

                {/* 5. ปุ่มควบคุม */}
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.btnPrimary}>{isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}</button>
                  <button type="button" onClick={() => setShowProductModal(false)} className={styles.btnSecondary}>ยกเลิก</button>
                </div>
             </form>
           </div>
        </div>
      )}

      {/* CSS for Modal */}
      <style jsx>{`
        .modalOverlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 2000; }
        .modalContent { 
          background: #1e293b; /* ใช้สีเข้มที่เข้ากับพื้นหลัง */
          padding: 30px; 
          border-radius: 12px; 
          width: 90%; 
          max-height: 90vh; 
          overflow-y: auto; 
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}