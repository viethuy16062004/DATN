import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, Award, ArrowRight } from 'lucide-react';
import { dungXacThuc } from '../kho_luu_tru/NguCanhXacThuc';

export const TheBaiTap = ({ baiTap }) => {
  const { laGiaoVien, laSinhVien } = dungXacThuc();

  const duongDan = laGiaoVien 
    ? `/giao-vien/bai-tap/${baiTap.id}` 
    : `/sinh-vien/bai-tap/${baiTap.id}`;

  const ngayHetHan = new Date(baiTap.hanNop);
  const daQuaHan = new Date() > ngayHetHan;

  const layBadgeTrangThai = () => {
    if (laGiaoVien) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
          {baiTap.soLuongBaiNop || 0} bài nộp ({baiTap.soLuongDaCham || 0} đã chấm)
        </span>
      );
    }

    if (baiTap.daNop) {
      if (baiTap.diemSo !== null && baiTap.diemSo !== undefined) {
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800">
            <Award className="w-3.5 h-3.5" />
            {baiTap.diemSo} / {baiTap.diemToiDa} điểm
          </span>
        );
      }
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Đã nộp bài
        </span>
      );
    }

    if (daQuaHan) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-100 text-rose-700">
          <AlertCircle className="w-3.5 h-3.5" />
          Quá hạn nộp
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-800">
        <Clock className="w-3.5 h-3.5" />
        Chưa nộp
      </span>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-brand-200 transition-all gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-600 truncate max-w-[200px]">
            {baiTap.tenLop}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Điểm tối đa: {baiTap.diemToiDa}
          </span>
        </div>

        <Link to={duongDan} className="block group">
          <h4 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-brand-600 transition truncate">
            {baiTap.tieuDe}
          </h4>
        </Link>

        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Hạn nộp: {ngayHetHan.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        {layBadgeTrangThai()}
        <Link
          to={duongDan}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition"
        >
          <span>Chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
