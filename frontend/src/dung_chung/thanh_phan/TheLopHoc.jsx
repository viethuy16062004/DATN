import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Copy, Check, MoreVertical, ArrowUpRight, Share2, ExternalLink } from 'lucide-react';
import { dungXacThuc } from '../kho_luu_tru/NguCanhXacThuc';

export const TheLopHoc = ({ lop, onXoaLop }) => {
  const { laGiaoVien, laAdmin } = dungXacThuc();
  const [daCopy, setDaCopy] = useState(false);
  const [daCopyLink, setDaCopyLink] = useState(false);

  const handleCopyMa = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(lop.maLop);
    setDaCopy(true);
    setTimeout(() => setDaCopy(false), 2000);
  };

  const handleCopyLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const link = `${window.location.origin}/tham-gia-lop?maLop=${lop.maLop}`;
    navigator.clipboard.writeText(link);
    setDaCopyLink(true);
    setTimeout(() => setDaCopyLink(false), 2000);
  };

  const duongDanChiTiet = laGiaoVien 
    ? `/giao-vien/lop/${lop.id}` 
    : (laAdmin ? `/giao-vien/lop/${lop.id}` : `/sinh-vien/lop/${lop.id}`);

  const gradientClass = lop.anhBia || 'from-blue-600 to-indigo-700';

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header Banner */}
      <div className={`relative h-28 bg-gradient-to-r ${gradientClass} p-4 text-white flex flex-col justify-between`}>
        <div className="flex items-start justify-between">
          <Link to={duongDanChiTiet} className="group-hover:underline pr-2">
            <h3 className="font-bold text-base line-clamp-1 leading-tight text-white drop-shadow-sm">
              {lop.tenLop}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopyMa}
              className="flex items-center gap-1 text-[11px] font-mono font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-md text-white transition"
              title="Nhấn để sao chép mã lớp"
            >
              {daCopy ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{lop.maLop}</span>
            </button>

            {laGiaoVien && (
              <button
                onClick={handleCopyLink}
                className="p-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-md text-white transition"
                title={daCopyLink ? 'Đã sao chép liên kết mời!' : 'Sao chép link mời vào lớp'}
              >
                {daCopyLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Share2 className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-white/90">
          <span className="truncate font-medium">GV: {lop.giaoVien?.hoTen || 'Giảng viên'}</span>
        </div>
      </div>

      {/* Body description */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {lop.moTa || 'Chưa có mô tả chi tiết cho lớp học này.'}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Số lượng sinh viên">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{lop.soLuongSinhVien}</span>
              <span className="text-[11px] text-slate-400">sinh viên</span>
            </div>

            <div className="flex items-center gap-1.5" title="Số lượng bài tập">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{lop.soLuongBaiTap}</span>
              <span className="text-[11px] text-slate-400">bài tập</span>
            </div>
          </div>

          <Link
            to={duongDanChiTiet}
            className="flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-800 transition group-hover:translate-x-0.5"
          >
            <span>Vào lớp</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
