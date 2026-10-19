import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { dungXacThuc } from '../kho_luu_tru/NguCanhXacThuc';

export const BaoVeTuyenDuong = ({ vaiTroChoPhep = [] }) => {
  const { nguoiDung, dangTai } = dungXacThuc();

  if (dangTai) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Đang tải dữ liệu hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!nguoiDung) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (vaiTroChoPhep.length > 0 && !vaiTroChoPhep.includes(nguoiDung.vaiTro)) {
    // Redirect to proper dashboard based on current role
    if (nguoiDung.vaiTro === 'ADMIN') return <Navigate to="/quan-tri" replace />;
    if (nguoiDung.vaiTro === 'GIAO_VIEN') return <Navigate to="/giao-vien" replace />;
    return <Navigate to="/sinh-vien" replace />;
  }

  return <Outlet />;
};
