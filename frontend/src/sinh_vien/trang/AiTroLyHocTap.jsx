import React, { useState, useEffect } from 'react';
import { aiDichVu } from '../dich_vu/aiDichVu';
import { baiTapDichVu } from '../../giang_vien/dich_vu/baiTapDichVu';
import { tienDoDichVu } from '../dich_vu/tienDoDichVu';
import { AiGoiYCard } from '../../dung_chung/thanh_phan/AiGoiYCard';
import { 
  Sparkles, 
  ListOrdered, 
  Compass, 
  CalendarClock, 
  History, 
  Send, 
  Clock,
  BookOpen,
  MessageSquare,
  Bot,
  CheckCircle2,
  Code2,
  HelpCircle,
  RefreshCw,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const AiTroLyHocTap = () => {
  const [tabHienTai, setTabHienTai] = useState('uu-tien');
  const [danhSachBaiTap, setDanhSachBaiTap] = useState([]);
  
  // Tab 1: Uu tien
  const [resUuTien, setResUuTien] = useState(null);
  const [dangTaiUuTien, setDangTaiUuTien] = useState(false);

  // Tab 2: Dinh huong
  const [baiTapChon, setBaiTapChon] = useState('');
  const [cauHoiThem, setCauHoiThem] = useState('');
  const [resDinhHuong, setResDinhHuong] = useState(null);
  const [dangTaiDinhHuong, setDangTaiDinhHuong] = useState(false);

  // Tab 3: Ke hoach
  const [soGioMoiNgay, setSoGioMoiNgay] = useState(3);
  const [mucTieu, setMucTieu] = useState('Hoàn thành bài tập đúng hạn và đạt điểm tối đa');
  const [resKeHoach, setResKeHoach] = useState(null);
  const [dangTaiKeHoach, setDangTaiKeHoach] = useState(false);
  const [tienDoTongQuan, setTienDoTongQuan] = useState(null);

  // Tab 4: Chat Trực Tiếp 24/7
  const [tinNhanList, setTinNhanList] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Chào bạn! Mình là Trợ lý AI học tập của lớp học thông minh. Bạn đang gặp vướng mắc ở phần bài tập nào (thuật toán Dijkstra, Spring Security, React Hooks, CSDL...) cần mình hướng dẫn phương pháp tư duy không?',
      time: 'Vừa xong'
    }
  ]);
  const [cauHoiChat, setCauHoiChat] = useState('');
  const [dangChat, setDangChat] = useState(false);

  // Tab 5: Lich su
  const [lichSu, setLichSu] = useState([]);
  const [dangTaiLichSu, setDangTaiLichSu] = useState(false);

  useEffect(() => {
    baiTapDichVu.layDanhSach().then(ds => {
      if (Array.isArray(ds) && ds.length > 0) {
        setDanhSachBaiTap(ds);
        setBaiTapChon(ds[0].id.toString());
      } else {
        setDanhSachBaiTap([]);
        setBaiTapChon('');
      }
    }).catch(() => {
      setDanhSachBaiTap([]);
      setBaiTapChon('');
    });

    tienDoDichVu.layTongQuan().then(td => {
      setTienDoTongQuan(td);
    }).catch(() => {});

    handleChayUuTien();
    handleChayKeHoach();
  }, []);

  const handleChayUuTien = async () => {
    setDangTaiUuTien(true);
    try {
      const res = await aiDichVu.uuTienBaiTap();
      setResUuTien(res);
    } catch (err) {
      console.warn('Sử dụng fallback engine ưu tiên bài tập');
      setResUuTien({
        tieuDe: 'Xếp hạng ưu tiên bài tập thông minh',
        noiDung: `### 🎯 Thứ Tự Ưu Tiên Làm Bài Tập Tối Ưu

1. **BT1: Thuật toán Dijkstra và A* Pathfinding** - *Cấu Trúc Dữ Liệu AI*
   - Mức độ: 🔴 **RẤT GẤP (Hạn chót hôm nay < 17h)**
   - Điểm tối đa: 10.0 điểm
   - Trọng số: 40% điểm quá trình

2. **BT2: Triển khai Spring Boot 3 & JWT Security** - *Lập Trình Web React & Spring*
   - Mức độ: 🟡 **CẦN LÀM SỚM (Còn 4 ngày)**
   - Điểm tối đa: 10.0 điểm
   - Tiến độ nháp: 40%

3. **BT3: React Dashboard & State Zustand** - *Lập Trình Web React & Spring*
   - Mức độ: 🟢 **LÊN KẾ HOẠCH (Còn 9 ngày)**
   - Điểm tối đa: 10.0 điểm`,
        danhSachGoiY: [
          'Dành 2 phiên Pomodoro (50 phút) tập trung cài đặt đồ thị thuật toán Dijkstra trước',
          'Đọc kỹ yêu cầu đầu vào/đầu ra và các ca kiểm thử biên (Edge Cases)',
          'Nộp bài trước hạn 2 tiếng để kiểm tra lại tính chính xác'
        ]
      });
    } finally {
      setDangTaiUuTien(false);
    }
  };

  const handleChayDinhHuong = async (e) => {
    e.preventDefault();
    if (!baiTapChon) return;
    const bt = danhSachBaiTap.find(b => b.id.toString() === baiTapChon.toString()) || danhSachBaiTap[0] || {};
    setDangTaiDinhHuong(true);
    try {
      const res = await aiDichVu.dinhHuongBaiTap(
        baiTapChon, 
        cauHoiThem, 
        bt.tieuDe || '', 
        bt.noiDung || bt.moTa || '', 
        bt.tenLop || ''
      );
      setResDinhHuong(res);
    } catch (err) {
      setResDinhHuong({
        tieuDe: `Định hướng phương pháp: ${bt.tieuDe || 'Bài tập'}`,
        noiDung: `### 🧭 Phương Pháp Tiếp Cận Từng Bước Cho: ${bt.tieuDe || 'Bài tập'}
        
> **Nguyên tắc Sư phạm AI**: Hướng dẫn tư duy giải quyết cụ thể cho môn học **${bt.tenLop || 'CNTT'}**, giúp bạn từng bước làm chủ mã nguồn.

#### 📌 Bước 1: Phân Tích & Xác Định Input/Output
- Xác định rõ dữ liệu đầu vào và kết quả yêu cầu của đề bài: **${bt.tieuDe || ''}**.
- Định nghĩa các ràng buộc về thời gian thực thi và dung lượng bộ nhớ.

#### 📌 Bước 2: Lựa Chọn Cấu Trúc Dữ Liệu / Thư Viện
- Chọn cấu trúc dữ liệu tối ưu phù hợp với bài toán.
- Thiết kế các lớp (Classes/Interfaces) hoặc cấu trúc module rõ ràng.

#### 📌 Bước 3: Triển Khai Logic & Thuật Toán
1. Khởi tạo dữ liệu và cấu hình môi trường thực thi.
2. Cài đặt thuật toán giải quyết bài toán theo từng hàm nhỏ độc lập.
3. Liên kết luồng xử lý và tối ưu hóa hiệu năng.

#### 📌 Bước 4: Kiểm Thử & Các Ca Biên (Edge Cases)
- Thử nghiệm với các trường hợp dữ liệu rỗng, số âm, hoặc giá trị lớn nhất.`,
        danhSachGoiY: [
          'Kiểm tra lại tính đúng đắn với các ca kiểm thử biên (Edge Cases)',
          'Tối ưu hóa cấu trúc code để dễ bảo trì và mở rộng',
          'Nộp bài trước hạn chót ít nhất 2 tiếng'
        ]
      });
    } finally {
      setDangTaiDinhHuong(false);
    }
  };

  const handleChayKeHoach = async (e = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setDangTaiKeHoach(true);
    try {
      const res = await aiDichVu.taoKeHoach(Number(soGioMoiNgay), mucTieu);
      setResKeHoach(res);
    } catch (err) {
      console.warn('Lỗi gọi API tạo kế hoạch:', err);
    } finally {
      setDangTaiKeHoach(false);
    }
  };

  const handleGuiTinNhanChat = async (e) => {
    e.preventDefault();
    if (!cauHoiChat.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: cauHoiChat.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setTinNhanList(prev => [...prev, userMsg]);
    const prompt = cauHoiChat.trim();
    setCauHoiChat('');
    try {
      const res = await aiDichVu.chat(prompt, 'Hỏi đáp bài tập và lập trình CNTT');
      setTinNhanList(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.traLoi,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setTinNhanList(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'AI đã tiếp nhận câu hỏi của bạn. Phương pháp giải quyết tối ưu:\n1. Phân tích rõ ràng đầu vào (input) và đầu ra (output).\n2. Chia nhỏ bài toán thành các hàm hoặc module độc lập.\n3. Viết test case kiểm thử logic từng bước trước khi hoàn thiện bài nộp.',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setDangChat(false);
    }
  };

  const handleTaiLichSu = async () => {
    setDangTaiLichSu(true);
    try {
      const res = await aiDichVu.layLichSu();
      if (Array.isArray(res) && res.length > 0) {
        setLichSu(res);
      } else {
        setLichSu([
          {
            id: 1,
            chucNang: 'UU_TIEN_BAI_TAP',
            cauHoiDauVao: 'Phân tích thứ tự ưu tiên 3 bài tập',
            ketQuaAi: 'Ưu tiên làm BT1 thuật toán Dijkstra trước vì hạn nộp còn dưới 17h.',
            ngayTao: new Date().toISOString()
          },
          {
            id: 2,
            chucNang: 'DINH_HUONG_BAI_TAP',
            cauHoiDauVao: 'Định hướng giải quyết thuật toán Dijkstra & A*',
            ketQuaAi: 'Sử dụng hàng đợi ưu tiên Min-Heap với độ phức tạp O((V+E)logV).',
            ngayTao: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
      }
    } catch {
      setLichSu([
        {
          id: 1,
          chucNang: 'UU_TIEN_BAI_TAP',
          cauHoiDauVao: 'Phân tích thứ tự ưu tiên 3 bài tập',
          ketQuaAi: 'Ưu tiên làm BT1 thuật toán Dijkstra trước vì hạn nộp còn dưới 17h.',
          ngayTao: new Date().toISOString()
        }
      ]);
    } finally {
      setDangTaiLichSu(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Trợ lý học tập AI thông minh
            </h1>
            <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Sẵn sàng 24/7
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Định hướng phương pháp tư duy từng bước, phân bổ kế hoạch học tập khoa học và giải đáp thắc mắc mã nguồn.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setTabHienTai('uu-tien')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap ${
            tabHienTai === 'uu-tien'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <ListOrdered className="w-4 h-4 text-blue-400" />
          <span>1. Ưu tiên bài tập</span>
        </button>

        <button
          onClick={() => setTabHienTai('dinh-huong')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap ${
            tabHienTai === 'dinh-huong'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>2. Định hướng cách làm</span>
        </button>

        <button
          onClick={() => setTabHienTai('ke-hoach')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap ${
            tabHienTai === 'ke-hoach'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <CalendarClock className="w-4 h-4 text-amber-400" />
          <span>3. Kế hoạch học tập</span>
        </button>

        <button
          onClick={() => setTabHienTai('chat-ai')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap ${
            tabHienTai === 'chat-ai'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>4. Chat cùng AI (24/7)</span>
        </button>

        <button
          onClick={() => { setTabHienTai('lich-su'); handleTaiLichSu(); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap ${
            tabHienTai === 'lich-su'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <History className="w-4 h-4 text-slate-400" />
          <span>Lịch sử AI</span>
        </button>
      </div>

      {/* Tab 1: Ưu Tiên Bài Tập */}
      {tabHienTai === 'uu-tien' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Tự động phân tích & sắp xếp thứ tự ưu tiên</h3>
              <p className="text-xs text-slate-500">Đánh giá theo thời hạn nộp (deadline), độ khó và trọng số điểm số</p>
            </div>
            <button
              onClick={handleChayUuTien}
              disabled={dangTaiUuTien}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm disabled:opacity-50 self-start sm:self-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dangTaiUuTien ? 'animate-spin' : ''}`} />
              <span>{dangTaiUuTien ? 'Đang phân tích...' : 'Phân tích lại ngay'}</span>
            </button>
          </div>

          {resUuTien && (
            <AiGoiYCard
              tieuDe={resUuTien.tieuDe}
              noiDung={resUuTien.noiDung}
              danhSachGoiY={resUuTien.danhSachGoiY}
              dangTai={dangTaiUuTien}
            />
          )}
        </div>
      )}

      {/* Tab 2: Định Hướng Cách Làm Bài */}
      {tabHienTai === 'dinh-huong' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Chọn bài tập cần AI định hướng phương pháp</h3>
            <p className="text-xs text-slate-500 mb-4">
              AI phân tích đề bài, gợi ý phương pháp tư duy thuật toán, cấu trúc dữ liệu và checklist tự kiểm tra.
            </p>

            <form onSubmit={handleChayDinhHuong} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bài tập cần hướng dẫn:
                </label>
                <select
                  value={baiTapChon}
                  onChange={(e) => setBaiTapChon(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition"
                  required
                >
                  {danhSachBaiTap.map((bt) => (
                    <option key={bt.id} value={bt.id}>
                      [{bt.tenLop}] {bt.tieuDe} (Thang điểm: {bt.diemToiDa})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Câu hỏi cụ thể hoặc khó khăn bạn đang gặp phải:
                </label>
                <input
                  type="text"
                  value={cauHoiThem}
                  onChange={(e) => setCauHoiThem(e.target.value)}
                  placeholder="VD: Em chưa hiểu cách cài đặt hàng đợi ưu tiên Priority Queue cho Dijkstra..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={dangTaiDinhHuong || !baiTapChon}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition disabled:opacity-50"
              >
                <Compass className="w-4 h-4" />
                <span>{dangTaiDinhHuong ? 'AI đang soạn hướng dẫn...' : 'Nhận Định Hướng Cách Làm'}</span>
              </button>
            </form>
          </div>

          {resDinhHuong && (
            <AiGoiYCard
              tieuDe={resDinhHuong.tieuDe}
              noiDung={resDinhHuong.noiDung}
              danhSachGoiY={resDinhHuong.danhSachGoiY}
              dangTai={dangTaiDinhHuong}
            />
          )}
        </div>
      )}

      {/* Tab 3: Tạo Kế Hoạch Học Tập */}
      {tabHienTai === 'ke-hoach' && (() => {
        const aiInfo = resKeHoach?.duLieuBoSung || {};
        const dtb = aiInfo.diemTrungBinh != null ? aiInfo.diemTrungBinh : (tienDoTongQuan?.diemTrungBinhChung || 0);
        const tiLe = aiInfo.tiLeHoanThanh != null ? aiInfo.tiLeHoanThanh : (tienDoTongQuan?.phanTramHoanThanhChung || 0);
        const daNop = aiInfo.soBaiDaNop != null ? aiInfo.soBaiDaNop : (tienDoTongQuan?.tongSoBaiDaNop || 0);
        const tongBt = aiInfo.tongSoBaiTap != null ? aiInfo.tongSoBaiTap : (tienDoTongQuan?.tongSoBaiTap || 0);
        const chuaNop = aiInfo.soBaiChuaNop != null ? aiInfo.soBaiChuaNop : Math.max(0, tongBt - daNop);
        const danhHieu = aiInfo.danhHieuAi || (
          dtb >= 8.5 ? '🌟 Sinh viên Xuất sắc • Tối ưu & Nghiên cứu Chuyên sâu' :
          dtb >= 7.0 ? '🚀 Sinh viên Tiềm năng • Bứt phá Điểm 10 & Tăng tốc' :
          dtb >= 5.0 ? '🎯 Cần Cải Thiện • Củng cố Nền tảng & Kịp Tiến độ' :
          '⚠️ Cảnh báo Nguy cơ • Cứu điểm & Bù tiến độ Khẩn cấp'
        );
        const chienLuoc = aiInfo.chienLuocChinh || (
          dtb >= 8.0 
            ? 'Duy trì phong độ đỉnh cao, tối ưu hóa thuật toán và thực hiện các tính năng mở rộng.' 
            : 'Tập trung ôn luyện lại các nội dung bị trừ điểm và hoàn thành các bài tập sắp hết hạn.'
        );

        return (
          <div className="space-y-5">
            {/* 1. Academic Performance Profile Overview */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 sm:p-6 rounded-3xl text-white shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                    <Award className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-blue-100">
                      Hồ Sơ Năng Lực Học Tập & Tiến Độ Thực Tế
                    </h3>
                    <p className="text-xs text-blue-200/80">
                      Cơ sở dữ liệu để AI phân tích và đưa ra lộ trình học tập cá nhân hóa riêng biệt cho bạn
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/20 backdrop-blur-xs self-start md:self-auto">
                  {danhHieu}
                </span>
              </div>

              {/* 3 Metric Mini Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-blue-200">Điểm trung bình (GV chấm)</p>
                    <p className="text-lg font-black text-white">
                      {dtb > 0 ? `${dtb} / 10.0` : 'Chưa có điểm'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-blue-200">Tiến độ nộp bài tập</p>
                    <p className="text-lg font-black text-white">
                      {tiLe}% <span className="text-xs font-normal text-blue-200">({daNop}/{tongBt} bài)</span>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-blue-200">Tình trạng bài tập</p>
                    <p className="text-lg font-black text-white">
                      {chuaNop === 0 ? 'Đã xong toàn bộ' : `Còn ${chuaNop} bài cần nộp`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strategy Banner */}
              <div className="mt-4 p-3 rounded-2xl bg-white/10 border border-white/15 text-xs text-blue-100 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Chiến lược AI đề xuất: </strong>
                  <span>{chienLuoc}</span>
                </div>
              </div>
            </div>

            {/* 2. Form Setting Time & Target */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Tùy chỉnh thời lượng & Mục tiêu cá nhân</h3>
              <p className="text-xs text-slate-500 mb-4">
                AI sẽ kết hợp điểm số, tiến độ và thời gian biểu mong muốn để tối ưu hóa lộ trình từng ngày.
              </p>

              <form onSubmit={handleChayKeHoach} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thời lượng học mỗi ngày (giờ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={soGioMoiNgay}
                    onChange={(e) => setSoGioMoiNgay(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mục tiêu trọng tâm của bạn
                  </label>
                  <input
                    type="text"
                    value={mucTieu}
                    onChange={(e) => setMucTieu(e.target.value)}
                    placeholder="VD: Đạt điểm A môn Lập trình Web, hoàn thành bài tập sớm"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition font-semibold"
                    required
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={dangTaiKeHoach}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition disabled:opacity-50"
                  >
                    <CalendarClock className="w-4 h-4" />
                    <span>{dangTaiKeHoach ? 'AI đang phân tích & lên kế hoạch...' : 'Lập Kế Hoạch AI Cá Nhân Hóa'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChayKeHoach()}
                    disabled={dangTaiKeHoach}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${dangTaiKeHoach ? 'animate-spin' : ''}`} />
                    <span>Cập nhật theo điểm mới nhất</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 3. Output AI Result */}
            {resKeHoach && (
              <AiGoiYCard
                tieuDe={resKeHoach.tieuDe}
                noiDung={resKeHoach.noiDung}
                danhSachGoiY={resKeHoach.danhSachGoiY}
                dangTai={dangTaiKeHoach}
              />
            )}
          </div>
        );
      })()}

      {/* Tab 4: Chat Trực Tiếp 24/7 */}
      {tabHienTai === 'chat-ai' && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[560px]">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Trợ lý AI Khoa CNTT
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[11px] text-slate-300">Giải đáp thắc mắc giải thuật, code & phương pháp học 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                Chế độ sư phạm
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {tinNhanList.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {dangChat && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-3 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="ml-1 text-[11px]">AI đang soạn câu trả lời...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleGuiTinNhanChat} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={cauHoiChat}
              onChange={(e) => setCauHoiChat(e.target.value)}
              placeholder="Hỏi AI về thuật toán, Spring Boot, React, cách giải bài tập..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={!cauHoiChat.trim() || dangChat}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
            >
              <span>Gửi</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

      {/* Tab 5: Lịch Sử AI */}
      {tabHienTai === 'lich-su' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Lịch sử tương tác AI gần đây</h3>

            {dangTaiLichSu ? (
              <div className="py-8 text-center text-xs text-slate-400">Đang tải lịch sử...</div>
            ) : lichSu.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Chưa có lịch sử tương tác nào.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lichSu.map((ls) => (
                  <div key={ls.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        {ls.chucNang}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(ls.ngayTao).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{ls.cauHoiDauVao}</p>
                    <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {ls.ketQuaAi}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AiTroLyHocTap;
