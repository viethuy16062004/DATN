import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { baiTapDichVu } from '../dich_vu/baiTapDichVu';
import { baiNopDichVu } from '../../sinh_vien/dich_vu/baiNopDichVu';
import { chamDiemDichVu } from '../dich_vu/chamDiemDichVu';
import { aiDichVu } from '../../sinh_vien/dich_vu/aiDichVu';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  ExternalLink, 
  Clock, 
  Save, 
  FileText,
  User,
  AlertCircle,
  Image as ImageIcon,
  File,
  Eye,
  Download,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Zap,
  Check
} from 'lucide-react';

export const ChamDiemBaiNop = () => {
  const { id } = useParams(); // baiTapId
  const [baiTap, setBaiTap] = useState(null);
  const [danhSachBaiNop, setDanhSachBaiNop] = useState([]);
  const [baiNopChon, setBaiNopChon] = useState(null);
  
  // Grading form state
  const [diemSo, setDiemSo] = useState('');
  const [nhanXet, setNhanXet] = useState('');
  const [dangLuu, setDangLuu] = useState(false);
  const [thongBao, setThongBao] = useState({ loai: '', thongDiep: '' });
  const [dangTai, setDangTai] = useState(true);

  // AI Grader Assistant
  const [dangGoiAi, setDangGoiAi] = useState(false);
  const [aiGoiY, setAiGoiY] = useState(null);

  // Filters & Search
  const [boLocTrangThai, setBoLocTrangThai] = useState('ALL'); // 'ALL', 'CHUA_CHAM', 'DA_CHAM'
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

  const taiDuLieu = async () => {
    try {
      const [bt, dsBn] = await Promise.all([
        baiTapDichVu.layChiTiet(id),
        baiNopDichVu.layDanhSach(id),
      ]);
      setBaiTap(bt);
      setDanhSachBaiNop(dsBn || []);
      if (dsBn && dsBn.length > 0) {
        chonBaiNop(dsBn[0]);
      }
    } catch (err) {
      console.error('Lỗi tải bài nộp:', err);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, [id]);

  const chonBaiNop = (bn) => {
    setBaiNopChon(bn);
    setDiemSo(bn.diemSo !== null && bn.diemSo !== undefined ? bn.diemSo.toString() : '');
    setNhanXet(bn.nhanXet || '');
    setThongBao({ loai: '', thongDiep: '' });
    setAiGoiY(null);
  };

  const handleGoiAiChamDiem = async () => {
    if (!baiNopChon) return;
    setDangGoiAi(true);
    try {
      const res = await aiDichVu.goiYChamDiem(baiNopChon.id);
      setAiGoiY(res);
      if (res.diemGoiY !== undefined && res.diemGoiY !== null) {
        setDiemSo(res.diemGoiY.toString());
      }
      if (res.nhanXetChiTiet) {
        setNhanXet(res.nhanXetChiTiet);
      }
    } catch (err) {
      console.error('Lỗi AI chấm bài:', err);
      alert('Không thể kết nối AI gợi ý chấm điểm. Vui lòng thử lại.');
    } finally {
      setDangGoiAi(false);
    }
  };

  const handleLuuDiem = async (e) => {
    e?.preventDefault();
    if (!baiNopChon) return;

    const diem = parseFloat(diemSo);
    if (isNaN(diem) || diem < 0 || diem > (baiTap?.diemToiDa || 10)) {
      setThongBao({ loai: 'loi', thongDiep: `Điểm số phải từ 0 đến ${baiTap?.diemToiDa || 10}` });
      return;
    }

    setDangLuu(true);
    setThongBao({ loai: '', thongDiep: '' });

    try {
      const res = await chamDiemDichVu.chamDiem({
        baiNopId: baiNopChon.id,
        diemSo: diem,
        nhanXet: nhanXet.trim()
      });

      setThongBao({ loai: 'thanh-cong', thongDiep: 'Đã lưu điểm và nhận xét thành công!' });
      
      // Update local state
      setDanhSachBaiNop(prev => prev.map(bn => 
        bn.id === baiNopChon.id ? { ...bn, diemSo: res.diemSo, nhanXet: res.nhanXet, trangThai: 'DA_CHAM' } : bn
      ));
      setBaiNopChon(prev => ({ ...prev, diemSo: res.diemSo, nhanXet: res.nhanXet, trangThai: 'DA_CHAM' }));
    } catch (err) {
      setThongBao({ loai: 'loi', thongDiep: err.response?.data?.thongDiep || 'Lỗi khi lưu điểm' });
    } finally {
      setDangLuu(false);
    }
  };

  const handleChuyenSinhVien = (huong) => {
    if (!baiNopChon) return;
    const danhSach = dsLoc;
    const currentIndex = danhSach.findIndex(bn => bn.id === baiNopChon.id);
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + huong;
    if (nextIndex >= 0 && nextIndex < danhSach.length) {
      chonBaiNop(danhSach[nextIndex]);
    }
  };

  const dsLoc = danhSachBaiNop.filter(bn => {
    const matchSearch = bn.sinhVien?.hoTen?.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
                        bn.sinhVien?.email?.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
    if (!matchSearch) return false;
    if (boLocTrangThai === 'CHUA_CHAM') return bn.diemSo === null || bn.diemSo === undefined;
    if (boLocTrangThai === 'DA_CHAM') return bn.diemSo !== null && bn.diemSo !== undefined;
    return true;
  });

  const daChamCount = danhSachBaiNop.filter(bn => bn.diemSo !== null && bn.diemSo !== undefined).length;

  if (dangTai) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const isImg = baiNopChon?.tepNop?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to={baiTap?.lopHocId ? `/giao-vien/lop/${baiTap.lopHocId}` : '/giao-vien'}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700">
                {baiTap?.tenLop || 'Lớp học'}
              </span>
              <span className="text-xs text-slate-400">
                Hạn nộp: {new Date(baiTap?.hanNop).toLocaleString('vi-VN')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
              Chấm điểm: {baiTap?.tieuDe}
            </h1>
          </div>
        </div>

        {/* Stats badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-600">
            Tiến độ chấm:{' '}
            <strong className="text-blue-600 font-extrabold">{daChamCount}</strong> / {danhSachBaiNop.length} bài
          </div>
        </div>
      </div>

      {/* Main Dual Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Student List & Filter (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-white p-4 border border-slate-200/80 shadow-xs space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm sinh viên..."
                value={tuKhoaTimKiem}
                onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 outline-none transition"
              />
            </div>

            {/* Filter Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setBoLocTrangThai('ALL')}
                className={`py-1.5 rounded-lg transition ${
                  boLocTrangThai === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tất cả ({danhSachBaiNop.length})
              </button>
              <button
                onClick={() => setBoLocTrangThai('CHUA_CHAM')}
                className={`py-1.5 rounded-lg transition ${
                  boLocTrangThai === 'CHUA_CHAM' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Chưa chấm ({danhSachBaiNop.length - daChamCount})
              </button>
              <button
                onClick={() => setBoLocTrangThai('DA_CHAM')}
                className={`py-1.5 rounded-lg transition ${
                  boLocTrangThai === 'DA_CHAM' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Đã chấm ({daChamCount})
              </button>
            </div>

            {/* Student List */}
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto no-scrollbar pt-1">
              {dsLoc.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Không tìm thấy bài nộp nào
                </div>
              ) : (
                dsLoc.map((bn) => {
                  const daCham = bn.diemSo !== null && bn.diemSo !== undefined;
                  const isSelected = baiNopChon?.id === bn.id;

                  return (
                    <button
                      key={bn.id}
                      onClick={() => chonBaiNop(bn)}
                      className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-blue-50/90 border border-blue-200' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          daCham ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {bn.sinhVien?.hoTen?.charAt(0) || 'S'}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                            {bn.sinhVien?.hoTen}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {new Date(bn.ngayNop).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {daCham ? (
                          <span className="px-2 py-0.5 text-xs font-extrabold rounded-md bg-emerald-100 text-emerald-800">
                            {bn.diemSo}đ
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800">
                            Chờ chấm
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Submission Details & Grading Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {!baiNopChon ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-400">
              Chọn một sinh viên từ danh sách bên trái để chấm bài
            </div>
          ) : (
            <>
              {/* Active Student Card Header */}
              <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-base font-extrabold shadow-md shadow-blue-500/20">
                    {baiNopChon.sinhVien?.hoTen?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      {baiNopChon.sinhVien?.hoTen}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {baiNopChon.sinhVien?.email} • Nộp lúc: {new Date(baiNopChon.ngayNop).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                {/* Prev / Next navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleChuyenSinhVien(-1)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                    title="Sinh viên trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleChuyenSinhVien(1)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                    title="Sinh viên kế tiếp"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Student Submission Content Box */}
              <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nội dung bài làm của sinh viên
                  </span>
                  {baiNopChon.tepNop && (
                    <a
                      href={baiNopChon.tepNop}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Mở / Tải tệp đính kèm</span>
                    </a>
                  )}
                </div>

                {/* Text / Markdown Content */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {baiNopChon.noiDung || (
                    <span className="text-slate-400 italic">Sinh viên không nhập văn bản giải trình.</span>
                  )}
                </div>

                {/* Image Preview if applicable */}
                {isImg && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900/5 p-2">
                    <p className="text-[11px] font-bold text-slate-500 mb-2 px-1">Ảnh đính kèm:</p>
                    <img
                      src={baiNopChon.tepNop}
                      alt="Ảnh bài nộp"
                      className="max-h-72 w-auto mx-auto rounded-xl object-contain shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* AI Grading Assistant Bar */}
              <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-950 to-slate-900 p-5 text-white shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white/10 text-amber-300 backdrop-blur-md">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">
                        Trợ Lý AI Chấm Bài Sư Phạm
                      </h3>
                      <p className="text-xs text-blue-200/80">
                        Tự động phân tích bài làm, đề xuất điểm số và nhận xét hướng dẫn
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoiAiChamDiem}
                    disabled={dangGoiAi}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-black shadow-md transition active:scale-95 disabled:opacity-50"
                  >
                    {dangGoiAi ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>AI đang phân tích bài làm...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>AI Gợi ý điểm & nhận xét</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Grading Form */}
              <form onSubmit={handleLuuDiem} className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Nhập điểm & Nhận xét của Giảng viên</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    Thang điểm tối đa: {baiTap?.diemToiDa || 10}đ
                  </span>
                </div>

                {thongBao.thongDiep && (
                  <div className={`p-3 text-xs font-bold rounded-xl ${
                    thongBao.loai === 'thanh-cong' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {thongBao.thongDiep}
                  </div>
                )}

                {/* Score & Quick buttons */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Điểm số đạt được <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max={baiTap?.diemToiDa || 10}
                      required
                      placeholder="0.0"
                      value={diemSo}
                      onChange={(e) => setDiemSo(e.target.value)}
                      className="w-32 px-4 py-2.5 text-base font-black text-blue-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
                    />

                    {/* Quick grade buttons */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[10, 9.5, 9, 8.5, 8, 7.5, 7, 5, 0].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setDiemSo(score.toString())}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                            diemSo === score.toString()
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Feedback textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nhận xét & Lời khuyên dành cho sinh viên
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Góp ý chi tiết về cách viết code, tối ưu giải thuật hoặc khen ngợi nỗ lực của sinh viên..."
                    value={nhanXet}
                    onChange={(e) => setNhanXet(e.target.value)}
                    className="w-full px-3.5 py-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition resize-y leading-relaxed"
                  />
                </div>

                {/* Action Submit */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={dangLuu}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 transition active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{dangLuu ? 'Đang lưu điểm...' : 'Lưu Điểm & Hoàn Tất'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChamDiemBaiNop;
