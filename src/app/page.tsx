'use client';

import { useState } from 'react';
import { ShoppingCart, Info, Truck, Shield } from 'lucide-react';

export default function UniformOrder() {
  const [selectedType, setSelectedType] = useState('white');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const whiteStock = {
    29147: { available: true, label: 'เสื้อสีขาว (รวมกางเกง)' },
    1778: { available: true, label: 'จำนวนออดีตอีส (รวมกางเกง)' }
  };

  const whiteSizes = [
    { size: 'L', quantity: 7793, available: true },
    { size: 'M', quantity: 5716, available: true },
    { size: 'S', quantity: 2945, available: true },
    { size: 'SS', quantity: 1624, available: true },
    { size: 'XL', quantity: 4608, available: true },
    { size: '2XL', quantity: 1643, available: true },
    { size: '3XL', quantity: 824, available: true },
    { size: '4XL', quantity: 207, available: true },
    { size: '5XL', quantity: 148, available: true },
    { size: 'SSS', quantity: 543, available: true },
    { size: '6XL', quantity: 1, available: true }
  ];

  const blackSizes = [
    { size: 'L', quantity: 8638, available: true },
    { size: 'M', quantity: 6420, available: true },
    { size: 'XL', quantity: 5181, available: true },
    { size: '3XL', quantity: 728, available: true },
    { size: 'S', quantity: 3398, available: true },
    { size: 'SS', quantity: 1910, available: true },
    { size: '2XL', quantity: 1877, available: true },
    { size: '4XL', quantity: 240, available: true },
    { size: 'SSS', quantity: 631, available: true },
    { size: '5XL', quantity: 173, available: true },
    { size: '6XL', quantity: 4, available: true },
    { size: '8XL', quantity: 4, available: true },
    { size: '7XL', quantity: 3, available: true }
  ];

  const polySizes = [
    { size: 'L', quantity: 845, available: true },
    { size: 'M', quantity: 704, available: true },
    { size: 'XL', quantity: 523, available: true },
    { size: '3XL', quantity: 107, available: true },
    { size: 'S', quantity: 443, available: true },
    { size: '2XL', quantity: 234, available: true },
    { size: 'SS', quantity: 286, available: true },
    { size: '4XL', quantity: 33, available: true },
    { size: 'SSS', quantity: 88, available: true },
    { size: '5XL', quantity: 25, available: true },
    { size: '6XL', quantity: 4, available: true },
    { size: '8XL', quantity: 3, available: true },
    { size: '7XL', quantity: 3, available: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              ตร
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-gray-900">YOUNG ENTREPRENEUR</span>
              </div>
              <span className="text-xs text-indigo-600 font-semibold">บายศรีเมือง 243 ปี</span>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-gray-700">👤 Suphan Chainok</div>
            <div className="text-xs text-gray-500">ผู้บริหารจัดการ</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-8 aspect-square flex items-center justify-center">
              <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%2365a30d' width='400' height='500'/%3E%3Ctext x='50%25' y='40%25' font-size='24' fill='white' text-anchor='middle' font-weight='bold'%3Eเสื้อบายศรีเมือง%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='20' fill='white' text-anchor='middle'%3Eรุ่นเรียน 243 ปี%3C/text%3E%3C/svg%3E"
                alt="School Uniform"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 bg-gradient-to-b from-white to-gray-50">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                  <div className="font-bold text-indigo-900">แบบสีขาว</div>
                  <div className="text-sm text-indigo-700 mt-1">ราคา 198 บาท</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-300">
                  <div className="font-bold text-gray-900">แบบไทยคต</div>
                  <div className="text-sm text-gray-600 mt-1">ราคา 243 บาท</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info & CTA */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3 leading-tight">
                เสื้อเฉลิมฉลองปี <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">243</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                เสื้อคณุภาพสูงสำหรับการหมุนเวียนโรงเรียนบายศรีเมือง เป็นหนึ่งในโครงการสมาชิกสังคม
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 mb-8">
              <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg">
                <ShoppingCart size={24} />
                สั่งซื้อเสื้อเลย
              </button>
              <button className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-4 px-6 rounded-xl transition-all">
                ดูรายละเอียดเพิ่มเติม
              </button>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-2">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-green-600" />
                <span className="text-sm text-gray-700">การผลิตโดยสมาชิกท้องถิ่น</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-green-600" />
                <span className="text-sm text-gray-700">จัดส่งทั่วประเทศ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-600 rounded-xl p-6 mb-12 shadow-sm">
          <div className="flex gap-4">
            <Info size={24} className="text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">ข้อมูลเพิ่มเติม</h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                หอการค้าจังหวัดนครราชสีมาร่วมกับอลุมนี จัตุประชารัฐวิทยาลัยการฝึกหัดครูสมาบท (วิสาหกิจเพื่อสังคม) จำหน่ายเสื้อบายศรีเมือง รุ่นเรียน 243 ปี
              </p>
              <p className="text-gray-700 font-semibold text-indigo-700">
                💰 ค่าธรรมเนียมเพิ่มเติม 50 บาท + จำนวนเสื้อทดแทน 10 บาท
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">📊 สถิติการขายเสื้อ</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-5xl font-black mb-2">29,147</div>
              <div className="text-indigo-100">เสื้อสีขาว (รวมกางเกง)</div>
            </div>
            <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-6 text-white shadow-lg">
              <div className="text-5xl font-black mb-2">1,778</div>
              <div className="text-gray-200">จำนวนออดีตอีส (รวมกางเกง)</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
              <div className="text-4xl font-black text-indigo-600 mb-2">29,849</div>
              <div className="text-gray-700 font-semibold">เสื้อสีขาว</div>
              <div className="text-sm text-gray-600 mt-1">จำนวนออดีตอีส: 1,460 รายการ</div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-6 border-2 border-gray-300">
              <div className="text-4xl font-black text-gray-600 mb-2">3,298</div>
              <div className="text-gray-700 font-semibold">เสื้อสีดำ</div>
              <div className="text-sm text-gray-600 mt-1">จำนวนออดีตอีส: 318 รายการ</div>
            </div>
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-6 mb-12">
          {/* White Shirt */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-6">
              <h3 className="font-bold text-lg">👕 เสื้อสีขาว - เลือกขนาด</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                {whiteSizes.map((item) => (
                  <button
                    key={item.size}
                    onClick={() => {
                      setSelectedType('white');
                      setSelectedSize(item.size);
                    }}
                    className={`py-3 px-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                      selectedSize === item.size && selectedType === 'white'
                        ? 'bg-indigo-600 text-white shadow-lg scale-105'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                  >
                    <div>{item.size}</div>
                    <div className="text-xs opacity-75 mt-1">{item.quantity}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Black Shirt */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-6">
              <h3 className="font-bold text-lg">👕 เสื้อสีดำ - เลือกขนาด</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                {blackSizes.map((item) => (
                  <button
                    key={item.size}
                    onClick={() => {
                      setSelectedType('black');
                      setSelectedSize(item.size);
                    }}
                    className={`py-3 px-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                      selectedSize === item.size && selectedType === 'black'
                        ? 'bg-gray-700 text-white shadow-lg scale-105'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <div>{item.size}</div>
                    <div className="text-xs opacity-75 mt-1">{item.quantity}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Poly Shirt */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6">
              <h3 className="font-bold text-lg">👕 เสื้อโปโล - เลือกขนาด</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                {polySizes.map((item) => (
                  <button
                    key={item.size}
                    className="py-3 px-2 rounded-lg font-semibold text-sm bg-amber-200 text-amber-800 hover:bg-amber-300 transition-all transform hover:scale-105"
                  >
                    <div>{item.size}</div>
                    <div className="text-xs opacity-75 mt-1">{item.quantity}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3">เกี่ยวกับเรา</h4>
              <p className="text-gray-300 text-sm">โรงเรียนประจำบายศรีเมือง วิสาหกิจเพื่อสังคม</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">ติดต่อเรา</h4>
              <p className="text-gray-300 text-sm">โทร: 0-4421-7000</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">การชำระเงิน</h4>
              <p className="text-gray-300 text-sm">ธนาคารกรุงไทย เลขที่บัญชี 333-4-23368-5</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
            <p>© 2024 บายศรีเมือง 243 ปี | All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
