package com.aiclassroom.admin;

import com.aiclassroom.dung_chung.lop_hoc.LopHocPhanHoi;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungPhanHoi;
import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quan-tri")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DieuKhienQuanTri {

    private final DichVuQuanTri dichVuQuanTri;

    @GetMapping("/thong-ke")
    public ResponseEntity<ThongKeQuanTriPhanHoi> layThongKeHeThong() {
        return ResponseEntity.ok(dichVuQuanTri.layThongKeHeThong());
    }

    @GetMapping("/nguoi-dung")
    public ResponseEntity<List<NguoiDungPhanHoi>> layDanhSachNguoiDung(@RequestParam(required = false) VaiTro vaiTro) {
        return ResponseEntity.ok(dichVuQuanTri.layDanhSachNguoiDung(vaiTro));
    }

    @PostMapping("/nguoi-dung")
    public ResponseEntity<NguoiDungPhanHoi> taoNguoiDung(@Valid @RequestBody TaoNguoiDungYeuCau yeuCau) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dichVuQuanTri.taoNguoiDung(yeuCau));
    }

    @PutMapping("/nguoi-dung/{id}/vai-tro")
    public ResponseEntity<NguoiDungPhanHoi> doiVaiTro(@PathVariable Long id, @Valid @RequestBody DoiVaiTroYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuQuanTri.doiVaiTro(id, yeuCau));
    }

    @PutMapping("/nguoi-dung/{id}/dat-lai-mat-khau")
    public ResponseEntity<Void> datLaiMatKhau(@PathVariable Long id, @Valid @RequestBody DatLaiMatKhauYeuCau yeuCau) {
        dichVuQuanTri.datLaiMatKhau(id, yeuCau);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/nguoi-dung/{id}")
    public ResponseEntity<Void> xoaNguoiDung(@PathVariable Long id) {
        dichVuQuanTri.xoaNguoiDung(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lop-hoc")
    public ResponseEntity<List<LopHocPhanHoi>> layDanhSachTatCaLopHoc() {
        return ResponseEntity.ok(dichVuQuanTri.layDanhSachTatCaLopHoc());
    }

    @DeleteMapping("/lop-hoc/{id}")
    public ResponseEntity<Void> xoaLopHoc(@PathVariable Long id) {
        dichVuQuanTri.xoaLopHoc(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lich-su-ai")
    public ResponseEntity<List<LichSuAiPhanHoi>> layLichSuAiToanHeThong() {
        return ResponseEntity.ok(dichVuQuanTri.layLichSuAiToanHeThong());
    }
}
