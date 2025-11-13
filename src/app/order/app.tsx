"use client";

import { useState, type ComponentType } from 'react';
import Page from './page';
import FutureZizes from '../zizes/page';

// ensure Page is recognized as a component that accepts the onNext prop
const PageCmp = Page as ComponentType<{ onNext?: (data: FormData) => void }>;

export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  acceptMarketing: boolean;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'order' | 'selection'>('order');
  const [customerData, setCustomerData] = useState<FormData | null>(null);

  return (
    <div>
      {currentPage === 'order' ? (
        <PageCmp 
          onNext={(data: FormData) => {
            setCustomerData(data);
            setCurrentPage('selection');
          }} 
        />
      ) : (
        <FutureZizes 
          customerData={customerData}
          onBack={() => setCurrentPage('order')} 
        />
      )}
    </div>
  );
}