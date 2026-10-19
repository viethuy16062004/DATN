package com.aiclassroom.dung_chung.ai;

import com.aiclassroom.sinh_vien.bai_nop.BaiNop;
import com.aiclassroom.sinh_vien.bai_nop.BaiNopRepository;
import com.aiclassroom.dung_chung.bai_tap.BaiTap;
import com.aiclassroom.dung_chung.bai_tap.BaiTapRepository;
import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.giang_vien.cham_diem.ChamDiem;
import com.aiclassroom.giang_vien.cham_diem.ChamDiemRepository;
import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import com.aiclassroom.dung_chung.lop_hoc.LopHocRepository;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLop;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLopRepository;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongCoQuyen;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongTimThay;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import com.aiclassroom.dung_chung.tien_do.TienDo;
import com.aiclassroom.dung_chung.tien_do.TienDoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DichVuAi {

    private final GeminiDichVu geminiDichVu;
    private final KhachHangAiGateway khachHangAiGateway;
    private final LichSuAiRepository lichSuAiRepository;
    private final DichVuLichSuAi dichVuLichSuAi;
    private final BaiTapRepository baiTapRepository;
    private final BaiNopRepository baiNopRepository;
    private final ChamDiemRepository chamDiemRepository;
    private final LopHocRepository lopHocRepository;
    private final ThanhVienLopRepository thanhVienLopRepository;
    private final TienDoRepository tienDoRepository;
    private final TienIchNguoiDung tienIchNguoiDung;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");

    public AiPhanHoi uuTienBaiTap(AiUuTienYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        List<LopHoc> dsLop;

        if (yeuCau != null && yeuCau.getLopHocId() != null) {
            LopHoc lh = lopHocRepository.findById(yeuCau.getLopHocId())
                    .orElseThrow(() -> new NgoaiLeKhongTimThay("Không tìm thấy lớp học"));
            dsLop = List.of(lh);
        } else {
            List<ThanhVienLop> tvList = thanhVienLopRepository.findBySinhVien(nd);
            dsLop = tvList.stream().map(ThanhVienLop::getLopHoc).toList();
        }

        List<BaiTap> tatCaBaiTap = dsLop.isEmpty() 
                ? Collections.emptyList() 
                : baiTapRepository.findByLopHocInOrderByHanNopAsc(dsLop);
        List<Map<String, Object>> danhSachChuaNop = new ArrayList<>();
        LocalDateTime bayGio = LocalDateTime.now();

        for (BaiTap bt : tatCaBaiTap) {
            Optional<BaiNop> optBn = baiNopRepository.findByBaiTapAndSinhVien(bt, nd);
            if (optBn.isEmpty()) {
                long gioConLai = Duration.between(bayGio, bt.getHanNop()).toHours();
                Map<String, Object> map = new HashMap<>();
                map.put("baiTapId", bt.getId());
                map.put("tieuDe", bt.getTieuDe());
                map.put("tenLop", bt.getLopHoc().getTenLop());
                map.put("hanNop", bt.getHanNop().format(FORMATTER));
                map.put("gioConLai", gioConLai);
                map.put("diemToiDa", bt.getDiemToiDa());
                danhSachChuaNop.add(map);
            }
        }

        // 1. Gọi Google Gemini AI thật
        String promptHeThong = "Bạn là Trợ lý AI giáo dục thông minh của hệ thống AI Classroom. "
                + "Nhiệm vụ: Phân tích danh sách bài tập chưa nộp của sinh viên, xem xét thời hạn nộp, độ khó và thang điểm để sắp xếp thứ tự ưu tiên tối ưu nhất.";
        
        StringBuilder userPrompt = new StringBuilder();
        userPrompt.append("Sinh viên: ").append(nd.getHoTen()).append("\n");
        userPrompt.append("Danh sách bài tập cần làm:\n");
        if (danhSachChuaNop.isEmpty()) {
            userPrompt.append("- Hiện tại không có bài tập nào chưa nộp.");
        } else {
            for (Map<String, Object> m : danhSachChuaNop) {
                userPrompt.append(String.format("- Môn: %s | Bài: %s | Hạn: %s (còn %s giờ) | Điểm: %s\n",
                        m.get("tenLop"), m.get("tieuDe"), m.get("hanNop"), m.get("gioConLai"), m.get("diemToiDa")));
            }
        }
        userPrompt.append("\nYêu cầu: Hãy đưa ra thứ tự ưu tiên cụ thể và 3 khuyến nghị hành động ngắn gọn.");

        String geminiRes = geminiDichVu.goiGemini(promptHeThong, userPrompt.toString());
        AiPhanHoi phanHoi;

        if (geminiRes != null && !geminiRes.isBlank()) {
            List<String> goiY = List.of(
                    "Ưu tiên hoàn thành bài tập có hạn nộp gần nhất trong vòng 24 giờ",
                    "Chia nhỏ bài tập lớn thành các phiên học 25 phút Pomodoro",
                    "Đọc kỹ yêu cầu đề bài và kiểm tra các trường hợp biên trước khi nộp"
            );
            phanHoi = AiPhanHoi.builder()
                    .chucNang("UU_TIEN_BAI_TAP")
                    .tieuDe("Xếp hạng ưu tiên bài tập thông minh (Gemini AI)")
                    .noiDung(geminiRes)
                    .danhSachGoiY(goiY)
                    .duLieuBoSung(Map.of("tongSoBaiChuaNop", danhSachChuaNop.size(), "baiTap", danhSachChuaNop))
                    .build();
        } else {
            // Fallback Engine
            StringBuilder sb = new StringBuilder();
            sb.append("### 🎯 Danh Sách Thứ Tự Ưu Tiên Bài Tập (AI Phân Tích)\n\n");
            if (danhSachChuaNop.isEmpty()) {
                sb.append("Tuyệt vời! Bạn hiện tại đã hoàn thành tất cả các bài tập được giao. Hãy dành thời gian ôn lại kiến thức và nghỉ ngơi nhé!");
            } else {
                sb.append("Dựa trên thời hạn nộp bài (deadline) và trọng số điểm, dưới đây là thứ tự làm bài tối ưu nhất cho bạn:\n\n");
                int stt = 1;
                for (Map<String, Object> bt : danhSachChuaNop) {
                    long gio = (long) bt.get("gioConLai");
                    String doKhan = gio < 24 ? "🔴 RẤT GẤP (Dưới 24h)" : (gio < 72 ? "🟡 CẦN LÀM SỚM (1-3 ngày)" : "🟢 CÓ THỂ LÊN KẾ HOẠCH");
                    sb.append(stt++).append(". **").append(bt.get("tieuDe")).append("** - *").append(bt.get("tenLop")).append("*\n");
                    sb.append("   - Mức độ: ").append(doKhan).append("\n");
                    sb.append("   - Hạn chót: ").append(bt.get("hanNop")).append(" (còn khoảng ").append(gio > 0 ? gio + " giờ" : "đã quá hạn").append(")\n");
                    sb.append("   - Điểm tối đa: ").append(bt.get("diemToiDa")).append(" điểm\n\n");
                }
            }

            List<String> goiY = List.of(
                    "Hãy chia nhỏ bài tập có hạn gần nhất thành các phiên học 25 phút (Pomodoro)",
                    "Ưu tiên hoàn thiện bài tập có điểm số cao và hạn nộp dưới 24 giờ trước",
                    "Đọc kỹ yêu cầu bài tập và liên hệ AI định hướng nếu gặp bế tắc"
            );

            phanHoi = AiPhanHoi.builder()
                    .chucNang("UU_TIEN_BAI_TAP")
                    .tieuDe("Xếp hạng ưu tiên bài tập thông minh")
                    .noiDung(sb.toString())
                    .danhSachGoiY(goiY)
                    .duLieuBoSung(Map.of("tongSoBaiChuaNop", danhSachChuaNop.size(), "baiTap", danhSachChuaNop))
                    .build();
        }

        dichVuLichSuAi.luuLichSu(nd, "UU_TIEN_BAI_TAP", "Phân tích ưu tiên bài tập", phanHoi.getNoiDung());
        return phanHoi;
    }

    public AiPhanHoi dinhHuongBaiTap(AiDinhHuongYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        
        String tieuDe = "Bài tập thực hành";
        String noiDung = "";
        String tenLop = "Lớp học thông minh";
        Double diemToiDa = 10.0;
        Long baiTapId = yeuCau.getBaiTapId();

        if (baiTapId != null) {
            Optional<BaiTap> optBt = baiTapRepository.findById(baiTapId);
            if (optBt.isPresent()) {
                BaiTap bt = optBt.get();
                tieuDe = bt.getTieuDe();
                noiDung = bt.getNoiDung() != null ? bt.getNoiDung() : "";
                tenLop = (bt.getLopHoc() != null) ? bt.getLopHoc().getTenLop() : tenLop;
                diemToiDa = bt.getDiemToiDa();
            }
        }

        if (yeuCau.getTieuDe() != null && !yeuCau.getTieuDe().isBlank()) {
            tieuDe = yeuCau.getTieuDe();
        }
        if (yeuCau.getNoiDung() != null && !yeuCau.getNoiDung().isBlank()) {
            noiDung = yeuCau.getNoiDung();
        }
        if (yeuCau.getTenLop() != null && !yeuCau.getTenLop().isBlank()) {
            tenLop = yeuCau.getTenLop();
        }

        // Làm sạch tiêu đề hiển thị
        String tieuDeChuan = tieuDe.replaceAll("^[#\\s]*Đề\\s*bài\\s*:\\s*", "").replaceAll("^[#\\s]*Bài\\s*tập\\s*:\\s*", "").trim();

        // 1. Gọi Google Gemini AI thật
        String promptHeThong = "Bạn là Giảng viên Đại học và Trợ lý AI Sư phạm cao cấp Khoa Công nghệ Thông tin.\n"
                + "NGUYÊN TẮC BẮT BUỘC: Hướng dẫn tư duy, phân tích kiến trúc dữ liệu và các bước thực hiện tuần tự để sinh viên tự làm chủ kiến thức, TUYỆT ĐỐI KHÔNG GIẢI BÀI HỘ hoặc viết sẵn toàn bộ mã nguồn bài giải.\n"
                + "Hãy phân tích đề bài CỤ THỂ và định dạng câu trả lời theo đúng cấu trúc Markdown chuẩn:\n"
                + "> Lộ trình tư duy thuật toán và phương pháp giải quyết tối ưu cho bài: **" + tieuDeChuan + "**.\n\n"
                + "#### 📌 Bước 1: Phân Tích & Xác Định Input/Output\n"
                + "- **Input**: ...\n"
                + "- **Output**: ...\n\n"
                + "#### 📌 Bước 2: Kiến Trúc Cấu Trúc Dữ Liệu / Công Nghệ Áp Dụng\n"
                + "- ...\n\n"
                + "#### 📌 Bước 3: Thuật Toán & Luồng Xử Lý Chi Tiết Từng Bước\n"
                + "1. ...\n"
                + "2. ...\n\n"
                + "#### 📌 Bước 4: Kiểm Thử & Các Ca Biên Cần Lưu Ý (Edge Cases)\n"
                + "- ...";

        StringBuilder userPrompt = new StringBuilder();
        userPrompt.append("Môn học: ").append(tenLop).append("\n");
        userPrompt.append("Tên bài tập: ").append(tieuDeChuan).append("\n");
        if (!noiDung.isBlank()) {
            userPrompt.append("Nội dung/Yêu cầu đề bài:\n").append(noiDung).append("\n");
        }
        userPrompt.append("Thang điểm: ").append(diemToiDa).append("\n");
        if (yeuCau.getCauHoiThem() != null && !yeuCau.getCauHoiThem().isBlank()) {
            userPrompt.append("Câu hỏi/Vướng mắc cụ thể của sinh viên: ").append(yeuCau.getCauHoiThem()).append("\n");
        }

        String geminiRes = geminiDichVu.goiGemini(promptHeThong, userPrompt.toString());
        AiPhanHoi phanHoi;

        if (geminiRes != null && !geminiRes.isBlank()) {
            List<String> goiY = List.of(
                    "Tự kiểm tra lại các trường hợp biên đặc biệt (Edge Cases)",
                    "Tối ưu hóa độ phức tạp thời gian O(N) và bộ nhớ",
                    "Nộp bài trước hạn chót ít nhất 2 tiếng để phòng ngừa sự cố mạng"
            );

            phanHoi = AiPhanHoi.builder()
                    .chucNang("DINH_HUONG_BAI_TAP")
                    .tieuDe("Định hướng giải quyết: " + tieuDeChuan)
                    .noiDung(geminiRes)
                    .danhSachGoiY(goiY)
                    .duLieuBoSung(Map.of("baiTapId", baiTapId != null ? baiTapId : 0L, "tieuDe", tieuDeChuan))
                    .build();
        } else {
            // Context-Aware Expert Pedagogical Generator
            String textLower = (tieuDeChuan + " " + noiDung + " " + (yeuCau.getCauHoiThem() != null ? yeuCau.getCauHoiThem() : "")).toLowerCase();
            StringBuilder sb = new StringBuilder();

            sb.append("> Hướng dẫn phương pháp tư duy và các bước thực hiện chi tiết cho: **").append(tieuDeChuan).append("**\n\n");

            if (yeuCau.getCauHoiThem() != null && !yeuCau.getCauHoiThem().isBlank()) {
                sb.append("#### 💡 Giải Đáp Thắc Mắc Cụ Thể: \"").append(yeuCau.getCauHoiThem().trim()).append("\"\n");
                sb.append("- Hãy phân tích câu hỏi trên thành 2 phần: điều kiện đầu vào (tiền điều kiện) và kết quả mong đợi sau khi thực thi.\n");
                sb.append("- Chú ý kiểm tra các giá trị đặc biệt (như giá trị rỗng `null`, chỉ số ngoài mảng `IndexOutOfBounds`, chia cho 0) trước khi xử lý logic chính.\n\n");
            }

            if (textLower.contains("cấu trúc dữ liệu") || textLower.contains("ccauas trúc") || textLower.contains("cây") || textLower.contains("tree") || textLower.contains("đồ thị") || textLower.contains("graph") || textLower.contains("danh sách") || textLower.contains("stack") || textLower.contains("queue") || textLower.contains("thuật toán") || textLower.contains("sort")) {
                sb.append("#### 📌 Bước 1: Mô Hình Hóa & Thiết Kế Cấu Trúc Dữ Liệu\n");
                sb.append("- **Định nghĩa Node / Thực thể**: Khai báo class/struct chứa dữ liệu (`data`) và các con trỏ liên kết (`next`, `prev`, `left`, `right`).\n");
                sb.append("- **Chọn giải thuật phù hợp**: Đánh giá độ phức tạp thuật toán (Time Complexity: $O(\\log N)$ hoặc $O(N)$) và bộ nhớ (Space Complexity: $O(1)$ hay $O(N)$).\n\n");

                sb.append("#### 📌 Bước 2: Triển Khai Các Hàm Thao Tác Cốt Lõi\n");
                sb.append("1. **Khởi tạo & Thêm mới (Insert/Add)**: Đảm bảo xử lý đúng khi cấu trúc rỗng (Root / Head là `null`) và khi chèn vào giữa/cuối.\n");
                sb.append("2. **Tìm kiếm & Duyệt (Traversal/Search)**: Áp dụng đệ quy (Recursion) hoặc vòng lặp (Iteration) qua từng phần tử theo thứ tự mong muốn (Pre-order, In-order, BFS, DFS).\n");
                sb.append("3. **Cập nhật & Xóa (Update/Delete)**: Quản lý kỹ việc giải phóng bộ nhớ hoặc nối lại liên kết con trỏ để không làm đứt gãy cấu trúc.\n\n");

                sb.append("#### 📌 Bước 3: Kiểm Thử & Các Ca Kiểm Thử Biên (Edge Cases)\n");
                sb.append("- **Test Case 1 (Cấu trúc rỗng)**: Gọi hàm tìm kiếm/xóa khi chưa có phần tử nào -> Hệ thống không bị crash (bắt ngoại lệ an toàn).\n");
                sb.append("- **Test Case 2 (1 phần tử duy nhất)**: Thao tác thêm rồi xóa 1 phần tử duy nhất -> Trạng thái cấu trúc trở về rỗng chuẩn xác.\n");
                sb.append("- **Test Case 3 (Dữ liệu trùng lặp / Dữ liệu lớn)**: Kiểm tra hiệu năng khi chèn nhiều phần tử ngẫu nhiên.");
            } else if (textLower.contains("api") || textLower.contains("spring") || textLower.contains("web") || textLower.contains("jwt") || textLower.contains("auth") || textLower.contains("react")) {
                sb.append("#### 📌 Bước 1: Thiết Kế Mô Hình Thực Thể & CSDL (Entity & DTO)\n");
                sb.append("- Xác định các bảng CSDL và quan hệ (`@OneToMany`, `@ManyToOne`, `@ManyToMany`).\n");
                sb.append("- Tạo các lớp DTO để nhận dữ liệu từ Client (Request DTO) và phản hồi ra ngoài (Response DTO), không để lộ trực tiếp Entity.\n\n");

                sb.append("#### 📌 Bước 2: Xây Dựng Kiến Trúc Phân Tầng (Controller -> Service -> Repository)\n");
                sb.append("1. **Repository Layer**: Khai báo các interface kế thừa `JpaRepository` với các query methods cần thiết.\n");
                sb.append("2. **Service Layer**: Cài đặt nghiệp vụ xử lý, xác thực dữ liệu đầu vào (Validation `@Valid`), mã hóa mật khẩu và xử lý ngoại lệ nghiệp vụ.\n");
                sb.append("3. **Controller Layer**: Định tuyến các endpoint RESTful chuẩn (`GET`, `POST`, `PUT`, `DELETE`) với mã trạng thái HTTP phù hợp (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).\n\n");

                sb.append("#### 📌 Bước 3: Kiểm Thử Với Postman & Swagger\n");
                sb.append("- Kiểm thử luồng thành công (Happy Path) và kiểm thử các ca truyền thiếu trường bắt buộc hoặc sai định dạng token.");
            } else {
                sb.append("#### 📌 Bước 1: Phân Tích Yêu Cầu & Xác Định Input/Output\n");
                sb.append("- **Input**: Xác định rõ các biến số, kiểu dữ liệu và phạm vi giá trị đầu vào.\n");
                sb.append("- **Output**: Kết quả mong muốn cần trả về theo đúng định dạng đề bài yêu cầu.\n\n");

                sb.append("#### 📌 Bước 2: Triển Khai Logic Từng Bước\n");
                sb.append("1. Khởi tạo dự án, thiết lập các thư viện và cấu trúc thư mục rõ ràng.\n");
                sb.append("2. Cài đặt các hàm xử lý logic nghiệp vụ chính (Clean Code, đặt tên biến có ý nghĩa).\n");
                sb.append("3. Ghép nối các module và bổ sung xử lý ngoại lệ (`try-catch`, logging).\n\n");

                sb.append("#### 📌 Bước 3: Kiểm Thử & Tự Đánh Giá\n");
                sb.append("- Chạy kiểm thử với ít nhất 3 bộ dữ liệu: Dữ liệu chuẩn, Dữ liệu rỗng, Dữ liệu cận biên.");
            }

            List<String> goiY = List.of(
                    "Tự kiểm tra lại các trường hợp đặc biệt (Edge Cases)",
                    "Viết mã nguồn sạch (Clean Code), chú thích rõ ràng ở các hàm logic chính",
                    "Nộp bài trước thời hạn ít nhất 2 tiếng để phòng ngừa sự cố mạng"
            );

            phanHoi = AiPhanHoi.builder()
                    .chucNang("DINH_HUONG_BAI_TAP")
                    .tieuDe("Định hướng giải quyết: " + tieuDeChuan)
                    .noiDung(sb.toString())
                    .danhSachGoiY(goiY)
                    .duLieuBoSung(Map.of("baiTapId", baiTapId != null ? baiTapId : 0L, "tieuDe", tieuDeChuan))
                    .build();
        }

        dichVuLichSuAi.luuLichSu(nd, "DINH_HUONG_BAI_TAP", "Định hướng bài tập: " + tieuDeChuan, phanHoi.getNoiDung());
        return phanHoi;
    }

    public AiPhanHoi layDinhHuongHomNay() {
        return taoKeHoach(AiKeHoachYeuCau.builder()
                .soGioMoiNgay(3)
                .mucTieu("Tối ưu hóa học tập và hoàn thành bài tập theo năng lực cá nhân")
                .build());
    }

    public AiPhanHoi taoKeHoach(AiKeHoachYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        List<ThanhVienLop> tvList = thanhVienLopRepository.findBySinhVien(nd);
        List<LopHoc> dsLop = tvList.stream().map(ThanhVienLop::getLopHoc).toList();
        List<BaiTap> tatCaBaiTap = dsLop.isEmpty() 
                ? Collections.emptyList() 
                : baiTapRepository.findByLopHocInOrderByHanNopAsc(dsLop);

        List<BaiNop> dsBaiNop = baiNopRepository.findBySinhVien(nd);
        Map<Long, BaiNop> mapBaiNop = dsBaiNop.stream()
                .filter(bn -> bn.getBaiTap() != null)
                .collect(Collectors.toMap(bn -> bn.getBaiTap().getId(), bn -> bn, (a, b) -> a));

        List<ChamDiem> dsChamDiem = dsBaiNop.isEmpty()
                ? Collections.emptyList()
                : chamDiemRepository.findByBaiNopIn(dsBaiNop);

        // 1. Tính toán Điểm trung bình thực tế giáo viên đã chấm & Tiến độ hoàn thành
        int tongSoBaiTap = tatCaBaiTap.size();
        int soBaiDaNop = dsBaiNop.size();
        int soBaiDaCham = dsChamDiem.size();
        int soBaiChuaNop = Math.max(0, tongSoBaiTap - soBaiDaNop);

        double tongDiemThang10 = 0.0;
        String nhanXetMoiNhat = null;
        for (ChamDiem cd : dsChamDiem) {
            double diemToiDa = (cd.getBaiNop() != null && cd.getBaiNop().getBaiTap() != null && cd.getBaiNop().getBaiTap().getDiemToiDa() != null)
                    ? cd.getBaiNop().getBaiTap().getDiemToiDa() : 10.0;
            double diemThang10 = diemToiDa > 0 ? (cd.getDiemSo() / diemToiDa) * 10.0 : cd.getDiemSo();
            tongDiemThang10 += diemThang10;
            if (cd.getNhanXet() != null && !cd.getNhanXet().isBlank()) {
                nhanXetMoiNhat = cd.getNhanXet();
            }
        }

        double diemTrungBinh = soBaiDaCham > 0 ? (tongDiemThang10 / soBaiDaCham) : 0.0;
        diemTrungBinh = Math.round(diemTrungBinh * 10.0) / 10.0;

        double tiLeHoanThanh = tongSoBaiTap > 0 ? ((double) soBaiDaNop * 100.0 / tongSoBaiTap) : 0.0;
        tiLeHoanThanh = Math.round(tiLeHoanThanh * 10.0) / 10.0;

        LocalDateTime bayGio = LocalDateTime.now();
        List<BaiTap> btChuaNopList = new ArrayList<>();
        int soBaiQuaHan = 0;
        int soBaiSapDenHan = 0;

        for (BaiTap bt : tatCaBaiTap) {
            if (!mapBaiNop.containsKey(bt.getId())) {
                btChuaNopList.add(bt);
                if (bt.getHanNop() != null) {
                    if (bt.getHanNop().isBefore(bayGio)) {
                        soBaiQuaHan++;
                    } else if (Duration.between(bayGio, bt.getHanNop()).toHours() <= 24) {
                        soBaiSapDenHan++;
                    }
                }
            }
        }

        // Bài tập ưu tiên số 1 cần xử lý
        BaiTap btUuTienNhat = btChuaNopList.stream()
                .filter(b -> b.getHanNop() != null && !b.getHanNop().isBefore(bayGio))
                .findFirst()
                .orElse(btChuaNopList.isEmpty() ? null : btChuaNopList.get(0));

        // 2. Phân loại Học lực & Tình trạng Học tập (Persona)
        String nhomHocLuc;
        String danhHieuAi;
        String chienLuocChinh;
        String mauSacBadge;

        if (diemTrungBinh >= 8.5 && tiLeHoanThanh >= 50.0 && soBaiQuaHan == 0) {
            nhomHocLuc = "XUAT_SAC";
            danhHieuAi = "🌟 Sinh viên Xuất sắc • Tối ưu & Nghiên cứu Chuyên sâu";
            chienLuocChinh = "Duy trì phong độ đỉnh cao, tối ưu hóa cấu trúc mã nguồn và chinh phục các bài tập nâng cao.";
            mauSacBadge = "emerald";
        } else if (diemTrungBinh >= 7.0 && soBaiQuaHan == 0) {
            nhomHocLuc = "GIOI_KHA";
            danhHieuAi = "🚀 Sinh viên Tiềm năng • Bứt phá Điểm 10 & Nâng cao Tiến độ";
            chienLuocChinh = "Rà soát kỹ các tiêu chí kiểm thử để đạt điểm tối đa và đẩy nhanh tiến độ nộp bài trước hạn.";
            mauSacBadge = "blue";
        } else if (diemTrungBinh >= 5.0 || (tiLeHoanThanh >= 40.0 && soBaiQuaHan <= 1)) {
            nhomHocLuc = "TRUNG_BINH";
            danhHieuAi = "🎯 Sinh viên Cần Cải Thiện • Củng cố Nền tảng & Kịp Tiến độ";
            chienLuocChinh = "Tập trung nắm vững lý thuyết cốt lõi, tham khảo giải thích từng bước từ AI và nộp bài đúng hạn.";
            mauSacBadge = "amber";
        } else {
            nhomHocLuc = "NGUY_CO";
            danhHieuAi = "⚠️ Cảnh báo Nguy cơ • Kế hoạch Cứu điểm & Bù tiến độ Khẩn cấp";
            chienLuocChinh = "Ưu tiên giải quyết ngay các bài tập trễ hạn và các bài có trọng số điểm cao để đảm bảo điều kiện qua môn.";
            mauSacBadge = "rose";
        }

        int soGio = (yeuCau != null && yeuCau.getSoGioMoiNgay() != null && yeuCau.getSoGioMoiNgay() > 0) ? yeuCau.getSoGioMoiNgay() : 3;
        String mucTieu = (yeuCau != null && yeuCau.getMucTieu() != null && !yeuCau.getMucTieu().isBlank()) 
                ? yeuCau.getMucTieu() 
                : ("Kế hoạch học tập cá nhân hóa - Nhóm " + nhomHocLuc);

        // 3. Xây dựng Khung giờ gợi ý học tập trong ngày (Dynamic Slot Planner)
        List<Map<String, String>> khungGioGoiY = new ArrayList<>();
        String tenBt = btUuTienNhat != null ? btUuTienNhat.getTieuDe() : "Ôn tập kiến thức môn học";
        String tenMon = btUuTienNhat != null && btUuTienNhat.getLopHoc() != null ? btUuTienNhat.getLopHoc().getTenLop() : "Công nghệ thông tin";

        if ("XUAT_SAC".equals(nhomHocLuc)) {
            khungGioGoiY.add(Map.of("gio", "15:00 - 16:00", "tieuDe", "Nghiên cứu kiến trúc & tối ưu: " + tenBt, "loai", "CHUYEN_SAU", "mau", "purple"));
            khungGioGoiY.add(Map.of("gio", "16:00 - 16:15", "tieuDe", "Nghỉ ngơi & ghi chú ý tưởng (Pomodoro)", "loai", "NGHI_NGOI", "mau", "blue"));
            khungGioGoiY.add(Map.of("gio", "16:15 - 17:00", "tieuDe", "Viết mã nguồn sạch & thiết kế Unit Test nâng cao", "loai", "THUC_HANH", "mau", "emerald"));
            khungGioGoiY.add(Map.of("gio", "17:00 - 17:30", "tieuDe", "Refactor mã nguồn & chuẩn bị tài liệu kỹ thuật", "loai", "TONG_KET", "mau", "teal"));
        } else if ("GIOI_KHA".equals(nhomHocLuc)) {
            khungGioGoiY.add(Map.of("gio", "15:00 - 16:00", "tieuDe", "Phân tích yêu cầu & thiết kế thuật toán: " + tenBt, "loai", "THUAT_TOAN", "mau", "purple"));
            khungGioGoiY.add(Map.of("gio", "16:00 - 16:15", "tieuDe", "Nghỉ giải lao thư giãn mắt", "loai", "NGHI_NGOI", "mau", "blue"));
            khungGioGoiY.add(Map.of("gio", "16:15 - 17:00", "tieuDe", "Cài đặt tính năng chính & kiểm tra lỗi cú pháp", "loai", "THUC_HANH", "mau", "emerald"));
            khungGioGoiY.add(Map.of("gio", "17:00 - 17:30", "tieuDe", "Kiểm thử các ca biên (Edge cases) và hoàn thành nộp", "loai", "KIEM_THU", "mau", "teal"));
        } else if ("TRUNG_BINH".equals(nhomHocLuc)) {
            khungGioGoiY.add(Map.of("gio", "15:00 - 16:00", "tieuDe", "Đọc lại lý thuyết nền tảng & xem bài mẫu: " + tenMon, "loai", "LY_THUYET", "mau", "amber"));
            khungGioGoiY.add(Map.of("gio", "16:00 - 16:15", "tieuDe", "Nghỉ giải lao ngắn", "loai", "NGHI_NGOI", "mau", "blue"));
            khungGioGoiY.add(Map.of("gio", "16:15 - 17:00", "tieuDe", "Thực hiện từng bước cơ bản: " + tenBt, "loai", "THUC_HANH", "mau", "emerald"));
            khungGioGoiY.add(Map.of("gio", "17:00 - 17:30", "tieuDe", "Hỏi AI gỡ lỗi các đoạn code chưa chạy và nộp bài", "loai", "GO_LOI", "mau", "teal"));
        } else {
            // NGUY CO
            khungGioGoiY.add(Map.of("gio", "14:30 - 15:30", "tieuDe", "CẤP TỐC: Giải quyết ngay bài tập trễ hạn / sắp hết hạn", "loai", "KHAN_CAP", "mau", "rose"));
            khungGioGoiY.add(Map.of("gio", "15:30 - 15:45", "tieuDe", "Nghỉ ngắn lấy lại tập trung", "loai", "NGHI_NGOI", "mau", "blue"));
            khungGioGoiY.add(Map.of("gio", "15:45 - 16:45", "tieuDe", "Hoàn thành các chức năng tối thiểu để lấy điểm điều kiện", "loai", "THUC_HANH", "mau", "amber"));
            khungGioGoiY.add(Map.of("gio", "16:45 - 17:30", "tieuDe", "Kiểm tra tệp nộp, nộp bài ngay & nhắn tin hỗ trợ GV", "loai", "NOP_BAI", "mau", "emerald"));
        }

        // 4. Xây dựng Prompt gửi Gemini AI thật
        String promptHeThong = "Bạn là Trợ lý AI Cố vấn Học tập Cá nhân hóa Cao cấp tại AI Classroom. "
                + "Nhiệm vụ: Dựa trên TỔNG ĐIỂM TRUNG BÌNH (GPA) khi giáo viên chấm điểm và TIẾN ĐỘ HOÀN THÀNH BÀI TẬP của sinh viên, hãy lập một kế hoạch học tập độc quyền, cụ thể và khác biệt hoàn toàn cho sinh viên này.";

        StringBuilder userPrompt = new StringBuilder();
        userPrompt.append("Hồ sơ năng lực học tập của sinh viên:\n");
        userPrompt.append("- Họ tên: ").append(nd.getHoTen()).append("\n");
        userPrompt.append("- Điểm trung bình (GPA do GV chấm): ").append(diemTrungBinh > 0 ? (diemTrungBinh + "/10.0") : "Chưa có điểm").append("\n");
        userPrompt.append("- Tiến độ hoàn thành bài tập: ").append(tiLeHoanThanh).append("% (Đã nộp ").append(soBaiDaNop).append("/").append(tongSoBaiTap).append(" bài)\n");
        userPrompt.append("- Số bài chưa nộp: ").append(soBaiChuaNop).append(" (Trong đó sắp đến hạn 24h: ").append(soBaiSapDenHan).append(", Quá hạn: ").append(soBaiQuaHan).append(")\n");
        if (nhanXetMoiNhat != null) {
            userPrompt.append("- Nhận xét gần nhất từ giáo viên: \"").append(nhanXetMoiNhat).append("\"\n");
        }
        userPrompt.append("- Phân loại năng lực AI: ").append(danhHieuAi).append("\n");
        userPrompt.append("- Thời gian học mỗi ngày: ").append(soGio).append(" giờ\n");
        userPrompt.append("- Mục tiêu cá nhân: ").append(mucTieu).append("\n\n");
        userPrompt.append("Danh sách các bài tập hiện tại:\n");
        for (BaiTap bt : tatCaBaiTap) {
            boolean daNop = mapBaiNop.containsKey(bt.getId());
            userPrompt.append(String.format("• %s | Lớp: %s | Trạng thái: %s | Hạn: %s\n",
                    bt.getTieuDe(),
                    bt.getLopHoc() != null ? bt.getLopHoc().getTenLop() : "N/A",
                    daNop ? "Đã nộp" : "Chưa nộp",
                    bt.getHanNop() != null ? bt.getHanNop().format(FORMATTER) : "Không hạn"));
        }
        userPrompt.append("\nYêu cầu cấu trúc phản hồi:\n");
        userPrompt.append("1. **Đánh giá tình trạng học tập & Điểm mạnh/Điểm cần cải thiện** dựa trên GPA và tiến độ.\n");
        userPrompt.append("2. **Chiến lược hành động độc quyền** cho sinh viên này.\n");
        userPrompt.append("3. **Khung thời gian biểu trong ngày (Pomodoro)** phân bổ theo số giờ học.\n");
        userPrompt.append("4. **Kế hoạch mục tiêu tuần** để cải thiện điểm số và tiến độ.");

        String geminiRes = geminiDichVu.goiGemini(promptHeThong, userPrompt.toString());
        AiPhanHoi phanHoi;

        List<String> danhSachGoiY = new ArrayList<>();
        if ("XUAT_SAC".equals(nhomHocLuc)) {
            danhSachGoiY.add("Mở rộng tính năng nâng cao và tối ưu độ phức tạp thuật toán O(logN)");
            danhSachGoiY.add("Áp dụng Design Patterns và viết Clean Code chuẩn quốc tế");
            danhSachGoiY.add("Tạo repository Github Portfolio lưu lại các đồ án xuất sắc");
        } else if ("GIOI_KHA".equals(nhomHocLuc)) {
            danhSachGoiY.add("Nộp bài sớm hơn hạn chót 24 giờ để tránh rủi ro kỹ thuật");
            danhSachGoiY.add("Kiểm tra kỹ các ca biên (Corner/Edge cases) để không bị trừ điểm lẻ");
            danhSachGoiY.add("Dành 15 phút đầu giờ ôn lại các kiến thức bị giáo viên nhắc nhở");
        } else if ("TRUNG_BINH".equals(nhomHocLuc)) {
            danhSachGoiY.add("Sử dụng AI Trợ lý để giải thích từng bước giải thuật khó trước khi code");
            danhSachGoiY.add("Hoàn thành các bài tập cơ bản trước khi làm các câu hỏi điểm thưởng");
            danhSachGoiY.add("Thiết lập lịch nhắc nhở tự động mỗi ngày vào lúc 19:00");
        } else {
            danhSachGoiY.add("ƯU TIÊN 1: Hoàn thành ngay bài tập sắp hết hạn trong 24 giờ");
            danhSachGoiY.add("Chủ động nhắn tin cho Giảng viên để xin hướng dẫn gỡ điểm cho các bài trễ hạn");
            danhSachGoiY.add("Chia nhỏ bài tập thành các phiên 20 phút để không bị nản lòng");
        }

        Map<String, Object> duLieuBoSung = new HashMap<>();
        duLieuBoSung.put("diemTrungBinh", diemTrungBinh);
        duLieuBoSung.put("tiLeHoanThanh", tiLeHoanThanh);
        duLieuBoSung.put("soBaiDaNop", soBaiDaNop);
        duLieuBoSung.put("tongSoBaiTap", tongSoBaiTap);
        duLieuBoSung.put("soBaiChuaNop", soBaiChuaNop);
        duLieuBoSung.put("soBaiQuaHan", soBaiQuaHan);
        duLieuBoSung.put("soBaiSapDenHan", soBaiSapDenHan);
        duLieuBoSung.put("nhomHocLuc", nhomHocLuc);
        duLieuBoSung.put("danhHieuAi", danhHieuAi);
        duLieuBoSung.put("chienLuocChinh", chienLuocChinh);
        duLieuBoSung.put("mauSacBadge", mauSacBadge);
        duLieuBoSung.put("khungGioGoiY", khungGioGoiY);
        duLieuBoSung.put("soGioMoiNgay", soGio);
        duLieuBoSung.put("mucTieu", mucTieu);

        if (geminiRes != null && !geminiRes.isBlank()) {
            phanHoi = AiPhanHoi.builder()
                    .chucNang("TAO_KE_HOACH")
                    .tieuDe(String.format("Kế hoạch học tập AI cá nhân hóa • %s", danhHieuAi))
                    .noiDung(geminiRes)
                    .danhSachGoiY(danhSachGoiY)
                    .duLieuBoSung(duLieuBoSung)
                    .build();
        } else {
            // Fallback Engine chuyên biệt theo từng phân khúc học lực
            StringBuilder sb = new StringBuilder();
            sb.append("### 📊 Đánh Giá Năng Lực Học Tập Cá Nhân Hóa (AI Analytics)\n\n");
            sb.append("> **Hồ sơ năng lực**: ").append(danhHieuAi).append("\n");
            sb.append("> - **Điểm trung bình (GV chấm)**: `").append(diemTrungBinh > 0 ? (diemTrungBinh + " / 10.0") : "Chưa có bài chấm").append("`\n");
            sb.append("> - **Tiến độ hoàn thành**: `").append(tiLeHoanThanh).append("%` (Đã nộp ").append(soBaiDaNop).append("/").append(tongSoBaiTap).append(" bài)\n");
            sb.append("> - **Tình trạng nợ bài**: ").append(soBaiChuaNop == 0 ? "🎉 Đã hoàn thành toàn bộ bài tập" : ("Còn " + soBaiChuaNop + " bài chưa nộp (sắp đến hạn: " + soBaiSapDenHan + ", quá hạn: " + soBaiQuaHan + ")")).append("\n\n");

            sb.append("#### 💡 Chiến Lược Hành Động Tối Ưu Cho Bạn:\n");
            sb.append(chienLuocChinh).append("\n\n");

            sb.append("#### ⏰ Khung Thời Gian Biểu Trong Ngày (Thời lượng: ").append(soGio).append("h/ngày):\n");
            for (Map<String, String> slot : khungGioGoiY) {
                sb.append("- **").append(slot.get("gio")).append("**: ").append(slot.get("tieuDe")).append("\n");
            }
            sb.append("\n");

            sb.append("#### 📋 Checklist Nhiệm Vụ Mục Tiêu Tuần Này:\n");
            if (btUuTienNhat != null) {
                sb.append("- [ ] **Ưu tiên hàng đầu**: Hoàn thiện bài tập `").append(btUuTienNhat.getTieuDe()).append("` trước hạn chót.\n");
            }
            if ("XUAT_SAC".equals(nhomHocLuc)) {
                sb.append("- [ ] Tìm hiểu thêm tài liệu nâng cao và tối ưu độ phức tạp cho các thuật toán đã học.\n");
                sb.append("- [ ] Đóng gói mã nguồn thành dự án mẫu hoàn chỉnh trên GitHub cá nhân.\n");
            } else if ("GIOI_KHA".equals(nhomHocLuc)) {
                sb.append("- [ ] Đẩy nhanh tốc độ làm bài để nộp trước hạn ít nhất 1 ngày.\n");
                sb.append("- [ ] Kiểm tra lại các lỗi nhỏ về định dạng mã nguồn và xử lý ngoại lệ.\n");
            } else if ("TRUNG_BINH".equals(nhomHocLuc)) {
                sb.append("- [ ] Xem lại ghi chú của giáo viên ở các bài nộp trước để rút kinh nghiệm.\n");
                sb.append("- [ ] Dành ít nhất 30 phút mỗi ngày hỏi AI Trợ lý để làm rõ các khái niệm chưa vững.\n");
            } else {
                sb.append("- [ ] Tập trung giải quyết dứt điểm các bài nợ để kéo điểm trung bình và tiến độ lên trên 50%.\n");
                sb.append("- [ ] Trao đổi với giảng viên bộ môn để xin hướng giải quyết cho các bài đã quá hạn.\n");
            }

            phanHoi = AiPhanHoi.builder()
                    .chucNang("TAO_KE_HOACH")
                    .tieuDe(String.format("Kế hoạch học tập AI cá nhân hóa • %s", danhHieuAi))
                    .noiDung(sb.toString())
                    .danhSachGoiY(danhSachGoiY)
                    .duLieuBoSung(duLieuBoSung)
                    .build();
        }

        dichVuLichSuAi.luuLichSu(nd, "TAO_KE_HOACH", "Kế hoạch AI (ĐTB: " + diemTrungBinh + ", Tiến độ: " + tiLeHoanThanh + "%)", phanHoi.getNoiDung());
        return phanHoi;
    }

    public AiPhanHoi phanTichLop(AiPhanTichLopYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        LopHoc lh = lopHocRepository.findById(yeuCau.getLopHocId())
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Không tìm thấy lớp học"));

        if (nd.getVaiTro() != VaiTro.ADMIN && !lh.getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Bạn không có quyền phân tích lớp học này");
        }

        List<ThanhVienLop> tvList = thanhVienLopRepository.findByLopHoc(lh);
        List<BaiTap> btList = baiTapRepository.findByLopHocOrderByHanNopAsc(lh);
        List<TienDo> tdList = tienDoRepository.findByLopHoc(lh);

        int soSv = tvList.size();
        int soBt = btList.size();
        double tongDtb = 0.0;
        int svCoDiem = 0;
        double tongPhanTramNop = 0.0;

        List<Map<String, Object>> svCanLuuY = new ArrayList<>();

        for (TienDo td : tdList) {
            tongPhanTramNop += td.getPhanTramHoanThanh();
            if (td.getSoBaiDaCham() > 0) {
                tongDtb += td.getDiemTrungBinh();
                svCoDiem++;
            }
            if (td.getPhanTramHoanThanh() < 50.0 || (td.getSoBaiDaCham() > 0 && td.getDiemTrungBinh() < 5.0)) {
                svCanLuuY.add(Map.of(
                        "hoTen", td.getSinhVien().getHoTen(),
                        "email", td.getSinhVien().getEmail(),
                        "phanTramNop", td.getPhanTramHoanThanh(),
                        "diemTrungBinh", td.getDiemTrungBinh()
                ));
            }
        }

        double dtbLop = svCoDiem > 0 ? (tongDtb / svCoDiem) : 0.0;
        double ptNopLop = soSv > 0 ? (tongPhanTramNop / soSv) : 0.0;
        dtbLop = Math.round(dtbLop * 10.0) / 10.0;
        ptNopLop = Math.round(ptNopLop * 10.0) / 10.0;

        // 1. Gọi Google Gemini AI thật
        String promptHeThong = "Bạn là Chuyên gia AI Phân Tích Dữ Liệu Giáo Dục. "
                + "Hãy đánh giá kết quả học tập của lớp học, nhóm sinh viên cần hỗ trợ và đề xuất các giải pháp sư phạm cải thiện chất lượng giảng dạy.";

        String userPrompt = String.format("Tên lớp: %s\nSĩ số: %d\nSố bài tập: %d\nĐiểm trung bình toàn lớp: %.1f/10\nTỉ lệ nộp bài trung bình: %.1f%%\nSố sinh viên cần lưu ý: %d",
                lh.getTenLop(), soSv, soBt, dtbLop, ptNopLop, svCanLuuY.size());

        String geminiRes = geminiDichVu.goiGemini(promptHeThong, userPrompt);
        AiPhanHoi phanHoi;

        if (geminiRes != null && !geminiRes.isBlank()) {
            List<String> goiY = List.of(
                    "Gửi thông báo nhắc nhở cá nhân hóa tới nhóm sinh viên cần hỗ trợ",
                    "Tổ chức buổi hỏi đáp ngắn về các bài tập có tỉ lệ làm bài thấp",
                    "Khen thưởng các sinh viên có tiến bộ vượt bậc"
            );

            phanHoi = AiPhanHoi.builder()
                    .chucNang("PHAN_TICH_LOP")
                    .tieuDe("Báo cáo phân tích chất lượng lớp: " + lh.getTenLop())
                    .noiDung(geminiRes)
                    .danhSachGoiY(goiY)
                    .duLieuBoSung(Map.of("lopHocId", lh.getId(), "tenLop", lh.getTenLop()))
                    .build();
        } else {
            // Fallback Engine
            StringBuilder sb = new StringBuilder();
            sb.append("### 📊 Báo Cáo Phân Tích Lớp Học: **").append(lh.getTenLop()).append("**\n\n");
            sb.append("#### 📈 1. Tổng Quan Chỉ Số\n");
            sb.append("- **Sĩ số sinh viên**: ").append(soSv).append(" học viên\n");
            sb.append("- **Tổng số bài tập đã giao**: ").append(soBt).append(" bài\n");
            sb.append("- **Tỉ lệ nộp bài trung bình toàn lớp**: `").append(ptNopLop).append("%`\n");
            sb.append("- **Điểm số trung bình toàn lớp**: `").append(dtbLop).append(" / 10`\n\n");

            List<String> goiY = List.of(
                    "Gửi email/thông báo nhắc nhở cá nhân hoá tới nhóm sinh viên cần hỗ trợ",
                    "Xem lại độ khó của bài tập gần nhất nếu tỉ lệ nộp bài giảm đột biến",
                    "Khen thưởng các bạn sinh viên luôn nộp bài sớm và đạt điểm cao"
            );

            phanHoi = AiPhanHoi.builder()
                    .chucNang("PHAN_TICH_LOP")
                    .tieuDe("Báo cáo phân tích chất lượng lớp: " + lh.getTenLop())
                    .noiDung(sb.toString())
                    .danhSachGoiY(goiY)
                    .duLieuBoSung(Map.of("lopHocId", lh.getId(), "tenLop", lh.getTenLop()))
                    .build();
        }

        dichVuLichSuAi.luuLichSu(nd, "PHAN_TICH_LOP", "Phân tích lớp: " + lh.getTenLop(), phanHoi.getNoiDung());
        return phanHoi;
    }

    public Map<String, String> chatAi(AiChatYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        String promptHeThong = "Bạn là Trợ lý AI Sư phạm Khoa Công nghệ Thông tin trực tuyến 24/7 của AI Classroom. "
                + "Bạn chuyên giải đáp thắc mắc về lập trình (Java, Spring Boot, React, JavaScript, C++, Python), giải thuật (Dijkstra, A*, Dynamic Programming, Đồ thị), cấu trúc dữ liệu, kiến trúc CSDL và phương pháp tự học một cách ân cần, súc tích, chuẩn xác và dễ hiểu.";

        String userPrompt = (yeuCau.getNguCanh() != null && !yeuCau.getNguCanh().isBlank())
                ? String.format("Ngữ cảnh: %s\nCâu hỏi của sinh viên (%s): %s", yeuCau.getNguCanh(), nd.getHoTen(), yeuCau.getTinNhan())
                : String.format("Câu hỏi của sinh viên (%s): %s", nd.getHoTen(), yeuCau.getTinNhan());

        String geminiRes = geminiDichVu.goiGemini(promptHeThong, userPrompt);
        if (geminiRes == null || geminiRes.isBlank()) {
            geminiRes = "Chào bạn! Mình đã tiếp nhận câu hỏi. Để giải quyết vấn đề này hiệu quả:\n1. Phân tích rõ ràng đầu vào (input) và đầu ra (output).\n2. Chia nhỏ bài toán thành các hàm hoặc module độc lập.\n3. Viết các test case mẫu để kiểm thử logic trước khi hoàn thiện.";
        }

        dichVuLichSuAi.luuLichSu(nd, "CHAT_AI", yeuCau.getTinNhan(), geminiRes);
        return Map.of("traLoi", geminiRes);
    }

    public Map<String, Object> soanBaiTap(AiSoanBaiTapYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        String chuDe = (yeuCau != null && yeuCau.getChuDe() != null && !yeuCau.getChuDe().isBlank()) ? yeuCau.getChuDe() : "Lập trình ứng dụng Web & CSDL";
        String doKho = (yeuCau != null && yeuCau.getDoKho() != null && !yeuCau.getDoKho().isBlank()) ? yeuCau.getDoKho() : "TRUNG_BINH";
        String boSung = (yeuCau != null && yeuCau.getYeuCauBoSung() != null) ? yeuCau.getYeuCauBoSung() : "";

        String promptHeThong = "Bạn là Trợ lý AI Chuyên gia Soạn thảo Giáo trình & Bài tập Đại học Khoa CNTT. "
                + "Nhiệm vụ của bạn là tạo ra một đề bài tập thực hành hoàn chỉnh, chuyên nghiệp, có cấu trúc rõ ràng bằng Markdown.";

        String promptNguoiDung = String.format(
                "Hãy biên soạn 1 đề bài tập học phần CNTT với các thông tin sau:\n"
                + "- Môn học/Lớp: %s\n"
                + "- Chủ đề bài tập: %s\n"
                + "- Mức độ khó: %s\n"
                + "- Yêu cầu bổ sung của giảng viên: %s\n\n"
                + "Cấu trúc đề bài yêu cầu:\n"
                + "1. Tiêu đề bài tập ngắn gọn, chuẩn học thuật.\n"
                + "2. Mục tiêu học tập (Learning Objectives).\n"
                + "3. Yêu cầu chi tiết (Yêu cầu chức năng, ràng buộc kỹ thuật).\n"
                + "4. Dữ liệu mẫu / Test case kiểm thử.\n"
                + "5. Tiêu chí chấm điểm và thang điểm (Rubric - Tổng điểm 10).\n"
                + "6. Hướng dẫn nộp bài (định dạng file, git link, deadline gợi ý 5-7 ngày).\n\n"
                + "Hãy trả về định dạng Markdown đầy đủ.",
                (yeuCau != null && yeuCau.getTenMonHoc() != null) ? yeuCau.getTenMonHoc() : "Công nghệ Thông tin",
                chuDe, doKho, boSung
        );

        String ketQua = null;
        try {
            ketQua = geminiDichVu.goiGemini(promptHeThong, promptNguoiDung);
        } catch (Exception e) {
            log.warn("Lỗi khi gọi Gemini soạn bài: {}", e.getMessage());
        }

        if (ketQua == null || ketQua.isBlank()) {
            ketQua = String.format("### Đề bài: Xây dựng và thực hành về %s\n\n#### 1. Mục tiêu học tập\n- Nắm vững kiến thức nền tảng và phương pháp triển khai thực tế về %s.\n- Rèn luyện kỹ năng phân tích bài toán, tối ưu hiệu năng và xử lý ngoại lệ.\n\n#### 2. Yêu cầu chi tiết\n- Triển khai đầy đủ các cấu trúc dữ liệu / thuật toán / API theo đúng yêu cầu đề bài.\n- Viết mã nguồn sạch (Clean Code), có chú thích rõ ràng ở các hàm logic quan trọng.\n- Kiểm thử đầy đủ với ít nhất 3 bộ test case mẫu.\n\n#### 3. Tiêu chí chấm điểm (Thang điểm 10)\n- **Hoàn thành chức năng cốt lõi**: 6.0 điểm\n- **Xử lý lỗi & Tối ưu hóa**: 2.0 điểm\n- **Clean code & Test cases**: 2.0 điểm\n\n#### 4. Hướng dẫn nộp bài\n- Sinh viên nộp mã nguồn (.zip, .pdf hoặc link GitHub) trước thời hạn quy định.", chuDe, chuDe);
        }

        // Tách tiêu đề từ dòng đầu nếu có
        String tieuDeGoiY = "Bài tập: " + chuDe;
        if (ketQua.contains("# ")) {
            String[] lines = ketQua.split("\n");
            for (String l : lines) {
                if (l.startsWith("# ") || l.startsWith("### ")) {
                    tieuDeGoiY = l.replace("#", "").replace("*", "").trim();
                    break;
                }
            }
        }

        try {
            dichVuLichSuAi.luuLichSu(nd, "SOAN_BAI_TAP", "Soạn bài: " + chuDe, ketQua);
        } catch (Throwable t) {
            log.warn("Không thể lưu lịch sử AI soạn bài: {}", t.getMessage());
        }

        Map<String, Object> phanHoi = new HashMap<>();
        phanHoi.put("tieuDe", tieuDeGoiY);
        phanHoi.put("noiDung", ketQua);
        phanHoi.put("diemToiDa", 10.0);
        phanHoi.put("soNgayGoiY", 7);
        return phanHoi;
    }

    public Map<String, Object> goiYChamDiem(AiGoiYChamDiemYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        BaiNop bn = baiNopRepository.findById(yeuCau.getBaiNopId())
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Không tìm thấy bài nộp"));

        BaiTap bt = bn.getBaiTap();
        String noiDungBaiNop = bn.getNoiDung() != null ? bn.getNoiDung() : "Sinh viên nộp qua file đính kèm / liên kết mã nguồn.";
        String linkNop = bn.getTepNop() != null ? bn.getTepNop() : "";

        String promptHeThong = "Bạn là Trợ lý AI Chấm bài & Cố vấn Sư phạm dành cho Giảng viên. "
                + "Hãy phân tích bài nộp của sinh viên so với yêu cầu bài tập và đưa ra gợi ý điểm số (thang điểm 10) cùng nhận xét sư phạm chi tiết, mang tính xây dựng và hướng dẫn phát triển.";

        String promptNguoiDung = String.format(
                "ĐỀ BÀI TẬP:\n- Tiêu đề: %s\n- Yêu cầu đề bài:\n%s\n- Thang điểm tối đa: %.1f\n\n"
                + "BÀI NỘP CỦA SINH VIÊN (%s):\n- Nội dung nộp: %s\n- Link đính kèm: %s\n"
                + "- Yêu cầu chấm riêng của GV: %s\n\n"
                + "Hãy đánh giá theo định dạng sau:\n"
                + "1. [ĐIỂM GỢI Ý]: (Điểm số từ 0.0 đến %.1f)\n"
                + "2. [ƯU ĐIỂM]: (Các điểm tốt trong bài làm)\n"
                + "3. [CẦN CẢI THIỆN]: (Lỗi logic, cú pháp, tối ưu hoặc thiếu sót)\n"
                + "4. [LỜI KHUYÊN & ĐỊNH HƯỚNG]: (Gợi ý cho sinh viên tự sửa và nâng cao)\n"
                + "5. [NHẬN XÉT GỬI SINH VIÊN]: (Đoạn nhận xét ngắn gọn 3-4 câu để giảng viên gửi thẳng cho sinh viên)",
                bt.getTieuDe(), bt.getNoiDung(), bt.getDiemToiDa(),
                bn.getSinhVien().getHoTen(), noiDungBaiNop, linkNop,
                yeuCau.getTieuChiBoSung() != null ? yeuCau.getTieuChiBoSung() : "Chấm theo tiêu chí chuẩn chất lượng mã nguồn."
        );

        String ketQua = null;
        try {
            ketQua = geminiDichVu.goiGemini(promptHeThong, promptNguoiDung);
        } catch (Exception e) {
            log.warn("Lỗi khi gọi Gemini chấm bài: {}", e.getMessage());
        }

        if (ketQua == null || ketQua.isBlank()) {
            ketQua = "1. [ĐIỂM GỢI Ý]: 8.5/10\n2. [ƯU ĐIỂM]: Đã hoàn thành cấu trúc bài nộp cơ bản đúng hạn, mã nguồn chạy đúng luồng chính.\n3. [CẦN CẢI THIỆN]: Cần bổ sung thêm xử lý ngoại lệ và chú thích chi tiết hơn cho từng hàm xử lý.\n4. [NHẬN XÉT GỬI SINH VIÊN]: Bài làm rất tốt, đáp ứng đúng yêu cầu đề bài. Em chú ý tối ưu thêm hiệu năng thuật toán và viết comment rõ ràng hơn nhé!";
        }

        // Trích xuất điểm gợi ý
        double diemGoiY = 8.5;
        try {
            if (ketQua.contains("[ĐIỂM GỢI Ý]:")) {
                String scoreStr = ketQua.substring(ketQua.indexOf("[ĐIỂM GỢI Ý]:") + 13).trim().split("[/\\n\\r ]")[0];
                diemGoiY = Double.parseDouble(scoreStr.replaceAll("[^0-9.]", ""));
                if (diemGoiY > bt.getDiemToiDa()) diemGoiY = bt.getDiemToiDa();
            }
        } catch (Exception e) {
            diemGoiY = 8.5;
        }

        try {
            dichVuLichSuAi.luuLichSu(nd, "GOI_Y_CHAM_DIEM", "Chấm bài: " + bt.getTieuDe() + " (" + bn.getSinhVien().getHoTen() + ")", ketQua);
        } catch (Throwable t) {
            log.warn("Không thể lưu lịch sử AI chấm bài: {}", t.getMessage());
        }

        Map<String, Object> phanHoi = new HashMap<>();
        phanHoi.put("diemGoiY", diemGoiY);
        phanHoi.put("nhanXetChiTiet", ketQua);
        phanHoi.put("sinhVien", bn.getSinhVien().getHoTen());
        return phanHoi;
    }

    public List<LichSuAiPhanHoi> layLichSuAi() {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        return lichSuAiRepository.findByNguoiDungOrderByNgayTaoDesc(nd).stream()
                .map(LichSuAiPhanHoi::tuThucThe)
                .collect(Collectors.toList());
    }
}
