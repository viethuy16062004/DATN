import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json());

// Initialize Google Generative AI
let genAI = null;
let model = null;

if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
    console.log('✅ Google Gemini API (gemini-2.5-flash) khoi tao thanh cong');
  } catch (err) {
    console.warn('⚠️ Loi khoi tao Gemini client:', err.message);
  }
} else {
  console.log('ℹ️ GEMINI_API_KEY chua duoc cau hinh trong .env. Su dung che do thong minh du phong.');
}

// Helper to call Gemini model
async function callGemini(systemPrompt, userPrompt) {
  if (!model) {
    return null;
  }
  try {
    const fullPrompt = `${systemPrompt}\n\nNội dung cần xử lý:\n${userPrompt}\n\nHãy trả về kết quả dưới dạng Markdown tiếng Việt chuẩn mực, chi tiết và có tính sư phạm cao.`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return null;
  }
}

// 1. AI uu tien bai tap
app.post('/api/ai/uu-tien-bai-tap', async (req, res) => {
  const { sinhVien, danhSachBaiTap } = req.body;

  const systemPrompt = `Bạn là trợ lý học tập AI thông minh của hệ thống AI CLASSROOM.
Nhiệm vụ của bạn là phân tích danh sách bài tập chưa nộp của sinh viên, xem xét thời hạn nộp (deadline), độ gấp (số giờ còn lại) và điểm số tối đa để sắp xếp thứ tự làm bài tối ưu nhất.
Đồng thời đưa ra lời khuyên quản lý thời gian cụ thể, tích cực và dễ thực hiện.`;

  const userPrompt = `Sinh viên: ${sinhVien || 'Sinh viên'}
Danh sách bài tập cần làm:
${JSON.stringify(danhSachBaiTap || [], null, 2)}`;

  let aiText = await callGemini(systemPrompt, userPrompt);

  if (!aiText) {
    aiText = `### 🎯 Đánh Giá & Xếp Hạng Ưu Tiên Bài Tập (AI Phân Tích)\n\nChào bạn ${sinhVien || 'bạn'}, AI đã tổng hợp các bài tập của bạn và khuyến nghị lộ trình xử lý như sau:\n\n` +
      (danhSachBaiTap && danhSachBaiTap.length > 0 
        ? danhSachBaiTap.map((bt, idx) => {
            const gio = bt.gioConLai;
            const status = gio < 24 ? '🔴 CỰC KỲ KHẨN CẤP' : (gio < 72 ? '🟡 CẦN HOÀN THÀNH SỚM' : '🟢 KẾ HOẠCH BÌNH THƯỜNG');
            return `${idx + 1}. **${bt.tieuDe}** (${bt.tenLop})\n   - Mức độ ưu tiên: ${status}\n   - Thời hạn: ${bt.hanNop} (còn ${gio > 0 ? gio + 'h' : 'đã quá hạn'})\n   - Thang điểm: ${bt.diemToiDa} điểm`;
          }).join('\n\n')
        : 'Bạn đã hoàn thành tất cả các bài tập được giao! Hãy tự thưởng cho bản thân một khoảng thời gian thư giãn.');
  }

  res.json({
    chucNang: 'UU_TIEN_BAI_TAP',
    tieuDe: 'Thứ tự ưu tiên bài tập thông minh',
    noiDung: aiText,
    danhSachGoiY: [
      'Bắt đầu ngay với bài tập có hạn nộp dưới 24h',
      'Sử dụng phương pháp Pomodoro 25 phút tập trung cao độ',
      'Kiểm tra lại tiêu chí đánh giá trước khi ấn nộp bài'
    ]
  });
});

