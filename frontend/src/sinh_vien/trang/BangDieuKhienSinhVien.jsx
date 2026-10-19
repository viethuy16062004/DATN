import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { baiTapDichVu } from '../../giang_vien/dich_vu/baiTapDichVu';
import { tienDoDichVu } from '../dich_vu/tienDoDichVu';
import { aiDichVu } from '../dich_vu/aiDichVu';
import { dungXacThuc } from '../../dung_chung/kho_luu_tru/NguCanhXacThuc';
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  AlertCircle,
  FileText,
  Users,
  Code2,
  Database,
  Cpu,
  Bot,
  ChevronDown,
  BookOpen,
  CheckCircle,
  TrendingUp,
  FolderDot,
  Bell,
  CheckSquare,
  RefreshCw,
  Award
} from 'lucide-react';

export const BangDieuKhienSinhVien = () => {
  const navigate = useNavigate();
  const { nguoiDung } = dungXacThuc();
  const [tabBaiTap, setTabBaiTap] = useState('tat_ca');
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachBaiTap, setDanhSachBaiTap] = useState([]);
  const [aiKeHoach, setAiKeHoach] = useState(null);
  const [dangTaiAi, setDangTaiAi] = useState(false);
  const [dangTai, setDangTai] = useState(true);

  const tenSinhVien = nguoiDung?.hoTen || 'Sinh viên';

  // Dữ liệu mẫu lớp học chuẩn theo screenshot
  const duLieuLopChuan = [
    {
      id: '1',
      maLop: 'WEB2026',
      tenLop: 'Lập Trình Web React & Spring',
      giangVien: 'GV: TS. Lê Hoàng Nam',
      soHocSinh: 2,
      soBaiTap: 2,
      tienDo: 33,
      daNop: 4,
      tongBai: 12,
      themeColor: 'from-blue-600 via-blue-700 to-indigo-800',
      icon: Code2,
      barColor: 'bg-blue-600'
    },
    {
      id: '2',
      maLop: 'DSA2026',
      tenLop: 'Cấu Trúc Dữ Liệu & Giải Thuật AI',
      giangVien: 'GV: TS. Lê Hoàng Nam',
      soHocSinh: 1,
      soBaiTap: 1,
      tienDo: 70,
      daNop: 7,
      tongBai: 10,
      themeColor: 'from-emerald-600 via-teal-700 to-slate-800',
      icon: Database,
      barColor: 'bg-emerald-500'
    },
    {
      id: '3',
      maLop: 'AI2026',
      tenLop: 'Trí Tuệ Nhân Tạo Ứng Dụng',
      giangVien: 'GV: TS. Lê Hoàng Nam',
      soHocSinh: 1,
      soBaiTap: 0,
      tienDo: 12,
      daNop: 1,
      tongBai: 8,
      themeColor: 'from-purple-600 via-indigo-700 to-purple-900',
      icon: Cpu,
      barColor: 'bg-purple-600'
    }
  ];

  // Dữ liệu mẫu bài tập chuẩn theo screenshot
  const duLieuBaiTapChuan = [
    {
      id: '1',
      tieuDe: 'Bài tập 1: Dijkstra và A* Pathfinding',
      monHoc: 'Cấu Trúc Dữ Liệu & Giải Thuật AI',
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
      diemToiDa: 10,
      conLai: 'Còn 4 ngày',
      hanNopText: '10/10/2026 • 23:59',
      trangThai: 'dang_lam',
      trangThaiText: 'Đang làm',
      trangThaiClass: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-amber-100 text-amber-500',
      timeBg: 'bg-amber-50 text-amber-700',
      tienDoMini: 60
    }
  ];

  useEffect(() => {
    const taiDuLieu = async () => {
      try {
        const [dsLop, dsBt, dsTd] = await Promise.allSettled([
          lopHocDichVu.layDanhSach(),
          baiTapDichVu.layDanhSach(),
          tienDoDichVu.layDanhSach()
        ]);

        const tienDoMap = {};
        if (dsTd.status === 'fulfilled' && Array.isArray(dsTd.value)) {
          dsTd.value.forEach(td => {
            if (td.lopHocId) tienDoMap[td.lopHocId] = td;
          });
        }

        let mappedBt = [];
        if (dsBt.status === 'fulfilled' && Array.isArray(dsBt.value) && dsBt.value.length > 0) {
          const now = new Date();
          mappedBt = dsBt.value.map((bt) => {
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
              monHoc: bt.tenLop || bt.lopHoc?.tenLop || 'Lớp học',
              lopHocId: bt.lopHocId || bt.lopHoc?.id,
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
          setDanhSachBaiTap(mappedBt);
        } else {
          setDanhSachBaiTap([]);
        }

        if (dsLop.status === 'fulfilled' && Array.isArray(dsLop.value) && dsLop.value.length > 0) {
          const mappedLop = dsLop.value.map((l, i) => {
            const td = tienDoMap[l.id];
            const soBtCuaLop = mappedBt.filter(b => b.lopHocId === l.id);
            const daNopCount = soBtCuaLop.filter(b => b.daNop).length;
            const tongBtCount = l.soLuongBaiTap || soBtCuaLop.length || 0;
            const phanTram = tongBtCount > 0 ? Math.round((daNopCount * 100) / tongBtCount) : (td?.phanTramHoanThanh ? Math.round(td.phanTramHoanThanh) : 0);

            return {
              id: l.id,
              maLop: l.maLop || `CLASS${i+1}`,
              tenLop: l.tenLop,
              giangVien: `GV: ${l.giaoVien?.hoTen || 'Giảng viên'}`,
              soHocSinh: l.soLuongSinhVien || 0,
              soBaiTap: tongBtCount,
              tienDo: phanTram,
              daNop: daNopCount,
              tongBai: tongBtCount,
              themeColor: duLieuLopChuan[i % duLieuLopChuan.length].themeColor,
              icon: i % 3 === 0 ? Code2 : (i % 3 === 1 ? Database : Cpu),
              barColor: phanTram === 100 ? 'bg-emerald-500' : (phanTram > 50 ? 'bg-blue-600' : 'bg-amber-500')
            };
          });
          setDanhSachLop(mappedLop);
        } else {
          setDanhSachLop([]);
        }

        // Hiển thị giao diện ngay lập tức
        setDangTai(false);

        // Tải kế hoạch AI cá nhân hóa theo ĐTB và tiến độ (chạy ngầm)
        aiDichVu.layDinhHuongHomNay()
          .then(aiRes => {
            if (aiRes) setAiKeHoach(aiRes);
          })
          .catch(e => {
            console.warn('Sử dụng dữ liệu AI cục bộ:', e);
          });

      } catch (e) {
        console.error('Lỗi tải dữ liệu bảng điều khiển:', e);
        setDangTai(false);
      }
    };
    taiDuLieu();
  }, []);

  const handleLamMoiKeHoach = async () => {
    setDangTaiAi(true);
    try {
      const aiRes = await aiDichVu.taoKeHoach(3, 'Cập nhật lộ trình học tập cá nhân hóa');
      if (aiRes) {
        setAiKeHoach(aiRes);
      }
    } catch (e) {
      console.error('Lỗi làm mới kế hoạch AI:', e);
    } finally {
      setDangTaiAi(false);
    }
  };

  const soTatCa = danhSachBaiTap.length;
  const soChuaNop = danhSachBaiTap.filter(b => !b.daNop).length;
  const soDaNop = danhSachBaiTap.filter(b => b.daNop).length;
  const soSapDenHan = danhSachBaiTap.filter(b => !b.daNop && b.sapDenHan).length;
  const soQuaHan = danhSachBaiTap.filter(b => !b.daNop && b.quaHan).length;

  const baiTapHienThi = danhSachBaiTap.filter(bt => {
    if (tabBaiTap === 'tat_ca') return true;
    if (tabBaiTap === 'chua_nop') return !bt.daNop;
    if (tabBaiTap === 'da_nop') return bt.daNop;
    if (tabBaiTap === 'sap_den_han') return !bt.daNop && bt.sapDenHan;
    if (tabBaiTap === 'qua_han') return !bt.daNop && bt.quaHan;
    return true;
  });

  const baiTapUuTien = danhSachBaiTap.find(b => !b.daNop && !b.quaHan) || danhSachBaiTap.find(b => !b.daNop) || danhSachBaiTap[0];

  // Thông số AI cá nhân hóa theo Điểm trung bình và Tiến độ
  const aiInfo = aiKeHoach?.duLieuBoSung || {};
  const diemTbAi = aiInfo.diemTrungBinh != null ? aiInfo.diemTrungBinh : null;
  const tiLeHoanThanhAi = aiInfo.tiLeHoanThanh != null 
    ? aiInfo.tiLeHoanThanh 
    : (soTatCa > 0 ? Math.round((soDaNop * 100) / soTatCa) : 0);
  const danhHieuAi = aiInfo.danhHieuAi || (
    diemTbAi >= 8.5 ? '🌟 Sinh viên Xuất sắc • Tối ưu & Chuyên sâu' :
    diemTbAi >= 7.0 ? '🚀 Sinh viên Tiềm năng • Bứt phá Điểm 10' :
    diemTbAi >= 5.0 ? '🎯 Cần Cải Thiện • Củng cố Nền tảng' :
    '⚡ Kế hoạch Tăng tốc Khẩn cấp'
  );
  const chienLuocChinh = aiInfo.chienLuocChinh || (
    diemTbAi >= 8.0 
      ? 'Duy trì phong độ đỉnh cao, đào sâu các thuật toán phức tạp và tối ưu hóa mã nguồn.' 
      : 'Tập trung hoàn thành các bài tập sắp đến hạn và củng cố các nội dung bị trừ điểm.'
  );
  const khungGioGoiY = aiInfo.khungGioGoiY || [];
  const danhSachGoiY = aiKeHoach?.danhSachGoiY || [];


  const ngayHienTaiText = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto pb-12 font-sans">
      
      {/* 1. Header Greeting & Motivation Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Chào mừng trở lại, <br className="sm:hidden" />
            <span className="text-slate-900">{tenSinhVien}!</span>
            <span className="text-2xl">👏</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {soChuaNop > 0
              ? `Hôm nay bạn có ${soChuaNop} nhiệm vụ bài tập cần hoàn thành. Cùng AI lên kế hoạch để học tập hiệu quả hơn nhé!`
              : 'Tuyệt vời! Bạn đã hoàn thành toàn bộ bài tập và không còn bài tồn đọng.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs capitalize">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {ngayHienTaiText}
          </div>

          {/* Inspirational Illustration Box */}
          <div className="hidden xl:flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-100/80">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-blue-900 italic">
              “Học tập thông minh hơn với AI mỗi ngày”
            </p>
          </div>
        </div>
      </div>

      {/* 2. Three Alert Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Urgent Alert Card 1 */}
        <div 
          onClick={() => setTabBaiTap('sap_den_han')}
          className="rounded-2xl bg-rose-50/50 border border-rose-200/70 p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900 leading-snug">
                {soSapDenHan > 0 ? `${soSapDenHan} bài tập sắp đến hạn trong 24 giờ` : (soQuaHan > 0 ? `${soQuaHan} bài tập đã quá hạn` : 'Không có bài tập gấp')}
              </h4>
              <p className="text-[11px] text-rose-700/80 mt-0.5">
                {soSapDenHan > 0 ? 'Hãy ưu tiên nộp bài trước hạn chót' : (soQuaHan > 0 ? 'Vui lòng liên hệ giảng viên để nộp bù' : 'Tiến độ học tập của bạn đang rất tốt')}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition shrink-0" />
        </div>

        {/* Warning Alert Card 2 */}
        <div 
          onClick={() => setTabBaiTap('chua_nop')}
          className="rounded-2xl bg-amber-50/50 border border-amber-200/70 p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 leading-snug">
                {soChuaNop > 0 ? `${soChuaNop} bài tập chưa nộp` : 'Đã hoàn thành toàn bộ bài tập'}
              </h4>
              <p className="text-[11px] text-amber-700/80 mt-0.5">
                {soChuaNop > 0 ? 'Hãy lên kế hoạch làm bài đúng hạn' : 'Xuất sắc! Bạn không còn bài tập tồn đọng'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition shrink-0" />
        </div>

        {/* Info Alert Card 3 */}
        <div 
          onClick={() => setTabBaiTap('da_nop')}
          className="rounded-2xl bg-emerald-50/50 border border-emerald-200/70 p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-900 leading-snug">
                {soDaNop} bài tập đã nộp thành công
              </h4>
              <p className="text-[11px] text-emerald-700/80 mt-0.5">
                {soDaNop > 0 ? 'Xem lại bài nộp và điểm số đánh giá' : 'Chưa có bài tập nào được nộp'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition shrink-0" />
        </div>

      </div>

      {/* 3. Main Grid (Left Content 72% / Right Widgets 28%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-6">
          
          {/* A. Feature Hero: AI ĐỊNH HƯỚNG HÔM NAY */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
            
            {/* Header row of AI Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 sm:mt-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black tracking-wide uppercase">
                      AI ĐỊNH HƯỚNG HÔM NAY
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/25 backdrop-blur-xs border border-white/30 text-white flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-300" />
                      <span>{diemTbAi > 0 ? `ĐTB: ${diemTbAi}/10` : 'ĐTB: Chưa có'}</span>
                      <span>•</span>
                      <span>Tiến độ: {tiLeHoanThanhAi}%</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 font-medium mt-0.5">
                    {danhHieuAi} — {chienLuocChinh}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button 
                  onClick={handleLamMoiKeHoach}
                  disabled={dangTaiAi}
                  title="Phân tích lại theo điểm số và bài nộp mới nhất"
                  className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition backdrop-blur-xs shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dangTaiAi ? 'animate-spin' : ''}`} />
                  <span>{dangTaiAi ? 'Đang phân tích...' : 'Làm mới'}</span>
                </button>

                <button 
                  onClick={() => navigate('/sinh-vien/ai-tro-ly')}
                  className="px-3.5 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-extrabold transition shadow-xs flex items-center gap-1"
                >
                  <span>Chi tiết kế hoạch AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inner 3-Panel Card Grid (White container) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-slate-800 relative z-10">
              
              {/* Panel 1: Bài tập nên ưu tiên (md:col-span-5) */}
              <div className="md:col-span-5 rounded-2xl bg-white p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                      01
                    </span>
                    <span className="text-xs font-bold text-slate-500">Bài tập nên ưu tiên</span>
                  </div>

                  {baiTapUuTien ? (
                    <>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 line-clamp-2">
                        {baiTapUuTien.tieuDe}
                      </h4>

                      <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
                        <span className={`px-2 py-0.5 rounded-md font-bold border ${baiTapUuTien.trangThaiClass}`}>
                          ⏰ {baiTapUuTien.conLai}
                        </span>
                        <span className="text-slate-400 font-semibold">Điểm: {baiTapUuTien.diemToiDa}đ</span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                        <FolderDot className="w-3.5 h-3.5 text-blue-500" />
                        <span>{baiTapUuTien.monHoc}</span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-xs">
                        <p className="font-bold text-slate-700 text-[11px]">Trạng thái & Đề xuất:</p>
                        <p className="text-slate-600 flex items-center gap-1.5">• {baiTapUuTien.daNop ? 'Bạn đã nộp bài tập này' : 'Bạn chưa nộp bài'}</p>
                        <p className="text-slate-600 flex items-center gap-1.5">• Hạn nộp: {baiTapUuTien.hanNopText}</p>
                        <p className="text-slate-600 flex items-center gap-1.5">• Trọng số điểm tối đa: {baiTapUuTien.diemToiDa} điểm</p>
                      </div>
                    </>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-500 space-y-1">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
                      <p className="font-bold">Tuyệt vời! Bạn đã hoàn thành toàn bộ bài tập.</p>
                    </div>
                  )}
                </div>

                <Link
                  to={baiTapUuTien ? `/sinh-vien/bai-tap/${baiTapUuTien.id}` : '/sinh-vien/ai-tro-ly'}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{baiTapUuTien && !baiTapUuTien.daNop ? 'Làm bài & Xem hướng dẫn' : 'Hỏi trợ lý AI'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Panel 2: Gợi ý kế hoạch trong ngày (md:col-span-4) */}
              <div className="md:col-span-4 rounded-2xl bg-white p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Gợi ý kế hoạch trong ngày</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      AI Cá nhân hóa
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {khungGioGoiY.length > 0 ? (
                      khungGioGoiY.map((slot, sIdx) => {
                        const mauClass = 
                          slot.mau === 'rose' ? 'bg-rose-500' :
                          slot.mau === 'amber' ? 'bg-amber-500' :
                          slot.mau === 'emerald' ? 'bg-emerald-500' :
                          slot.mau === 'teal' ? 'bg-teal-500' :
                          slot.mau === 'blue' ? 'bg-blue-500' : 'bg-purple-500';

                        return (
                          <div key={sIdx} className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400 w-20 shrink-0">{slot.gio}</span>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${mauClass}`}></span>
                            <span className="font-semibold text-slate-800 truncate" title={slot.tieuDe}>
                              {slot.tieuDe}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      baiTapUuTien && !baiTapUuTien.daNop ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400 w-20 shrink-0">15:00 - 16:00</span>
                            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                            <span className="font-bold text-slate-800 truncate" title={baiTapUuTien.tieuDe}>
                              Làm: {baiTapUuTien.tieuDe}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400 w-20 shrink-0">16:00 - 16:15</span>
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                            <span className="text-slate-600 truncate">Nghỉ ngắn Pomodoro</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400 w-20 shrink-0">16:15 - 17:00</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                            <span className="font-bold text-slate-800 truncate">Hoàn thiện mã nguồn & chạy thử</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400 w-20 shrink-0">17:00 - 17:30</span>
                            <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                            <span className="text-slate-600 truncate">Kiểm tra kết quả và nộp bài</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400 w-20 shrink-0">15:00 - 16:00</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                            <span className="font-bold text-slate-800 truncate">Ôn tập kiến thức môn học</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400 w-20 shrink-0">16:00 - 16:15</span>
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                            <span className="text-slate-600 truncate">Nghỉ giải lao thư giãn</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400 w-20 shrink-0">16:15 - 17:00</span>
                            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                            <span className="font-bold text-slate-800 truncate">Hỏi đáp & tự học với AI Trợ lý</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400 w-20 shrink-0">17:00 - 17:30</span>
                            <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                            <span className="text-slate-600 truncate">Đọc trước tài liệu bài giảng</span>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </div>

                <Link
                  to="/sinh-vien/ai-tro-ly"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 pt-2 border-t border-slate-100"
                >
                  <span>Xem kế hoạch chi tiết đầy đủ</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Panel 3: Các gợi ý khác (md:col-span-3) */}
              <div className="md:col-span-3 rounded-2xl bg-white p-4 shadow-sm flex flex-col justify-between space-y-2.5">
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5 font-bold text-xs text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Chiến lược gợi ý từ AI</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    {danhSachGoiY.length > 0 ? (
                      danhSachGoiY.slice(0, 4).map((goiY, gIdx) => {
                        const bgColors = [
                          'bg-purple-50/70 border-purple-100 text-slate-800',
                          'bg-blue-50/70 border-blue-100 text-slate-800',
                          'bg-emerald-50/70 border-emerald-100 text-slate-800',
                          'bg-amber-50/70 border-amber-100 text-slate-800'
                        ];
                        const icons = [Clock, BookOpen, FileText, Bell];
                        const IconCmp = icons[gIdx % icons.length];
                        const iconColors = ['text-purple-600', 'text-blue-600', 'text-emerald-600', 'text-amber-600'];

                        return (
                          <div key={gIdx} className={`p-2 rounded-xl border flex items-start gap-2 ${bgColors[gIdx % bgColors.length]}`}>
                            <IconCmp className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${iconColors[gIdx % iconColors.length]}`} />
                            <span className="line-clamp-2 leading-relaxed">{goiY}</span>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>Chia nhỏ bài tập lớn thành các <strong>phiên 25 phút</strong></span>
                        </div>
                        <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2 text-slate-700">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>Xem lại kiến thức <strong>Cấu trúc dữ liệu & giải thuật</strong></span>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2 text-slate-700">
                          <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Nộp bài sớm trước hạn để phòng ngừa lỗi mạng</span>
                        </div>
                        <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100 flex items-start gap-2 text-slate-700">
                          <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>Đặt lịch nhắc nhở tự động mỗi ngày</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* B. Middle Section: Lớp học của tôi */}
          <div id="lop-hoc" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-extrabold text-slate-900">Lớp học của tôi</h2>
                <span className="px-2 py-0.2 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  {danhSachLop.length} lớp
                </span>
              </div>
              <Link
                to="/sinh-vien/lop-hoc"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-0.5"
              >
                Xem tất cả
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Course Cards Grid or Empty State */}
            {danhSachLop.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-3 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Bạn chưa tham gia lớp học nào</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                    Hãy liên hệ giảng viên để nhận mã lớp hoặc nhấn nút Tham gia lớp để bắt đầu môn học.
                  </p>
                </div>
                <Link
                  to="/sinh-vien/lop-hoc"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                >
                  <span>Tham gia lớp học</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {danhSachLop.map((lop) => {
                  const IconComponent = lop.icon;
                  return (
                    <div
                      key={lop.id}
                      className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition duration-200 flex flex-col justify-between"
                    >
                      {/* Top gradient banner */}
                      <div className={`p-3.5 bg-gradient-to-r ${lop.themeColor} text-white flex items-center justify-between`}>
                        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                          {lop.maLop}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                            {lop.tenLop}
                          </h3>
                          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                            {lop.giangVien}
                          </p>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>Tiến độ</span>
                            <span className="font-bold text-slate-800">{lop.tienDo}% <span className="text-slate-400 font-normal">({lop.daNop}/{lop.tongBai} bài)</span></span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${lop.barColor}`}
                              style={{ width: `${lop.tienDo}%` }}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400 font-medium">
                            👥 {lop.soHocSinh} sinh viên • 📝 {lop.soBaiTap} bài tập
                          </span>
                          <Link
                            to={`/sinh-vien/lop/${lop.id}`}
                            className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition"
                          >
                            Vào lớp
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* C. Bottom Section: Bài tập cần làm */}
          <div id="bai-tap" className="space-y-4 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">
                  !
                </span>
                <h2 className="text-base font-extrabold text-slate-900">Bài tập cần làm</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <span>Thời hạn tăng dần</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <button 
                  onClick={() => alert('Đã bật chế độ nhắc nhở AI tự động')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition shadow-2xs"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Tạo nhắc nhở AI</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { key: 'tat_ca', label: `Tất cả (${soTatCa})` },
                { key: 'chua_nop', label: `Chưa nộp (${soChuaNop})` },
                { key: 'da_nop', label: `Đã nộp (${soDaNop})` },
                { key: 'sap_den_han', label: `Sắp đến hạn (${soSapDenHan})` },
                { key: 'qua_han', label: `Quá hạn (${soQuaHan})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setTabBaiTap(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    tabBaiTap === tab.key
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Assignment Rows */}
            <div className="space-y-2.5">
              {baiTapHienThi.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400 space-y-1">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
                  <p className="font-bold text-slate-700">Không có bài tập nào trong danh mục này</p>
                </div>
              ) : (
                baiTapHienThi.map((bt) => (
                  <div
                    key={bt.id}
                    className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs hover:border-blue-300 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bt.iconBg}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 hover:text-blue-600 transition">
                          {bt.tieuDe}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                          {bt.monHoc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${bt.timeBg}`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{bt.conLai}</span>
                        <span className="text-[11px] opacity-75 hidden md:inline">{bt.hanNopText}</span>
                      </div>

                      <span className="text-xs font-extrabold text-slate-700">
                        {bt.diemToiDa} điểm
                      </span>

                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${bt.trangThaiClass}`}>
                        {bt.trangThaiText}
                      </span>

                      <Link
                        to={`/sinh-vien/bai-tap/${bt.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs transition flex items-center gap-1"
                      >
                        Chi tiết
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (3 Widgets) */}
        <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-6">
          
          {/* Widget 1: Lịch học & Hạn nộp */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-extrabold text-slate-900">Lịch học & Hạn nộp</h3>
              </div>
              <Link to="/sinh-vien/bai-tap" className="text-[11px] font-bold text-blue-600 hover:underline">
                Xem tất cả ›
              </Link>
            </div>

            {/* Calendar Month */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-800">Tháng 10, 2026</span>
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-1 hover:text-slate-700 rounded"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:text-slate-700 rounded"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Calendar Table */}
            <div className="text-[11px]">
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-400 pb-1">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-slate-600">
                <span className="text-slate-300 py-1">29</span>
                <span className="text-slate-300 py-1">30</span>
                <span className="py-1">1</span>
                <span className="py-1">2</span>
                <span className="py-1">3</span>
                <span className="py-1">4</span>
                <span className="py-1">5</span>

                <span className="py-1 bg-blue-600 text-white font-bold rounded-lg relative flex flex-col items-center justify-center shadow-xs">
                  6
                  <span className="w-1 h-1 rounded-full bg-rose-300 absolute bottom-0.5"></span>
                </span>
                <span className="py-1">7</span>
                <span className="py-1 relative flex flex-col items-center justify-center">
                  8<span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-0.5"></span>
                </span>
                <span className="py-1">9</span>
                <span className="py-1 relative flex flex-col items-center justify-center">
                  10<span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-0.5"></span>
                </span>
                <span className="py-1">11</span>
                <span className="py-1">12</span>

                <span className="py-1">13</span>
                <span className="py-1">14</span>
                <span className="py-1 relative flex flex-col items-center justify-center">
                  15<span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-0.5"></span>
                </span>
                <span className="py-1">16</span>
                <span className="py-1">17</span>
                <span className="py-1">18</span>
                <span className="py-1">19</span>

                <span className="py-1">20</span>
                <span className="py-1">21</span>
                <span className="py-1">22</span>
                <span className="py-1">23</span>
                <span className="py-1">24</span>
                <span className="py-1 relative flex flex-col items-center justify-center">
                  25<span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-0.5"></span>
                </span>
                <span className="py-1">26</span>

                <span className="py-1">27</span>
                <span className="py-1">28</span>
                <span className="py-1">29</span>
                <span className="py-1">30</span>
                <span className="py-1">31</span>
                <span className="text-slate-300 py-1">1</span>
                <span className="text-slate-300 py-1">2</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Hạn nộp sắp tới */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-extrabold text-slate-900">Hạn nộp sắp tới</h3>
              </div>
              <Link to="/sinh-vien/bai-tap" className="text-[11px] font-bold text-blue-600 hover:underline">
                Xem tất cả ›
              </Link>
            </div>

            <div className="space-y-2.5">
              {danhSachBaiTap.filter(b => !b.daNop).slice(0, 3).map((bt, idx) => (
                <Link
                  key={bt.id || idx}
                  to={`/sinh-vien/bai-tap/${bt.id}`}
                  className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border-l-4 border-l-rose-500 border border-slate-200/60 transition group"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-rose-600 mb-1">
                    <span>⏰ {bt.conLai}</span>
                    <span className="text-slate-400 font-normal">{bt.hanNopText} ›</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                    {bt.tieuDe}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{bt.monHoc}</p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="font-semibold text-slate-700">{bt.diemToiDa} điểm</span>
                    <span className="text-rose-600 font-bold">{bt.trangThaiText}</span>
                  </div>
                </Link>
              ))}

              {danhSachBaiTap.filter(b => !b.daNop).length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  🎉 Không có bài tập nào chưa nộp!
                </div>
              )}
            </div>
          </div>

          {/* Widget 3: Trợ lý AI học tập */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-extrabold text-slate-900">Trợ lý AI học tập</h3>
              </div>
              <Link to="/sinh-vien/ai-tro-ly" className="text-[11px] font-bold text-blue-600 hover:underline">
                Mở rộng ›
              </Link>
            </div>

            <div className="space-y-2">
              
              <Link
                to="/sinh-vien/ai-tro-ly"
                className="p-2.5 rounded-xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100/80 flex items-center justify-between transition group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition">
                      Ưu tiên bài tập hôm nay
                    </h5>
                    <p className="text-[10px] text-slate-500">Phân tích và đề xuất bài tập cần làm trước</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/sinh-vien/ai-tro-ly"
                className="p-2.5 rounded-xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100/80 flex items-center justify-between transition group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                      Hướng dẫn cách làm bài
                    </h5>
                    <p className="text-[10px] text-slate-500">Giải thích từng bước, gợi ý tài liệu</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/sinh-vien/ai-tro-ly"
                className="p-2.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/80 flex items-center justify-between transition group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      Tạo kế hoạch học tập
                    </h5>
                    <p className="text-[10px] text-slate-500">Lập kế hoạch học tập cá nhân hóa</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/sinh-vien/tien-do"
                className="p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-50 border border-amber-100/80 flex items-center justify-between transition group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition">
                      Phân tích tiến độ học tập
                    </h5>
                    <p className="text-[10px] text-slate-500">Đánh giá tiến độ và đưa ra lời khuyên</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition" />
              </Link>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default BangDieuKhienSinhVien;
