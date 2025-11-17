"use client";

import { useState } from 'react';
import Page from './page';
import FutureZizes from '../zizes/page';

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
        <Page 
          {...({ onNext: (data: FormData) => {
            setCustomerData(data);
            setCurrentPage('selection');
          }} as any)}
        />
      ) : (
        <FutureZizes 
          {...({ customerData, onBack: () => setCurrentPage('order') } as any)}
        />
      )}
    </div>
  );
}