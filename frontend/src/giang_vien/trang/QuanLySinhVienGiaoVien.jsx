import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  BookOpen, 
  GraduationCap, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  X, 
  Check, 
  Copy, 
  Share2, 
  AlertCircle,
  Sparkles,
  Info,
  FileSpreadsheet,
  UploadCloud,
  Download,
  ListFilter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { sinhVienGiaoVienDichVu } from '../dich_vu/sinhVienGiaoVienDichVu';
import { dungXacThuc } from '../../dung_chung/kho_luu_tru/NguCanhXacThuc';

export const QuanLySinhVienGiaoVien = () => {
  const { nguoiDung } = dungXacThuc();
  const [danhSach, setDanhSach] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [tuKhoa, setTuKhoa] = useState('');
  
  // Modal State
  const [moModal, setMoModal] = useState(false);
  const [tabModal, setTabModal] = useState('danh_sach_email'); // 'danh_sach_email' | 'file_excel' | 'tung_sinh_vien'
  
  // Tab 1: Dán danh sách Email
  const [vanBanEmails, setVanBanEmails] = useState('');
  const [ghiChuChung, setGhiChuChung] = useState('');

  // Tab 2: File Excel / CSV
  const [fileExcel, setFileExcel] = useState(null);
  const [danhSachTuExcel, setDanhSachTuExcel] = useState([]);
  const [dangDocFile, setDangDocFile] = useState(false);
  const fileInputRef = useRef(null);

  // Tab 3: Từng sinh viên
  const [emailNhap, setEmailNhap] = useState('');
  const [ghiChuNhap, setGhiChuNhap] = useState('');
  const [dsGoiY, setDsGoiY] = useState([]);
  const [dangTimHeThong, setDangTimHeThong] = useState(false);

  // Chung cho Modal
  const [dangLuu, setDangLuu] = useState(false);
  const [loiModal, setLoiModal] = useState('');
  const [thanhCongModal, setThanhCongModal] = useState('');
  const [ketQuaHangLoat, setKetQuaHangLoat] = useState(null);
  const [daCopyEmail, setDaCopyEmail] = useState(null);

  const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  // Real-time extracted emails from Tab 1
  const danhSachEmailTach = useMemo(() => {
    if (!vanBanEmails.trim()) return [];
    const matches = vanBanEmails.match(EMAIL_REGEX) || [];
    return Array.from(new Set(matches.map(e => e.trim().toLowerCase())));
  }, [vanBanEmails]);

  const taiDuLieu = async () => {
    try {
      setDangTai(true);
      const res = await sinhVienGiaoVienDichVu.layDanhSach();
      setDanhSach(res || []);
    } catch (err) {
      console.error('Lỗi tải danh sách sinh viên:', err);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, []);

  // Search autocomplete in system for Tab 3
  useEffect(() => {
    if (!moModal || tabModal !== 'tung_sinh_vien' || emailNhap.length < 2) {
      setDsGoiY([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setDangTimHeThong(true);
        const res = await sinhVienGiaoVienDichVu.timKiemHeThong(emailNhap);
        setDsGoiY(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setDangTimHeThong(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [emailNhap, moModal, tabModal]);

  const resetModal = () => {
    setVanBanEmails('');
    setGhiChuChung('');
    setFileExcel(null);
    setDanhSachTuExcel([]);
    setEmailNhap('');
    setGhiChuNhap('');
    setLoiModal('');
    setThanhCongModal('');
    setKetQuaHangLoat(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Tải file mẫu Excel
  const handleTaiFileMau = () => {
    const wb = XLSX.utils.book_new();
    const duLieuMau = [
      ['Email', 'Họ và tên', 'Mã sinh viên / Ghi chú'],
      ['sinhvien1@dau.edu.vn', 'Nguyễn Văn An', 'SV2026001 - Lớp KTPM K20'],
      ['sinhvien2@dau.edu.vn', 'Trần Thị Bình', 'SV2026002 - Lớp KTPM K20'],
      ['sinhvien3@gmail.com', 'Lê Hoàng Cường', 'SV2026003 - Lớp KTPM K20']
    ];
    const ws = XLSX.utils.aoa_to_sheet(duLieuMau);

    // Định dạng độ rộng cột
    ws['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 35 }];

    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachSinhVien');
    XLSX.writeFile(wb, 'Mau_Danh_Sach_Sinh_Vien.xlsx');
  };

  // Đọc file Excel / CSV
  const xuLyDocFile = (file) => {
    if (!file) return;
    setFileExcel(file);
    setLoiModal('');
    setDangDocFile(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        if (!rows || rows.length === 0) {
          setLoiModal('File không có dữ liệu');
          setDangDocFile(false);
          return;
        }

        // Tìm dòng tiêu đề
        let headerRowIndex = -1;
        let colEmail = -1;
        let colName = -1;
        let colNote = -1;

        for (let i = 0; i < Math.min(rows.length, 10); i++) {
          const row = rows[i];
          for (let j = 0; j < row.length; j++) {
            const val = String(row[j] || '').trim().toLowerCase();
            if (val.includes('email') || val.includes('mail') || val.includes('thư điện tử')) {
              colEmail = j;
              headerRowIndex = i;
            }
            if (val.includes('họ tên') || val.includes('họ và tên') || val.includes('name') || val.includes('tên')) {
              colName = j;
            }
            if (val.includes('mã sv') || val.includes('mssv') || val.includes('ghi chú') || val.includes('note') || val.includes('mã sinh viên')) {
              colNote = j;
            }
          }
          if (headerRowIndex !== -1) break;
        }

        const sinhVienTrichXuat = [];
        const seenEmails = new Set();

        const startIdx = headerRowIndex !== -1 ? headerRowIndex + 1 : 0;

        for (let i = startIdx; i < rows.length; i++) {
          const row = rows[i];
          let email = '';
          let hoTen = '';
          let ghiChu = '';

          if (colEmail !== -1) {
            email = String(row[colEmail] || '').trim();
            if (colName !== -1) hoTen = String(row[colName] || '').trim();
            if (colNote !== -1) ghiChu = String(row[colNote] || '').trim();
          } else {
            // Quét từng ô trong hàng tìm ô chứa email
            for (let j = 0; j < row.length; j++) {
              const cellVal = String(row[j] || '').trim();
              if (cellVal.match(EMAIL_REGEX)) {
                email = cellVal;
                // Lấy các ô còn lại làm tên / ghi chú
                const otherCells = row.filter((_, idx) => idx !== j && String(row[idx] || '').trim());
                if (otherCells.length > 0) hoTen = String(otherCells[0]).trim();
                if (otherCells.length > 1) ghiChu = String(otherCells[1]).trim();
                break;
              }
            }
          }

          if (email && email.match(EMAIL_REGEX)) {
            const cleanEmail = email.toLowerCase();
            if (!seenEmails.has(cleanEmail)) {
              seenEmails.add(cleanEmail);
              sinhVienTrichXuat.push({
                email: cleanEmail,
                hoTen: hoTen || cleanEmail.split('@')[0],
                ghiChu: ghiChu || null
              });
            }
          }
        }

        if (sinhVienTrichXuat.length === 0) {
          setLoiModal('Không tìm thấy địa chỉ email hợp lệ nào trong file. Vui lòng kiểm tra định dạng file mẫu.');
        } else {
          setDanhSachTuExcel(sinhVienTrichXuat);
        }
      } catch (err) {
        console.error(err);
        setLoiModal('Lỗi khi đọc file Excel: ' + err.message);
      } finally {
        setDangDocFile(false);
      }
    };

    reader.onerror = () => {
      setLoiModal('Không thể đọc file');
      setDangDocFile(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Submit Tab 1 (Dán danh sách email)
  const handleThemDanhSachEmail = async (e) => {
    e?.preventDefault();
    if (danhSachEmailTach.length === 0) {
      setLoiModal('Chưa phát hiện email hợp lệ nào trong ô nhập');
      return;
    }

    setDangLuu(true);
    setLoiModal('');
    setThanhCongModal('');

    try {
      const payload = danhSachEmailTach.map(email => ({
        email,
        hoTen: email.split('@')[0],
        ghiChu: ghiChuChung.trim() || null
      }));

      const res = await sinhVienGiaoVienDichVu.themHangLoat(payload);
      setKetQuaHangLoat(res);
      taiDuLieu();
    } catch (err) {
      setLoiModal(err.response?.data?.thongDiep || 'Có lỗi xảy ra khi lưu danh sách sinh viên');
    } finally {
      setDangLuu(false);
    }
  };

  // Submit Tab 2 (Nhập từ Excel)
  const handleThemTuExcel = async (e) => {
    e?.preventDefault();
    if (danhSachTuExcel.length === 0) {
      setLoiModal('Chưa có danh sách sinh viên nào từ file Excel');
      return;
    }

    setDangLuu(true);
    setLoiModal('');
    setThanhCongModal('');

    try {
      const res = await sinhVienGiaoVienDichVu.themHangLoat(danhSachTuExcel);
      setKetQuaHangLoat(res);
      taiDuLieu();
    } catch (err) {
      setLoiModal(err.response?.data?.thongDiep || 'Có lỗi xảy ra khi thêm sinh viên từ file');
    } finally {
      setDangLuu(false);
    }
  };

  // Submit Tab 3 (Thêm từng sinh viên)
  const handleThemDonLe = async (e) => {
    e?.preventDefault();
    if (!emailNhap.trim()) {
      setLoiModal('Vui lòng nhập email');
      return;
    }

    setDangLuu(true);
    setLoiModal('');
    setThanhCongModal('');

    try {
      await sinhVienGiaoVienDichVu.themSinhVien(emailNhap.trim(), ghiChuNhap.trim());
      setThanhCongModal('Đã thêm sinh viên vào danh sách quản lý thành công!');
      setEmailNhap('');
      setGhiChuNhap('');
      taiDuLieu();
      setTimeout(() => {
        setThanhCongModal('');
        setMoModal(false);
      }, 1200);
    } catch (err) {
      setLoiModal(err.response?.data?.thongDiep || 'Không thể thêm sinh viên vào danh sách');
    } finally {
      setDangLuu(false);
    }
  };

  const handleXoaSinhVien = async (id, hoTen) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sinh viên "${hoTen}" khỏi danh sách quản lý? Sinh viên này sẽ không thể tham gia các lớp học mới của bạn.`)) {
      try {
        await sinhVienGiaoVienDichVu.xoaSinhVien(id);
        setDanhSach(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        alert(err.response?.data?.thongDiep || 'Không thể xóa sinh viên');
      }
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setDaCopyEmail(id);
    setTimeout(() => setDaCopyEmail(null), 1500);
  };

  const danhSachLoc = danhSach.filter(item => {
    const sv = item.sinhVien;
    const q = tuKhoa.toLowerCase();
    return (
      sv?.hoTen?.toLowerCase().includes(q) ||
      sv?.email?.toLowerCase().includes(q) ||
      item.ghiChu?.toLowerCase().includes(q) ||
      sv?.soDienThoai?.includes(q)
    );
  });

  const tongSoSv = danhSach.length;
  const svDangHoc = danhSach.filter(i => i.soLopDangHoc > 0).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 backdrop-blur-md flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Quyền kiểm soát vào lớp</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Danh Sách Sinh Viên Quản Lý Riêng
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 max-w-3xl leading-relaxed">
              Quản lý danh sách sinh viên được phân công hoặc cho phép vào lớp. <strong className="text-amber-300">Chỉ những sinh viên có tên trong danh sách này mới có thể tham gia vào các lớp học do bạn tạo</strong> khi mở link mời hoặc nhập mã lớp.
            </p>
          </div>

          <button
            onClick={() => {
              resetModal();
              setMoModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black shadow-lg transition active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm sinh viên mới</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 max-w-xl">
          <div>
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Tổng sinh viên quản lý</span>
            <p className="text-xl font-black text-white">{tongSoSv} sinh viên</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Đã tham gia lớp</span>
            <p className="text-xl font-black text-emerald-300">{svDangHoc} sinh viên</p>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Chưa vào lớp nào</span>
            <p className="text-xl font-black text-amber-300">{tongSoSv - svDangHoc} sinh viên</p>
          </div>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed space-y-1">
          <p className="font-bold">Quy tắc bảo mật & Quản lý lớp học:</p>
          <p className="text-blue-800">
            Khi bạn gửi liên kết hoặc mã lớp cho sinh viên, hệ thống sẽ tự động đối chiếu tài khoản sinh viên với danh sách dưới đây. Nếu sinh viên chưa được thêm vào danh sách quản lý của bạn, hệ thống sẽ từ chối quyền vào lớp và yêu cầu sinh viên liên hệ bạn.
          </p>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder="Tìm theo tên, email, mã SV, SĐT..."
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500 font-semibold">
          <span>Hiển thị <strong>{danhSachLoc.length}</strong> / {tongSoSv} sinh viên</span>
        </div>
      </div>

      {/* Table Danh Sach Sinh Vien */}
      {dangTai ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : danhSachLoc.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">
            {tuKhoa ? 'Không tìm thấy sinh viên phù hợp' : 'Chưa có sinh viên nào trong danh sách quản lý'}
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {tuKhoa ? 'Thử tìm với từ khóa khác' : 'Nhấn vào nút "Thêm sinh viên mới" ở góc trên để dán danh sách email hoặc tải lên file Excel.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Sinh viên</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Ghi chú / Mã SV</th>
                  <th className="py-3.5 px-4 text-center">Số lớp đang học</th>
                  <th className="py-3.5 px-4">Ngày thêm</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {danhSachLoc.map((item) => {
                  const sv = item.sinhVien;
                  const ngayTao = item.ngayTao ? new Date(item.ngayTao).toLocaleDateString('vi-VN') : '—';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            {sv?.hoTen?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{sv?.hoTen || 'Chưa cập nhật'}</span>
                            {sv?.soDienThoai && (
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {sv.soDienThoai}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-600">{sv?.email}</span>
                          <button
                            onClick={() => handleCopy(sv?.email, item.id)}
                            title="Sao chép email"
                            className="p-1 text-slate-400 hover:text-blue-600 rounded transition opacity-0 group-hover:opacity-100"
                          >
                            {daCopyEmail === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {item.ghiChu ? (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700 text-[11px] border border-slate-200">
                            {item.ghiChu}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Không có</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {item.soLopDangHoc > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                            <BookOpen className="w-3 h-3" />
                            {item.soLopDangHoc} lớp
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold text-[11px]">
                            Chưa vào lớp
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {ngayTao}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleXoaSinhVien(item.id, sv?.hoTen || sv?.email)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Xóa khỏi danh sách quản lý"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL THÊM SINH VIÊN (HỖ TRỢ EXCEL, LIST EMAIL & ĐƠN LẺ) */}
      {moModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 space-y-5 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-1 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    Thêm Sinh Viên Quản Lý
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cấp quyền cho sinh viên tham gia các lớp học của bạn
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMoModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error or Success Notice */}
            {loiModal && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loiModal}</span>
              </div>
            )}

            {thanhCongModal && (
              <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 shrink-0">
                <Check className="w-4 h-4 shrink-0" />
                <span>{thanhCongModal}</span>
              </div>
            )}

            {/* KẾT QUẢ THÊM HÀNG LOẠT (VIEW KẾT QUẢ) */}
            {ketQuaHangLoat ? (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Đã xử lý xong dữ liệu nhập</span>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Tổng</span>
                      <span className="text-base font-black text-slate-800">{ketQuaHangLoat.tongSo}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-600 block uppercase">Thành công</span>
                      <span className="text-base font-black text-emerald-700">{ketQuaHangLoat.thanhCong}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-600 block uppercase">Đã có sẵn</span>
                      <span className="text-base font-black text-amber-700">{ketQuaHangLoat.daTonTai}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                      <span className="text-[10px] font-bold text-rose-600 block uppercase">Lỗi</span>
                      <span className="text-base font-black text-rose-700">{ketQuaHangLoat.loi}</span>
                    </div>
                  </div>
                </div>

                {/* Chi tiết từng sinh viên */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 sticky top-0 text-[11px] font-bold text-slate-500 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Họ tên</th>
                        <th className="py-2.5 px-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ketQuaHangLoat.chiTiet?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono text-slate-700">{item.email}</td>
                          <td className="py-2 px-3 text-slate-600">{item.hoTen || '—'}</td>
                          <td className="py-2 px-3">
                            {item.trangThai === 'THANH_CONG' && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                                Đã thêm
                              </span>
                            )}
                            {item.trangThai === 'DA_TON_TAI' && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-bold text-[10px]">
                                Đã có từ trước
                              </span>
                            )}
                            {item.trangThai === 'LOI' && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-[10px]" title={item.thongBao}>
                                Lỗi
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      resetModal();
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Thêm tiếp
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoModal(false)}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md shadow-blue-600/20"
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Tab Navigation */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setTabModal('danh_sach_email');
                      setLoiModal('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
                      tabModal === 'danh_sach_email'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Dán danh sách Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTabModal('file_excel');
                      setLoiModal('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
                      tabModal === 'file_excel'
                        ? 'bg-white text-emerald-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Nhập từ file Excel / CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTabModal('tung_sinh_vien');
                      setLoiModal('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
                      tabModal === 'tung_sinh_vien'
                        ? 'bg-white text-slate-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Thêm từng bạn</span>
                  </button>
                </div>

                {/* TAB 1: DÁN DANH SÁCH EMAIL HÀNG LOẠT */}
                {tabModal === 'danh_sach_email' && (
                  <form onSubmit={handleThemDanhSachEmail} className="space-y-4 overflow-y-auto pr-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Danh sách Email sinh viên <span className="text-rose-500">*</span>
                        </label>
                        {danhSachEmailTach.length > 0 && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            ✓ Đã nhận diện {danhSachEmailTach.length} email hợp lệ
                          </span>
                        )}
                      </div>

                      <textarea
                        rows={6}
                        value={vanBanEmails}
                        onChange={(e) => setVanBanEmails(e.target.value)}
                        placeholder="Dán danh sách email tại đây. Hỗ trợ phân tách bằng dấu phẩy, dấu chấm phẩy hoặc xuống dòng...&#10;VD:&#10;sinhvien1@dau.edu.vn, sinhvien2@dau.edu.vn&#10;sinhvien3@dau.edu.vn&#10;sv_k20@gmail.com; sv_ai@gmail.com"
                        className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition leading-relaxed"
                        required
                      />
                      <p className="text-[11px] text-slate-400">
                        Hệ thống tự động lọc ra các địa chỉ email chuẩn và loại bỏ trùng lặp.
                      </p>
                    </div>

                    {/* Preview detected email chips */}
                    {danhSachEmailTach.length > 0 && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Xem trước các email sẽ thêm ({danhSachEmailTach.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                          {danhSachEmailTach.slice(0, 15).map((em, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-700"
                            >
                              {em}
                            </span>
                          ))}
                          {danhSachEmailTach.length > 15 && (
                            <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px]">
                              +{danhSachEmailTach.length - 15} email khác...
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Ghi chú chung cho đợt thêm này (tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={ghiChuChung}
                        onChange={(e) => setGhiChuChung(e.target.value)}
                        placeholder="VD: Lớp KTPM K20 - Học kỳ 1 (2026)"
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
                      />
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                      💡 <strong>Tự động tạo tài khoản:</strong> Nếu sinh viên chưa từng đăng ký tài khoản trên hệ thống, hệ thống sẽ tự động cấp tài khoản sinh viên với mật khẩu mặc định <code>123456</code>.
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setMoModal(false)}
                        className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={dangLuu || danhSachEmailTach.length === 0}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                      >
                        {dangLuu ? 'Đang thêm hàng loạt...' : `Lưu ${danhSachEmailTach.length > 0 ? danhSachEmailTach.length : ''} sinh viên vào danh sách`}
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: NHẬP TỪ FILE EXCEL / CSV */}
                {tabModal === 'file_excel' && (
                  <form onSubmit={handleThemTuExcel} className="space-y-4 overflow-y-auto pr-1">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-slate-700">
                        Tải lên tệp Excel (.xlsx, .xls) hoặc CSV
                      </span>
                      <button
                        type="button"
                        onClick={handleTaiFileMau}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải file Excel mẫu</span>
                      </button>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition space-y-2 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                        onChange={(e) => xuLyDocFile(e.target.files?.[0])}
                      />
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-105 transition shadow-2xs">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          {fileExcel ? fileExcel.name : 'Nhấn để chọn file hoặc kéo thả file vào đây'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Hỗ trợ định dạng: .xlsx, .xls, .csv (chứa cột Email, Họ tên, Mã sinh viên)
                        </p>
                      </div>
                    </div>

                    {dangDocFile && (
                      <div className="p-3 text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Đang phân tích dữ liệu file Excel...</span>
                      </div>
                    )}

                    {/* Preview Table From Excel */}
                    {danhSachTuExcel.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Đã đọc được {danhSachTuExcel.length} sinh viên từ file
                          </span>
                          <span className="text-[11px] text-slate-400">Hiển thị trước 5 dòng đầu</span>
                        </div>

                        <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-48 overflow-y-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-[11px] font-bold text-slate-500 uppercase sticky top-0">
                              <tr>
                                <th className="py-2 px-3">STT</th>
                                <th className="py-2 px-3">Email</th>
                                <th className="py-2 px-3">Họ và tên</th>
                                <th className="py-2 px-3">Ghi chú / Mã SV</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {danhSachTuExcel.slice(0, 5).map((sv, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                                  <td className="py-2 px-3 font-mono font-semibold text-slate-800">{sv.email}</td>
                                  <td className="py-2 px-3 text-slate-600">{sv.hoTen}</td>
                                  <td className="py-2 px-3 text-slate-500">{sv.ghiChu || '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setMoModal(false)}
                        className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={dangLuu || danhSachTuExcel.length === 0}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                      >
                        {dangLuu ? 'Đang thêm từ file...' : `Lưu ${danhSachTuExcel.length > 0 ? danhSachTuExcel.length : ''} sinh viên từ file Excel`}
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 3: THÊM TỪNG BẠN */}
                {tabModal === 'tung_sinh_vien' && (
                  <form onSubmit={handleThemDonLe} className="space-y-4 overflow-y-auto pr-1">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Email sinh viên <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={emailNhap}
                          onChange={(e) => setEmailNhap(e.target.value)}
                          placeholder="VD: sinhvien@aiclassroom.edu.vn"
                          className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
                          required
                        />
                        {dangTimHeThong && (
                          <div className="absolute right-3 top-2.5">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Autocomplete dropdown suggestions */}
                      {dsGoiY.length > 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100">
                          <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Gợi ý sinh viên trong hệ thống:
                          </div>
                          {dsGoiY.map((sv) => (
                            <button
                              type="button"
                              key={sv.id}
                              onClick={() => {
                                setEmailNhap(sv.email);
                                setDsGoiY([]);
                              }}
                              className="w-full p-2.5 text-left hover:bg-blue-50 flex items-center justify-between gap-2 transition"
                            >
                              <div>
                                <span className="font-bold text-xs text-slate-800 block">{sv.hoTen}</span>
                                <span className="text-[11px] text-slate-400">{sv.email}</span>
                              </div>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                Chọn
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Ghi chú / Mã sinh viên (tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={ghiChuNhap}
                        onChange={(e) => setGhiChuNhap(e.target.value)}
                        placeholder="VD: SV2026001 - Lớp KTPM K20"
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
                      />
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                      💡 <strong>Mẹo:</strong> Sau khi thêm sinh viên vào danh sách này, bạn chỉ cần gửi mã lớp hoặc liên kết tham gia lớp học cho sinh viên là các bạn có thể vào học ngay lập tức.
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setMoModal(false)}
                        className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={dangLuu}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition shadow-md shadow-blue-600/20"
                      >
                        {dangLuu ? 'Đang thêm...' : 'Lưu vào danh sách'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLySinhVienGiaoVien;
