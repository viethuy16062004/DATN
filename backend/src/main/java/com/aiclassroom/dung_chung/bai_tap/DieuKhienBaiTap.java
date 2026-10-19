package com.aiclassroom.dung_chung.bai_tap;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bai-tap")
@RequiredArgsConstructor
public class DieuKhienBaiTap {

    private final DichVuBaiTap dichVuBaiTap;

    @GetMapping
    public ResponseEntity<List<BaiTapPhanHoi>> layDanhSachBaiTap(@RequestParam(required = false) Long lopHocId) {
        return ResponseEntity.ok(dichVuBaiTap.layDanhSachBaiTap(lopHocId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaiTapPhanHoi> layChiTietBaiTap(@PathVariable Long id) {
        return ResponseEntity.ok(dichVuBaiTap.layChiTietBaiTap(id));
    }

    @PostMapping
    public ResponseEntity<BaiTapPhanHoi> taoBaiTap(@Valid @RequestBody TaoBaiTapYeuCau yeuCau) {
        return new ResponseEntity<>(dichVuBaiTap.taoBaiTap(yeuCau), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaiTapPhanHoi> capNhatBaiTap(@PathVariable Long id, @Valid @RequestBody CapNhatBaiTapYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuBaiTap.capNhatBaiTap(id, yeuCau));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> xoaBaiTap(@PathVariable Long id) {
        dichVuBaiTap.xoaBaiTap(id);
        return ResponseEntity.noContent().build();
    }
}
