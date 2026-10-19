import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NhaCungCapXacThuc, dungXacThuc } from './dung_chung/kho_luu_tru/NguCanhXacThuc';
import { BaoVeTuyenDuong } from './dung_chung/thanh_phan/BaoVeTuyenDuong';
import { KhungGiaoDien } from './dung_chung/thanh_phan/KhungGiaoDien';

// Authentication Pages
import { DangNhap } from './dung_chung/trang/DangNhap';
import { DangKy } from './dung_chung/trang/DangKy';

// Student Pages
import { BangDieuKhienSinhVien } from './sinh_vien/trang/BangDieuKhienSinhVien';
import { DanhSachLopSinhVien } from './sinh_vien/trang/DanhSachLopSinhVien';
import { DanhSachBaiTapSinhVien } from './sinh_vien/trang/DanhSachBaiTapSinhVien';
import { ChiTietLopSinhVien } from './sinh_vien/trang/ChiTietLopSinhVien';
import { ChiTietBaiTapSinhVien } from './sinh_vien/trang/ChiTietBaiTapSinhVien';
import { TienDoHocTap } from './sinh_vien/trang/TienDoHocTap';
import { AiTroLyHocTap } from './sinh_vien/trang/AiTroLyHocTap';
import { ThamGiaLopHoc } from './sinh_vien/trang/ThamGiaLopHoc';

// Teacher Pages
import { BangDieuKhienGiaoVien } from './giang_vien/trang/BangDieuKhienGiaoVien';
import { DanhSachLopGiaoVien } from './giang_vien/trang/DanhSachLopGiaoVien';
import { TaoLopHoc } from './giang_vien/trang/TaoLopHoc';
import { ChiTietLopGiaoVien } from './giang_vien/trang/ChiTietLopGiaoVien';
import { TaoBaiTap } from './giang_vien/trang/TaoBaiTap';
import { ChamDiemBaiNop } from './giang_vien/trang/ChamDiemBaiNop';
import { TienDoLopHoc } from './giang_vien/trang/TienDoLopHoc';
import { AiPhanTichLop } from './giang_vien/trang/AiPhanTichLop';
import { QuanLySinhVienGiaoVien } from './giang_vien/trang/QuanLySinhVienGiaoVien';

// Admin Pages
import { BangDieuKhienQuanTri } from './admin/trang/BangDieuKhienQuanTri';
import { QuanLyNguoiDung } from './admin/trang/QuanLyNguoiDung';
import { QuanLyLopHocAdmin } from './admin/trang/QuanLyLopHocAdmin';
import { NhatKyAiAdmin } from './admin/trang/NhatKyAiAdmin';

// Default redirect helper
const DieuHuongTrangChu = () => {
  const { nguoiDung, dangTai } = dungXacThuc();

  if (dangTai) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!nguoiDung) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (nguoiDung.vaiTro === 'ADMIN') return <Navigate to="/quan-tri" replace />;
  if (nguoiDung.vaiTro === 'GIAO_VIEN') return <Navigate to="/giao-vien" replace />;
  return <Navigate to="/sinh-vien" replace />;
};

export function App() {
  return (
    <BrowserRouter>
      <NhaCungCapXacThuc>
        <Routes>
          {/* Public Routes */}
          <Route path="/dang-nhap" element={<DangNhap />} />
          <Route path="/dang-ky" element={<DangKy />} />

          {/* Protected Routes Layout */}
          <Route element={<BaoVeTuyenDuong />}>
            <Route element={<KhungGiaoDien />}>
              <Route path="/" element={<DieuHuongTrangChu />} />

              {/* Student Routes */}
              <Route element={<BaoVeTuyenDuong vaiTroChoPhep={['SINH_VIEN', 'ADMIN']} />}>
                <Route path="/sinh-vien" element={<BangDieuKhienSinhVien />} />
                <Route path="/sinh-vien/lop-hoc" element={<DanhSachLopSinhVien />} />
                <Route path="/sinh-vien/bai-tap" element={<DanhSachBaiTapSinhVien />} />
                <Route path="/sinh-vien/lop/:id" element={<ChiTietLopSinhVien />} />
                <Route path="/sinh-vien/bai-tap/:id" element={<ChiTietBaiTapSinhVien />} />
                <Route path="/sinh-vien/tien-do" element={<TienDoHocTap />} />
                <Route path="/sinh-vien/ai-tro-ly" element={<AiTroLyHocTap />} />
                <Route path="/sinh-vien/tham-gia" element={<ThamGiaLopHoc />} />
                <Route path="/tham-gia-lop" element={<ThamGiaLopHoc />} />
              </Route>

              {/* Teacher Routes */}
              <Route element={<BaoVeTuyenDuong vaiTroChoPhep={['GIAO_VIEN', 'ADMIN']} />}>
                <Route path="/giao-vien" element={<BangDieuKhienGiaoVien />} />
                <Route path="/giao-vien/lop-hoc" element={<DanhSachLopGiaoVien />} />
                <Route path="/giao-vien/sinh-vien-quan-ly" element={<QuanLySinhVienGiaoVien />} />
                <Route path="/giao-vien/tao-lop" element={<TaoLopHoc />} />
                <Route path="/giao-vien/lop/:id" element={<ChiTietLopGiaoVien />} />
                <Route path="/giao-vien/tao-bai-tap" element={<TaoBaiTap />} />
                <Route path="/giao-vien/bai-tap/:id" element={<ChamDiemBaiNop />} />
                <Route path="/giao-vien/tien-do" element={<TienDoLopHoc />} />
                <Route path="/giao-vien/ai-phan-tich" element={<AiPhanTichLop />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<BaoVeTuyenDuong vaiTroChoPhep={['ADMIN']} />}>
                <Route path="/quan-tri" element={<BangDieuKhienQuanTri />} />
                <Route path="/quan-tri/nguoi-dung" element={<QuanLyNguoiDung />} />
                <Route path="/quan-tri/lop-hoc" element={<QuanLyLopHocAdmin />} />
                <Route path="/quan-tri/nhat-ky-ai" element={<NhatKyAiAdmin />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NhaCungCapXacThuc>
    </BrowserRouter>
  );
}

export default App;
