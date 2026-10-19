import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { baiTapDichVu } from '../../giang_vien/dich_vu/baiTapDichVu';
import { baiNopDichVu } from '../dich_vu/baiNopDichVu';
import { aiDichVu } from '../dich_vu/aiDichVu';
import { tepTinDichVu } from '../../dung_chung/dich_vu/tepTinDichVu';
import { AiGoiYCard } from '../../dung_chung/thanh_phan/AiGoiYCard';
import { NoiDungBaiTapCard } from '../../dung_chung/thanh_phan/NoiDungBaiTapCard';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Paperclip,
  UploadCloud,
  Image as ImageIcon,
  File,
  Trash2,
  ExternalLink,
  Link2,
  X,
  Eye
} from 'lucide-react';

export const ChiTietBaiTapSinhVien = () => {
  const { id } = useParams();
  const [baiTap, setBaiTap] = useState(null);
  const [baiNop, setBaiNop] = useState(null);
  const [noiDungNop, setNoiDungNop] = useState('');
  const [tepNop, setTepNop] = useState('');
  const [tepDaChon, setTepDaChon] = useState(null);
  const [kieuNop, setKieuNop] = useState('tep'); // 'tep' | 'lien_ket'
  const [dangTaiTep, setDangTaiTep] = useState(false);
  const [dangNop, setDangNop] = useState(false);
  const [thongBao, setThongBao] = useState({ loai: '', thongDiep: '' });
  
  // AI Guidance state
  const [aiHuongDan, setAiHuongDan] = useState(null);
  const [dangLayAi, setDangLayAi] = useState(false);
  const [aiLoi, setAiLoi] = useState('');
  const [cauHoiThem, setCauHoiThem] = useState('');
  const [dangTai, setDangTai] = useState(true);

  const laHinhAnh = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url) || url.startsWith('data:image/');
  };

  const dinhDangKichThuoc = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const taiDuLieu = async () => {
    try {
      const [bt, bn] = await Promise.all([
        baiTapDichVu.layChiTiet(id),
        baiNopDichVu.layBaiNopCuaToi(id).catch(() => null)
      ]);
      setBaiTap(bt);
      if (bn) {
        setBaiNop(bn);
        setNoiDungNop(bn.noiDung || '');
        setTepNop(bn.tepNop || '');
        if (bn.tepNop) {
          if (bn.tepNop.startsWith('http://') || bn.tepNop.startsWith('https://')) {
            setKieuNop('lien_ket');
          } else {
            setKieuNop('tep');
            setTepDaChon({
              ten: bn.tepNop.split('/').pop(),
              url: bn.tepNop,
              laAnh: laHinhAnh(bn.tepNop)
            });
          }
        }
      }
    } catch (err) {
      console.error('Loi tai bai tap:', err);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, [id]);

  const handleChonTep = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setThongBao({ loai: 'loi', thongDiep: 'Kích thước tệp không được vượt quá 50MB' });
      return;
    }

    setDangTaiTep(true);
    setThongBao({ loai: '', thongDiep: '' });
    try {
      const res = await tepTinDichVu.taiLen(file);
      setTepNop(res.url);
      setTepDaChon({
        ten: res.tenTepGoc,
        kichThuoc: res.kichThuoc,
        url: res.url,
        laAnh: file.type.startsWith('image/') || laHinhAnh(res.tenTepGoc)
      });
      setThongBao({ loai: 'thanh-cong', thongDiep: `Tải lên tệp thành công: ${res.tenTepGoc}` });
    } catch (err) {
      console.error('Loi tai tep:', err);
      setThongBao({ loai: 'loi', thongDiep: 'Lỗi khi tải tệp lên server. Vui lòng thử lại.' });
    } finally {
      setDangTaiTep(false);
    }
  };

  const handleXoaTep = () => {
    setTepDaChon(null);
    setTepNop('');
  };

  const handleNopBai = async (e) => {
    e.preventDefault();
    if (!noiDungNop.trim() && !tepNop.trim()) {
      setThongBao({ loai: 'loi', thongDiep: 'Vui lòng nhập nội dung bài làm hoặc tải lên tệp/hình ảnh bài nộp' });
      return;
    }

    setDangNop(true);
    setThongBao({ loai: '', thongDiep: '' });

    try {
      const res = await baiNopDichVu.nopBai({
        baiTapId: id,
        noiDung: noiDungNop.trim(),
        tepNop: tepNop.trim()
      });
      setBaiNop(res);
      setThongBao({ loai: 'thanh-cong', thongDiep: 'Đã nộp bài tập thành công!' });
    } catch (err) {
      setThongBao({ loai: 'loi', thongDiep: err.response?.data?.thongDiep || 'Nộp bài thất bại' });
    } finally {
      setDangNop(false);
    }
  };

  const handleHoiAiDinhHuong = async (e) => {
    if (e) e.preventDefault();
    setDangLayAi(true);
    setAiLoi('');
    try {
      const res = await aiDichVu.dinhHuongBaiTap(
        id, 
        cauHoiThem.trim(),
        baiTap?.tieuDe || '',
        baiTap?.noiDung || '',
        baiTap?.tenLop || ''
      );
      setAiHuongDan(res);
    } catch (err) {
      console.error('Loi hoi AI dinh huong:', err);
      setAiLoi(err.response?.data?.thongDiep || 'Không thể kết nối với dịch vụ AI. Vui lòng thử lại sau.');
    } finally {
      setDangLayAi(false);
    }
  };

  if (dangTai) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!baiTap) {
    return (
      <div className="p-8 text-center text-slate-500">
        Không tìm thấy bài tập này.
      </div>
    );
  }

  const hanNop = new Date(baiTap.hanNop);
  const daQuaHan = new Date() > hanNop;

  return (
    <div className="space-y-6">
      <Link
        to={baiTap.lopHocId ? `/sinh-vien/lop/${baiTap.lopHocId}` : '/sinh-vien'}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại lớp học</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assignment Prompt & AI Guidance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Visual Card */}
          <NoiDungBaiTapCard
            noiDung={baiTap.noiDung}
            tieuDe={baiTap.tieuDe}
            diemToiDa={baiTap.diemToiDa}
            hanNop={baiTap.hanNop}
            tenLop={baiTap.tenLop}
          />

          {baiTap.tepDinhKem && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800">Tài liệu / Mã nguồn đính kèm từ Giảng viên</p>
                  <p className="text-[11px] text-slate-400 truncate">{baiTap.tepDinhKem}</p>
                </div>
              </div>
              <a
                href={baiTap.tepDinhKem}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition shrink-0 ml-3"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem tệp đính kèm</span>
              </a>
            </div>
          )}

          {/* AI Guidance Box */}
          <div className="space-y-4">
            <form onSubmit={handleHoiAiDinhHuong} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">AI Định Hướng Phương Pháp Tư Duy</h3>
                    <p className="text-[11px] text-slate-500">Phân tích thuật toán từng bước & checklist tự kiểm tra</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={dangLayAi}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{dangLayAi ? 'AI đang phân tích...' : 'Hỏi AI Hướng Dẫn'}</span>
                </button>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <input
                  type="text"
                  value={cauHoiThem}
                  onChange={(e) => setCauHoiThem(e.target.value)}
                  placeholder="Nhập câu hỏi cụ thể hoặc khó khăn bạn đang gặp phải rồi bấm Enter hoặc nút Hỏi AI..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition"
                />
              </div>
            </form>

            {aiLoi && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{aiLoi}</span>
              </div>
            )}

            {(dangLayAi || aiHuongDan) && (
              <AiGoiYCard
                tieuDe={aiHuongDan?.tieuDe || 'Đang phân tích bài tập...'}
                noiDung={aiHuongDan?.noiDung || ''}
                danhSachGoiY={aiHuongDan?.danhSachGoiY || []}
                dangTai={dangLayAi}
              />
            )}
          </div>
        </div>

        {/* Right 1 Col: Submission & Feedback */}
        <div className="space-y-6">
          {/* Grade / Feedback Card if graded */}
          {baiNop?.diemSo !== null && baiNop?.diemSo !== undefined && (
            <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/30 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Kết Quả Chấm Điểm</span>
                </div>
                <span className="text-xl font-extrabold text-emerald-700">
                  {baiNop.diemSo} / {baiTap.diemToiDa}
                </span>
              </div>

              {baiNop.nhanXet && (
                <div className="p-3.5 rounded-xl bg-white border border-emerald-100 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-500 mb-1">Nhận xét của Giảng viên:</p>
                  <p className="italic">"{baiNop.nhanXet}"</p>
                </div>
              )}
            </div>
          )}

          {/* Submission Form */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Nộp bài tập của bạn</h3>
              {baiNop && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-blue-100 text-blue-700">
                  Đã nộp
                </span>
              )}
            </div>

            {thongBao.thongDiep && (
              <div className={`p-3 text-xs rounded-xl ${
                thongBao.loai === 'thanh-cong' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {thongBao.thongDiep}
              </div>
            )}

            <form onSubmit={handleNopBai} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung bài làm / Giải trình
                </label>
                <textarea
                  value={noiDungNop}
                  onChange={(e) => setNoiDungNop(e.target.value)}
                  placeholder="Ghi chú câu trả lời, mô tả giải thuật hoặc kết quả bài làm..."
                  rows={4}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition resize-none"
                />
              </div>

              {/* Upload Type Selector Tabs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Đính kèm bài làm (File, Hình ảnh hoặc Link)
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                    <button
                      type="button"
                      onClick={() => setKieuNop('tep')}
                      className={`px-2 py-0.5 rounded-md font-medium transition ${
                        kieuNop === 'tep' ? 'bg-white text-brand-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Tải tệp / Ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => setKieuNop('lien_ket')}
                      className={`px-2 py-0.5 rounded-md font-medium transition ${
                        kieuNop === 'lien_ket' ? 'bg-white text-brand-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Đường Link
                    </button>
                  </div>
                </div>

                {kieuNop === 'tep' ? (
                  <div className="space-y-2">
                    {/* File/Image Upload Box */}
                    {tepDaChon ? (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                              {tepDaChon.laAnh ? <ImageIcon className="w-4 h-4" /> : <File className="w-4 h-4" />}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-800 truncate">{tepDaChon.ten}</p>
                              {tepDaChon.kichThuoc && (
                                <p className="text-[10px] text-slate-400">{dinhDangKichThuoc(tepDaChon.kichThuoc)}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {tepDaChon.url && (
                              <a
                                href={tepDaChon.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 transition"
                                title="Xem tệp"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={handleXoaTep}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Xóa tệp đính kèm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Image Preview if it's an image */}
                        {tepDaChon.laAnh && tepDaChon.url && (
                          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-48 flex items-center justify-center">
                            <img
                              src={tepDaChon.url}
                              alt="Xem trước bài làm"
                              className="max-h-48 object-contain w-full rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition ${
                        dangTaiTep ? 'bg-slate-50 border-slate-300 opacity-60' : 'bg-slate-50/60 hover:bg-blue-50/40 border-slate-300 hover:border-blue-400'
                      }`}>
                        <input
                          type="file"
                          onChange={handleChonTep}
                          disabled={dangTaiTep}
                          accept="image/*,.pdf,.doc,.docx,.zip,.rar,.7z,.txt,.py,.java,.js,.cpp,.c,.ipynb,.sql"
                          className="hidden"
                        />
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {dangTaiTep ? 'Đang tải tệp lên...' : 'Bấm để chọn file hoặc kéo thả vào đây'}
                        </span>
                        <span className="text-[10px] text-slate-400 text-center">
                          Hỗ trợ: Hình ảnh (PNG, JPG, WEBP), PDF, Word, Code, ZIP (Tối đa 50MB)
                        </span>
                      </label>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={tepNop}
                      onChange={(e) => {
                        setTepNop(e.target.value);
                        setTepDaChon(null);
                      }}
                      placeholder="https://github.com/... hoặc link Google Drive"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition font-mono"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={dangNop || dangTaiTep}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{dangNop ? 'Đang gửi bài...' : (baiNop ? 'Cập nhật bài nộp' : 'Nộp bài ngay')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
