import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Home, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Sparkles, 
  Users, 
  GraduationCap, 
  Settings,
  LayoutDashboard
} from 'lucide-react';

export const ThanhDuongDan = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap = {
    'sinh-vien': { name: 'Sinh viên', icon: GraduationCap, link: '/sinh-vien' },
    'giao-vien': { name: 'Giảng viên', icon: BookOpen, link: '/giao-vien' },
    'quan-tri': { name: 'Quản trị', icon: Users, link: '/quan-tri' },
    'lop': { name: 'Lớp học', icon: BookOpen, link: null },
    'bai-tap': { name: 'Bài tập', icon: FileText, link: null },
    'tien-do': { name: 'Tiến độ học tập', icon: BarChart3, link: null },
    'ai-tro-ly': { name: 'AI Trợ lý học tập', icon: Sparkles, link: '/sinh-vien/ai-tro-ly' },
    'ai-phan-tich': { name: 'AI Phân tích lớp', icon: Sparkles, link: '/giao-vien/ai-phan-tich' },
    'tao-bai-tap': { name: 'Tạo bài tập', icon: FileText, link: '/giao-vien/tao-bai-tap' },
    'nguoi-dung': { name: 'Quản lý người dùng', icon: Users, link: '/quan-tri/nguoi-dung' },
    'lop-hoc': { name: 'Quản lý lớp học', icon: BookOpen, link: '/quan-tri/lop-hoc' },
    'nhat-ky-ai': { name: 'Nhật ký AI', icon: Sparkles, link: '/quan-tri/nhat-ky-ai' }
  };

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === '')) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium py-1.5 px-1 mb-4 overflow-x-auto select-none">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-blue-600 transition-colors px-1.5 py-1 rounded-md hover:bg-slate-100 text-slate-600"
        title="Trang chủ"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>Trang chủ</span>
      </Link>

      {pathnames.map((name, index) => {
        const isLast = index === pathnames.length - 1;
        const info = routeNameMap[name] || {
          name: isNaN(name) ? name : `#${name}`,
          icon: null,
          link: null
        };

        const Icon = info.icon;
        const isNumericId = !isNaN(name);

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50/80 text-blue-700 font-semibold shadow-xs">
                {Icon && <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                <span className="truncate max-w-[200px]">{info.name}</span>
              </span>
            ) : info.link ? (
              <Link
                to={info.link}
                className="flex items-center gap-1 hover:text-blue-600 hover:bg-slate-100 px-1.5 py-1 rounded-md transition-colors"
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                <span>{info.name}</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-slate-600 px-1.5 py-1">
                {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                <span>{info.name}</span>
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
