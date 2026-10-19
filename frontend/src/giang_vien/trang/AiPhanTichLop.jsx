import React, { useState, useEffect } from 'react';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { aiDichVu } from '../../sinh_vien/dich_vu/aiDichVu';
import { AiGoiYCard } from '../../dung_chung/thanh_phan/AiGoiYCard';
import { 
  Sparkles, 
  BarChart2, 
  Users, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  RefreshCw,
  Zap,
  Target,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

export const AiPhanTichLop = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [lopHocId, setLopHocId] = useState('');
  const [aiBaoCao, setAiBaoCao] = useState(null);
  const [dangTaiAi, setDangTaiAi] = useState(false);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    lopHocDichVu.layDanhSach().then(ds => {
      setDanhSachLop(ds || []);
      if (ds && ds.length > 0) {
        setLopHocId(ds[0].id.toString());
        chayPhanTich(ds[0].id);
      } else {
        setDangTai(false);
      }
    }).catch(console.error);
  }, []);

  const chayPhanTich = async (id) => {
    setDangTaiAi(true);
    try {
      const res = await aiDichVu.phanTichLop(id);
      setAiBaoCao(res);
    } catch (err) {
      console.error(err);
    } finally {
      setDangTaiAi(false);
      setDangTai(false);
    }
  };

  const handleDoiLop = (id) => {
    setLopHocId(id);
    chayPhanTich(id);
  };

  if (dangTai) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Cố Vấn Sư Phạm & Đảm Bảo Chất Lượng Đào Tạo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI Phân Tích & Đánh Giá Toàn Diện Lớp Học
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
              Hệ thống tự động tổng hợp phổ điểm, phát hiện lỗ hổng kiến thức chung và đề xuất kế hoạch giảng dạy cải thiện.
            </p>
          </div>

          {danhSachLop.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <select
                value={lopHocId}
                onChange={(e) => handleDoiLop(e.target.value)}
                className="px-4 py-2.5 text-xs font-bold bg-white text-slate-800 rounded-2xl shadow-lg outline-none transition"
              >
                {danhSachLop.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.tenLop}
                  </option>
                ))}
              </select>

              <button
                onClick={() => chayPhanTich(lopHocId)}
                disabled={dangTaiAi}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md transition active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${dangTaiAi ? 'animate-spin' : ''}`} />
                <span>Phân tích lại</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Nhận diện điểm nghẽn</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Phát hiện các chủ đề bài tập có tỷ lệ nộp muộn hoặc điểm thấp để giảng viên giải thích lại.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Cảnh báo sớm</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Liệt kê danh sách sinh viên có nguy cơ thụt lùi để kịp thời động viên và kèm cặp.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Đề xuất bài giảng</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Gợi ý các dạng bài tập thực hành củng cố phù hợp với năng lực thực tế của lớp.
            </p>
          </div>
        </div>
      </div>

      {/* AI Analysis Report View */}
      {aiBaoCao ? (
        <AiGoiYCard
          tieuDe={aiBaoCao.tieuDe}
          noiDung={aiBaoCao.noiDung}
          danhSachGoiY={aiBaoCao.danhSachGoiY}
          dangTai={dangTaiAi}
        />
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Chưa có báo cáo phân tích cho lớp học này. Vui lòng bấm "Phân tích lại" để khởi tạo.
          </p>
        </div>
      )}
    </div>
  );
};

export default AiPhanTichLop;
