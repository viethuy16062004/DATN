import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quanTriDichVu } from '../dich_vu/quanTriDichVu';
import { 
  Sparkles, 
  Search, 
  Bot, 
  User, 
  ArrowLeft, 
  Calendar, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';

export const NhatKyAiAdmin = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [timKiem, setTimKiem] = useState('');
  const [locChucNang, setLocChucNang] = useState('');
  const [dangTai, setDangTai] = useState(true);
  const [moChiTietId, setMoChiTietId] = useState(null);

  const taiLichSu = async () => {
    setDangTai(true);
    try {
      const res = await quanTriDichVu.layLichSuAi();
      setDanhSach(res);
    } catch (err) {
      console.error(err);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiLichSu();
  }, []);

  const danhSachLoc = danhSach.filter(item => {
    const matchSearch = 
      item.nguoiDung?.hoTen?.toLowerCase().includes(timKiem.toLowerCase()) ||
      item.cauHoiDauVao?.toLowerCase().includes(timKiem.toLowerCase()) ||
      item.chucNang?.toLowerCase().includes(timKiem.toLowerCase());
    
    const matchChucNang = locChucNang ? item.chucNang === locChucNang : true;
    return matchSearch && matchChucNang;
  });

  const getBadgeChucNang = (chucNang) => {
    switch (chucNang) {
      case 'CHAT_HOI_DAP':
      case 'TRO_LY_HOC_TAP':
        return { label: 'Trợ lý học tập', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'GOI_Y_CHAM_DIEM':
        return { label: 'Gợi ý chấm điểm', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'PHAN_TICH_TIEN_DO':
      case 'PHAN_TICH_LOP_HOC':
        return { label: 'Phân tích lớp học', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: chucNang || 'AI Request', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
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
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Nhật ký giám sát AI & Hệ thống
            </h1>
            <p className="text-xs text-slate-500">
              Theo dõi lịch sử truy vấn Gemini LLM, hỗ trợ giảng viên chấm bài & sinh viên hỏi đáp.
            </p>
          </div>
        </div>

        {/* Total Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            <span>Mô hình: <strong className="text-slate-900">Gemini 3.5 Flash</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            Tổng lượt gọi: <strong className="text-amber-600">{danhSach.length}</strong>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={timKiem}
            onChange={(e) => setTimKiem(e.target.value)}
            placeholder="Tìm theo người dùng, nội dung câu hỏi..."
            className="pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={locChucNang}
            onChange={(e) => setLocChucNang(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition"
          >
            <option value="">Tất cả tính năng AI</option>
            <option value="TRO_LY_HOC_TAP">Trợ lý học tập</option>
            <option value="GOI_Y_CHAM_DIEM">Gợi ý chấm điểm</option>
            <option value="PHAN_TICH_TIEN_DO">Phân tích tiến độ</option>
          </select>

          <button
            onClick={taiLichSu}
            title="Làm mới"
            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dangTai ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {dangTai ? (
          <div className="py-20 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200/80">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto mb-3" />
            Đang tải nhật ký AI...
          </div>
        ) : danhSachLoc.length === 0 ? (
          <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
            <Sparkles className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold">Chưa có bản ghi nhật ký AI nào.</p>
          </div>
        ) : (
          danhSachLoc.map((item) => {
            const badge = getBadgeChucNang(item.chucNang);
            const daMo = moChiTietId === item.id;

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition overflow-hidden"
              >
                <div 
                  onClick={() => setMoChiTietId(daMo ? null : item.id)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs">
                          {item.nguoiDung?.hoTen || 'Người dùng ẩn danh'}
                        </span>
                        <span className="text-[10px] text-slate-400">({item.nguoiDung?.email})</span>
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">
                        "{item.cauHoiDauVao || 'Không có nội dung câu hỏi'}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {item.ngayTao ? new Date(item.ngayTao).toLocaleString('vi-VN') : 'Vừa xong'}
                    </span>
                    <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                      {daMo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {daMo && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">📥 Dữ liệu đầu vào (Prompt / Request):</span>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {item.cauHoiDauVao}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-1">🤖 Phản hồi từ AI (Response):</span>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-[11px] whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                        {item.ketQuaAi}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NhatKyAiAdmin;
