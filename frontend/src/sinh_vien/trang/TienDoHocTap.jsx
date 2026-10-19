import React, { useState, useEffect } from 'react';
import { tienDoDichVu } from '../dich_vu/tienDoDichVu';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  TrendingUp, 
  BarChart3 
} from 'lucide-react';

export const TienDoHocTap = () => {
  const [tienDoTongQuan, setTienDoTongQuan] = useState(null);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    const taiTienDo = async () => {
      try {
        const res = await tienDoDichVu.layTongQuan();
        setTienDoTongQuan(res);
      } catch (err) {
        console.error('Loi tai tien do:', err);
      } finally {
        setDangTai(false);
      }
    };

    taiTienDo();
  }, []);

  if (dangTai) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!tienDoTongQuan) {
    return (
      <div className="p-8 text-center text-slate-500">
        Chưa có dữ liệu tiến độ học tập.
      </div>
    );
  }

  const bieuDoData = (tienDoTongQuan.chiTietCacLop || []).map(td => ({
    tenLop: td.tenLop?.length > 15 ? td.tenLop.substring(0, 15) + '...' : td.tenLop,
    phanTram: td.phanTramHoanThanh,
    diemTB: td.diemTrungBinh,
    daNop: td.soBaiDaNop,
    tong: td.tongBaiTap
  }));

  const COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Tiến độ & Kết quả học tập
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi mức độ hoàn thành bài tập và kết quả đánh giá chi tiết theo từng môn học.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tổng số lớp</p>
            <p className="text-xl font-bold text-slate-800">{tienDoTongQuan.tongSoLop}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Đã hoàn thành</p>
            <p className="text-xl font-bold text-emerald-600">
              {tienDoTongQuan.tongSoBaiDaNop} / {tienDoTongQuan.tongSoBaiTap} bài
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tỉ lệ hoàn thành</p>
            <p className="text-xl font-bold text-purple-600">
              {tienDoTongQuan.phanTramHoanThanhChung}%
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Điểm trung bình</p>
            <p className="text-xl font-bold text-amber-600">
              {tienDoTongQuan.diemTrungBinhChung > 0 ? `${tienDoTongQuan.diemTrungBinhChung} / 10` : 'Chưa có'}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-bold text-slate-800">Biểu đồ tiến độ hoàn thành theo từng môn học</h2>
        </div>

        {bieuDoData.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Chưa có lớp học nào để biểu diễn biểu đồ.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bieuDoData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="tenLop" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis unit="%" tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Tiến độ hoàn thành']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="phanTram" radius={[8, 8, 0, 0]}>
                  {bieuDoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Breakdown Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Bảng chi tiết theo từng lớp học</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Tên lớp học</th>
                <th className="py-3 px-4">Tổng bài tập</th>
                <th className="py-3 px-4">Đã nộp</th>
                <th className="py-3 px-4">Đã chấm</th>
                <th className="py-3 px-4">Điểm TB</th>
                <th className="py-3 px-5">Tiến độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tienDoTongQuan.chiTietCacLop?.map((td) => (
                <tr key={td.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-5 font-semibold text-slate-900">{td.tenLop}</td>
                  <td className="py-3.5 px-4">{td.tongBaiTap} bài</td>
                  <td className="py-3.5 px-4 text-brand-600 font-medium">{td.soBaiDaNop} bài</td>
                  <td className="py-3.5 px-4">{td.soBaiDaCham} bài</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">
                    {td.soBaiDaCham > 0 ? `${td.diemTrungBinh}/10` : '-'}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-600 h-full rounded-full transition-all"
                          style={{ width: `${td.phanTramHoanThanh}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">{td.phanTramHoanThanh}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
