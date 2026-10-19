import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { ModalThamGiaLop } from '../thanh_phan/ModalThamGiaLop';
import {
  Users,
  Search,
  Plus,
  BookOpen,
  ArrowRight,
  Code2,
  Database,
  Cpu,
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';

export const DanhSachLopSinhVien = () => {
  const navigate = useNavigate();
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [tuKhoa, setTuKhoa] = useState('');
  const [boLocTrangThai, setBoLocTrangThai] = useState('tat_ca'); // 'tat_ca', 'dang_hoc', 'hoan_thanh'
  const [moModalThamGia, setMoModalThamGia] = useState(false);

  const duLieuLopMau = [
    {
      id: '1',
      maLop: 'WEB2026',
      tenLop: 'Lập Trình Web React & Spring',
      giangVien: 'TS. Lê Hoàng Nam',
      soHocSinh: 2,
      soBaiTap: 2,
      tienDo: 33,
      daNop: 4,
      tongBai: 12,
      trangThai: 'dang_hoc',
      themeColor: 'from-blue-600 via-blue-700 to-indigo-800',
      icon: Code2,
      barColor: 'bg-blue-600'
    },
    {
      id: '2',
      maLop: 'DSA2026',
      tenLop: 'Cấu Trúc Dữ Liệu & Giải Thuật AI',
      giangVien: 'TS. Lê Hoàng Nam',
      soHocSinh: 1,
      soBaiTap: 1,
      tienDo: 70,
      daNop: 7,
      tongBai: 10,
      trangThai: 'dang_hoc',
      themeColor: 'from-emerald-600 via-teal-700 to-slate-800',
      icon: Database,
      barColor: 'bg-emerald-500'
    },
    {
      id: '3',
      maLop: 'AI2026',
      tenLop: 'Trí Tuệ Nhân Tạo Ứng Dụng',
      giangVien: 'TS. Lê Hoàng Nam',
      soHocSinh: 1,
      soBaiTap: 0,
      tienDo: 12,
      daNop: 1,
      tongBai: 8,
      trangThai: 'dang_hoc',
      themeColor: 'from-purple-600 via-indigo-700 to-purple-900',
      icon: Cpu,
      barColor: 'bg-purple-600'
    }
  ];

  const taiDanhSachLop = async () => {
    setDangTai(true);
    try {
      const data = await lopHocDichVu.layDanhSach();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((l, i) => ({
          id: l.id,
          maLop: l.maLop || `LOP${l.id}`,
          tenLop: l.tenLop || `Lớp học #${l.id}`,
          giangVien: l.tenGiaoVien || l.giaoVien?.hoTen || 'Giảng viên phụ trách',
          soHocSinh: l.soHocSinh || 1,
          soBaiTap: l.soBaiTap || 0,
          tienDo: l.tienDo || (l.tongBai ? Math.round(((l.daNop || 0) / l.tongBai) * 100) : 0),
          daNop: l.daNop || 0,
          tongBai: l.tongBai || (l.soBaiTap || 0),
          trangThai: (l.tienDo === 100) ? 'hoan_thanh' : 'dang_hoc',
          themeColor: duLieuLopMau[i % duLieuLopMau.length].themeColor,
          icon: i % 3 === 0 ? Code2 : (i % 3 === 1 ? Database : Cpu),
          barColor: duLieuLopMau[i % duLieuLopMau.length].barColor
        }));
        setDanhSachLop(mapped);
      } else {
        setDanhSachLop([]);
      }
    } catch (e) {
      console.warn('Lỗi tải danh sách lớp học:', e);
      setDanhSachLop([]);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDanhSachLop();
  }, []);

  const lopLoc = danhSachLop.filter((lop) => {
    const khopTuKhoa = 
      lop.tenLop.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      lop.maLop.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      lop.giangVien.toLowerCase().includes(tuKhoa.toLowerCase());
    
    if (!khopTuKhoa) return false;
    if (boLocTrangThai === 'tat_ca') return true;
    if (boLocTrangThai === 'dang_hoc') return lop.trangThai === 'dang_hoc';
    if (boLocTrangThai === 'hoan_thanh') return lop.trangThai === 'hoan_thanh';
    return true;
  });

  const tongSoLop = danhSachLop.length;
  const tongSoBaiTap = danhSachLop.reduce((acc, cur) => acc + (cur.soBaiTap || 0), 0);
  const tienDoTrungBinh = tongSoLop > 0 
    ? Math.round(danhSachLop.reduce((acc, cur) => acc + (cur.tienDo || 0), 0) / tongSoLop) 
    : 0;

  return (
    <div className="space-y-6 max-w-[1450px] mx-auto pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Lớp học của tôi
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {tongSoLop} môn học
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Quản lý toàn bộ danh sách lớp học, theo dõi tiến độ bài tập và truy cập bài giảng trực tuyến.
          </p>
        </div>

        <button
          onClick={() => setMoModalThamGia(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-95 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tham gia lớp mới</span>
        </button>
      </div>

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Tổng số lớp đã tham gia</p>
            <p className="text-lg font-black text-slate-900">{tongSoLop} lớp học</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Tổng bài tập cần làm</p>
            <p className="text-lg font-black text-slate-900">{tongSoBaiTap} bài tập</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Tiến độ hoàn thành TB</p>
            <p className="text-lg font-black text-emerald-600">{tienDoTrungBinh}%</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder="Tìm theo tên môn, mã lớp, giảng viên..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {[
            { key: 'tat_ca', label: `Tất cả (${danhSachLop.length})` },
            { key: 'dang_hoc', label: `Đang học (${danhSachLop.filter(l => l.trangThai === 'dang_hoc').length})` },
            { key: 'hoan_thanh', label: `Đã xong (${danhSachLop.filter(l => l.trangThai === 'hoan_thanh').length})` }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setBoLocTrangThai(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                boLocTrangThai === tab.key
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      {dangTai ? (
        <div className="py-16 text-center text-xs text-slate-400">
          <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Đang tải danh sách lớp học...
        </div>
      ) : lopLoc.length === 0 ? (
        tongSoLop === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Bạn chưa tham gia lớp học nào</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Hãy liên hệ giảng viên phụ trách để nhận mã lớp học hoặc tham gia bằng đường link mời của giảng viên.
              </p>
            </div>
            <button
              onClick={() => setMoModalThamGia(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tham gia lớp học ngay</span>
            </button>
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Không tìm thấy lớp học nào</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không có lớp học nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.
            </p>
            <button
              onClick={() => { setTuKhoa(''); setBoLocTrangThai('tat_ca'); }}
              className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lopLoc.map((lop) => {
            const IconComponent = lop.icon;
            return (
              <div
                key={lop.id}
                className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top gradient header banner */}
                <div className={`p-4 bg-gradient-to-r ${lop.themeColor} text-white flex items-center justify-between`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-2xs">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold tracking-wide uppercase text-white/90">
                      Môn học
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                    {lop.maLop}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                      {lop.tenLop}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>GV: {lop.giangVien}</span>
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>Tiến độ hoàn thành</span>
                      <span className="font-bold text-slate-900">
                        {lop.tienDo}% <span className="text-slate-400 font-normal">({lop.daNop}/{lop.tongBai} bài)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${lop.barColor}`}
                        style={{ width: `${lop.tienDo}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">
                      👥 {lop.soHocSinh} sinh viên • 📝 {lop.soBaiTap} bài tập
                    </span>
                    <Link
                      to={`/sinh-vien/lop/${lop.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1 shadow-sm shadow-blue-500/20 active:scale-95"
                    >
                      <span>Vào lớp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal Tham Gia Lớp */}
      <ModalThamGiaLop
        mo={moModalThamGia}
        onDong={() => setMoModalThamGia(false)}
        onThanhCong={() => {
          setMoModalThamGia(false);
          taiDanhSachLop();
        }}
      />

    </div>
  );
};

export default DanhSachLopSinhVien;
