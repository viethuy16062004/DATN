import React, { useState, useEffect } from 'react';
import { dungXacThuc } from '../kho_luu_tru/NguCanhXacThuc';
import { xacThucDichVu } from '../dich_vu/xacThucDichVu';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Save, 
  CheckCircle, 
  AlertCircle,
  GraduationCap,
  KeyRound,
  Sparkles,
  Camera
} from 'lucide-react';

export const ModalHoSoCaNhan = ({ mo, onDong }) => {
  const { nguoiDung, capNhatThongTin } = dungXacThuc();
  const [hoTen, setHoTen] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [anhDaiDien, setAnhDaiDien] = useState('');
  const [dangLuu, setDangLuu] = useState(false);
  const [thongBao, setThongBao] = useState({ loai: '', thongDiep: '' });

  useEffect(() => {
    if (nguoiDung) {
      setHoTen(nguoiDung.hoTen || '');
      setSoDienThoai(nguoiDung.soDienThoai || '');
      setAnhDaiDien(nguoiDung.anhDaiDien || '');
      setMatKhauMoi('');
      setThongBao({ loai: '', thongDiep: '' });
    }
  }, [nguoiDung, mo]);

  if (!mo) return null;

  const handleLuu = async (e) => {
    e.preventDefault();
    if (!hoTen.trim()) {
      setThongBao({ loai: 'loi', thongDiep: 'Vui lòng nhập họ và tên của bạn' });
      return;
    }

    setDangLuu(true);
    setThongBao({ loai: '', thongDiep: '' });

    try {
      const payload = {
        hoTen: hoTen.trim(),
        soDienThoai: soDienThoai.trim(),
        anhDaiDien: anhDaiDien.trim()
      };
      if (matKhauMoi.trim()) {
        payload.matKhauMoi = matKhauMoi.trim();
      }

      const res = await xacThucDichVu.capNhatThongTinCaNhan(payload);
      capNhatThongTin(res);
      setThongBao({ loai: 'thanh-cong', thongDiep: 'Cập nhật hồ sơ cá nhân thành công!' });
      setTimeout(() => {
        onDong();
      }, 1200);
    } catch (err) {
      setThongBao({ 
        loai: 'loi', 
        thongDiep: err.response?.data?.thongDiep || 'Không thể cập nhật hồ sơ, vui lòng thử lại!' 
      });
    } finally {
      setDangLuu(false);
    }
  };

  const layTenVaiTro = () => {
    if (nguoiDung?.vaiTro === 'ADMIN') return 'Quản Trị Viên';
    if (nguoiDung?.vaiTro === 'GIAO_VIEN') return 'Giảng Viên';
    return 'Sinh Viên';
  };

  const chuCaiDau = (hoTen || nguoiDung?.hoTen || 'U').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div 
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Quản lý hồ sơ cá nhân</h3>
              <p className="text-[11px] text-slate-500">Xem và chỉnh sửa thông tin tài khoản của bạn</p>
            </div>
          </div>
          <button
            onClick={onDong}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleLuu} className="p-6 space-y-4">
          
          {/* Alert Notification */}
          {thongBao.thongDiep && (
            <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              thongBao.loai === 'thanh-cong'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {thongBao.loai === 'thanh-cong' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{thongDiep}</span>
            </div>
          )}

          {/* Avatar Profile Section */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                {chuCaiDau}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-extrabold text-slate-900 truncate">
                {hoTen || nguoiDung?.hoTen || 'Người dùng'}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">{nguoiDung?.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
                  {layTenVaiTro()}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">• Hệ thống AI Classroom</span>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3 pt-1">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition font-medium"
                />
              </div>
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Địa chỉ Email <span className="text-slate-400 font-normal">(Cố định theo tài khoản)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={nguoiDung?.email || ''}
                  disabled
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed outline-none font-medium"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số điện thoại liên hệ
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={soDienThoai}
                  onChange={(e) => setSoDienThoai(e.target.value)}
                  placeholder="VD: 0912345678"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition font-medium"
                />
              </div>
            </div>

            {/* Password Change */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đổi mật khẩu mới <span className="text-slate-400 font-normal">(Bỏ trống nếu không muốn đổi)</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={matKhauMoi}
                  onChange={(e) => setMatKhauMoi(e.target.value)}
                  placeholder="Nhập mật khẩu mới ít nhất 6 ký tự"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition font-medium"
                />
              </div>
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onDong}
              disabled={dangLuu}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={dangLuu}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition disabled:opacity-50 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{dangLuu ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalHoSoCaNhan;
