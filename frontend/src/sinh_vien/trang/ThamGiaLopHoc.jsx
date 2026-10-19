import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles,
  Search,
  School,
  Lock
} from 'lucide-react';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { dungXacThuc } from '../../dung_chung/kho_luu_tru/NguCanhXacThuc';

export const ThamGiaLopHoc = () => {
  const [searchParams] = useSearchParams();
  const maLopUrl = searchParams.get('maLop') || searchParams.get('code') || '';
  const [maLop, setMaLop] = useState(maLopUrl);
  const [thongTinLop, setThongTinLop] = useState(null);
  const [dangTai, setDangTai] = useState(false);
  const [dangThamGia, setDangThamGia] = useState(false);
  const [loi, setLoi] = useState('');
  const [thanhCong, setThanhCong] = useState(false);

  const { nguoiDung, laGiaoVien, laAdmin } = dungXacThuc();
  const navigate = useNavigate();

  const kiemTraMaLop = async (code) => {
    if (!code || !code.trim()) return;
    setDangTai(true);
    setLoi('');
    try {
      const res = await lopHocDichVu.layThongTinTheoMa(code.trim());
      setThongTinLop(res);
    } catch (err) {
      setThongTinLop(null);
      setLoi(err.response?.data?.thongDiep || 'Không tìm thấy lớp học với mã này');
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    if (maLopUrl) {
      setMaLop(maLopUrl);
      kiemTraMaLop(maLopUrl);
    }
  }, [maLopUrl]);

  const handleTimKiem = (e) => {
    e.preventDefault();
    if (maLop.trim()) {
      kiemTraMaLop(maLop.trim());
    }
  };

  const handleXacNhanThamGia = async () => {
    if (!thongTinLop?.maLop) return;
    setDangThamGia(true);
    setLoi('');
    try {
      const res = await lopHocDichVu.thamGia(thongTinLop.maLop);
      setThanhCong(true);
      setTimeout(() => {
        navigate(`/sinh-vien/lop/${res.id || thongTinLop.id}`);
      }, 1500);
    } catch (err) {
      setLoi(err.response?.data?.thongDiep || 'Không thể tham gia lớp học');
    } finally {
      setDangThamGia(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
          <School className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Tham Gia Lớp Học Trực Tuyến
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Nhập mã lớp hoặc mở liên kết mời do giảng viên cung cấp để tham gia lớp học
        </p>
      </div>

      {/* Code Input Form */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <form onSubmit={handleTimKiem} className="flex gap-2">
          <input
            type="text"
            value={maLop}
            onChange={(e) => setMaLop(e.target.value.toUpperCase())}
            placeholder="Nhập mã lớp (VD: WEB2026)"
            className="flex-1 px-4 py-2.5 text-sm uppercase font-mono font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition"
          />
          <button
            type="submit"
            disabled={dangTai || !maLop.trim()}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 shrink-0"
          >
            {dangTai ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Tìm lớp</span>
          </button>
        </form>
      </div>

      {/* Error Alert */}
      {loi && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Không thể vào lớp:</p>
            <p>{loi}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {thanhCong && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3 animate-in zoom-in-95">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Tham gia lớp thành công!</p>
            <p>Đang chuyển hướng bạn đến lớp học...</p>
          </div>
        </div>
      )}

      {/* Classroom Preview Card */}
      {thongTinLop && !thanhCong && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-200">
          {/* Cover Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
                Mã lớp: {thongTinLop.maLop}
              </span>
              <span className="text-xs text-blue-200 font-semibold">
                Giảng viên: <strong className="text-white">{thongTinLop.tenGiaoVien}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              {thongTinLop.tenLop}
            </h2>

            <p className="text-xs text-blue-100/80 line-clamp-2">
              {thongTinLop.moTa || 'Lớp học chưa cập nhật mô tả.'}
            </p>
          </div>

          {/* Body stats */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sinh viên đã vào</span>
                <p className="text-base font-extrabold text-slate-800">{thongTinLop.soSinhVien} thành viên</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bài tập đã giao</span>
                <p className="text-base font-extrabold text-slate-800">{thongTinLop.soBaiTap} bài</p>
              </div>
            </div>

            {/* Authorization & Status checks */}
            {thongTinLop.daThamGia ? (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-3">
                <p className="text-xs font-bold text-blue-900">
                  🎉 Bạn đã là thành viên của lớp học này rồi!
                </p>
                <Link
                  to={`/sinh-vien/lop/${thongTinLop.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
                >
                  <span>Vào lớp học ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : !thongTinLop.thuocDanhSachQuanLy ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <p className="font-bold">Bạn chưa thuộc danh sách quản lý của giảng viên</p>
                    <p className="mt-1">
                      Giảng viên <strong className="text-amber-950">{thongTinLop.tenGiaoVien}</strong> chỉ cho phép các sinh viên nằm trong danh sách quản lý riêng tham gia. Vui lòng nhắn tin/email ({thongTinLop.emailGiaoVien}) để được giảng viên thêm vào danh sách.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bạn đã được giảng viên phê duyệt trong danh sách quản lý sinh viên.</span>
                </div>

                <button
                  onClick={handleXacNhanThamGia}
                  disabled={dangThamGia}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/25 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {dangThamGia ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Xác nhận tham gia lớp học này</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThamGiaLopHoc;
