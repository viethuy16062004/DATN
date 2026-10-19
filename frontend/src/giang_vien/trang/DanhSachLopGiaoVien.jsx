import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { TheLopHoc } from '../../dung_chung/thanh_phan/TheLopHoc';
import { dungXacThuc } from '../../dung_chung/kho_luu_tru/NguCanhXacThuc';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Users, 
  FileText, 
  Copy, 
  Check, 
  Trash2, 
  ChevronRight, 
  X,
  GraduationCap
} from 'lucide-react';

export const DanhSachLopGiaoVien = () => {
  const { nguoiDung } = dungXacThuc();
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [tuKhoa, setTuKhoa] = useState('');

  // Modal Tạo lớp học
  const [moModalTaoLop, setMoModalTaoLop] = useState(false);
  const [tenLopMoi, setTenLopMoi] = useState('');
  const [maLopMoi, setMaLopMoi] = useState('');
  const [moTaMoi, setMoTaMoi] = useState('');
  const [dangTaoLop, setDangTaoLop] = useState(false);
  const [loiTaoLop, setLoiTaoLop] = useState('');

  const taiDanhSachLop = async () => {
    try {
      const ds = await lopHocDichVu.layDanhSach();
      setDanhSachLop(ds || []);
    } catch (err) {
      console.error('Lỗi tải danh sách lớp:', err);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDanhSachLop();
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
      taiDanhSachLop();
    } catch (err) {
      setLoiTaoLop(err.response?.data?.thongDiep || 'Không thể tạo lớp học. Vui lòng thử lại.');
    } finally {
      setDangTaoLop(false);
    }
  };

  const lopLoc = danhSachLop.filter(l => 
    l.tenLop?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
    l.maLop?.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  const tongSinhVien = danhSachLop.reduce((acc, l) => acc + (l.soLuongSinhVien || 0), 0);

  if (dangTai) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Lớp học của tôi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Danh sách tất cả các lớp học do bạn trực tiếp giảng dạy và phụ trách ({danhSachLop.length} lớp, {tongSinhVien} sinh viên)
          </p>
        </div>

        <Link
          to="/giao-vien/tao-lop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-blue-600/20 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tạo lớp học mới</span>
        </Link>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên lớp hoặc mã lớp..."
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-blue-600 outline-none shadow-2xs transition"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>Hiển thị <strong className="text-blue-600">{lopLoc.length}</strong> / {danhSachLop.length} lớp học</span>
        </div>
      </div>

      {/* Classrooms Grid */}
      {lopLoc.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border-2 border-dashed border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-800">
              {tuKhoa ? 'Không tìm thấy lớp học nào' : 'Bạn chưa khởi tạo lớp học nào'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Chỉ các lớp học do bạn tạo mới hiển thị tại đây. Bấm nút bên dưới để khởi tạo khóa học đầu tiên.
            </p>
          </div>
          <Link
            to="/giao-vien/tao-lop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
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

export default DanhSachLopGiaoVien;
