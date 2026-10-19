import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { aiDichVu } from '../../sinh_vien/dich_vu/aiDichVu';
import { dungXacThuc } from '../../dung_chung/kho_luu_tru/NguCanhXacThuc';
import { 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  Copy, 
  Check, 
  Shuffle, 
  Palette, 
  Layers, 
  Settings, 
  Users, 
  GraduationCap, 
  Send, 
  Zap, 
  Eye, 
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Bot
} from 'lucide-react';

const DANH_SACH_CHU_DE_MAU = [
  'Lập Trình Web Fullstack (React & Spring Boot)',
  'Cấu Trúc Dữ Liệu & Giải Thuật Ứng Dụng',
  'Trí Tuệ Nhân Tạo & Học Máy (AI / ML)',
  'Kiến Trúc & Thiết Kế Phần Mềm',
  'Lập Trình Di Động Flutter & React Native',
  'An Toàn & Bảo Mật Thông Tin Mạng'
];

const BANG_MAU_CHU_DE = [
  { 
    id: 'from-blue-600 via-blue-700 to-indigo-800', 
    ten: 'Xanh Dương Công Nghệ', 
    bg: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800',
    accent: 'text-blue-600'
  },
  { 
    id: 'from-emerald-600 via-teal-700 to-cyan-800', 
    ten: 'Xanh Ngọc Thuật Toán', 
    bg: 'bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800',
    accent: 'text-emerald-600'
  },
  { 
    id: 'from-violet-600 via-purple-700 to-indigo-900', 
    ten: 'Tím Trí Tuệ Nhân Tạo', 
    bg: 'bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-900',
    accent: 'text-purple-600'
  },
  { 
    id: 'from-amber-500 via-orange-600 to-rose-700', 
    ten: 'Cam Năng Động & Sáng Tạo', 
    bg: 'bg-gradient-to-r from-amber-500 via-orange-600 to-rose-700',
    accent: 'text-amber-600'
  },
  { 
    id: 'from-rose-600 via-pink-600 to-purple-700', 
    ten: 'Hồng Đồ Họa & Thiết Kế', 
    bg: 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700',
    accent: 'text-rose-600'
  },
  { 
    id: 'from-slate-800 via-slate-900 to-zinc-950', 
    ten: 'Đen Huyền Bí & Hệ Thống', 
    bg: 'bg-gradient-to-r from-slate-800 via-slate-900 to-zinc-950',
    accent: 'text-slate-700'
  }
];

