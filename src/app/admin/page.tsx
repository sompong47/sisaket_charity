'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './adminpage.module.css';

// ==================== INTERFACES ====================
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  shirtType: string;
  totalQuantity: number;
  grandTotal: number;
  status: OrderStatus;
  orderDate: string;
}

interface Statistics {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalShirts: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  const [statistics] = useState<Statistics>({
    totalOrders: 1899,
    pendingOrders: 243,
    totalRevenue: 375804,
    totalShirts: 31619
  });

  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD20241117001',
      customerName: 'สมชัย ใจดี',
      phone: '098-456-7897',
      shirtType: 'เสื้อสีปกติ',
      totalQuantity: 3,
      grandTotal: 664,
      status: 'pending',
      orderDate: '2024-11-17 10:30'
    },
    {
      id: '2',
      orderNumber: 'ORD20241117002',
      customerName: 'สมหญิง รักดี',
      phone: '089-123-4567',
      shirtType: 'เสื้อไว้ทุกข์',
      totalQuantity: 5,
      grandTotal: 1030,
      status: 'confirmed',
      orderDate: '2024-11-17 11:45'
    },
    {
      id: '3',
      orderNumber: 'ORD20241117003',
      customerName: 'วิชัย มีสุข',
      phone: '092-555-6789',
      shirtType: 'เสื้อสีปกติ',
      totalQuantity: 2,
      grandTotal: 446,
      status: 'shipped',
      orderDate: '2024-11-17 14:20'
    }
  ]);

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
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = styles.particle;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        bg.appendChild(particle);
      }
    }
  }, []);

  // ----------------- FIX TYPE ERROR (STRICT) -----------------
  const getStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { label: string; class: string }> = {
      pending: { label: 'รอดำเนินการ', class: styles.statusPending },
      confirmed: { label: 'ยืนยันแล้ว', class: styles.statusConfirmed },
      shipped: { label: 'จัดส่งแล้ว', class: styles.statusShipped },
      completed: { label: 'สำเร็จ', class: styles.statusCompleted },
      cancelled: { label: 'ยกเลิก', class: styles.statusCancelled }
    };

    return statusMap[status];
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.page}>
      {/* Animated Background */}
      <div className={styles.animatedBg}></div>

      {/* Navigation */}
      <nav className={`${styles.topNavigation} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.navLogo}>
            <span className={styles.logoText}> Admin Dashboard</span>
          </div>
          <div className={styles.navMenu}>
            <button
              className={styles.userBtn}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className={styles.userAvatar}></span>
              <span className={styles.userText}>ผู้ดูแลระบบ</span>
              <span className={styles.dropdownArrow}>▼</span>
            </button>

            {showDropdown && (
              <div className={styles.userDropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownAvatar}></span>
                  <span className={styles.dropdownName}>Admin</span>
                </div>
                <button className={styles.dropdownItem} onClick={() => router.push('/')}>
                   หน้าหลัก
                </button>
                <button className={styles.dropdownItem}>
                   ตั้งค่า
                </button>
                <button className={`${styles.dropdownItem} ${styles.logout}`}>
                   ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={styles.adminContent}>
        <div className={styles.adminContainer}>

          {/* Header */}
          <div className={styles.adminHeader}>
            <h1 className={styles.adminTitle}>ระบบจัดการคำสั่งซื้อ</h1>
          </div>

          {/* Tabs */}
          <div className={styles.tabsContainer}>
            <button className={`${styles.tab} ${activeTab === 'dashboard' ? styles.tabActive : ''}`} onClick={() => setActiveTab('dashboard')}> Dashboard</button>
            <button className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`} onClick={() => setActiveTab('orders')}> คำสั่งซื้อ</button>
            <button className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`} onClick={() => setActiveTab('products')}> สินค้า</button>
            <button className={`${styles.tab} ${activeTab === 'settings' ? styles.tabActive : ''}`} onClick={() => setActiveTab('settings')}> ตั้งค่า</button>
          </div>

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className={styles.dashboardContent}>
              
              {/* Statistics Cards */}
              <div className={styles.statsGrid}>

                <div className={`${styles.statCard} ${styles.statPrimary}`}>
                  <div className={styles.statIcon}></div>
                  <div>
                    <div className={styles.statValue}>{statistics.totalOrders.toLocaleString()}</div>
                    <div className={styles.statLabel}>คำสั่งซื้อทั้งหมด</div>
                  </div>
                </div>

                <div className={`${styles.statCard} ${styles.statWarning}`}>
                  <div className={styles.statIcon}></div>
                  <div>
                    <div className={styles.statValue}>{statistics.pendingOrders.toLocaleString()}</div>
                    <div className={styles.statLabel}>รอดำเนินการ</div>
                  </div>
                </div>

                <div className={`${styles.statCard} ${styles.statSuccess}`}>
                  <div className={styles.statIcon}></div>
                  <div>
                    <div className={styles.statValue}>฿{statistics.totalRevenue.toLocaleString()}</div>
                    <div className={styles.statLabel}>รายได้รวม</div>
                  </div>
                </div>

                <div className={`${styles.statCard} ${styles.statInfoBox}`}>
                  <div className={styles.statIcon}></div>
                  <div>
                    <div className={styles.statValue}>{statistics.totalShirts.toLocaleString()}</div>
                    <div className={styles.statLabel}>เสื้อที่ขายได้</div>
                  </div>
                </div>

              </div>

              {/* Recent Orders */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>คำสั่งซื้อล่าสุด</h2>
                <div className={styles.ordersList}>
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className={styles.orderItem}>
                      <div className={styles.orderInfo}>
                        <div className={styles.orderNumber}>{order.orderNumber}</div>
                        <div className={styles.orderCustomer}>{order.customerName}</div>
                      </div>

                      <div className={styles.orderDetails}>
                        <div className={styles.orderQuantity}>{order.totalQuantity} ตัว</div>
                        <div className={styles.orderPrice}>฿{order.grandTotal.toLocaleString()}</div>
                      </div>

                      <span className={`${styles.statusBadge} ${getStatusBadge(order.status).class}`}>
                        {getStatusBadge(order.status).label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className={styles.ordersContent}>

              {/* Filters */}
              <div className={styles.filtersBar}>
                <input
                  type="text"
                  placeholder=" ค้นหาหมายเลขคำสั่งซื้อ หรือชื่อลูกค้า..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                  className={styles.filterSelect}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="pending">รอดำเนินการ</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="shipped">จัดส่งแล้ว</option>
                  <option value="completed">สำเร็จ</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>

              {/* Orders Table */}
              <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th>หมายเลขคำสั่งซื้อ</th>
                      <th>ลูกค้า</th>
                      <th>เบอร์โทร</th>
                      <th>ประเภทเสื้อ</th>
                      <th>จำนวน</th>
                      <th>ราคารวม</th>
                      <th>สถานะ</th>
                      <th>วันที่สั่งซื้อ</th>
                      <th>การจัดการ</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td className={styles.orderNumberCell}>{order.orderNumber}</td>
                        <td>{order.customerName}</td>
                        <td>{order.phone}</td>
                        <td>{order.shirtType}</td>
                        <td>{order.totalQuantity} ตัว</td>
                        <td className={styles.priceCell}>฿{order.grandTotal.toLocaleString()}</td>

                        <td>
                          <span className={`${styles.statusBadge} ${getStatusBadge(order.status).class}`}>
                            {getStatusBadge(order.status).label}
                          </span>
                        </td>

                        <td>{order.orderDate}</td>

                        <td>
                          <div className={styles.actionButtons}>
                            <button className={styles.btnView}></button>
                            <button className={styles.btnEdit}></button>
                            <button className={styles.btnDelete}></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div className={styles.productsContent}>
              <div className={styles.comingSoon}>
                <div className={styles.comingSoonIcon}></div>
                <h2>กำลังพัฒนา</h2>
                <p>ฟีเจอร์จัดการสินค้ากำลังอยู่ระหว่างการพัฒนา</p>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className={styles.settingsContent}>
              <div className={styles.comingSoon}>
                <div className={styles.comingSoonIcon}></div>
                <h2>กำลังพัฒนา</h2>
                <p>ฟีเจอร์ตั้งค่ากำลังอยู่ระหว่างการพัฒนา</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
