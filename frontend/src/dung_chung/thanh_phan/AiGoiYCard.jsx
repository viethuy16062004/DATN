import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  Lightbulb, 
  Target, 
  Code2, 
  CheckSquare, 
  Copy, 
  Check, 
  Cpu, 
  Bookmark,
  ChevronRight,
  Zap,
  ArrowRight,
  Clock,
  AlertTriangle,
  Flame,
  Layers,
  BookOpen
} from 'lucide-react';

export const AiGoiYCard = ({ tieuDe, noiDung, danhSachGoiY, dangTai }) => {
  const [daSaoChep, setDaSaoChep] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const saoChepNoiDung = () => {
    if (!noiDung) return;
    navigator.clipboard.writeText(noiDung.replace(/###|####|\*\*|`|>|---/g, '').trim());
    setDaSaoChep(true);
    setTimeout(() => setDaSaoChep(false), 2000);
  };

  // Helper format inline text: bold, code, formulas, colors
  const formatInlineText = (text) => {
    if (!text) return null;

    // Split by markdown bold (**...**), inline code (`...`), formulas ($...$)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$.*?\$)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        
        // Check for urgency keywords
        if (content.includes('RẤT GẤP') || content.includes('Hôm nay') || content.includes('🔴')) {
          return (
            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-lg bg-rose-50 text-rose-700 font-extrabold text-xs border border-rose-200 shadow-2xs">
              <Flame className="w-3 h-3 text-rose-500" />
              {content.replace(/🔴/g, '').trim()}
            </span>
          );
        }
        if (content.includes('CẦN LÀM SỚM') || content.includes('🟡')) {
          return (
            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
              <Clock className="w-3 h-3 text-amber-500" />
              {content.replace(/🟡/g, '').trim()}
            </span>
          );
        }
        if (content.includes('LÊN KẾ HOẠCH') || content.includes('🟢')) {
          return (
            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              {content.replace(/🟢/g, '').trim()}
            </span>
          );
        }

        return <strong key={idx} className="font-extrabold text-slate-900">{content}</strong>;
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        const code = part.slice(1, -1);
        return (
          <code key={idx} className="px-1.5 py-0.5 mx-1 rounded-md bg-blue-50 border border-blue-200/80 text-blue-700 font-mono text-[11px] font-bold">
            {code}
          </code>
        );
      }

      if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1).replace(/\\ge/g, '≥').replace(/\\infty/g, '∞').replace(/\\log/g, 'log');
        return (
          <span key={idx} className="px-1.5 py-0.5 mx-1 rounded-md bg-purple-50 border border-purple-200/80 text-purple-700 font-mono text-[11px] font-bold">
            {formula}
          </span>
        );
      }

      return <span key={idx}>{part}</span>;
    });
  };

  // Parser phân tích nội dung AI thành các khối giao diện đẹp mắt
  const renderStructuredContent = (raw) => {
    if (!raw) return null;

    const lines = raw.split('\n');
    const sections = [];
    let currentCard = null;
    let introParagraphs = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // 1. Dấu gạch ngang phân cách (---)
      if (line === '---' || line === '***') {
        if (currentCard) {
          sections.push(currentCard);
          currentCard = null;
        }
        sections.push({ type: 'divider' });
        continue;
      }

      // 2. Blockquote (> ...)
      if (line.startsWith('>')) {
        if (currentCard) {
          sections.push(currentCard);
          currentCard = null;
        }
        sections.push({
          type: 'callout',
          content: line.replace(/^>\s*/, '').replace(/\*\*/g, '')
        });
        continue;
      }

      // 3. Tiêu đề mục (### ... hoặc #### ...)
      if (line.startsWith('###') || line.startsWith('####')) {
        if (currentCard) {
          sections.push(currentCard);
          currentCard = null;
        }
        const cleanHeading = line.replace(/^#{2,4}\s*/, '').replace(/\*\*/g, '').trim();
        sections.push({
          type: 'heading',
          content: cleanHeading
        });
        continue;
      }

      // 4. Mục ưu tiên hoặc bước thực hiện (1. **...** hoặc 1. ...)
      const numberedMatch = line.match(/^(\d+)\.\s*(.+)$/);
      if (numberedMatch) {
        if (currentCard) {
          sections.push(currentCard);
        }
        currentCard = {
          type: 'numbered_card',
          number: numberedMatch[1],
          title: numberedMatch[2],
          details: []
        };
        continue;
      }

      // 5. Chi tiết trong thẻ mục (* ... hoặc - ...)
      const bulletMatch = line.match(/^[\*\-]\s*(.+)$/);
      if (bulletMatch) {
        if (currentCard) {
          currentCard.details.push(bulletMatch[1]);
        } else {
          sections.push({
            type: 'bullet',
            content: bulletMatch[1]
          });
        }
        continue;
      }

      // 6. Đoạn văn thông thường
      if (currentCard) {
        currentCard.details.push(line);
      } else {
        introParagraphs.push(line);
      }
    }

    if (currentCard) {
      sections.push(currentCard);
    }

    return (
      <div className="space-y-4">
        {/* Intro text if any */}
        {introParagraphs.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 font-medium">
            {introParagraphs.map((p, idx) => (
              <p key={idx}>{formatInlineText(p)}</p>
            ))}
          </div>
        )}

        {/* Dynamic structured sections */}
        <div className="space-y-3.5">
          {sections.map((sec, idx) => {
            if (sec.type === 'callout') {
              const cleanContent = sec.content
                .replace(/^Nguyên tắc Sư phạm AI:\s*/i, '')
                .replace(/^Nguyên tắc Sư phạm:\s*/i, '')
                .replace(/^Nguyên tắc:\s*/i, '');

              return (
                <div key={idx} className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/50 border border-blue-200/80 flex items-start gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5 shadow-xs">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-blue-800">
                      Nguyên tắc Sư phạm & Lời khuyên AI
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed font-medium">
                      {formatInlineText(cleanContent)}
                    </p>
                  </div>
                </div>
              );
            }

            if (sec.type === 'heading') {
              return (
                <div key={idx} className="flex items-center gap-2 pt-2 pb-1 border-b border-slate-100">
                  <div className="w-2 h-4 rounded-full bg-blue-600"></div>
                  <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    {formatInlineText(sec.content)}
                  </h4>
                </div>
              );
            }

            if (sec.type === 'divider') {
              return <div key={idx} className="border-t border-dashed border-slate-200 my-3" />;
            }

            if (sec.type === 'bullet') {
              return (
                <div key={idx} className="flex items-start gap-2.5 py-1 px-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed flex-1">
                    {formatInlineText(sec.content)}
                  </div>
                </div>
              );
            }

            if (sec.type === 'numbered_card') {
              const num = parseInt(sec.number, 10);
              const isUrgent = num === 1;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 shadow-2xs ${
                    isUrgent
                      ? 'bg-gradient-to-br from-blue-50/40 via-white to-slate-50/60 border-blue-200/90'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                        isUrgent
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {sec.number}
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 leading-snug">
                        {formatInlineText(sec.title)}
                      </div>
                    </div>
                  </div>

                  {sec.details.length > 0 && (
                    <div className="pl-10 space-y-1.5 pt-1">
                      {sec.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                          <div className="flex-1">
                            {formatInlineText(detail)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-5 sm:p-7 text-slate-800 space-y-5 transition-all">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 shadow-2xs">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80 flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-600" />
                Trợ lý AI Sư Phạm (Gemini AI)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1">
              {tieuDe}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={saoChepNoiDung}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs active:scale-95"
          >
            {daSaoChep ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Sao chép lộ trình</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {dangTai ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <p className="text-xs font-bold text-slate-600 animate-pulse">AI đang phân tích và định hình giải pháp tối ưu...</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Main Structured AI Content */}
          {renderStructuredContent(noiDung)}

          {/* Action Recommendations Checklist */}
          {danhSachGoiY && danhSachGoiY.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Khuyến nghị hành động tiếp theo (Đánh dấu khi hoàn thành):</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {danhSachGoiY.map((gy, idx) => {
                  const isChecked = !!checkedItems[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border transition cursor-pointer select-none shadow-2xs ${
                        isChecked 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition shrink-0 ${
                        isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs leading-relaxed font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {gy}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AiGoiYCard;
