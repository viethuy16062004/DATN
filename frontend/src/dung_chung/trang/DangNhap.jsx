import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  LogIn, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe,
  Monitor,
  GitBranch,
  Bot,
  Check
} from 'lucide-react';
import { dungXacThuc } from '../kho_luu_tru/NguCanhXacThuc';

export const DangNhap = () => {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [ghiNho, setGhiNho] = useState(true);
  const [hienMatKhau, setHienMatKhau] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [ngonNgu, setNgonNgu] = useState('VI');
  
  // Validation errors
  const [loiEmail, setLoiEmail] = useState('');
  const [loiMatKhau, setLoiMatKhau] = useState('');
  const [loiChung, setLoiChung] = useState('');

  const { dangNhap } = dungXacThuc();
  const navigate = useNavigate();

  // Validate email format
  const validateEmailFormat = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const handleKiemTraValidation = () => {
    let hopLe = true;

    // 1. Kiểm tra Email
    if (!email.trim()) {
      setLoiEmail('Email không được để trống');
      hopLe = false;
    } else if (!validateEmailFormat(email.trim())) {
      setLoiEmail('Email không đúng định dạng');
      hopLe = false;
    } else {
      setLoiEmail('');
    }

    // 2. Kiểm tra Mật khẩu
    if (!matKhau) {
      setLoiMatKhau('Mật khẩu không được để trống');
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

    setDangXuLy(true);

    try {
      const user = await dangNhap(email.trim(), matKhau);
      if (user?.vaiTro === 'ADMIN') {
        navigate('/quan-tri');
      } else if (user?.vaiTro === 'GIAO_VIEN') {
        navigate('/giao-vien');
      } else {
        navigate('/sinh-vien');
      }
    } catch (err) {
      const thongDiepLoi = err.response?.data?.thongDiep || err.response?.data?.message || 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại Backend.';
      setLoiChung(thongDiepLoi);
    } finally {
      setDangXuLy(false);
    }
  };

  const handleChonTaiKhoanDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setMatKhau(demoPass);
    setLoiEmail('');
    setLoiMatKhau('');
    setLoiChung('');
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
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          
          {/* Left Column: AI Classroom Banner (48% width on Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-7 flex-col justify-between relative overflow-hidden">
            {/* Background Light Effects */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top Badge & Heading */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-blue-100 border border-white/20 mb-4">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Thế hệ EduAI 2026</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight leading-tight mb-2.5">
                Học tập & Giảng dạy thông minh cùng Trợ lý AI
              </h2>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Không gian số hóa cá nhân hóa toàn diện, đồng hành cùng hàng nghìn giảng viên và sinh viên tối ưu hóa tri thức mỗi ngày.
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
                    Lớp học tương tác thông minh
                  </h4>
                  <p className="text-[11px] text-blue-100/80 leading-snug">
                    Tóm tắt bài giảng tự động, dịch thuật ngữ chuyên ngành tức thời.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight mb-0.5">
                    Gợi ý bài tập & Lộ trình AI
                  </h4>
                  <p className="text-[11px] text-blue-100/80 leading-snug">
                    Chẩn đoán lỗ hổng kiến thức và cá nhân hóa lộ trình học tập.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight mb-0.5">
                    Trợ lý học thuật 24/7
                  </h4>
                  <p className="text-[11px] text-blue-100/80 leading-snug">
                    Giải đáp thắc mắc theo phương pháp Socratic, rèn luyện tư duy phản biện.
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

          {/* Right Column: Compact Form Section shifted towards Right (52% on Desktop) */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-center items-center lg:items-end bg-white">
            
            {/* Inner Compact Container (max-w-[370px] and right aligned) */}
            <div className="w-full max-w-[370px] lg:mr-2 flex flex-col justify-between">
              
              {/* Form Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                      <GraduationCap className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900">
                          AI CLASSROOM
                        </span>
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                          AI
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">Đăng nhập vào tài khoản của bạn</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Bảo mật 256-bit
                  </span>
                </div>

                {/* Social Login (Google Edu & MS 365) */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => handleChonTaiKhoanDemo('sinhvien@aiclassroom.edu.vn', '123456')}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.39 7.35 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Google Edu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChonTaiKhoanDemo('giaovien@aiclassroom.edu.vn', '123456')}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
                  >
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 21 21">
                      <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                      <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                      <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                    </svg>
                    <span>Microsoft 365</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex py-1.5 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    HOẶC DÙNG EMAIL TRƯỜNG
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Login Form (Compact & Clean) */}
                <form onSubmit={handleSubmit} noValidate className="space-y-2.5 mt-1">
                  {/* Email Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Email đăng nhập <span className="text-rose-500">*</span>
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
                        placeholder="huy_2251220239@dau.edu.vn"
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50/90 rounded-xl border transition outline-none ${
                          loiEmail
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                            : 'border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    {loiEmail && (
                      <p className="flex items-center gap-1 text-[10px] text-rose-600 font-medium mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{loiEmail}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Mật khẩu <span className="text-rose-500">*</span>
                      </label>
                      <a 
                        href="#quen-mat-khau" 
                        onClick={(e) => { e.preventDefault(); alert('Vui lòng liên hệ Quản trị viên để đặt lại mật khẩu.'); }}
                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
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
                        placeholder="••••••••••••••••"
                        className={`w-full pl-9 pr-9 py-2 text-xs bg-slate-50/90 rounded-xl border transition outline-none ${
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
                      <p className="flex items-center gap-1 text-[10px] text-rose-600 font-medium mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{loiMatKhau}</span>
                      </p>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={ghiNho}
                        onChange={(e) => setGhiNho(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                      />
                      <span className="text-[11px] text-slate-600 font-medium">Ghi nhớ đăng nhập</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={dangXuLy}
                    className="w-full mt-1 flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{dangXuLy ? 'Đang xác thực...' : 'Đăng nhập'}</span>
                  </button>
                </form>

                {/* Link Register */}
                <div className="text-center mt-2.5">
                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    Chưa có tài khoản?{' '}
                    <Link to="/dang-ky" className="font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5">
                      <span>Đăng ký ngay</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </p>
                </div>
              </div>

              {/* Quick Demo Accounts Pill (Ultra Compact) */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Điền nhanh tài khoản:
                    </span>
                    <span className="text-[8px] font-extrabold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-200">DEMO</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => handleChonTaiKhoanDemo('sinhvien@aiclassroom.edu.vn', '123456')}
                      className="px-1.5 py-1 text-[10px] font-semibold bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 rounded-lg transition truncate text-center shadow-2xs"
                    >
                      🎓 Sinh viên
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChonTaiKhoanDemo('giaovien@aiclassroom.edu.vn', '123456')}
                      className="px-1.5 py-1 text-[10px] font-semibold bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 rounded-lg transition truncate text-center shadow-2xs"
                    >
                      👨‍🏫 Giảng viên
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChonTaiKhoanDemo('admin@aiclassroom.edu.vn', '123456')}
                      className="px-1.5 py-1 text-[10px] font-semibold bg-white hover:bg-purple-50 text-purple-700 border border-slate-200 rounded-lg transition truncate text-center shadow-2xs"
                    >
                      👑 Quản trị
                    </button>
                  </div>
                </div>

                {/* Bottom Security Info */}
                <div className="flex items-center justify-center gap-2 mt-2 text-[9px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-blue-500" />
                    SSO Trường Đại học
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                    AI Tutor 4.5 Active
                  </span>
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
