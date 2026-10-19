import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dungXacThuc } from '../kho_luu_tru/NguCanhXacThuc';
import { 
  GraduationCap, 
  Sparkles, 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe,
  Monitor,
  GitBranch,
  Bot
} from 'lucide-react';

export const DangKy = () => {
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [vaiTro, setVaiTro] = useState('SINH_VIEN');
  const [dongYDieuKhoan, setDongYDieuKhoan] = useState(true);
  const [hienMatKhau, setHienMatKhau] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [ngonNgu, setNgonNgu] = useState('VI');

  // Validation errors
  const [loiHoTen, setLoiHoTen] = useState('');
  const [loiEmail, setLoiEmail] = useState('');
  const [loiMatKhau, setLoiMatKhau] = useState('');
  const [loiSoDienThoai, setLoiSoDienThoai] = useState('');
  const [loiChung, setLoiChung] = useState('');

  const { dangKy } = dungXacThuc();
  const navigate = useNavigate();

  const validateEmailFormat = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const handleKiemTraValidation = () => {
    let hopLe = true;

    // 1. Kiểm tra Họ và tên
    if (!hoTen.trim()) {
      setLoiHoTen('Họ và tên không được để trống');
      hopLe = false;
    } else {
      setLoiHoTen('');
    }

    // 2. Kiểm tra Email
    if (!email.trim()) {
      setLoiEmail('Email không được để trống');
      hopLe = false;
    } else if (!validateEmailFormat(email.trim())) {
      setLoiEmail('Email không đúng định dạng');
      hopLe = false;
    } else {
      setLoiEmail('');
    }

    // 3. Kiểm tra Mật khẩu
    if (!matKhau) {
      setLoiMatKhau('Mật khẩu không được để trống');
      hopLe = false;
    } else if (matKhau.length < 6) {
      setLoiMatKhau('Mật khẩu phải từ 6 ký tự trở lên');
      hopLe = false;
    } else {
      setLoiMatKhau('');
    }

    return hopLe;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoiChung('');

    const hopLe = handleKiemTraValidation();
    if (!hopLe) return;

    if (!dongYDieuKhoan) {
      setLoiChung('Bạn cần đồng ý với điều khoản sử dụng để tiếp tục');
      return;
    }

    setDangXuLy(true);

    try {
      const user = await dangKy({
        hoTen: hoTen.trim(),
        email: email.trim(),
        matKhau,
        soDienThoai: soDienThoai.trim(),
        vaiTro,
      });

      if (user?.vaiTro === 'ADMIN') {
        navigate('/quan-tri');
      } else if (user?.vaiTro === 'GIAO_VIEN') {
        navigate('/giao-vien');
      } else {
        navigate('/sinh-vien');
      }
    } catch (err) {
      const thongDiepLoi = err.response?.data?.thongDiep || err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại Backend hoặc email đã tồn tại.';
      setLoiChung(thongDiepLoi);
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-800 flex flex-col justify-between p-3 sm:p-5 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Top Bar */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <GraduationCap className="w-4.5 h-4.5" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
            AI Classroom
          </span>
        </div>

        <button 
          onClick={() => setNgonNgu(ngonNgu === 'VI' ? 'EN' : 'VI')}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg shadow-2xs transition"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{ngonNgu}</span>
        </button>
      </header>

      {/* 2. Main 2-Column Container */}
      <main className="w-full max-w-5xl mx-auto my-auto py-2">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Column: AI Classroom Banner (48% width on Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-7 flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top Badge & Heading */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-blue-100 border border-white/20 mb-4">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Thế hệ EduAI 2026</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight leading-tight mb-2.5">
                Bắt đầu hành trình học tập cùng AI
              </h2>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Tạo tài khoản miễn phí để trải nghiệm nền tảng quản lý học tập thông minh và tương tác 24/7 cùng Trợ lý AI.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-2.5 my-4 relative z-10">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight mb-0.5">
                    Tham gia & Tạo lớp học dễ dàng
                  </h4>
                  <p className="text-[11px] text-blue-100/80 leading-snug">
                    Kết nối giảng viên và sinh viên qua mã lớp học trực quan.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight mb-0.5">
                    Quản lý nộp bài & Chấm điểm AI
                  </h4>
                  <p className="text-[11px] text-blue-100/80 leading-snug">
                    Nộp bài tập đa định dạng, nhận điểm và phân tích tự động.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight mb-0.5">
                    Hỏi đáp kiến thức không giới hạn
                  </h4>
                  <p className="text-[11px] text-blue-100/80 leading-snug">
                    AI giải đáp chi tiết lý thuyết, code mẫu và gợi ý tài liệu học.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Social Proof */}
            <div className="flex items-center justify-between pt-3 border-t border-white/15 relative z-10 text-[11px] text-blue-100">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-[9px] font-bold ring-2 ring-blue-600">DN</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-900 text-[9px] font-bold ring-2 ring-blue-600">BK</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold ring-2 ring-blue-600">SP</span>
                </div>
                <span>Được tin dùng bởi <strong>40+ Trường Đại học</strong></span>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
          </div>

          {/* Right Column: Compact Register Form (shifted towards right) */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-center items-center lg:items-end bg-white">
            
            {/* Inner Compact Container (max-w-[370px] and right aligned) */}
            <div className="w-full max-w-[370px] lg:mr-2 flex flex-col justify-between">
              
              {/* Form Header */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                      <UserPlus className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900">
                          TẠO TÀI KHOẢN
                        </span>
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                          FREE
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">Tham gia cộng đồng AI Classroom</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Bảo mật
                  </span>
                </div>

                {loiChung && (
                  <div className="mb-2 p-2.5 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span>{loiChung}</span>
                  </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-2 mt-1">
                  
                  {/* Họ và tên */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={hoTen}
                        onChange={(e) => {
                          setHoTen(e.target.value);
                          if (loiHoTen) setLoiHoTen('');
                        }}
                        placeholder="Trần Việt Huy"
                        className={`w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50/90 rounded-xl border transition outline-none ${
                          loiHoTen
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                            : 'border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    {loiHoTen && (
                      <p className="flex items-center gap-1 text-[10px] text-rose-600 font-medium mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{loiHoTen}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Email trường / cá nhân <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (loiEmail) setLoiEmail('');
                        }}
                        placeholder="huy.tran@aiclassroom.edu.vn"
                        className={`w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50/90 rounded-xl border transition outline-none ${
                          loiEmail
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                            : 'border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    {loiEmail && (
                      <p className="flex items-center gap-1 text-[10px] text-rose-600 font-medium mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{loiEmail}</span>
                      </p>
                    )}
                  </div>

                  {/* Mật khẩu */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Mật khẩu <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={hienMatKhau ? 'text' : 'password'}
                        value={matKhau}
                        onChange={(e) => {
                          setMatKhau(e.target.value);
                          if (loiMatKhau) setLoiMatKhau('');
                        }}
                        placeholder="Tối thiểu 6 ký tự"
                        className={`w-full pl-9 pr-9 py-1.5 text-xs bg-slate-50/90 rounded-xl border transition outline-none ${
                          loiMatKhau
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                            : 'border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setHienMatKhau(!hienMatKhau)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                        tabIndex={-1}
                      >
                        {hienMatKhau ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {loiMatKhau && (
                      <p className="flex items-center gap-1 text-[10px] text-rose-600 font-medium mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{loiMatKhau}</span>
                      </p>
                    )}
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Số điện thoại (Tùy chọn)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={soDienThoai}
                        onChange={(e) => setSoDienThoai(e.target.value)}
                        placeholder="0912345678"
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50/90 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
                      />
                    </div>
                  </div>

                  {/* Chọn vai trò */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Vai trò của bạn <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setVaiTro('SINH_VIEN')}
                        className={`py-1.5 px-2.5 text-[11px] font-bold rounded-xl border transition text-center shadow-2xs ${
                          vaiTro === 'SINH_VIEN'
                            ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        🎓 Sinh viên
                      </button>
                      <button
                        type="button"
                        onClick={() => setVaiTro('GIAO_VIEN')}
                        className={`py-1.5 px-2.5 text-[11px] font-bold rounded-xl border transition text-center shadow-2xs ${
                          vaiTro === 'GIAO_VIEN'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        👨‍🏫 Giảng viên
                      </button>
                    </div>
                  </div>

                  {/* Đồng ý điều khoản */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <input
                      type="checkbox"
                      id="dieukhoan"
                      checked={dongYDieuKhoan}
                      onChange={(e) => setDongYDieuKhoan(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <label htmlFor="dieukhoan" className="text-[10px] text-slate-600 cursor-pointer select-none">
                      Tôi đồng ý với <a href="#terms" className="text-blue-600 hover:underline">Điều khoản</a> & <a href="#privacy" className="text-blue-600 hover:underline">Chính sách</a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={dangXuLy}
                    className="w-full mt-1 flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{dangXuLy ? 'Đang khởi tạo tài khoản...' : 'Đăng ký tài khoản'}</span>
                  </button>
                </form>

                {/* Link Login */}
                <div className="text-center mt-3 pt-2.5 border-t border-slate-100">
                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    Đã có tài khoản?{' '}
                    <Link to="/dang-nhap" className="font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5">
                      <span>Đăng nhập tại đây</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* 3. Bottom Footer Links */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 py-2 px-2 text-[10px] sm:text-[11px] text-slate-500">
        <div>
          © 2026 AI Classroom Inc. All academic rights reserved.
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <a href="#privacy" className="hover:text-slate-800 transition">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-800 transition">Terms of Service</a>
          <a href="#status" className="hover:text-slate-800 transition">System Status</a>
          <a href="#support" className="hover:text-slate-800 transition">Support</a>
        </div>
      </footer>

    </div>
  );
};
