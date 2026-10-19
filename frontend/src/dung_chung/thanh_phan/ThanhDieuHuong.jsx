import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dungXacThuc } from '../kho_luu_tru/NguCanhXacThuc';
import { BangThongBao } from './BangThongBao';
import { ModalHoSoCaNhan } from './ModalHoSoCaNhan';
import { 
  Sparkles, 
  LogOut, 
  Plus, 
  GraduationCap, 
  ChevronDown, 
  Menu, 
  Search, 
  BookOpen, 
  User,
  Settings
} from 'lucide-react';

export const ThanhDieuHuong = ({ onOpenModalTaoLop, onOpenModalThamGia, onToggleSidebar }) => {
  const { nguoiDung, dangXuat, laGiaoVien, laSinhVien, laAdmin } = dungXacThuc();
  const [moMenuUser, setMoMenuUser] = useState(false);
  const [moModalHoSo, setMoModalHoSo] = useState(false);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const navigate = useNavigate();

  const hoTen = (nguoiDung?.hoTen && nguoiDung.hoTen !== 'Nguyễn Văn An') ? nguoiDung.hoTen : 'Trần Việt Huy';
  const email = nguoiDung?.email || 'sinhvien@aiclassroom.com';
  const chuCaiDau = hoTen.charAt(0).toUpperCase();

  let vaiTroLabel = 'Sinh viên';
  let vaiTroBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  if (laAdmin || nguoiDung?.vaiTro === 'ADMIN') {
    vaiTroLabel = 'Quản trị viên';
    vaiTroBadgeClass = 'bg-purple-50 text-purple-700 border-purple-200/80';
  } else if (laGiaoVien || nguoiDung?.vaiTro === 'GIAO_VIEN') {
    vaiTroLabel = 'Giảng viên';
    vaiTroBadgeClass = 'bg-blue-50 text-blue-700 border-blue-200/80';
  }

  const handleDangXuat = () => {
    dangXuat();
    navigate('/dang-nhap');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6 select-none shadow-2xs">
        {/* Left: Hamburger menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-slate-900">
                AI Classroom
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200/60">
                <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                AI
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Centered Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={tuKhoaTimKiem}
              onChange={(e) => setTuKhoaTimKiem(e.target.value)}
              placeholder="Tìm kiếm lớp học, bài tập, tài liệu..."
              className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
              Ctrl + K
            </span>
          </div>
        </div>

        {/* Right Controls: Tham gia lớp, Thông báo, Avatar & Tên sinh viên */}
        <div className="flex items-center gap-3">
          {/* + Tham gia lớp / Tạo lớp mới */}
          {laGiaoVien ? (
            <Link
              to="/giao-vien/tao-lop"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Tạo lớp mới</span>
            </Link>
          ) : (
            <button
              onClick={onOpenModalThamGia}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tham gia lớp</span>
            </button>
          )}

          {/* Notifications with Red Badge */}
          <BangThongBao />

          {/* User Profile Dropdown at Top Right Corner */}
          <div className="relative">
            <button
              onClick={() => setMoMenuUser(!moMenuUser)}
              className="flex items-center gap-2.5 p-1 sm:px-2 py-1.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs shadow-sm">
                {chuCaiDau}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                    {hoTen}
                  </span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-md border ${vaiTroBadgeClass}`}>
                    {vaiTroLabel}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate max-w-[170px]">
                  {email}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {moMenuUser && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMoMenuUser(false)} />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-900/10 z-40 border border-slate-200/80 animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Header info */}
                  <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{hoTen}</p>
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md border ${vaiTroBadgeClass}`}>
                        {vaiTroLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1 space-y-0.5 text-xs">
                    
                    {/* Quản lý hồ sơ Button */}
                    <button
                      onClick={() => {
                        setMoMenuUser(false);
                        setMoModalHoSo(true);
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Quản lý hồ sơ cá nhân</span>
                    </button>

                    <button
                      onClick={() => {
                        setMoMenuUser(false);
                        navigate(laAdmin ? '/quan-tri' : (laGiaoVien ? '/giao-vien' : '/sinh-vien'));
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    >
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      <span>Bảng điều khiển</span>
                    </button>

                    <button
                      onClick={() => {
                        setMoMenuUser(false);
                        navigate('/sinh-vien/ai-tro-ly');
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Trợ lý AI học tập</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={handleDangXuat}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Profile Management Modal */}
      <ModalHoSoCaNhan
        mo={moModalHoSo}
        onDong={() => setMoModalHoSo(false)}
      />
    </>
  );
};

export default ThanhDieuHuong;
