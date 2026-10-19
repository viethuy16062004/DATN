import React, { useState } from 'react';
import { X, KeyRound, ArrowRight } from 'lucide-react';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';

export const ModalThamGiaLop = ({ mo, onDong, onThanhCong }) => {
  const [maLop, setMaLop] = useState('');
  const [dangXuLy, setDangXuLy] = useState(false);
  const [loi, setLoi] = useState('');

  if (!mo) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!maLop.trim()) {
      setLoi('Vui lòng nhập mã lớp học');
      return;
    }

    setDangXuLy(true);
    setLoi('');

    try {
      const res = await lopHocDichVu.thamGia(maLop.trim().toUpperCase());
      setMaLop('');
      onThanhCong(res);
      onDong();
    } catch (err) {
      setLoi(err.response?.data?.thongDiep || 'Mã lớp không hợp lệ hoặc bạn đã tham gia lớp này rồi');
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
        <button
          onClick={onDong}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Tham gia lớp học</h3>
            <p className="text-xs text-slate-500">Nhập mã tham gia do giảng viên cung cấp</p>
          </div>
        </div>

        {loi && (
          <div className="mb-4 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            {loi}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mã lớp học (ví dụ: WEB2026)
            </label>
            <input
              type="text"
              value={maLop}
              onChange={(e) => setMaLop(e.target.value.toUpperCase())}
              placeholder="VD: ABC123"
              className="w-full px-3.5 py-2.5 text-sm uppercase tracking-wider font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onDong}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={dangXuLy}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl transition shadow-sm shadow-brand-600/20"
            >
              <span>{dangXuLy ? 'Đang kiểm tra...' : 'Tham gia lớp'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
