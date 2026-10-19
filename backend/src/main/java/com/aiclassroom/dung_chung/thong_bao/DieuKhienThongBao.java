package com.aiclassroom.dung_chung.thong_bao;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/thong-bao")
@RequiredArgsConstructor
public class DieuKhienThongBao {

    private final DichVuThongBao dichVuThongBao;

    @GetMapping
    public ResponseEntity<List<ThongBaoPhanHoi>> layDanhSachThongBao() {
        return ResponseEntity.ok(dichVuThongBao.layDanhSachThongBao());
    }

    @GetMapping("/chua-doc/so-luong")
    public ResponseEntity<Map<String, Long>> demChuaDoc() {
        return ResponseEntity.ok(Map.of("soLuong", dichVuThongBao.demThongBaoChuaDoc()));
    }

    @PutMapping("/{id}/da-doc")
    public ResponseEntity<Void> danhDauDaDoc(@PathVariable Long id) {
        dichVuThongBao.danhDauDaDoc(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/doc-tat-ca")
    public ResponseEntity<Void> danhDauDocTatCa() {
        dichVuThongBao.danhDauDocTatCa();
        return ResponseEntity.ok().build();
    }
}
