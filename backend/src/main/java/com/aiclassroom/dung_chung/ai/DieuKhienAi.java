package com.aiclassroom.dung_chung.ai;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class DieuKhienAi {

    private final DichVuAi dichVuAi;

    @PostMapping("/uu-tien-bai-tap")
    public ResponseEntity<AiPhanHoi> uuTienBaiTap(@RequestBody(required = false) AiUuTienYeuCau yeuCau) {
        if (yeuCau == null) {
            yeuCau = new AiUuTienYeuCau();
        }
        return ResponseEntity.ok(dichVuAi.uuTienBaiTap(yeuCau));
    }

    @PostMapping("/dinh-huong-bai-tap")
    public ResponseEntity<AiPhanHoi> dinhHuongBaiTap(@Valid @RequestBody AiDinhHuongYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuAi.dinhHuongBaiTap(yeuCau));
    }

    @GetMapping("/dinh-huong-hom-nay")
    public ResponseEntity<AiPhanHoi> layDinhHuongHomNay() {
        return ResponseEntity.ok(dichVuAi.layDinhHuongHomNay());
    }

    @PostMapping("/tao-ke-hoach")
    public ResponseEntity<AiPhanHoi> taoKeHoach(@RequestBody(required = false) AiKeHoachYeuCau yeuCau) {
        if (yeuCau == null) {
            yeuCau = new AiKeHoachYeuCau();
        }
        return ResponseEntity.ok(dichVuAi.taoKeHoach(yeuCau));
    }

    @PostMapping("/phan-tich-lop")
    public ResponseEntity<AiPhanHoi> phanTichLop(@Valid @RequestBody AiPhanTichLopYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuAi.phanTichLop(yeuCau));
    }

    @PostMapping("/chat")
    public ResponseEntity<java.util.Map<String, String>> chatAi(@Valid @RequestBody AiChatYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuAi.chatAi(yeuCau));
    }

    @PostMapping("/soan-bai-tap")
    public ResponseEntity<java.util.Map<String, Object>> soanBaiTap(@RequestBody(required = false) AiSoanBaiTapYeuCau yeuCau) {
        if (yeuCau == null) {
            yeuCau = new AiSoanBaiTapYeuCau();
        }
        return ResponseEntity.ok(dichVuAi.soanBaiTap(yeuCau));
    }

    @PostMapping("/goi-y-cham-diem")
    public ResponseEntity<java.util.Map<String, Object>> goiYChamDiem(@Valid @RequestBody AiGoiYChamDiemYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuAi.goiYChamDiem(yeuCau));
    }

    @GetMapping("/lich-su")
    public ResponseEntity<List<LichSuAiPhanHoi>> layLichSuAi() {
        return ResponseEntity.ok(dichVuAi.layLichSuAi());
    }
}
