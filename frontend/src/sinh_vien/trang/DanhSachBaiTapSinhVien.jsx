import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { baiTapDichVu } from '../../giang_vien/dich_vu/baiTapDichVu';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import {
  FileText,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';

export const DanhSachBaiTapSinhVien = () => {
  const navigate = useNavigate();
  const [danhSachBaiTap, setDanhSachBaiTap] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [tuKhoa, setTuKhoa] = useState('');
  const [boLocTrangThai, setBoLocTrangThai] = useState('tat_ca');
  const [boLocLopHoc, setBoLocLopHoc] = useState('tat_ca');

  const duLieuBaiTapMau = [
    {
      id: '1',
      tieuDe: 'Bài tập 1: Dijkstra và A* Pathfinding',
      monHoc: 'Cấu Trúc Dữ Liệu & Giải Thuật AI',
      lopHocId: '2',
      diemToiDa: 10,
      conLai: 'Còn 17 giờ',
      hanNopText: '06/10/2026 • 10:18',
      trangThai: 'chua_nop',
      trangThaiText: 'Chưa nộp',
      trangThaiClass: 'bg-rose-50 text-rose-600 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-500',
      timeBg: 'bg-rose-50 text-rose-600'
    },
    {
      id: '2',
      tieuDe: 'Bài tập 2: Spring Boot 3 Security JWT',
      monHoc: 'Lập Trình Web React & Spring',
      lopHocId: '1',
      diemToiDa: 10,
      conLai: 'Còn 4 ngày',
      hanNopText: '10/10/2026 • 23:59',
      trangThai: 'dang_lam',
      trangThaiText: 'Đang làm',
      trangThaiClass: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-amber-100 text-amber-500',
      timeBg: 'bg-amber-50 text-amber-700',
      tienDoMini: 60
    },
    {
      id: '3',
      tieuDe: 'Bài tập 3: Xây dựng Dashboard Quản Trị với Zustand',
      monHoc: 'Lập Trình Web React & Spring',
      lopHocId: '1',
      diemToiDa: 10,
      conLai: 'Còn 9 ngày',
      hanNopText: '15/10/2026 • 23:59',
      trangThai: 'chua_nop',
      trangThaiText: 'Chưa nộp',
      trangThaiClass: 'bg-rose-50 text-rose-600 border-rose-200',
      iconBg: 'bg-blue-100 text-blue-500',
      timeBg: 'bg-blue-50 text-blue-700'
    }
  ];

  useEffect(() => {
    const taiDuLieu = async () => {
      setDangTai(true);
      try {
        const [dsBt, dsLh] = await Promise.allSettled([
          baiTapDichVu.layDanhSach(),
          lopHocDichVu.layDanhSach()
        ]);

        if (dsLh.status === 'fulfilled' && Array.isArray(dsLh.value)) {
          setDanhSachLop(dsLh.value);
        }

        if (dsBt.status === 'fulfilled' && Array.isArray(dsBt.value) && dsBt.value.length > 0) {
          const now = new Date();
          const mapped = dsBt.value.map((bt) => {
            const hanNopDate = bt.hanNop ? new Date(bt.hanNop) : null;
            let conLai = 'Không thời hạn';
            let quaHan = false;
            let sapDenHan = false;

            if (hanNopDate) {
              const diffMs = hanNopDate.getTime() - now.getTime();
              if (diffMs < 0) {
                quaHan = true;
                const diffDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
                conLai = diffDays === 0 ? 'Hết hạn hôm nay' : `Quá hạn ${diffDays} ngày`;
              } else {
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffHours / 24);
                if (diffHours < 24) {
                  sapDenHan = true;
                  conLai = diffHours === 0 ? 'Còn dưới 1 giờ' : `Còn ${diffHours} giờ`;
                } else {
                  conLai = `Còn ${diffDays} ngày`;
                }
              }
            }

            const daNop = bt.daNop === true;
            let trangThai = daNop ? 'da_nop' : (quaHan ? 'qua_han' : (sapDenHan ? 'sap_den_han' : 'chua_nop'));
            let trangThaiText = daNop ? 'Đã nộp' : (quaHan ? 'Quá hạn' : 'Chưa nộp');
            let trangThaiClass = daNop 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : (quaHan ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-50 text-rose-600 border-rose-200');
            
            let iconBg = daNop ? 'bg-emerald-100 text-emerald-600' : (quaHan ? 'bg-rose-100 text-rose-600' : (sapDenHan ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'));
            let timeBg = daNop ? 'bg-slate-100 text-slate-700' : (quaHan ? 'bg-rose-50 text-rose-700' : (sapDenHan ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'));

            if (daNop && bt.trangThaiBaiNop === 'DA_CHAM' && bt.diemSo != null) {
              trangThaiText = `Đã nộp (${bt.diemSo}đ)`;
            }

            return {
              id: bt.id,
              tieuDe: bt.tieuDe,
              monHoc: bt.tenLop || bt.lopHoc?.tenLop || 'Môn học',
              lopHocId: (bt.lopHocId || bt.lopHoc?.id)?.toString(),
              diemToiDa: bt.diemToiDa || 10,
              conLai,
              hanNopDate,
              hanNopText: hanNopDate ? hanNopDate.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Không có hạn',
              daNop,
              quaHan,
              sapDenHan,
              trangThai,
              trangThaiText,
              trangThaiClass,
              iconBg,
              timeBg
            };
          });
          setDanhSachBaiTap(mapped);
        } else {
          setDanhSachBaiTap([]);
        }
      } catch {
        setDanhSachBaiTap([]);
      } finally {
        setDangTai(false);
      }
    };

    taiDuLieu();
  }, []);

  const baiTapLoc = danhSachBaiTap.filter((bt) => {
    const khopTuKhoa = 
      bt.tieuDe.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      bt.monHoc.toLowerCase().includes(tuKhoa.toLowerCase());

    if (!khopTuKhoa) return false;

    if (boLocLopHoc !== 'tat_ca' && bt.lopHocId !== boLocLopHoc) return false;

    if (boLocTrangThai === 'tat_ca') return true;
    if (boLocTrangThai === 'chua_nop') return !bt.daNop;
    if (boLocTrangThai === 'da_nop') return bt.daNop;
    if (boLocTrangThai === 'sap_den_han') return !bt.daNop && bt.sapDenHan;
    if (boLocTrangThai === 'qua_han') return !bt.daNop && bt.quaHan;
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1450px] mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Bài tập & Hạn nộp
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {danhSachBaiTap.length} nhiệm vụ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Theo dõi danh sách bài tập của toàn bộ các môn học, nộp bài đúng hạn và nhận trợ giúp định hướng từ AI.
          </p>
        </div>

        <Link
          to="/sinh-vien/ai-tro-ly"
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-95 self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>Hỏi AI định hướng bài tập</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              placeholder="Tìm theo tên bài tập, môn học..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Class Selector Dropdown */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Lọc theo môn:</span>
            <select
              value={boLocLopHoc}
              onChange={(e) => setBoLocLopHoc(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition"
            >
              <option value="tat_ca">Tất cả môn học</option>
              {danhSachLop.map((l) => (
                <option key={l.id} value={l.id.toString()}>
                  {l.tenLop}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
          {[
            { key: 'tat_ca', label: `Tất cả (${danhSachBaiTap.length})` },
            { key: 'chua_nop', label: `Chưa nộp (${danhSachBaiTap.filter(b => !b.daNop).length})` },
            { key: 'da_nop', label: `Đã nộp (${danhSachBaiTap.filter(b => b.daNop).length})` },
            { key: 'sap_den_han', label: `Sắp đến hạn (${danhSachBaiTap.filter(b => !b.daNop && b.sapDenHan).length})` },
            { key: 'qua_han', label: `Quá hạn (${danhSachBaiTap.filter(b => !b.daNop && b.quaHan).length})` }
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

      {/* Assignment List */}
      {dangTai ? (
        <div className="py-16 text-center text-xs text-slate-400">
          <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Đang tải danh sách bài tập...
        </div>
      ) : baiTapLoc.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không có bài tập nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Không tìm thấy bài tập nào khớp với bộ lọc hiện tại của bạn.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {baiTapLoc.map((bt) => (
            <div
              key={bt.id}
              className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs hover:shadow-xs hover:border-blue-300 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bt.iconBg}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 hover:text-blue-600 transition">
                    {bt.tieuDe}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>{bt.monHoc}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 self-end sm:self-center shrink-0 flex-wrap">
                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${bt.timeBg}`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{bt.conLai}</span>
                  <span className="text-[11px] opacity-75 hidden md:inline">• {bt.hanNopText}</span>
                </div>

                <span className="text-xs font-extrabold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  {bt.diemToiDa} điểm
                </span>

                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${bt.trangThaiClass}`}>
                  {bt.trangThaiText}
                </span>

                <Link
                  to={`/sinh-vien/bai-tap/${bt.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95"
                >
                  <span>Làm bài & Định hướng AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DanhSachBaiTapSinhVien;
