package com.aiclassroom.dung_chung.lop_hoc;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lop-hoc")
@RequiredArgsConstructor
public class DieuKhienLopHoc {

    private final DichVuLopHoc dichVuLopHoc;

    @GetMapping
    public ResponseEntity<List<LopHocPhanHoi>> layDanhSachLopHoc() {
        return ResponseEntity.ok(dichVuLopHoc.layDanhSachLopHoc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LopHocPhanHoi> layChiTietLopHoc(@PathVariable Long id) {
        return ResponseEntity.ok(dichVuLopHoc.layChiTietLopHoc(id));
    }

    @PostMapping
    public ResponseEntity<LopHocPhanHoi> taoLopHoc(@Valid @RequestBody TaoLopHocYeuCau yeuCau) {
        return new ResponseEntity<>(dichVuLopHoc.taoLopHoc(yeuCau), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LopHocPhanHoi> capNhatLopHoc(@PathVariable Long id, @Valid @RequestBody CapNhatLopHocYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuLopHoc.capNhatLopHoc(id, yeuCau));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> xoaLopHoc(@PathVariable Long id) {
        dichVuLopHoc.xoaLopHoc(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/tham-gia")
    public ResponseEntity<LopHocPhanHoi> thamGiaLopHoc(@Valid @RequestBody ThamGiaLopYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuLopHoc.thamGiaLopHoc(yeuCau));
    }

    @GetMapping("/thong-tin-ma/{maLop}")
    public ResponseEntity<LopHocMoiPhanHoi> layThongTinLopTheoMa(@PathVariable String maLop) {
        return ResponseEntity.ok(dichVuLopHoc.layThongTinLopTheoMa(maLop));
    }

    @GetMapping("/{id}/thanh-vien")
    public ResponseEntity<List<ThanhVienLopPhanHoi>> layDanhSachThanhVien(@PathVariable Long id) {
        return ResponseEntity.ok(dichVuLopHoc.layDanhSachThanhVien(id));
    }

    @DeleteMapping("/{id}/thanh-vien/{sinhVienId}")
    public ResponseEntity<Void> xoaThanhVien(@PathVariable Long id, @PathVariable Long sinhVienId) {
        dichVuLopHoc.xoaThanhVien(id, sinhVienId);
        return ResponseEntity.noContent().build();
    }
}