// 2. AI dinh huong bai tap (Khong lam bai thay)
app.post('/api/ai/dinh-huong-bai-tap', async (req, res) => {
  const { tieuDe, noiDung, tenLop, cauHoiThem } = req.body;

  const systemPrompt = `Bạn là trợ lý AI học tập mang tính sư phạm cao.
QUY TẮC BẮT BUỘC:
- Hướng dẫn sinh viên cách tiếp cận, phương pháp tư duy và các bước thực hiện tuần tự để giải quyết bài tập.
- TUYỆT ĐỐI KHÔNG giải bài hộ, không viết toàn bộ mã nguồn hoặc đưa ra đáp án cuối cùng trực tiếp.
- Giúp sinh viên hiểu bản chất kiến thức, đặt các câu hỏi gợi mở và checklist tự kiểm tra.`;

  const userPrompt = `Lớp học: ${tenLop || ''}
Tên bài tập: ${tieuDe}
Yêu cầu bài tập: ${noiDung}
Câu hỏi thêm của sinh viên: ${cauHoiThem || 'Hướng dẫn cách làm bài này từng bước.'}`;

  let aiText = await callGemini(systemPrompt, userPrompt);

  if (!aiText) {
    aiText = `### 🧭 Hướng Dẫn Phương Pháp Tiếp Cận Bài Tập: ${tieuDe}\n\n` +
      `*Nguyên tắc:* AI cung cấp hướng dẫn tư duy từng bước để bạn tự chủ bài làm.\n\n` +
      `#### 📌 Bước 1: Phân tích yêu cầu bài toán\n- Đọc kỹ mô tả: ${noiDung}\n- Xác định rõ input, output và ràng buộc của bài toán.\n\n` +
      `#### 📌 Bước 2: Kiến thức trọng tâm cần áp dụng\n- Môn học **${tenLop}**: Ôn lại các bài giảng về cấu trúc, cú pháp và quy chuẩn liên quan.\n\n` +
      `#### 📌 Bước 3: Các bước thực hiện đề xuất\n1. Chuẩn bị môi trường & tài liệu.\n2. Thiết kế logic sơ bộ trên giấy/sơ đồ khối.\n3. Hiện thực hóa từng module nhỏ và kiểm thử ngay.\n4. Rà soát lại bài làm và đóng gói theo yêu cầu của giảng viên.`;
  }

  res.json({
    chucNang: 'DINH_HUONG_BAI_TAP',
    tieuDe: `Định hướng giải quyết: ${tieuDe}`,
    noiDung: aiText,
    danhSachGoiY: [
      'Xem lại tài liệu lý thuyết trong bài giảng của môn học',
      'Thử nghiệm với các test case nhỏ trước khi hoàn thiện',
      'Đảm bảo bài nộp tuân thủ đúng định dạng yêu cầu'
    ]
  });
});

// 3. AI tao ke hoach hoc tap
app.post('/api/ai/tao-ke-hoach', async (req, res) => {
  const { sinhVien, soGioMoiNgay, mucTieu, danhSachBaiTap } = req.body;

  const systemPrompt = `Bạn là chuyên gia cố vấn học tập AI.
Hãy lập một kế hoạch học tập chi tiết, thực tế và có tính động viên cao cho sinh viên dựa trên thời gian biểu (${soGioMoiNgay || 3} giờ/ngày), mục tiêu (${mucTieu || 'Nâng cao kết quả'}) và danh sách bài tập hiện có.`;

  const userPrompt = `Sinh viên: ${sinhVien || 'Sinh viên'}
Thời gian học mỗi ngày: ${soGioMoiNgay || 3} giờ
Mục tiêu: ${mucTieu || 'Đạt kết quả tốt'}
Danh sách bài tập cần hoàn thành: ${JSON.stringify(danhSachBaiTap || [], null, 2)}`;

  let aiText = await callGemini(systemPrompt, userPrompt);

  if (!aiText) {
    aiText = `### 📅 Lộ Trình & Kế Hoạch Học Tập Tối Ưu\n\n` +
      `**Sinh viên:** ${sinhVien || 'Bạn'}\n` +
      `**Thời lượng học mỗi ngày:** ${soGioMoiNgay || 3} giờ | **Mục tiêu:** ${mucTieu || 'Học tập hiệu quả'}\n\n` +
      `#### ⏰ Phân Bổ Thời Gian Mỗi Ngày:\n` +
      `- **Phiên 1 (50 phút):** Giải quyết các nhiệm vụ ưu tiên cao / ôn tập kiến thức khó.\n` +
      `- *Nghỉ ngắn (10 phút):* Đi lại, thư giãn.\n` +
      `- **Phiên 2 (50 phút):** Hoàn thiện các bài tập thực hành.\n` +
      `- *Nghỉ ngắn (10 phút)*\n` +
      `- **Phiên 3 (30 phút):** Tự đánh giá, sửa lỗi và nộp bài trước hạn.`;
  }

  res.json({
    chucNang: 'TAO_KE_HOACH',
    tieuDe: 'Kế hoạch học tập cá nhân hoá',
    noiDung: aiText,
    danhSachGoiY: [
      'Học vào khung giờ có khả năng tập trung cao nhất trong ngày',
      'Tắt các thông báo mạng xã hội trong lúc học',
      'Đánh dấu hoàn thành từng mục tiêu nhỏ để tạo động lực'
    ]
  });
});

