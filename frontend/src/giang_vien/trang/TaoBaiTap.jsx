import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { baiTapDichVu } from '../dich_vu/baiTapDichVu';
import { aiDichVu } from '../../sinh_vien/dich_vu/aiDichVu';
import { tepTinDichVu } from '../../dung_chung/dich_vu/tepTinDichVu';
import { NoiDungBaiTapCard } from '../../dung_chung/thanh_phan/NoiDungBaiTapCard';
import { 
  ArrowLeft, 
  FileText, 
  Send, 
  Calendar, 
  Award, 
  Paperclip, 
  Sparkles, 
  Eye, 
  Edit3, 
  Upload, 
  Trash2, 
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Zap,
  Bold,
  Code,
  List,
  Target,
  Terminal,
  BookOpen
} from 'lucide-react';

export const TaoBaiTap = () => {
  const [searchParams] = useSearchParams();
  const lopHocIdParam = searchParams.get('lopHocId');

  const [danhSachLop, setDanhSachLop] = useState([]);
  const [lopHocId, setLopHocId] = useState(lopHocIdParam || '');
  const [tieuDe, setTieuDe] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [hanNop, setHanNop] = useState('');
  const [diemToiDa, setDiemToiDa] = useState(10);
  const [tepDinhKem, setTepDinhKem] = useState('');
  const [dangXuLy, setDangXuLy] = useState(false);
  const [loi, setLoi] = useState('');
  const [cheDoXemTruoc, setCheDoXemTruoc] = useState(false); // false = Soạn thảo, true = Xem dạng tài liệu đẹp

  // AI Assistant State
  const [moPanelAi, setMoPanelAi] = useState(false);
  const [chuDeAi, setChuDeAi] = useState('');
  const [doKhoAi, setDoKhoAi] = useState('TRUNG_BINH');
  const [yeuCauThemAi, setYeuCauThemAi] = useState('');
  const [dangGoiAi, setDangGoiAi] = useState(false);

  // File Upload State
  const [dangTaiFile, setDangTaiFile] = useState(false);
  const [thongTinFile, setThongTinFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    lopHocDichVu.layDanhSach().then(ds => {
      setDanhSachLop(ds || []);
      if (!lopHocId && ds && ds.length > 0) {
        setLopHocId(ds[0].id.toString());
      }
    }).catch(console.error);

    // Mặc định hạn nộp: 7 ngày tới lúc 23:59
    datHanNopNhanh(7);
  }, []);

  const datHanNopNhanh = (soNgay) => {
    const d = new Date();
    d.setDate(d.getDate() + soNgay);
    d.setHours(23, 59, 0, 0);
    // Convert to local datetime-local string
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    setHanNop(localDate.toISOString().slice(0, 16));
  };

  const [thongBaoAi, setThongBaoAi] = useState('');

  const handleChayAiSoanBai = async () => {
    if (!chuDeAi.trim()) {
      alert('Vui lòng nhập chủ đề bài tập để AI biên soạn!');
      return;
    }
    setDangGoiAi(true);
    setThongBaoAi('');
    try {
      const lopChon = danhSachLop.find(l => l.id.toString() === lopHocId);
      const res = await aiDichVu.soanBaiTap({
        chuDe: chuDeAi.trim(),
        doKho: doKhoAi,
        yeuCauBoSung: yeuCauThemAi.trim(),
        tenMonHoc: lopChon?.tenLop || 'Công nghệ Thông tin'
      });

      if (res) {
        if (res.tieuDe) setTieuDe(res.tieuDe);
        if (res.noiDung) setNoiDung(res.noiDung);
        if (res.diemToiDa) setDiemToiDa(res.diemToiDa);
        if (res.soNgayGoiY) datHanNopNhanh(res.soNgayGoiY);
        setCheDoXemTruoc(true); // Hiển thị ngay dạng tài liệu trực quan đẹp mắt
        setThongBaoAi('🎉 AI đã biên soạn đề bài & rubric chấm điểm thành công! Giao diện tài liệu chuẩn đã được tạo bên dưới.');
      }

      setMoPanelAi(false);
    } catch (err) {
      console.error('Lỗi AI soạn bài:', err);
      alert('Không thể kết nối AI: ' + (err.response?.data?.thongDiep || 'Vui lòng khởi động lại backend để áp dụng endpoint mới.'));
    } finally {
      setDangGoiAi(false);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDangTaiFile(true);
    try {
      const res = await tepTinDichVu.taiLen(file);
      setTepDinhKem(res.url);
      setThongTinFile(res);
    } catch (err) {
      alert('Tải tệp đính kèm thất bại: ' + (err.response?.data?.thongDiep || err.message));
    } finally {
      setDangTaiFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lopHocId || !tieuDe.trim() || !noiDung.trim() || !hanNop) {
      setLoi('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    setDangXuLy(true);
    setLoi('');

    try {
      await baiTapDichVu.taomoi({
        lopHocId: Number(lopHocId),
        tieuDe: tieuDe.trim(),
        noiDung: noiDung.trim(),
        hanNop: new Date(hanNop).toISOString(),
        diemToiDa: Number(diemToiDa),
        tepDinhKem: tepDinhKem.trim() || null
      });

      navigate(`/giao-vien/lop/${lopHocId}`);
    } catch (err) {
      setLoi(err.response?.data?.thongDiep || 'Không thể tạo bài tập');
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <Link
        to={lopHocId ? `/giao-vien/lop/${lopHocId}` : '/giao-vien'}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại trang lớp học</span>
      </Link>

      {/* Main Container */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Header with AI Assistant Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Giao bài tập mới
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Thiết lập nội dung thực hành, thời hạn và tiêu chí đánh giá sinh viên
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMoPanelAi(!moPanelAi)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Soạn Đề Tự Động</span>
          </button>
        </div>

        {/* AI Assistant Modal / Accordion Drawer */}
        {moPanelAi && (
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50/90 via-blue-50/70 to-slate-50 p-5 border border-indigo-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs sm:text-sm font-black text-indigo-900 uppercase tracking-wide">
                  Trợ lý AI Biên Soạn Đề Bài & Tiêu Chí Chấm
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMoPanelAi(false)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                  Chủ đề bài tập cần giao <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Xây dựng REST API Quản lý sách với Spring Security JWT"
                  value={chuDeAi}
                  onChange={(e) => setChuDeAi(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-indigo-200 rounded-xl focus:border-indigo-600 outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                  Mức độ khó
                </label>
                <select
                  value={doKhoAi}
                  onChange={(e) => setDoKhoAi(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-indigo-200 rounded-xl focus:border-indigo-600 outline-none shadow-2xs"
                >
                  <option value="CO_BAN">Cơ bản (Dành cho người mới bắt đầu)</option>
                  <option value="TRUNG_BINH">Trung bình (Thực hành chuẩn môn học)</option>
                  <option value="NANG_CAO">Nâng cao (Tối ưu thuật toán & Kiến trúc)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                Yêu cầu bổ sung (Tùy chọn)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Yêu cầu viết unit test với JUnit 5, có phân quyền ROLE_ADMIN và ROLE_USER..."
                value={yeuCauThemAi}
                onChange={(e) => setYeuCauThemAi(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-indigo-200 rounded-xl focus:border-indigo-600 outline-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleChayAiSoanBai}
                disabled={dangGoiAi}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition disabled:opacity-50"
              >
                {dangGoiAi ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gemini AI đang soạn đề...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Tạo Đề Bài Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {thongBaoAi && (
          <div className="p-3.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <span>{thongBaoAi}</span>
            <button type="button" onClick={() => setThongBaoAi('')} className="text-emerald-600 hover:text-emerald-900 ml-2">✕</button>
          </div>
        )}

        {loi && (
          <div className="p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl">
            {loi}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Class Select & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Lớp học áp dụng <span className="text-rose-500">*</span>
              </label>
              <select
                value={lopHocId}
                onChange={(e) => setLopHocId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
              >
                {danhSachLop.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.tenLop}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tiêu đề bài tập <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Bài tập lớn: Hệ thống thương mại điện tử..."
                value={tieuDe}
                onChange={(e) => setTieuDe(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
              />
            </div>
          </div>

          {/* Content Editor with Preview Switch */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Nội dung & Yêu cầu bài tập chi tiết</span> <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hệ thống tự động chuyển đổi Markdown thành giao diện thẻ trực quan chuyên nghiệp cho sinh viên
                </p>
              </div>

              {/* View Switch Buttons */}
              <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setCheDoXemTruoc(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl transition ${
                    cheDoXemTruoc 
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem dạng tài liệu chuẩn</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheDoXemTruoc(false)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl transition ${
                    !cheDoXemTruoc 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa Markdown</span>
                </button>
              </div>
            </div>

            {/* Visual View Mode */}
            {cheDoXemTruoc ? (
              <div className="space-y-3">
                {noiDung ? (
                  <div>
                    <NoiDungBaiTapCard
                      noiDung={noiDung}
                      tieuDe={tieuDe || 'Chi tiết đề bài thực hành'}
                      diemToiDa={diemToiDa}
                      hanNop={hanNop}
                      tenLop={danhSachLop.find(l => l.id.toString() === lopHocId)?.tenLop}
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setCheDoXemTruoc(false)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa nội dung này</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-3">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">Chưa có nội dung đề bài</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Hãy sử dụng nút <strong className="text-indigo-600">"AI Soạn Đề Tự Động"</strong> ở trên hoặc chuyển sang tab <strong className="text-slate-700">"Chỉnh sửa Markdown"</strong> để soạn thảo.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMoPanelAi(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Mở AI Soạn Đề</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Editor Mode with Helper Toolbar */
              <div className="space-y-2">
                {/* Format Helper Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase px-1">Chèn nhanh:</span>
                  
                  <button
                    type="button"
                    onClick={() => setNoiDung(prev => (prev ? prev + '\n\n' : '') + '#### 1. Mục tiêu học tập\n- Nắm vững kiến thức nền tảng...\n- Tối ưu hiệu năng và xử lý ngoại lệ.')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 text-[11px] font-bold transition"
                  >
                    <Target className="w-3 h-3 text-emerald-600" />
                    <span>+ Mục tiêu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNoiDung(prev => (prev ? prev + '\n\n' : '') + '#### 2. Yêu cầu chi tiết\n- Viết mã nguồn sạch (Clean Code), có chú thích rõ ràng.\n- Cung cấp RESTful API đáp ứng các ca sử dụng.')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/80 text-[11px] font-bold transition"
                  >
                    <Code className="w-3 h-3 text-blue-600" />
                    <span>+ Yêu cầu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNoiDung(prev => (prev ? prev + '\n\n' : '') + '#### 3. Bộ dữ liệu mẫu & Test cases\n- Test Case 1: Đầu vào hợp lệ -> Kết quả mong đợi...\n- Test Case 2: Kiểm tra biên và xử lý lỗi.')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/80 text-[11px] font-bold transition"
                  >
                    <Terminal className="w-3 h-3 text-purple-600" />
                    <span>+ Test Case</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNoiDung(prev => (prev ? prev + '\n\n' : '') + '#### 4. Thang điểm & Tiêu chí đánh giá\n- Hoàn thiện chức năng chính: 6.0 điểm\n- Xử lý ngoại lệ & Clean Code: 2.0 điểm\n- Báo cáo và kiểm thử: 2.0 điểm')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80 text-[11px] font-bold transition"
                  >
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>+ Thang điểm</span>
                  </button>

                  <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                  <button
                    type="button"
                    onClick={() => setNoiDung(prev => prev + ' **nội dung in đậm** ')}
                    className="p-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition"
                    title="In đậm (**text**)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setNoiDung(prev => prev + ' `mã_code` ')}
                    className="p-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-bold transition"
                    title="Mã code (`code`)"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setNoiDung(prev => (prev ? prev + '\n- ' : '- '))}
                    className="p-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition"
                    title="Dấu gạch đầu dòng (-)"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  required
                  rows="12"
                  placeholder="Nhập yêu cầu bài toán, mục tiêu, test case và rubric chấm điểm bằng cú pháp Markdown hoặc dùng nút AI bên trên..."
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                  className="w-full p-4 text-xs font-mono font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition leading-relaxed resize-y shadow-inner"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Số ký tự: {noiDung.length}</span>
                  <button
                    type="button"
                    onClick={() => setCheDoXemTruoc(true)}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Chuyển sang xem giao diện chuẩn →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Deadline & Max Score & Quick Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Thời hạn nộp bài <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => datHanNopNhanh(3)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    +3 ngày
                  </button>
                  <button
                    type="button"
                    onClick={() => datHanNopNhanh(7)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    +7 ngày
                  </button>
                  <button
                    type="button"
                    onClick={() => datHanNopNhanh(14)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    +2 tuần
                  </button>
                </div>
              </div>
              <input
                type="datetime-local"
                required
                value={hanNop}
                onChange={(e) => setHanNop(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Thang điểm tối đa <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                step="0.5"
                required
                value={diemToiDa}
                onChange={(e) => setDiemToiDa(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
              />
            </div>
          </div>

          {/* File Upload Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tệp tài liệu đính kèm / Mã nguồn mẫu (Tùy chọn)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>{dangTaiFile ? 'Đang tải tệp...' : 'Tải lên từ máy tính'}</span>
                <input
                  type="file"
                  onChange={handleUploadFile}
                  disabled={dangTaiFile}
                  className="hidden"
                />
              </label>

              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Hoặc dán liên kết URL file tài liệu / GitHub repo..."
                  value={tepDinhKem}
                  onChange={(e) => setTepDinhKem(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition"
                />
              </div>

              {tepDinhKem && (
                <button
                  type="button"
                  onClick={() => { setTepDinhKem(''); setThongTinFile(null); }}
                  className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Xóa tệp đính kèm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <Link
              to={lopHocId ? `/giao-vien/lop/${lopHocId}` : '/giao-vien'}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy bỏ
            </Link>

            <button
              type="submit"
              disabled={dangXuLy}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{dangXuLy ? 'Đang giao bài tập...' : 'Xác nhận giao bài tập'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaoBaiTap;
