import React, { useState, useEffect } from 'react';
import { lopHocDichVu } from '../../dung_chung/dich_vu/lopHocDichVu';
import { tienDoDichVu } from '../../sinh_vien/dich_vu/tienDoDichVu';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Users, 
  BarChart3, 
  CheckCircle2, 
  Award, 
  TrendingUp,
  BookOpen,
  AlertTriangle,
  Search,
  Download,
  Filter,
  ArrowUpRight
} from 'lucide-react';

export const TienDoLopHoc = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [lopHocId, setLopHocId] = useState('');
  const [danhSachTienDo, setDanhSachTienDo] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [tuKhoa, setTuKhoa] = useState('');

  useEffect(() => {
    lopHocDichVu.layDanhSach().then(ds => {
      setDanhSachLop(ds || []);
      if (ds && ds.length > 0) {
        setLopHocId(ds[0].id.toString());
        taiTienDoLop(ds[0].id);
      } else {
        setDangTai(false);
      }
    }).catch(console.error);
  }, []);

  const taiTienDoLop = async (id) => {
    setDangTai(true);
    try {
      const res = await tienDoDichVu.layTheoLop(id);
      setDanhSachTienDo(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setDangTai(false);
    }
  };

  const handleDoiLop = (id) => {
    setLopHocId(id);
    taiTienDoLop(id);
  };

  const bieuDoData = danhSachTienDo.map(td => ({
    hoTen: td.sinhVien?.hoTen?.length > 12 ? td.sinhVien.hoTen.substring(0, 12) + '...' : td.sinhVien?.hoTen,
    phanTram: td.phanTramHoanThanh || 0,
    diemTB: td.diemTrungBinh || 0,
  }));

  const COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

  const tongSv = danhSachTienDo.length;
  const tongPhanTram = danhSachTienDo.reduce((acc, t) => acc + (t.phanTramHoanThanh || 0), 0);
  const svCoDiem = danhSachTienDo.filter(t => t.soBaiDaCham > 0);
  const tongDiem = svCoDiem.reduce((acc, t) => acc + (t.diemTrungBinh || 0), 0);

  const ptTrungBinh = tongSv > 0 ? Math.round((tongPhanTram / tongSv) * 10) / 10 : 0;
  const dtbLop = svCoDiem.length > 0 ? Math.round((tongDiem / svCoDiem.length) * 10) / 10 : 0;
  const canChuYCount = danhSachTienDo.filter(t => (t.phanTramHoanThanh || 0) < 50).length;

  const danhSachLoc = danhSachTienDo.filter(td =>
    td.sinhVien?.hoTen?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
    td.sinhVien?.email?.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Theo dõi Tiến độ & Kết quả Học tập
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Thống kê tỷ lệ nộp bài, phân bố điểm số và cảnh báo sinh viên cần hỗ trợ theo từng lớp học
          </p>
        </div>

        {/* Class Selector */}
        {danhSachLop.length > 0 && (
          <div className="w-full sm:w-72">
            <select
              value={lopHocId}
              onChange={(e) => handleDoiLop(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-bold bg-white border border-slate-200 rounded-2xl focus:border-blue-600 shadow-xs outline-none transition"
            >
              {danhSachLop.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.tenLop}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {dangTai ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : danhSachTienDo.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-2">
          <Users className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Lớp học chưa có sinh viên hoặc bài tập</h3>
          <p className="text-xs text-slate-400">Hãy giao bài tập để theo dõi biểu đồ tiến độ học tập.</p>
        </div>
      ) : (
        <>
          {/* 4 Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sĩ số lớp</span>
                <p className="text-2xl font-black text-slate-900">{tongSv} <span className="text-xs font-semibold text-slate-400">bạn</span></p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tỷ lệ hoàn thành</span>
                <p className="text-2xl font-black text-emerald-600">{ptTrungBinh}%</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Điểm trung bình lớp</span>
                <p className="text-2xl font-black text-indigo-600">{dtbLop} <span className="text-xs font-semibold text-slate-400">/ 10</span></p>
              </div>
            </div>

            <div className={`p-5 rounded-3xl border shadow-xs flex items-center gap-4 ${
              canChuYCount > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200/80'
            }`}>
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                canChuYCount > 0 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Cần chú ý</span>
                <p className={`text-2xl font-black ${canChuYCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                  {canChuYCount} <span className="text-xs font-semibold text-slate-400">bạn</span>
                </p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Biểu Đồ Tiến Độ Hoàn Thành Bài Tập Từng Sinh Viên
                </h3>
                <p className="text-xs text-slate-400">Tỷ lệ % số bài đã nộp thành công</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bieuDoData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="hoTen" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Tỷ lệ hoàn thành']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="phanTram" radius={[6, 6, 0, 0]}>
                    {bieuDoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Student Progress Table */}
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Bảng Điểm & Trạng Thái Học Tập Chi Tiết
              </h3>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sinh viên..."
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Sinh viên</th>
                    <th className="py-3 px-4">Tiến độ nộp</th>
                    <th className="py-3 px-4 text-center">Đã hoàn thành</th>
                    <th className="py-3 px-4 text-center">Điểm TB</th>
                    <th className="py-3 px-4 text-right">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {danhSachLoc.map((td) => {
                    const pt = td.phanTramHoanThanh || 0;
                    const dtb = td.diemTrungBinh;
                    
                    let danhGia = { label: 'Xuất sắc', color: 'bg-emerald-50 text-emerald-700' };
                    if (pt < 50 || (dtb && dtb < 5.0)) {
                      danhGia = { label: 'Cần chú ý', color: 'bg-rose-50 text-rose-700' };
                    } else if (pt < 80 || (dtb && dtb < 7.0)) {
                      danhGia = { label: 'Khá', color: 'bg-blue-50 text-blue-700' };
                    }

                    return (
                      <tr key={td.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                              {td.sinhVien?.hoTen?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{td.sinhVien?.hoTen}</p>
                              <p className="text-[10px] text-slate-400">{td.sinhVien?.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 w-48">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span>{pt}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pt >= 80 ? 'bg-emerald-500' : pt >= 50 ? 'bg-blue-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${pt}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold">
                          {td.soBaiDaNop || 0} / {td.tongSoBaiTap || 0} bài
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {dtb !== null && dtb !== undefined ? (
                            <span className="font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                              {dtb.toFixed(1)}đ
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Chưa có</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${danhGia.color}`}>
                            {danhGia.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TienDoLopHoc;
