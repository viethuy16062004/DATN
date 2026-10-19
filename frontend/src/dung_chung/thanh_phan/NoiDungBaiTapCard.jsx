import React, { useState } from 'react';
import { 
  Target, 
  Code2, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Copy, 
  Check, 
  HelpCircle, 
  Layers, 
  FileText,
  Sparkles,
  Terminal,
  Clock,
  ExternalLink
} from 'lucide-react';

export const NoiDungBaiTapCard = ({ noiDung, tieuDe, diemToiDa, hanNop, tenLop }) => {
  const [daCopy, setDaCopy] = useState(false);

  if (!noiDung) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(noiDung.replace(/###|####|\*\*|`/g, '').trim());
    setDaCopy(true);
    setTimeout(() => setDaCopy(false), 2000);
  };

  // Helper format inline text: bold, code, formulas
  const formatInline = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="px-1.5 py-0.5 mx-1 rounded-md bg-blue-50 text-blue-700 font-mono text-[11px] font-bold border border-blue-200/80">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Parser: Tách nội dung thành các section có ý nghĩa
  const parseSections = (rawText) => {
    const lines = rawText.split('\n');
    const sections = [];
    let currentSection = { title: 'Tổng quan bài tập', icon: BookOpen, type: 'overview', items: [] };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Header 1 / 2 / 3 / 4
      if (line.startsWith('#') || line.startsWith('####') || line.startsWith('###') || line.startsWith('##')) {
        const cleanTitle = line.replace(/^[#\s]+/, '').replace(/^[0-9.]+\s*/, '').trim();

        if (currentSection.items.length > 0) {
          sections.push(currentSection);
        }

        let type = 'general';
        let icon = FileText;

        const lower = cleanTitle.toLowerCase();
        if (lower.includes('mục tiêu') || lower.includes('objective')) {
          type = 'objective';
          icon = Target;
        } else if (lower.includes('yêu cầu') || lower.includes('chức năng') || lower.includes('requirement')) {
          type = 'requirement';
          icon = Code2;
        } else if (lower.includes('thang điểm') || lower.includes('tiêu chí') || lower.includes('rubric') || lower.includes('đánh giá')) {
          type = 'rubric';
          icon = Award;
        } else if (lower.includes('test case') || lower.includes('dữ liệu mẫu') || lower.includes('kiểm thử')) {
          type = 'testcase';
          icon = Terminal;
        } else if (lower.includes('hướng dẫn nộp') || lower.includes('quy định') || lower.includes('nộp bài')) {
          type = 'submission';
          icon = Clock;
        }

        currentSection = { title: cleanTitle, icon, type, items: [] };
      } else {
        currentSection.items.push(line);
      }
    }

    if (currentSection.items.length > 0) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseSections(noiDung);

  const getStyleForType = (type) => {
    switch (type) {
      case 'objective':
        return {
          border: 'border-emerald-200/90',
          bg: 'bg-emerald-50/40',
          headerBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          badge: 'bg-emerald-100 text-emerald-800'
        };
      case 'requirement':
        return {
          border: 'border-blue-200/90',
          bg: 'bg-blue-50/30',
          headerBg: 'bg-blue-50',
          iconColor: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'rubric':
        return {
          border: 'border-amber-200/90',
          bg: 'bg-amber-50/40',
          headerBg: 'bg-amber-50',
          iconColor: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-900'
        };
      case 'testcase':
        return {
          border: 'border-purple-200/90',
          bg: 'bg-purple-50/30',
          headerBg: 'bg-purple-50',
          iconColor: 'text-purple-600',
          badge: 'bg-purple-100 text-purple-900'
        };
      default:
        return {
          border: 'border-slate-200',
          bg: 'bg-white',
          headerBg: 'bg-slate-50',
          iconColor: 'text-slate-600',
          badge: 'bg-slate-100 text-slate-700'
        };
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-7 text-white relative space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider">
              {tenLop || 'Bài tập thực hành'}
            </span>
            {diemToiDa && (
              <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black">
                {diemToiDa} điểm tối đa
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition active:scale-95"
            title="Sao chép đề bài"
          >
            {daCopy ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{daCopy ? 'Đã sao chép' : 'Sao chép đề bài'}</span>
          </button>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
            {tieuDe || 'Chi tiết Đề bài & Hướng dẫn Thực hành'}
          </h2>
          {hanNop && (
            <p className="text-xs text-blue-100/90 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Hạn chót nộp bài: <strong>{new Date(hanNop).toLocaleString('vi-VN')}</strong></span>
            </p>
          )}
        </div>
      </div>

      {/* Structured Sections List */}
      <div className="p-6 sm:p-8 space-y-5">
        {sections.map((sec, secIdx) => {
          const style = getStyleForType(sec.type);
          const Icon = sec.icon;

          return (
            <div
              key={secIdx}
              className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden shadow-2xs transition hover:shadow-xs`}
            >
              {/* Section Header */}
              <div className={`px-4 py-3 border-b ${style.border} ${style.headerBg} flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-xl bg-white shadow-2xs ${style.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide">
                    {sec.title}
                  </h3>
                </div>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${style.badge}`}>
                  Phần {secIdx + 1}
                </span>
              </div>

              {/* Section Content */}
              <div className="p-4 sm:p-5 space-y-2.5 text-xs text-slate-700 leading-relaxed">
                {sec.items.map((item, itemIdx) => {
                  const isBullet = item.startsWith('- ') || item.startsWith('* ') || item.startsWith('• ');
                  const isNumbered = /^[0-9]+[.)]\s*/.test(item);

                  if (isBullet || isNumbered) {
                    const cleanItem = item.replace(/^[-*•0-9.)\s]+/, '').trim();
                    return (
                      <div key={itemIdx} className="flex items-start gap-2.5 pl-1">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="flex-1 font-medium">
                          {formatInline(cleanItem)}
                        </div>
                      </div>
                    );
                  }

                  // Standard paragraph / line
                  return (
                    <p key={itemIdx} className="font-medium text-slate-800">
                      {formatInline(item)}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NoiDungBaiTapCard;
