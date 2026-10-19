import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quanTriDichVu } from '../dich_vu/quanTriDichVu';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  BarChart2,
  Cpu,
  UserPlus,
  KeyRound,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export const BangDieuKhienQuanTri = () => {
  const [thongKe, setThongKe] = useState(null);
  const [danhSachAi, setDanhSachAi] = useState([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    Promise.all([
      quanTriDichVu.layThongKe(),
      quanTriDichVu.layLichSuAi()
    ]).then(([resThongKe, resAi]) => {
      setThongKe(resThongKe);
      setDanhSachAi(resAi ? resAi.slice(0, 5) : []);
    }).catch(console.error).finally(() => setDangTai(false));
  }, []);

  if (dangTai) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  const pieData = [
    { name: 'Sinh viên', value: thongKe?.tongSinhVien || 0, color: '#3b82f6' },
    { name: 'Giảng viên', value: thongKe?.tongGiaoVien || 0, color: '#10b981' },
    { name: 'Quản trị viên', value: thongKe?.tongAdmin || 0, color: '#8b5cf6' },
  ];

  const barData = [
    { name: 'Lớp học', count: thongKe?.tongLopHoc || 0 },
    { name: 'Bài tập', count: thongKe?.tongBaiTap || 0 },
    { name: 'Bài nộp', count: thongKe?.tongBaiNop || 0 },
    { name: 'AI Requests', count: thongKe?.tongYeuCauAi || 0 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Header with System Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bảng điều khiển Quản trị viên
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              SYSTEM ADMIN
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Giám sát tài nguyên nền tảng, quản lý người dùng và lưu lượng AI toàn hệ thống.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/quan-tri/nguoi-dung"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-md shadow-purple-500/20 active:scale-98"
          >
            <Users className="w-4 h-4" />
            <span>Quản lý Người dùng</span>
          </Link>
          <Link
            to="/quan-tri/lop-hoc"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Tất cả Lớp học</span>
          </Link>
          <Link
            to="/quan-tri/nhat-ky-ai"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Nhật ký AI</span>
          </Link>
        </div>
      </div>

      {/* 2. 4 Main Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-purple-200 transition">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng người dùng</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{thongKe?.tongNguoiDung}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-blue-200 transition">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng lớp học</p>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{thongKe?.tongLopHoc}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-200 transition">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng bài nộp</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{thongKe?.tongBaiNop}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-200 transition">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Lượt tương tác</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{thongKe?.tongYeuCauAi}</p>
          </div>
        </div>
      </div>

      {/* 3. 2 Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: User Roles */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-800">Cơ cấu người dùng theo vai trò</h3>
            <span className="text-[11px] text-slate-400 font-semibold">Tự động cập nhật</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Platform Activity */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-800">Hoạt động tài nguyên toàn trường</h3>
            <span className="text-[11px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">Realtime</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Recent AI Activity Feed */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Tương tác AI gần đây</h3>
              <p className="text-[11px] text-slate-400">Các truy vấn AI được người dùng thực hiện gần nhất</p>
            </div>
          </div>

          <Link
            to="/quan-tri/nhat-ky-ai"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {danhSachAi.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Chưa có tương tác AI nào gần đây.</p>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {danhSachAi.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-700 text-[11px]">
                    {item.nguoiDung?.hoTen?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.nguoiDung?.hoTen || 'Người dùng'}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">"{item.cauHoiDauVao}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold">
                    {item.chucNang}
                  </span>
                  <span>{item.ngayTao ? new Date(item.ngayTao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BangDieuKhienQuanTri;
