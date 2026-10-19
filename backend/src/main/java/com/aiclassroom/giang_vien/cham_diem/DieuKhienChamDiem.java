package com.aiclassroom.giang_vien.cham_diem;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cham-diem")
@RequiredArgsConstructor
public class DieuKhienChamDiem {

    private final DichVuChamDiem dichVuChamDiem;

    @PostMapping
    public ResponseEntity<ChamDiemPhanHoi> chamDiem(@Valid @RequestBody ChamDiemYeuCau yeuCau) {
        return new ResponseEntity<>(dichVuChamDiem.chamDiem(yeuCau), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChamDiemPhanHoi> capNhatChamDiem(@PathVariable Long id, @Valid @RequestBody ChamDiemYeuCau yeuCau) {
        return ResponseEntity.ok(dichVuChamDiem.capNhatChamDiem(id, yeuCau));
    }

    @GetMapping("/bai-nop/{baiNopId}")
    public ResponseEntity<ChamDiemPhanHoi> layTheoBaiNop(@PathVariable Long baiNopId) {
        return ResponseEntity.ok(dichVuChamDiem.layTheoBaiNop(baiNopId));
    }
}
