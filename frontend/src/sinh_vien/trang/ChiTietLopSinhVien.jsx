import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { baiTapDichVu } from '../../giang_vien/dich_vu/baiTapDichVu';
import { TheBaiTap } from '../../dung_chung/thanh_phan/TheBaiTap';
import { BookOpen, Users, FileText, ArrowLeft, Copy, Check } from 'lucide-react';

export const ChiTietLopSinhVien = () => {
  const { id } = useParams();
  const [lop, setLop] = useState(null);
  const [danhSachBaiTap, setDanhSachBaiTap] = useState([]);
  const [thanhVien, setThanhVien] = useState([]);
  const [tabHienTai, setTabHienTai] = useState('bai-tap');
  const [dangTai, setDangTai] = useState(true);
  const [daCopy, setDaCopy] = useState(false);

  useEffect(() => {
    const taiDuLieu = async () => {
      try {
        const [l, dsBt, tv] = await Promise.all([
          lopHocDichVu.layChiTiet(id),
          baiTapDichVu.layDanhSach(id),
          lopHocDichVu.layThanhVien(id),
        ]);
        setLop(l);
        setDanhSachBaiTap(dsBt);
        setThanhVien(tv);
      } catch (err) {
        console.error('Loi tai chi tiet lop:', err);
      } finally {
        setDangTai(false);
      }
    };

    taiDuLieu();
  }, [id]);

  const handleCopyMa = () => {
    if (lop?.maLop) {
      navigator.clipboard.writeText(lop.maLop);
      setDaCopy(true);
      setTimeout(() => setDaCopy(false), 2000);
    }
  };

  if (dangTai) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!lop) {
    return (
      <div className="p-8 text-center text-slate-500">
        Không tìm thấy thông tin lớp học.
      </div>
    );
  }

  const gradientClass = lop.anhBia || 'from-blue-600 to-indigo-700';

  return (
    <div className="space-y-6">
      <Link
        to="/sinh-vien"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Bảng điều khiển</span>
      </Link>

      {/* Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${gradientClass} p-6 sm:p-8 text-white shadow-lg`}>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-white/20 backdrop-blur-md">
              Mã lớp: {lop.maLop}
            </span>
            <button
              onClick={handleCopyMa}
              className="p-1 hover:bg-white/20 rounded-md transition"
              title="Sao chép mã lớp"
            >
              {daCopy ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {lop.tenLop}
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-4">
            {lop.moTa || 'Lớp học trực tuyến tương tác cao tích hợp trợ lý AI.'}
          </p>
          <div className="flex items-center gap-4 text-xs text-white/80 font-medium">
            <span>Giảng viên: {lop.giaoVien?.hoTen}</span>
            <span>•</span>
            <span>{thanhVien.length} Sinh viên</span>
            <span>•</span>
            <span>{danhSachBaiTap.length} Bài tập</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setTabHienTai('bai-tap')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${
            tabHienTai === 'bai-tap'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Danh sách bài tập ({danhSachBaiTap.length})</span>
        </button>

        <button
          onClick={() => setTabHienTai('thanh-vien')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${
            tabHienTai === 'thanh-vien'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Thành viên lớp ({thanhVien.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {tabHienTai === 'bai-tap' ? (
        <div className="space-y-3">
          {danhSachBaiTap.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-400 text-xs">
              Chưa có bài tập nào được giao trong lớp học này.
            </div>
          ) : (
            danhSachBaiTap.map((bt) => (
              <TheBaiTap key={bt.id} baiTap={bt} />
            ))
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Giảng viên phụ trách</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                {lop.giaoVien?.hoTen?.charAt(0) || 'G'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{lop.giaoVien?.hoTen}</p>
                <p className="text-xs text-slate-400">{lop.giaoVien?.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sinh viên trong lớp ({thanhVien.length})</h3>
            <div className="divide-y divide-slate-100">
              {thanhVien.map((tv) => (
                <div key={tv.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                      {tv.sinhVien?.hoTen?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{tv.sinhVien?.hoTen}</p>
                      <p className="text-[11px] text-slate-400">{tv.sinhVien?.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Tham gia: {new Date(tv.ngayThamGia).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
