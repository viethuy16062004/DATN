package com.aiclassroom.giang_vien.quan_ly_sinh_vien;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungPhanHoi;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/giao-vien/sinh-vien-quan-ly")
@RequiredArgsConstructor
public class DieuKhienSinhVienGiaoVien {

    private final DichVuSinhVienGiaoVien dichVuSinhVienGiaoVien;

    @GetMapping
    public ResponseEntity<List<SinhVienGiaoVienPhanHoi>> layDanhSachSinhVienQuanLy() {
        return ResponseEntity.ok(dichVuSinhVienGiaoVien.layDanhSachSinhVienQuanLy());
    }

    @PostMapping
    public ResponseEntity<SinhVienGiaoVienPhanHoi> themSinhVien(@Valid @RequestBody ThemSinhVienQuanLyYeuCau yeuCau) {
        return new ResponseEntity<>(dichVuSinhVienGiaoVien.themSinhVien(yeuCau), HttpStatus.CREATED);
    }

    @PostMapping("/hang-loat")
    public ResponseEntity<KetQuaThemHangLoatPhanHoi> themHangLoatSinhVien(@Valid @RequestBody ThemHangLoatSinhVienYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuSinhVienGiaoVien.themHangLoatSinhVien(yeuCau));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> xoaSinhVien(@PathVariable Long id) {
        dichVuSinhVienGiaoVien.xoaSinhVien(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tim-kiem-he-thong")
    public ResponseEntity<List<NguoiDungPhanHoi>> timKiemSinhVienHeThong(@RequestParam(required = false, defaultValue = "") String q) {
        return ResponseEntity.ok(dichVuSinhVienGiaoVien.timKiemSinhVien(q));
    }
}
