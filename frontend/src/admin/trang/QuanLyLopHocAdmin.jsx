import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quanTriDichVu } from '../dich_vu/quanTriDichVu';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  Users, 
  FileText, 
  ArrowLeft, 
  Calendar, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const QuanLyLopHocAdmin = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [timKiem, setTimKiem] = useState('');
  const [dangTai, setDangTai] = useState(true);
  const [thongBao, setThongBao] = useState(null);

  const hienThongBao = (noiDung, loai = 'success') => {
    setThongBao({ noiDung, loai });
    setTimeout(() => setThongBao(null), 3500);
  };

  const taiDanhSachLop = async () => {
    setDangTai(true);
    try {
      const res = await quanTriDichVu.layDanhSachLopHoc();
      setDanhSachLop(res);
    } catch (err) {
      console.error(err);
      hienThongBao('Không thể tải danh sách lớp học', 'error');
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDanhSachLop();
  }, []);

  const handleXoaLop = async (id, tenLop) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lớp học "${tenLop}"? Tất cả bài tập và bài nộp liên quan sẽ bị xóa vĩnh viễn.`)) {
      try {
        await quanTriDichVu.xoaLopHoc(id);
        setDanhSachLop(prev => prev.filter(l => l.id !== id));
        hienThongBao(`Đã xóa lớp học "${tenLop}" thành công!`);
      } catch (err) {
        hienThongBao(err.response?.data?.thongDiep || 'Không thể xóa lớp học này', 'error');
      }
    }
  };

  const danhSachLoc = danhSachLop.filter(l => 
    l.tenLop?.toLowerCase().includes(timKiem.toLowerCase()) || 
    l.maLop?.toLowerCase().includes(timKiem.toLowerCase()) ||
    l.giaoVien?.hoTen?.toLowerCase().includes(timKiem.toLowerCase())
  );

  const tongSoSV = danhSachLop.reduce((sum, l) => sum + (l.soLuongSinhVien || 0), 0);
  const tongSoBT = danhSachLop.reduce((sum, l) => sum + (l.soLuongBaiTap || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {thongBao && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all ${
          thongBao.loai === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {thongBao.loai === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          <span>{thongBao.noiDung}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/quan-tri"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thống kê Quản trị</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Quản lý danh sách Lớp học
            </h1>
            <p className="text-xs text-slate-500">
              Giám sát toàn bộ các không gian lớp học trực tuyến do giảng viên khởi tạo.
            </p>
          </div>
        </div>

        {/* 3 Quick Stats Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            Tổng: <span className="font-extrabold text-blue-600">{danhSachLop.length}</span> lớp
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            Sinh viên: <span className="font-extrabold text-emerald-600">{tongSoSV}</span> lượt
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            Bài tập: <span className="font-extrabold text-purple-600">{tongSoBT}</span> bài
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={timKiem}
            onChange={(e) => setTimKiem(e.target.value)}
            placeholder="Tìm theo tên lớp, mã lớp hoặc giảng viên..."
            className="pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition w-full"
          />
        </div>

        <button
          onClick={taiDanhSachLop}
          title="Làm mới danh sách"
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-xl transition shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${dangTai ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Classes Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        {dangTai ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-3" />
            Đang tải dữ liệu lớp học...
          </div>
        ) : danhSachLoc.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold">Không tìm thấy lớp học phù hợp.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Thông tin Lớp học</th>
                  <th className="py-3.5 px-4">Mã lớp</th>
                  <th className="py-3.5 px-4">Giảng viên phụ trách</th>
                  <th className="py-3.5 px-4 text-center">Sinh viên</th>
                  <th className="py-3.5 px-4 text-center">Bài tập</th>
                  <th className="py-3.5 px-4">Ngày tạo</th>
                  <th className="py-3.5 px-5 text-right">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {danhSachLoc.map((l) => (
                  <tr key={l.id} className="hover:bg-blue-50/20 transition">
                    <td className="py-3.5 px-5">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{l.tenLop}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{l.moTa || 'Không có mô tả'}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-extrabold px-2.5 py-1 bg-slate-100 text-blue-700 rounded-lg border border-slate-200 text-xs">
                        {l.maLop}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                          {l.giaoVien?.hoTen?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{l.giaoVien?.hoTen || 'Chưa cập nhật'}</p>
                          <p className="text-[10px] text-slate-400">{l.giaoVien?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200">
                        <Users className="w-3 h-3 text-slate-400" />
                        {l.soLuongSinhVien || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200">
                        <FileText className="w-3 h-3 text-slate-400" />
                        {l.soLuongBaiTap || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {l.ngayTao ? new Date(l.ngayTao).toLocaleDateString('vi-VN') : 'Hôm nay'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleXoaLop(l.id, l.tenLop)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Xóa lớp học"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuanLyLopHocAdmin;
