import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { baiTapDichVu } from '../dich_vu/baiTapDichVu';
import { baiNopDichVu } from '../../sinh_vien/dich_vu/baiNopDichVu';
import { aiDichVu } from '../../sinh_vien/dich_vu/aiDichVu';
import { TheLopHoc } from '../../dung_chung/thanh_phan/TheLopHoc';
import { AiGoiYCard } from '../../dung_chung/thanh_phan/AiGoiYCard';
import { dungXacThuc } from '../../dung_chung/kho_luu_tru/NguCanhXacThuc';
import { 
  BookOpen, 
  Users, 
  FileText, 
  CheckSquare, 
  Sparkles, 
  Plus, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const BangDieuKhienGiaoVien = () => {
  const { nguoiDung } = dungXacThuc();
  const navigate = useNavigate();

  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachBaiTap, setDanhSachBaiTap] = useState([]);
  const [danhSachBaiNop, setDanhSachBaiNop] = useState([]);
  const [aiBaoCao, setAiBaoCao] = useState(null);
  const [dangTai, setDangTai] = useState(true);
  const [dangTaiAi, setDangTaiAi] = useState(false);
  const [tabHienTai, setTabHienTai] = useState('lop-hoc'); // 'lop-hoc', 'cho-cham', 'bai-tap'
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

  // Modal Tạo lớp học
  const [moModalTaoLop, setMoModalTaoLop] = useState(false);
  const [tenLopMoi, setTenLopMoi] = useState('');
  const [maLopMoi, setMaLopMoi] = useState('');
  const [moTaMoi, setMoTaMoi] = useState('');
  const [dangTaoLop, setDangTaoLop] = useState(false);
  const [loiTaoLop, setLoiTaoLop] = useState('');

  const taiDuLieu = async () => {
    try {
      const [dsLop, dsBt, dsBn] = await Promise.all([
        lopHocDichVu.layDanhSach(),
        baiTapDichVu.layDanhSach(),
        baiNopDichVu.layDanhSach(),
      ]);
      setDanhSachLop(dsLop || []);
      setDanhSachBaiTap(dsBt || []);
      setDanhSachBaiNop(dsBn || []);

      if (dsLop && dsLop.length > 0) {
        setDangTaiAi(true);
        try {
          const aiRes = await aiDichVu.phanTichLop(dsLop[0].id);
          setAiBaoCao(aiRes);
        } catch (e) {
          console.warn('Lỗi phân tích AI:', e);
        } finally {
          setDangTaiAi(false);
        }
      }
    } catch (err) {
      console.error('Lỗi tải dashboard giáo viên:', err);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, []);

  const handleTaoLop = async (e) => {
    e.preventDefault();
    if (!tenLopMoi.trim()) {
      setLoiTaoLop('Vui lòng nhập tên lớp học');
      return;
    }
    setDangTaoLop(true);
    setLoiTaoLop('');
    try {
      const maLopTuDong = maLopMoi.trim() || 'LH' + Math.floor(100000 + Math.random() * 900000);
      await lopHocDichVu.taomoi({
        tenLop: tenLopMoi.trim(),
        maLop: maLopTuDong,
        moTa: moTaMoi.trim()
      });
      setMoModalTaoLop(false);
      setTenLopMoi('');
      setMaLopMoi('');
      setMoTaMoi('');
      taiDuLieu();
    } catch (err) {
      setLoiTaoLop(err.response?.data?.thongDiep || 'Không thể tạo lớp học. Vui lòng thử lại.');
    } finally {
      setDangTaoLop(false);
    }
  };

  const baiChuaCham = danhSachBaiNop.filter(bn => bn.diemSo === null || bn.diemSo === undefined);
  const tongSinhVien = danhSachLop.reduce((acc, l) => acc + (l.soLuongSinhVien || 0), 0);

  const lopLoc = danhSachLop.filter(l => 
    l.tenLop?.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
    l.maLop?.toLowerCase().includes(tuKhoaTimKiem.toLowerCase())
  );

  if (dangTai) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hệ thống Quản lý Giảng dạy & Trợ lý AI Khoa CNTT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Chào Thầy/Cô, {nguoiDung?.hoTen || 'Giảng viên'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              Bạn đang quản lý <strong className="text-white font-bold">{danhSachLop.length} lớp học</strong> với{' '}
              <strong className="text-white font-bold">{tongSinhVien} sinh viên</strong>. Hiện có{' '}
              <strong className="text-amber-300 font-bold">{baiChuaCham.length} bài nộp</strong> đang chờ chấm điểm.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/giao-vien/tao-lop"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-extrabold shadow-lg transition active:scale-95"
            >
              <Plus className="w-4 h-4 text-blue-600 stroke-[3]" />
              <span>Tạo lớp học mới</span>
            </Link>

            <Link
              to="/giao-vien/tao-bai-tap"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/20 text-xs sm:text-sm font-bold backdrop-blur-md transition active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Giao bài tập</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lớp phụ trách</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{danhSachLop.length}</span>
            <span className="text-xs font-semibold text-blue-600">khóa học</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng sinh viên</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">{tongSinhVien}</span>
            <span className="text-xs font-semibold text-slate-400">học viên</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bài tập đã giao</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{danhSachBaiTap.length}</span>
            <span className="text-xs font-semibold text-slate-400">bài thực hành</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs transition group ${
          baiChuaCham.length > 0 
            ? 'bg-amber-50/50 border-amber-200/80 hover:border-amber-300' 
            : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Bài chờ chấm</span>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              baiChuaCham.length > 0 ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-slate-100 text-slate-400'
            }`}>
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black ${baiChuaCham.length > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
              {baiChuaCham.length}
            </span>
            {baiChuaCham.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-amber-200 text-amber-900 animate-pulse">
                Cần chấm gấp
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AI Overview Banner */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
              AI Trợ Giảng & Đánh Giá Chất Lượng Lớp Học
            </h2>
          </div>
          <Link
            to="/giao-vien/ai-phan-tich"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
          >
            <span>Xem phân tích tất cả các lớp</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {aiBaoCao ? (
          <AiGoiYCard
            tieuDe={aiBaoCao.tieuDe}
            noiDung={aiBaoCao.noiDung}
            danhSachGoiY={aiBaoCao.danhSachGoiY}
            dangTai={dangTaiAi}
          />
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Hệ thống AI Gemini sẽ tự động tổng hợp kết quả học tập và đề xuất phương pháp hỗ trợ sinh viên sau khi có bài nộp.
            </p>
          </div>
        )}
      </section>

      {/* Workspace Area: Tabs */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTabHienTai('lop-hoc')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                tabHienTai === 'lop-hoc'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Danh sách lớp học ({danhSachLop.length})</span>
            </button>

            <button
              onClick={() => setTabHienTai('cho-cham')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                tabHienTai === 'cho-cham'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Bài chờ chấm</span>
              {baiChuaCham.length > 0 && (
                <span className={`px-1.5 py-0.5 text-[10px] font-black rounded-md ${
                  tabHienTai === 'cho-cham' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {baiChuaCham.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setTabHienTai('bai-tap')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                tabHienTai === 'bai-tap'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Bài tập đã giao ({danhSachBaiTap.length})</span>
            </button>
          </div>

          {tabHienTai === 'lop-hoc' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm kiếm lớp học..."
                value={tuKhoaTimKiem}
                onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-blue-500 shadow-2xs outline-none transition"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Classrooms */}
        {tabHienTai === 'lop-hoc' && (
          <div>
            {lopLoc.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border-2 border-dashed border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {tuKhoaTimKiem ? 'Không tìm thấy lớp học phù hợp' : 'Bạn chưa khởi tạo lớp học nào'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Tạo lớp học mới để cung cấp mã mời cho sinh viên tham gia và phân công bài tập.
                </p>
                <Link
                  to="/giao-vien/tao-lop"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo lớp học ngay</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {lopLoc.map((lop) => (
                  <TheLopHoc key={lop.id} lop={lop} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pending Submissions */}
        {tabHienTai === 'cho-cham' && (
          <div>
            {baiChuaCham.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Tuyệt vời! Đã chấm điểm toàn bộ bài nộp</h3>
                <p className="text-xs text-slate-400">Không có bài nộp nào đang chờ duyệt.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
                {baiChuaCham.map((bn) => (
                  <div key={bn.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{bn.sinhVien?.hoTen || 'Sinh viên'}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">{bn.tenLop}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">{bn.tieuDeBaiTap}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(bn.ngayNop).toLocaleString('vi-VN')}
                        </span>
                        {bn.tepNop && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                            Có tệp đính kèm
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/giao-vien/bai-tap/${bn.baiTapId}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm shadow-amber-500/20 transition active:scale-95 shrink-0"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Chấm điểm ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Assignments */}
        {tabHienTai === 'bai-tap' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Link
                to="/giao-vien/tao-bai-tap"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Thêm bài tập mới</span>
              </Link>
            </div>

            {danhSachBaiTap.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-400">Chưa có bài tập nào được tạo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {danhSachBaiTap.map((bt) => (
                  <div key={bt.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {bt.tenLop || 'Lớp học'}
                        </span>
                        <h3 className="font-bold text-slate-800 text-sm mt-1">{bt.tieuDe}</h3>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg shrink-0">
                        {bt.diemToiDa || 10}đ
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {bt.noiDung}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Hạn: {new Date(bt.hanNop).toLocaleString('vi-VN')}</span>
                      <Link
                        to={`/giao-vien/bai-tap/${bt.id}`}
                        className="font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                      >
                        <span>Xem bài nộp</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modal: Tạo Lớp Học Mới */}
      {moModalTaoLop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">Tạo lớp học mới</h3>
                  <p className="text-xs text-slate-400">Khởi tạo không gian học tập cho sinh viên</p>
                </div>
              </div>
              <button
                onClick={() => setMoModalTaoLop(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loiTaoLop && (
              <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {loiTaoLop}
              </div>
            )}

            <form onSubmit={handleTaoLop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên lớp học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lập trình Java Nâng Cao - Nhóm 02"
                  value={tenLopMoi}
                  onChange={(e) => setTenLopMoi(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã lớp học (Tùy chọn - Tự động tạo nếu để trống)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: JAVA2026_N02"
                  value={maLopMoi}
                  onChange={(e) => setMaLopMoi(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả học phần
                </label>
                <textarea
                  rows="3"
                  placeholder="Giới thiệu về mục tiêu môn học, giáo trình tham khảo..."
                  value={moTaMoi}
                  onChange={(e) => setMoTaMoi(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMoModalTaoLop(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={dangTaoLop}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition disabled:opacity-50"
                >
                  {dangTaoLop ? 'Đang tạo lớp...' : 'Tạo lớp học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BangDieuKhienGiaoVien;