// 4. AI phan tich tien do lop cho giao vien
app.post('/api/ai/phan-tich-lop', async (req, res) => {
  const { tenLop, soLuongSinhVien, soLuongBaiTap, diemTrungBinhLop, tiLeNopBaiLop, sinhVienCanLuuY } = req.body;

  const systemPrompt = `Bạn là trợ lý phân tích dữ liệu giáo dục AI dành cho Giảng viên.
Hãy phân tích báo cáo lớp học, đánh giá mức độ tương tác, điểm trung bình, xác định các nguy cơ học tập và đề xuất giải pháp sư phạm cụ thể cho giảng viên.`;

  const userPrompt = `Lớp học: ${tenLop}
Sĩ số: ${soLuongSinhVien} sinh viên
Tổng số bài tập: ${soLuongBaiTap} bài
Điểm trung bình lớp: ${diemTrungBinhLop} / 10
Tỉ lệ nộp bài: ${tiLeNopBaiLop}%
Danh sách sinh viên cần lưu ý: ${JSON.stringify(sinhVienCanLuuY || [], null, 2)}`;

  let aiText = await callGemini(systemPrompt, userPrompt);

  if (!aiText) {
    aiText = `### 📊 Báo Cáo Phân Tích Tổng Thể Lớp Học: ${tenLop}\n\n` +
      `#### 📌 1. Đánh giá chung\n` +
      `- Lớp có **${soLuongSinhVien}** sinh viên với tỉ lệ nộp bài đạt **${tiLeNopBaiLop}%**.\n` +
      `- Điểm trung bình hiện tại: **${diemTrungBinhLop}/10**.\n\n` +
      `#### 📌 2. Nhận xét tình hình học tập\n` +
      (sinhVienCanLuuY && sinhVienCanLuuY.length > 0 
        ? `- Có **${sinhVienCanLuuY.length}** sinh viên cần được nhắc nhở thêm về tiến độ hoặc hỗ trợ học lực.\n`
        : `- Toàn bộ sinh viên trong lớp đang có tiến độ nộp bài và kết quả rất tốt.\n`) +
      `\n#### 📌 3. Đề xuất hành động cho Giảng viên\n` +
      `1. Đăng thông báo nhắc nhở trước ngày đến hạn của bài tập tiếp theo.\n` +
      `2. Khích lệ tinh thần các học viên có điểm số xuất sắc.\n` +
      `3. Dành 10-15 phút đầu giờ để giải đáp các vướng mắc của sinh viên.`;
  }

  res.json({
    chucNang: 'PHAN_TICH_LOP',
    tieuDe: `Báo cáo phân tích chất lượng lớp: ${tenLop}`,
    noiDung: aiText,
    danhSachGoiY: [
      'Gửi thông báo nhắc nhở các sinh viên chưa nộp bài',
      'Đánh giá lại độ khó của bài tập nếu tỉ lệ nộp bài thấp',
      'Khen ngợi sinh viên hoàn thành tốt để tạo không khí học tập sôi nổi'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'AI Gateway', geminiConfigured: !!GEMINI_API_KEY });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Gateway dang chay tai cong ${PORT}`);
});
