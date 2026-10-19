package com.aiclassroom.sinh_vien.bai_nop;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bai-nop")
@RequiredArgsConstructor
public class DieuKhienBaiNop {

    private final DichVuBaiNop dichVuBaiNop;

    @GetMapping
    public ResponseEntity<List<BaiNopPhanHoi>> layDanhSachBaiNop(@RequestParam(required = false) Long baiTapId) {
        return ResponseEntity.ok(dichVuBaiNop.layDanhSachBaiNop(baiTapId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaiNopPhanHoi> layChiTietBaiNop(@PathVariable Long id) {
        return ResponseEntity.ok(dichVuBaiNop.layChiTietBaiNop(id));
    }

    @GetMapping("/bai-tap/{baiTapId}/cua-toi")
    public ResponseEntity<BaiNopPhanHoi> layBaiNopCuaToi(@PathVariable Long baiTapId) {
        BaiNopPhanHoi res = dichVuBaiNop.layBaiNopCuaToiTheoBaiTap(baiTapId);
        return ResponseEntity.ok(res);
    }

    @PostMapping
    public ResponseEntity<BaiNopPhanHoi> nopBai(@Valid @RequestBody NopBaiYeuCau yeuCau) {
        return new ResponseEntity<>(dichVuBaiNop.nopBai(yeuCau), HttpStatus.CREATED);
    }
}