export const TaoLopHoc = () => {
  const { nguoiDung } = dungXacThuc();
  const navigate = useNavigate();

  const [tenLop, setTenLop] = useState('');
  const [maLop, setMaLop] = useState('');
  const [moTa, setMoTa] = useState('');
  const [anhBia, setAnhBia] = useState(BANG_MAU_CHU_DE[0].id);
  const [hocKy, setHocKy] = useState('Học kỳ 1 (2026 - 2027)');
  const [hinhThuc, setHinhThuc] = useState('TRUC_TIEP'); // 'TRUC_TIEP', 'TRUC_TUYEN', 'HYBRID'
  const [kichHoatAi, setKichHoatAi] = useState(true);
  const [choPhepThamGia, setChoPhepThamGia] = useState(true);

  const [dangXuLy, setDangXuLy] = useState(false);
  const [dangGoiAi, setDangGoiAi] = useState(false);
  const [loi, setLoi] = useState('');

  // Tự sinh mã lớp ngẫu nhiên lúc đầu
  useEffect(() => {
    taoMaLopNgauNhien();
  }, []);

  const taoMaLopNgauNhien = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setMaLop(res);
  };

  const handleChonMonGoiY = (tenMon) => {
    setTenLop(tenMon);
  };

  const handleAiTaoDeCuong = async () => {
    if (!tenLop.trim()) {
      alert('Vui lòng nhập hoặc chọn Tên lớp học trước để AI soạn đề cương!');
      return;
    }
    setDangGoiAi(true);
    try {
      const res = await aiDichVu.soanBaiTap({
        chuDe: tenLop.trim(),
        doKho: 'TRUNG_BINH',
        yeuCauBoSung: 'Soạn mô tả tóm tắt học phần, chuẩn đầu ra và các chủ đề chính',
        tenMonHoc: tenLop.trim()
      });

      if (res.noiDung) {
        setMoTa(res.noiDung.slice(0, 500) + '...');
      }
    } catch (err) {
      console.error('Lỗi AI soạn mô tả:', err);
      alert('Không thể kết nối AI. Vui lòng thử lại.');
    } finally {
      setDangGoiAi(false);
    }
  };

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
        maLop: maLop.trim().toUpperCase() || undefined,
        moTa: moTa.trim(),
        anhBia
      });

      // Điều hướng ngay vào trang chi tiết lớp học vừa tạo
      navigate(`/giao-vien/lop/${res.id}`);
    } catch (err) {
      setLoi(err.response?.data?.thongDiep || 'Không thể tạo lớp học. Vui lòng thử lại.');
    } finally {
      setDangXuLy(false);
    }
  };

  const mauChon = BANG_MAU_CHU_DE.find(m => m.id === anhBia) || BANG_MAU_CHU_DE[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb Link */}
      <Link
        to="/giao-vien/lop-hoc"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách lớp học</span>
      </Link>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Side: Creation Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            
            {/* Header */}
            <div className="pb-5 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Không gian Lớp học Thông minh</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Khởi tạo Lớp học Giảng dạy Mới
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Thiết lập thông tin học phần, chủ đề màu sắc và cấu hình trợ giảng AI cho lớp học
              </p>
            </div>

            {loi && (
              <div className="p-3.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl">
                {loi}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Card 1: Thông tin cơ bản */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">1</div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                    Thông tin học phần
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tên lớp học / Học phần <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Lập trình Web Fullstack React & Spring Boot - Nhóm 01"
                    value={tenLop}
                    onChange={(e) => setTenLop(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
                  />
                </div>

                {/* Quick Subject Chips */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Hoặc chọn nhanh từ danh mục môn học:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {DANH_SACH_CHU_DE_MAU.map((cd) => (
                      <button
                        key={cd}
                        type="button"
                        onClick={() => handleChonMonGoiY(cd)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                          tenLop === cd 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {cd}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Class Code & Term */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Mã tham gia lớp học <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={taoMaLopNgauNhien}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>Tạo ngẫu nhiên</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="VD: WEB2026"
                      value={maLop}
                      onChange={(e) => setMaLop(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 text-xs font-mono font-black text-blue-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition uppercase tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Học kỳ áp dụng
                    </label>
                    <select
                      value={hocKy}
                      onChange={(e) => setHocKy(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
                    >
                      <option value="Học kỳ 1 (2026 - 2027)">Học kỳ 1 (2026 - 2027)</option>
                      <option value="Học kỳ 2 (2026 - 2027)">Học kỳ 2 (2026 - 2027)</option>
                      <option value="Học kỳ hè 2026">Học kỳ Hè 2026</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Course Description */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">2</div>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                      Mô tả học phần & Đề cương
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleAiTaoDeCuong}
                    disabled={dangGoiAi}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold shadow-xs hover:from-indigo-700 hover:to-blue-700 transition active:scale-95 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{dangGoiAi ? 'AI đang soạn...' : 'AI Soạn Đề Cương'}</span>
                  </button>
                </div>

                <textarea
                  rows="4"
                  placeholder="Giới thiệu mục tiêu môn học, giáo trình tham khảo, hình thức đánh giá hoặc sử dụng nút 'AI Soạn Đề Cương' ở trên..."
                  value={moTa}
                  onChange={(e) => setMoTa(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition resize-none leading-relaxed"
                />
              </div>

              {/* Card 3: Visual Theme Palette */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">3</div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                    Chủ đề màu sắc & Ảnh bìa lớp học
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BANG_MAU_CHU_DE.map((mau) => {
                    const isSelected = anhBia === mau.id;
                    return (
                      <button
                        key={mau.id}
                        type="button"
                        onClick={() => setAnhBia(mau.id)}
                        className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                          isSelected 
                            ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50' 
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-xl ${mau.bg} shrink-0 shadow-xs flex items-center justify-center text-white`}>
                          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{mau.ten}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 4: Settings */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">4</div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                    Cấu hình lớp học
                  </h3>
                </div>

                <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span>Kích hoạt Trợ lý AI 24/7 trong lớp học</span>
                      </span>
                      <p className="text-[11px] text-slate-400">Cho phép sinh viên trong lớp hỏi đáp giải thuật, code và gợi ý bài tập</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={kichHoatAi}
                      onChange={(e) => setKichHoatAi(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>Cho phép sinh viên tự tham gia qua Mã Lớp</span>
                      </span>
                      <p className="text-[11px] text-slate-400">Sinh viên chỉ cần nhập mã lớp để ghi danh trực tiếp</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={choPhepThamGia}
                      onChange={(e) => setChoPhepThamGia(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Link
                  to="/giao-vien/lop-hoc"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy bỏ
                </Link>

                <button
                  type="submit"
                  disabled={dangXuLy}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-600/30 transition active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{dangXuLy ? 'Đang khởi tạo lớp học...' : 'Khởi Tạo Lớp Học Ngay'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Live Classroom Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Xem trước thẻ lớp học (Live Preview)</span>
            </div>

            {/* Live Rendered Card */}
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
              {/* Header Gradient */}
              <div className={`p-6 text-white ${mauChon.bg} relative space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
                    {hocKy}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black tracking-wider">
                    Mã: {maLop || 'XXXXXX'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black tracking-tight leading-snug line-clamp-2">
                    {tenLop || 'Tên lớp học của bạn sẽ hiển thị tại đây'}
                  </h3>
                  <p className="text-xs text-white/80 font-medium">
                    Giảng viên: {nguoiDung?.hoTen || 'Thầy/Cô'}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {moTa || 'Mô tả tóm tắt học phần, giáo trình và mục tiêu môn học sẽ xuất hiện ở đây sau khi bạn nhập liệu hoặc nhờ AI soạn thảo...'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-semibold">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>0 sinh viên</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-semibold">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>0 bài tập</span>
                  </div>
                </div>

                {kichHoatAi && (
                  <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-2 text-indigo-900 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Đã bật Trợ giảng AI Sư phạm 24/7</span>
                  </div>
                )}
              </div>
            </div>

            {/* Teaching Advice Box */}
            <div className="p-5 rounded-3xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs">
              <h4 className="font-extrabold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Mẹo giảng dạy thông minh</span>
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Sau khi tạo lớp, bạn có thể bấm sao chép <strong>Mã lớp</strong> để gửi vào nhóm Zalo / Email sinh viên. Khi sinh viên nộp bài, AI sẽ tự động phân tích phổ điểm và phát hiện học viên cần hỗ trợ.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaoLopHoc;
