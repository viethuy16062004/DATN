import React, { useState } from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';

const BANG_MAU = [
  { id: 'from-blue-600 to-indigo-700', ten: 'Xanh dương biển sâu' },
  { id: 'from-emerald-600 to-teal-700', ten: 'Xanh ngọc lục bảo' },
  { id: 'from-violet-600 to-purple-700', ten: 'Tím hoàng gia' },
  { id: 'from-rose-600 to-pink-700', ten: 'Hồng ngọc son' },
  { id: 'from-amber-500 to-orange-600', ten: 'Cam hoàng hôn' },
];

export const ModalTaoLop = ({ mo, onDong, onThanhCong }) => {
  const [tenLop, setTenLop] = useState('');
  const [moTa, setMoTa] = useState('');
  const [anhBia, setAnhBia] = useState('from-blue-600 to-indigo-700');
  const [dangXuLy, setDangXuLy] = useState(false);
  const [loi, setLoi] = useState('');

  if (!mo) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tenLop.trim()) {
      setLoi('Vui lòng nhập tên lớp học');
      return;
    }

    setDangXuLy(true);
    setLoi('');

    try {
      const res = await lopHocDichVu.taomoi({
        tenLop: tenLop.trim(),
        moTa: moTa.trim(),
        anhBia,
      });
      setTenLop('');
      setMoTa('');
      onThanhCong(res);
      onDong();
    } catch (err) {
      setLoi(err.response?.data?.thongDiep || 'Đã xảy ra lỗi khi tạo lớp học');
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
        <button
          onClick={onDong}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Tạo lớp học trực tuyến mới</h3>
            <p className="text-xs text-slate-500">Hệ thống sẽ tự động tạo mã mời lớp học ngẫu nhiên</p>
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
              Tên lớp học / Học phần <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tenLop}
              onChange={(e) => setTenLop(e.target.value)}
              placeholder="VD: Lập trình Web nâng cao - CS402"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mô tả ngắn về lớp học
            </label>
            <textarea
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              placeholder="Mục tiêu môn học, thông tin giáo trình, hình thức đánh giá..."
              rows={3}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Chọn màu chủ đề lớp
            </label>
            <div className="grid grid-cols-5 gap-2">
              {BANG_MAU.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setAnhBia(m.id)}
                  className={`h-10 rounded-xl bg-gradient-to-r ${m.id} transition-all ${
                    anhBia === m.id ? 'ring-2 ring-brand-500 ring-offset-2 scale-105 shadow-md' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={m.ten}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
              <span>{dangXuLy ? 'Đang tạo...' : 'Tạo lớp ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
