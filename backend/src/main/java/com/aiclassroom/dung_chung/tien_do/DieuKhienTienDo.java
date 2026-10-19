package com.aiclassroom.dung_chung.tien_do;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tien-do")
@RequiredArgsConstructor
public class DieuKhienTienDo {

    private final DichVuTienDo dichVuTienDo;

    @GetMapping
    public ResponseEntity<TienDoTongQuanPhanHoi> layTongQuanTienDo() {
        return ResponseEntity.ok(dichVuTienDo.layTongQuanTienDo());
    }

    @GetMapping("/danh-sach")
    public ResponseEntity<List<TienDoPhanHoi>> layTatCaTienDo() {
        return ResponseEntity.ok(dichVuTienDo.layTatCaTienDo());
    }

    @GetMapping("/lop/{lopHocId}")
    public ResponseEntity<List<TienDoPhanHoi>> layTienDoTheoLop(@PathVariable Long lopHocId) {
        return ResponseEntity.ok(dichVuTienDo.layTienDoTheoLop(lopHocId));
    }
}
