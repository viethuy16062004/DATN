import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { baiTapDichVu } from '../dich_vu/baiTapDichVu';
import { aiDichVu } from '../../sinh_vien/dich_vu/aiDichVu';
import { TheBaiTap } from '../../dung_chung/thanh_phan/TheBaiTap';
import { AiGoiYCard } from '../../dung_chung/thanh_phan/AiGoiYCard';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  FileText, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check,
  UserX,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  RefreshCw,
  Search,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const ChiTietLopGiaoVien = () => {
  const { id } = useParams();
  const [lop, setLop] = useState(null);
  const [danhSachBaiTap, setDanhSachBaiTap] = useState([]);
  const [thanhVien, setThanhVien] = useState([]);
  const [aiPhanTich, setAiPhanTich] = useState(null);
  const [tabHienTai, setTabHienTai] = useState('bai-tap'); // 'bai-tap', 'sinh-vien', 'ai-phan-tich'
  const [dangTai, setDangTai] = useState(true);
  const [dangTaiAi, setDangTaiAi] = useState(false);
  const [daCopy, setDaCopy] = useState(false);
  const [daCopyLink, setDaCopyLink] = useState(false);
  const [tuKhoaSinhVien, setTuKhoaSinhVien] = useState('');

  const navigate = useNavigate();

  const taiDuLieu = async () => {
    try {
      const [l, dsBt, tv] = await Promise.all([
        lopHocDichVu.layChiTiet(id),
        baiTapDichVu.layDanhSach(id),
        lopHocDichVu.layThanhVien(id),
      ]);
      setLop(l);
      setDanhSachBaiTap(dsBt || []);
      setThanhVien(tv || []);
    } catch (err) {
      console.error('Lỗi tải chi tiết lớp:', err);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, [id]);

  const handleCopyMa = () => {
    if (lop?.maLop) {
      navigator.clipboard.writeText(lop.maLop);
      setDaCopy(true);
      setTimeout(() => setDaCopy(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (lop?.maLop) {
      const link = `${window.location.origin}/tham-gia-lop?maLop=${lop.maLop}`;
      navigator.clipboard.writeText(link);
      setDaCopyLink(true);
      setTimeout(() => setDaCopyLink(false), 2000);
    }
  };

  const handleXoaLop = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này và toàn bộ bài tập liên quan? Thao tác này không thể hoàn tác.')) {
      try {
        await lopHocDichVu.xoa(id);
        navigate('/giao-vien');
      } catch (err) {
        alert(err.response?.data?.thongDiep || 'Không thể xóa lớp học');
      }
    }
  };

  const handleXoaSinhVien = async (sinhVienId, hoTen) => {
    if (window.confirm(`Bạn có chắc muốn xóa sinh viên "${hoTen}" khỏi lớp học?`)) {
      try {
        await lopHocDichVu.xoaThanhVien(id, sinhVienId);
        setThanhVien(prev => prev.filter(t => t.sinhVien.id !== sinhVienId));
      } catch (err) {
        alert(err.response?.data?.thongDiep || 'Không thể xóa sinh viên');
      }
    }
  };

  const handleXoaBaiTap = async (btId, tieuDe) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài tập "${tieuDe}"?`)) {
      try {
        await baiTapDichVu.xoa(btId);
        setDanhSachBaiTap(prev => prev.filter(b => b.id !== btId));
      } catch (err) {
        alert('Không thể xóa bài tập');
      }
    }
  };

  const handleChayAiPhanTich = async () => {
    setDangTaiAi(true);
    try {
      const res = await aiDichVu.phanTichLop(id);
      setAiPhanTich(res);
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối AI. Vui lòng thử lại.');
    } finally {
      setDangTaiAi(false);
    }
  };

  if (dangTai) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!lop) {
    return (
      <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
        <h2 className="text-base font-bold text-slate-800">Không tìm thấy lớp học</h2>
        <Link to="/giao-vien" className="text-xs font-bold text-blue-600 hover:underline">
          ← Quay lại bảng điều khiển
        </Link>
      </div>
    );
  }

  const sinhVienLoc = thanhVien.filter(tv => 
    tv.sinhVien?.hoTen?.toLowerCase().includes(tuKhoaSinhVien.toLowerCase()) ||
    tv.sinhVien?.email?.toLowerCase().includes(tuKhoaSinhVien.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Back Link */}
      <Link
        to="/giao-vien"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại bảng điều khiển</span>
      </Link>

      {/* Classroom Hero Card */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 backdrop-blur-md">
                Lớp học chính khóa
              </span>
              <button
                onClick={handleCopyMa}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 hover:bg-amber-300 text-xs font-black shadow-xs transition active:scale-95"
                title="Bấm để sao chép mã lớp"
              >
                {daCopy ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Mã lớp: {lop.maLop}</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 hover:bg-emerald-300 text-xs font-black shadow-xs transition active:scale-95"
                title="Bấm để sao chép liên kết mời sinh viên tham gia lớp"
              >
                {daCopyLink ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                <span>{daCopyLink ? 'Đã sao chép link mời!' : 'Sao chép link mời'}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lop.tenLop}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/80 max-w-3xl leading-relaxed">
              {lop.moTa || 'Lớp học chưa cập nhật mô tả học phần.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/giao-vien/tao-bai-tap?lopHocId=${lop.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-extrabold shadow-md transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Giao bài tập</span>
            </Link>

            <button
              onClick={handleXoaLop}
              className="p-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 transition active:scale-95"
              title="Xóa lớp học"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 max-w-lg">
          <div>
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Sinh viên</span>
            <p className="text-lg font-black text-white">{thanhVien.length} bạn</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Bài tập</span>
            <p className="text-lg font-black text-white">{danhSachBaiTap.length} bài</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Giảng viên</span>
            <p className="text-lg font-black text-white truncate">{lop.giaoVien?.hoTen || 'Thầy/Cô'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTabHienTai('bai-tap')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
            tabHienTai === 'bai-tap'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Danh sách bài tập ({danhSachBaiTap.length})</span>
        </button>

        <button
          onClick={() => setTabHienTai('sinh-vien')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
            tabHienTai === 'sinh-vien'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh sách sinh viên ({thanhVien.length})</span>
        </button>

        <button
          onClick={() => {
            setTabHienTai('ai-phan-tich');
            if (!aiPhanTich) handleChayAiPhanTich();
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
            tabHienTai === 'ai-phan-tich'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Đánh giá lớp học</span>
        </button>
      </div>

      {/* Tab 1: Assignments */}
      {tabHienTai === 'bai-tap' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Bài tập thực hành của lớp
            </h3>
            <Link
              to={`/giao-vien/tao-bai-tap?lopHocId=${lop.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Giao bài tập mới</span>
            </Link>
          </div>

          {danhSachBaiTap.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Chưa có bài tập nào</h4>
              <p className="text-xs text-slate-400">Tạo bài tập đầu tiên để sinh viên bắt đầu nộp bài.</p>
              <Link
                to={`/giao-vien/tao-bai-tap?lopHocId=${lop.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo bài tập ngay</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {danhSachBaiTap.map((bt) => (
                <div key={bt.id} className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-slate-800 text-sm">{bt.tieuDe}</h4>
                      <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg shrink-0">
                        {bt.diemToiDa || 10}đ
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {bt.noiDung}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Hạn: {new Date(bt.hanNop).toLocaleString('vi-VN')}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleXoaBaiTap(bt.id, bt.tieuDe)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Xóa bài tập"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        to={`/giao-vien/bai-tap/${bt.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition"
                      >
                        <span>Chấm bài</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Students */}
      {tabHienTai === 'sinh-vien' && (
        <div className="space-y-4">
          {/* Managed Student Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <span>🛡️ Kiểm soát quyền tham gia lớp học</span>
              </div>
              <p className="text-amber-800">
                Chỉ những sinh viên có trong <strong>Danh sách sinh viên quản lý riêng</strong> của bạn mới có thể tham gia lớp học này khi nhận link/mã lớp.
              </p>
            </div>
            <Link
              to="/giao-vien/sinh-vien-quan-ly"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shrink-0 transition active:scale-95 shadow-xs"
            >
              <span>Quản lý danh sách sinh viên</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm sinh viên theo tên, email..."
                value={tuKhoaSinhVien}
                onChange={(e) => setTuKhoaSinhVien(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-blue-600 outline-none shadow-2xs"
              />
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-100">
              Tổng số: {sinhVienLoc.length} sinh viên đã tham gia
            </div>
          </div>

          {sinhVienLoc.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400">Không có sinh viên nào trong danh sách.</p>
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {sinhVienLoc.map((tv, idx) => (
                  <div key={tv.id || idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">
                        {tv.sinhVien?.hoTen?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{tv.sinhVien?.hoTen}</h4>
                        <p className="text-[11px] text-slate-400">{tv.sinhVien?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        Tham gia: {new Date(tv.ngayThamGia).toLocaleDateString('vi-VN')}
                      </span>

                      <button
                        onClick={() => handleXoaSinhVien(tv.sinhVien?.id, tv.sinhVien?.hoTen)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Xóa sinh viên khỏi lớp"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: AI Analytics */}
      {tabHienTai === 'ai-phan-tich' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Báo Cáo Phân Tích Chất Lượng Học Tập & Giảng Dạy</span>
            </h3>

            <button
              onClick={handleChayAiPhanTich}
              disabled={dangTaiAi}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dangTaiAi ? 'animate-spin' : ''}`} />
              <span>Phân tích lại</span>
            </button>
          </div>

          {aiPhanTich ? (
            <AiGoiYCard
              tieuDe={aiPhanTich.tieuDe}
              noiDung={aiPhanTich.noiDung}
              danhSachGoiY={aiPhanTich.danhSachGoiY}
              dangTai={dangTaiAi}
            />
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">AI đang thu thập dữ liệu và phân tích...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChiTietLopGiaoVien;
