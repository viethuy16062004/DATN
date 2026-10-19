import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quanTriDichVu } from '../dich_vu/quanTriDichVu';
import { 
  Users, 
  Search, 
  Filter, 
  Trash2, 
  Shield, 
  ArrowLeft,
  UserPlus,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Lock,
  User,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const QuanLyNguoiDung = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [locVaiTro, setLocVaiTro] = useState('');
  const [timKiem, setTimKiem] = useState('');
  const [dangTai, setDangTai] = useState(true);

  // Modals state
  const [moModalThem, setMoModalThem] = useState(false);
  const [moModalResetPass, setMoModalResetPass] = useState(false);
  const [userDangChon, setUserDangChon] = useState(null);

  // Form Thêm Người Dùng state
  const [formThem, setFormThem] = useState({
    hoTen: '',
    email: '',
    matKhau: '123456',
    vaiTro: 'SINH_VIEN',
    soDienThoai: ''
  });
  const [loiFormThem, setLoiFormThem] = useState('');
  const [dangLuuThem, setDangLuuThem] = useState(false);

  // Form Reset Password state
  const [matKhauMoi, setMatKhauMoi] = useState('123456');
  const [dangLuuReset, setDangLuuReset] = useState(false);
  const [loiReset, setLoiReset] = useState('');

  // Toast notification state
  const [thongBao, setThongBao] = useState(null);

  const hienThongBao = (noiDung, loai = 'success') => {
    setThongBao({ noiDung, loai });
    setTimeout(() => setThongBao(null), 3500);
  };

  const taiNguoiDung = async () => {
    setDangTai(true);
    try {
      const res = await quanTriDichVu.layDanhSachNguoiDung(locVaiTro || null);
      setDanhSach(res);
    } catch (err) {
      console.error(err);
      hienThongBao('Không thể tải danh sách người dùng', 'error');
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiNguoiDung();
  }, [locVaiTro]);

  const handleDoiVaiTro = async (id, vaiTroMoi) => {
    try {
      await quanTriDichVu.doiVaiTro(id, vaiTroMoi);
      setDanhSach(prev => prev.map(u => u.id === id ? { ...u, vaiTro: vaiTroMoi } : u));
      hienThongBao('Đã cập nhật vai trò người dùng thành công!');
    } catch (err) {
      hienThongBao(err.response?.data?.thongDiep || 'Không thể đổi vai trò', 'error');
    }
  };

  const handleXoaNguoiDung = async (id, hoTen) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${hoTen}" khỏi hệ thống? Dữ liệu liên quan có thể bị xóa.`)) {
      try {
        await quanTriDichVu.xoaNguoiDung(id);
        setDanhSach(prev => prev.filter(u => u.id !== id));
        hienThongBao(`Đã xóa tài khoản "${hoTen}" thành công`);
      } catch (err) {
        hienThongBao(err.response?.data?.thongDiep || 'Không thể xóa tài khoản này', 'error');
      }
    }
  };

  const handleTaoNguoiDung = async (e) => {
    e.preventDefault();
    if (!formThem.hoTen || !formThem.email || !formThem.matKhau) {
      setLoiFormThem('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    setDangLuuThem(true);
    setLoiFormThem('');
    try {
      const res = await quanTriDichVu.taoNguoiDung(formThem);
      setDanhSach(prev => [res, ...prev]);
      setMoModalThem(false);
      setFormThem({ hoTen: '', email: '', matKhau: '123456', vaiTro: 'SINH_VIEN', soDienThoai: '' });
      hienThongBao(`Đã tạo tài khoản "${res.hoTen}" thành công!`);
    } catch (err) {
      setLoiFormThem(err.response?.data?.thongDiep || err.response?.data?.message || 'Lỗi khi tạo người dùng');
    } finally {
      setDangLuuThem(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!matKhauMoi || matKhauMoi.length < 6) {
      setLoiReset('Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }
    setDangLuuReset(true);
    setLoiReset('');
    try {
      await quanTriDichVu.datLaiMatKhau(userDangChon.id, matKhauMoi);
      setMoModalResetPass(false);
      setUserDangChon(null);
      hienThongBao(`Đã đặt lại mật khẩu cho "${userDangChon.hoTen}" thành công!`);
    } catch (err) {
      setLoiReset(err.response?.data?.thongDiep || 'Không thể đặt lại mật khẩu');
    } finally {
      setDangLuuReset(false);
    }
  };

  const danhSachLoc = danhSach.filter(u => 
    u.hoTen?.toLowerCase().includes(timKiem.toLowerCase()) || 
    u.email?.toLowerCase().includes(timKiem.toLowerCase())
  );

  const soLuongSV = danhSach.filter(u => u.vaiTro === 'SINH_VIEN').length;
  const soLuongGV = danhSach.filter(u => u.vaiTro === 'GIAO_VIEN').length;
  const soLuongAdmin = danhSach.filter(u => u.vaiTro === 'ADMIN').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {thongBao && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all animate-bounce ${
          thongBao.loai === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {thongBao.loai === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          <span>{thongBao.noiDung}</span>
        </div>
      )}

      {/* Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/quan-tri"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thống kê Quản trị</span>
        </Link>
      </div>

      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Quản lý tài khoản người dùng
              </h1>
              <p className="text-xs text-slate-500">
                Toàn quyền kiểm soát tài khoản Sinh viên, Giảng viên và Quản trị viên hệ thống.
              </p>
            </div>
          </div>
        </div>

        {/* Create User Button */}
        <button
          onClick={() => {
            setFormThem({ hoTen: '', email: '', matKhau: '123456', vaiTro: 'SINH_VIEN', soDienThoai: '' });
            setLoiFormThem('');
            setMoModalThem(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-98 rounded-xl transition shadow-md shadow-purple-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Thêm tài khoản mới</span>
        </button>
      </div>

      {/* Quick Role Badges & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Role Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setLocVaiTro('')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              locVaiTro === '' 
                ? 'bg-purple-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Tất cả ({danhSach.length})
          </button>
          <button
            onClick={() => setLocVaiTro('SINH_VIEN')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              locVaiTro === 'SINH_VIEN' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            🎓 Sinh viên ({soLuongSV})
          </button>
          <button
            onClick={() => setLocVaiTro('GIAO_VIEN')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              locVaiTro === 'GIAO_VIEN' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            👨‍🏫 Giảng viên ({soLuongGV})
          </button>
          <button
            onClick={() => setLocVaiTro('ADMIN')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              locVaiTro === 'ADMIN' 
                ? 'bg-purple-800 text-white shadow-xs' 
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            👑 Quản trị ({soLuongAdmin})
          </button>
        </div>

        {/* Search Input & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={timKiem}
              onChange={(e) => setTimKiem(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              className="pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition w-full sm:w-64"
            />
          </div>

          <button
            onClick={taiNguoiDung}
            title="Làm mới danh sách"
            className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dangTai ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        {dangTai ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto mb-3" />
            Đang tải dữ liệu người dùng...
          </div>
        ) : danhSachLoc.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold">Không tìm thấy tài khoản người dùng phù hợp.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Người dùng</th>
                  <th className="py-3.5 px-4">Email liên hệ</th>
                  <th className="py-3.5 px-4">Số điện thoại</th>
                  <th className="py-3.5 px-4">Phân quyền vai trò</th>
                  <th className="py-3.5 px-4">Ngày tham gia</th>
                  <th className="py-3.5 px-5 text-right">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {danhSachLoc.map((u) => (
                  <tr key={u.id} className="hover:bg-purple-50/20 transition">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-black text-xs shadow-2xs ${
                          u.vaiTro === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : (u.vaiTro === 'GIAO_VIEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800')
                        }`}>
                          {u.hoTen?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.hoTen}</p>
                          <p className="text-[10px] text-slate-400">ID: #{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-500">{u.soDienThoai || 'Chưa cập nhật'}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.vaiTro}
                        onChange={(e) => handleDoiVaiTro(u.id, e.target.value)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border outline-none transition cursor-pointer ${
                          u.vaiTro === 'ADMIN' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : (u.vaiTro === 'GIAO_VIEN' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-blue-50 text-blue-700 border-blue-200')
                        }`}
                      >
                        <option value="SINH_VIEN">🎓 SINH VIÊN</option>
                        <option value="GIAO_VIEN">👨‍🏫 GIẢNG VIÊN</option>
                        <option value="ADMIN">👑 QUẢN TRỊ VIÊN</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {u.ngayTao ? new Date(u.ngayTao).toLocaleDateString('vi-VN') : 'Mặc định'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setUserDangChon(u);
                            setMatKhauMoi('123456');
                            setLoiReset('');
                            setMoModalResetPass(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition"
                          title="Đặt lại mật khẩu"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleXoaNguoiDung(u.id, u.hoTen)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Thêm người dùng mới */}
      {moModalThem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Thêm người dùng mới</h3>
                  <p className="text-[11px] text-slate-500">Cấp tài khoản mới trực tiếp vào hệ thống</p>
                </div>
              </div>
              <button
                onClick={() => setMoModalThem(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loiFormThem && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loiFormThem}</span>
              </div>
            )}

            <form onSubmit={handleTaoNguoiDung} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formThem.hoTen}
                    onChange={(e) => setFormThem({ ...formThem, hoTen: e.target.value })}
                    placeholder="VD: Trần Việt Huy"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email đăng nhập <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formThem.email}
                    onChange={(e) => setFormThem({ ...formThem, email: e.target.value })}
                    placeholder="user@aiclassroom.edu.vn"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vai trò hệ thống</label>
                  <select
                    value={formThem.vaiTro}
                    onChange={(e) => setFormThem({ ...formThem, vaiTro: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none font-bold"
                  >
                    <option value="SINH_VIEN">🎓 Sinh viên</option>
                    <option value="GIAO_VIEN">👨‍🏫 Giảng viên</option>
                    <option value="ADMIN">👑 Quản trị</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formThem.soDienThoai}
                      onChange={(e) => setFormThem({ ...formThem, soDienThoai: e.target.value })}
                      placeholder="0912345678"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu khởi tạo <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formThem.matKhau}
                    onChange={(e) => setFormThem({ ...formThem, matKhau: e.target.value })}
                    placeholder="Mặc định: 123456"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMoModalThem(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={dangLuuThem}
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20 transition disabled:opacity-50"
                >
                  {dangLuuThem ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Đặt lại mật khẩu */}
      {moModalResetPass && userDangChon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Đặt lại mật khẩu</h3>
                  <p className="text-[11px] text-slate-500">{userDangChon.hoTen}</p>
                </div>
              </div>
              <button
                onClick={() => setMoModalResetPass(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loiReset && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loiReset}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu mới</label>
                <input
                  type="text"
                  required
                  value={matKhauMoi}
                  onChange={(e) => setMatKhauMoi(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">Mặc định đề xuất: 123456</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMoModalResetPass(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={dangLuuReset}
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20 transition disabled:opacity-50"
                >
                  {dangLuuReset ? 'Đang lưu...' : 'Xác nhận đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyNguoiDung;
