import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { dungXacThuc } from '../kho_luu_tru/NguCanhXacThuc';
import { lopHocDichVu } from '../dich_vu/lopHocDichVu';
import { 
  Home,
  Users, 
  UserCheck,
  FileText, 
  BarChart2, 
  Sparkles, 
  Plus, 
  Bot,
  GraduationCap,
  BookOpen
} from 'lucide-react';

const MAU_NEN_LOP = ['bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-purple-500', 'bg-amber-500'];

export const ThanhBen = ({ mo, onDong, onOpenModalThamGia }) => {
  const { nguoiDung, laGiaoVien, laAdmin } = dungXacThuc();
  const location = useLocation();
  const [danhSachLop, setDanhSachLop] = useState([]);

  useEffect(() => {
    lopHocDichVu.layDanhSach().then(ds => {
      if (Array.isArray(ds) && ds.length > 0) {
        setDanhSachLop(ds.slice(0, 5).map((l, idx) => ({
          id: l.id,
          ten: l.tenLop,
          mau: MAU_NEN_LOP[idx % MAU_NEN_LOP.length]
        })));
      } else {
        setDanhSachLop([]);
      }
    }).catch(() => {
      setDanhSachLop([]);
    });
  }, []);

  // Menu cấu hình theo vai trò
  const studentNavItems = [
    { to: '/sinh-vien', label: 'Bảng điều khiển', icon: Home, exact: true },
    { to: '/sinh-vien/lop-hoc', label: 'Lớp học của tôi', icon: Users },
    { to: '/sinh-vien/bai-tap', label: 'Bài tập & Hạn nộp', icon: FileText },
    { to: '/sinh-vien/tien-do', label: 'Tiến độ học tập', icon: BarChart2 },
    { to: '/sinh-vien/ai-tro-ly', label: 'Trợ lý AI học tập', icon: Sparkles, badge: 'AI', badgeColor: 'bg-blue-600 text-white' },
  ];

  const teacherNavItems = [
    { to: '/giao-vien', label: 'Bảng điều khiển', icon: Home, exact: true },
    { to: '/giao-vien/lop-hoc', label: 'Lớp học của tôi', icon: Users },
    { to: '/giao-vien/sinh-vien-quan-ly', label: 'Quản lý sinh viên', icon: UserCheck },
    { to: '/giao-vien/tao-bai-tap', label: 'Giao bài tập mới', icon: Plus },
    { to: '/giao-vien/tien-do', label: 'Tiến độ & Kết quả', icon: BarChart2 },
    { to: '/giao-vien/ai-phan-tich', label: 'AI Trợ giảng & Lớp', icon: Sparkles, badge: 'AI Pro', badgeColor: 'bg-indigo-600 text-white' },
  ];

  const adminNavItems = [
    { to: '/quan-tri', label: 'Tổng quan hệ thống', icon: Home, exact: true },
    { to: '/quan-tri/nguoi-dung', label: 'Quản lý người dùng', icon: Users },
    { to: '/quan-tri/lop-hoc', label: 'Quản lý lớp học', icon: BookOpen },
    { to: '/quan-tri/nhat-ky-ai', label: 'Nhật ký giám sát AI', icon: Sparkles, badge: 'AI Logs', badgeColor: 'bg-purple-600 text-white' },
  ];

  const navItems = laAdmin ? adminNavItems : (laGiaoVien ? teacherNavItems : studentNavItems);

  return (
    <>
      {mo && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden" 
          onClick={onDong} 
        />
      )}

      <aside className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-200/80 bg-white select-none transition-transform duration-200 lg:translate-x-0 flex flex-col justify-between ${
        mo ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'
      }`}>
        
        {/* Top & Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 no-scrollbar">
          
          {/* Main Navigation List */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={onDong}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-md ${item.badgeColor} shadow-2xs`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Lớp Học Phụ Trách / Gần Đây */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>{laGiaoVien ? 'Lớp bạn giảng dạy' : 'Lớp học gần đây'}</span>
              {onOpenModalThamGia && !laGiaoVien && (
                <button 
                  onClick={onOpenModalThamGia}
                  title="Tham gia lớp mới"
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              {danhSachLop.length > 0 ? (
                danhSachLop.map((lop) => (
                  <Link
                    key={lop.id}
                    to={laGiaoVien ? `/giao-vien/lop/${lop.id}` : `/sinh-vien/lop/${lop.id}`}
                    onClick={onDong}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition truncate group"
                  >
                    <span className={`h-2 w-2 rounded-full shrink-0 ${lop.mau}`} />
                    <span className="truncate group-hover:text-blue-600">{lop.ten}</span>
                  </Link>
                ))
              ) : (
                <div className="px-3 py-2 text-[11px] text-slate-400 italic">
                  Chưa tham gia lớp nào
                </div>
              )}
            </div>
          </div>

          {/* AI Promo Card Box */}
          <div className="pt-2">
            <div className="rounded-2xl bg-gradient-to-b from-blue-50/90 via-indigo-50/50 to-blue-50/80 p-4 border border-blue-100/80 text-center relative overflow-hidden">
              
              {/* Cute 3D AI Robot Graphic */}
              <div className="w-14 h-14 mx-auto mb-2 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md"></div>
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                  <Bot className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-blue-900 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {laAdmin ? 'Giám sát AI Gemini' : (laGiaoVien ? 'Trợ Lý AI Giảng Viên' : 'Trợ lý AI Thông Minh')}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                {laAdmin
                  ? 'Theo dõi hiệu năng mô hình LLM, giám sát câu hỏi và phản hồi tự động.'
                  : (laGiaoVien 
                      ? 'Soạn đề bài tập tự động, chấm điểm thông minh & phân tích chất lượng lớp.'
                      : 'Phân tích tiến độ, ưu tiên bài tập và giải đáp thuật toán 24/7.')}
              </p>

              <Link
                to={laAdmin ? "/quan-tri/nhat-ky-ai" : (laGiaoVien ? "/giao-vien/ai-phan-tich" : "/sinh-vien/ai-tro-ly")}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
              >
                <span>{laAdmin ? 'Xem nhật ký AI' : (laGiaoVien ? 'Phân tích lớp học' : 'Hỏi AI ngay')}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default ThanhBen;
