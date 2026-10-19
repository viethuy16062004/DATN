package com.aiclassroom.dung_chung.xac_thuc;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/xac-thuc")
@RequiredArgsConstructor
public class DieuKhienXacThuc {

    private final DichVuXacThuc dichVuXacThuc;

    @PostMapping("/dang-ky")
    public ResponseEntity<XacThucPhanHoi> dangKy(@Valid @RequestBody DangKyYeuCau yeuCau) {
        return new ResponseEntity<>(dichVuXacThuc.dangKy(yeuCau), HttpStatus.CREATED);
    }

    @PostMapping("/dang-nhap")
    public ResponseEntity<XacThucPhanHoi> dangNhap(@Valid @RequestBody DangNhapYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuXacThuc.dangNhap(yeuCau));
    }
}
