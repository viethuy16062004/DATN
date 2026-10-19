import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ThanhDieuHuong } from './ThanhDieuHuong';
import { ThanhBen } from './ThanhBen';
import { ThanhDuongDan } from './ThanhDuongDan';
import { ModalTaoLop } from '../../giang_vien/thanh_phan/ModalTaoLop';
import { ModalThamGiaLop } from '../../sinh_vien/thanh_phan/ModalThamGiaLop';

export const KhungGiaoDien = () => {
  const [moSidebar, setMoSidebar] = useState(false);
  const [moModalTao, setMoModalTao] = useState(false);
  const [moModalThamGia, setMoModalThamGia] = useState(false);

  const handleThanhCong = () => {
    // Reload or refresh state
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased">
      {/* 1. Header Navigation Bar */}
      <ThanhDieuHuong
        onOpenModalTaoLop={() => setMoModalTao(true)}
        onOpenModalThamGia={() => setMoModalThamGia(true)}
        onToggleSidebar={() => setMoSidebar(!moSidebar)}
      />

      <div className="flex flex-1 relative">
        {/* 2. Left Sidebar */}
        <ThanhBen 
          mo={moSidebar} 
          onDong={() => setMoSidebar(false)} 
          onOpenModalThamGia={() => setMoModalThamGia(true)}
        />

        {/* 3. Main Content Area with Breadcrumb */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Breadcrumbs (Notion-style navigation trail) */}
            <ThanhDuongDan />

            {/* Dynamic Routed Page Content */}
            <div className="transition-all duration-150">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* 4. Modals */}
      <ModalTaoLop
        mo={moModalTao}
        onDong={() => setMoModalTao(false)}
        onThanhCong={handleThanhCong}
      />

      <ModalThamGiaLop
        mo={moModalThamGia}
        onDong={() => setMoModalThamGia(false)}
        onThanhCong={handleThanhCong}
      />
    </div>
  );
};
