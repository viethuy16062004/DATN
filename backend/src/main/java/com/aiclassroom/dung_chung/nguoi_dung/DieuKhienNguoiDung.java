package com.aiclassroom.dung_chung.nguoi_dung;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nguoi-dung")
@RequiredArgsConstructor
public class DieuKhienNguoiDung {

    private final DichVuNguoiDung dichVuNguoiDung;

    @GetMapping("/me")
    public ResponseEntity<NguoiDungPhanHoi> layThongTinCaNhan() {
        return ResponseEntity.ok(dichVuNguoiDung.layThongTinCaNhan());
    }

    @PutMapping("/me")
    public ResponseEntity<NguoiDungPhanHoi> capNhatThongTinCaNhan(@Valid @RequestBody CapNhatNguoiDungYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuNguoiDung.capNhatThongTinCaNhan(yeuCau));
    }
}
