import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Award, 
  Info,
  Check
} from 'lucide-react';
import { thongBaoDichVu } from '../dich_vu/thongBaoDichVu';
import { useNavigate } from 'react-router-dom';

const DULIEU_MAU_THONG_BAO = [
  {
    id: 101,
    tieuDe: 'Bài tập mới: Thiết kế Giao diện React & Tailwind',
    noiDung: 'Giảng viên đã giao bài tập mới trong lớp Lập Trình Web Nâng Cao. Hạn nộp: 23:59 ngày mai.',
    loaiThongBao: 'BAI_TAP_MOI',
    daDoc: false,
    ngayTao: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    lienKet: '/sinh-vien'
  },
  {
    id: 102,
    tieuDe: 'Kết quả chấm điểm: 9.5 / 10 điểm',
    noiDung: 'Giảng viên đã chấm bài tập Thuật toán Dijkstra của bạn kèm nhận xét chi tiết.',
    loaiThongBao: 'CHAM_DIEM',
    daDoc: false,
    ngayTao: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    lienKet: '/sinh-vien/tien-do'
  },
  {
    id: 103,
    tieuDe: 'AI gợi ý lộ trình học tập tuần này',
    noiDung: 'Trợ lý AI vừa phân tích kết quả bài nộp và chuẩn bị 3 câu hỏi ôn tập phù hợp cho bạn.',
    loaiThongBao: 'AI_GOI_Y',
    daDoc: true,
    ngayTao: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    lienKet: '/sinh-vien/ai-tro-ly'
  },
  {
    id: 104,
    tieuDe: 'Chào mừng bạn đến với AI Classroom!',
    noiDung: 'Khám phá nền tảng lớp học thông minh tích hợp AI hỗ trợ học tập và giảng dạy.',
    loaiThongBao: 'HE_THONG',
    daDoc: true,
    ngayTao: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    lienKet: '/'
  }
];

export const BangThongBao = () => {
  const [mo, setMo] = useState(false);
  const [tab, setTab] = useState('tat_ca'); // 'tat_ca' | 'chua_doc'
  const [danhSach, setDanhSach] = useState(DULIEU_MAU_THONG_BAO);
  const [soChuaDoc, setSoChuaDoc] = useState(2);
  const navigate = useNavigate();

  const taiThongBao = async () => {
    try {
      const [ds, countRes] = await Promise.all([
        thongBaoDichVu.layDanhSach(),
        thongBaoDichVu.demChuaDoc()
      ]);
      if (ds && ds.length > 0) {
        setDanhSach(ds);
        setSoChuaDoc(countRes?.soLuong ?? 0);
      }
    } catch (err) {
      // Dùng dữ liệu mẫu nếu API chưa có
    }
  };

  useEffect(() => {
    taiThongBao();
  }, []);

  const handleDoc = async (id, lienKet) => {
    setDanhSach((prev) =>
      prev.map((t) => (t.id === id ? { ...t, daDoc: true } : t))
    );
    setSoChuaDoc((prev) => Math.max(0, prev - 1));
    try {
      await thongBaoDichVu.danhDauDaDoc(id);
    } catch (err) {
      // ignore
    }
    setMo(false);
    if (lienKet) {
      navigate(lienKet);
    }
  };

  const handleDocTatCa = async () => {
    setDanhSach((prev) => prev.map((t) => ({ ...t, daDoc: true })));
    setSoChuaDoc(0);
    try {
      await thongBaoDichVu.danhDauDocTatCa();
    } catch (err) {
      // ignore
    }
  };

  const layIconLoai = (loai) => {
    switch (loai) {
      case 'BAI_TAP_MOI':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'CHAM_DIEM':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'AI_GOI_Y':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const danhSachHienThi = tab === 'chua_doc' 
    ? danhSach.filter((t) => !t.daDoc) 
    : danhSach;

  return (
    <div className="relative">
      <button
        onClick={() => setMo(!mo)}
        className="relative flex items-center justify-center h-9 w-9 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition duration-150 active:scale-95"
        title="Thông báo"
      >
        <Bell className="w-4.5 h-4.5" />
        {soChuaDoc > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
            {soChuaDoc > 9 ? '9+' : soChuaDoc}
          </span>
        )}
      </button>

      {mo && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setMo(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 z-40 overflow-hidden border border-slate-200/80 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">Thông Báo</span>
                {soChuaDoc > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-700">
                    {soChuaDoc} mới
                  </span>
                )}
              </div>
              {soChuaDoc > 0 && (
                <button
                  onClick={handleDocTatCa}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Đã đọc tất cả
                </button>
              )}
            </div>

            {/* Filter Tabs (Notion style) */}
            <div className="flex border-b border-slate-100 px-4 pt-2 gap-4 text-xs font-semibold">
              <button
                onClick={() => setTab('tat_ca')}
                className={`pb-2 border-b-2 transition ${
                  tab === 'tat_ca'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Tất cả ({danhSach.length})
              </button>
              <button
                onClick={() => setTab('chua_doc')}
                className={`pb-2 border-b-2 transition ${
                  tab === 'chua_doc'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Chưa đọc ({danhSach.filter((t) => !t.daDoc).length})
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100/80">
              {danhSachHienThi.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                  Không có thông báo nào trong mục này
                </div>
              ) : (
                danhSachHienThi.map((tb) => (
                  <div
                    key={tb.id}
                    onClick={() => handleDoc(tb.id, tb.lienKet)}
                    className={`p-3.5 transition cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                      !tb.daDoc ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-xs shrink-0 mt-0.5">
                      {layIconLoai(tb.loaiThongBao)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs leading-snug ${!tb.daDoc ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {tb.tieuDe}
                        </p>
                        {!tb.daDoc && (
                          <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {tb.noiDung}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Vừa xong</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
              <span className="text-[11px] text-slate-400 font-medium">
                AI Classroom Notifications
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
