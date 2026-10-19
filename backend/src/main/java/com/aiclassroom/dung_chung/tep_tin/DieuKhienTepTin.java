package com.aiclassroom.dung_chung.tep_tin;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/tep-tin")
@RequiredArgsConstructor
public class DieuKhienTepTin {

    private final DichVuTepTin dichVuTepTin;

    @PostMapping(value = "/tai-len", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TepTinPhanHoi> taiLenTep(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(dichVuTepTin.luuTep(file));
    }

    @GetMapping("/xem/{tenTep}")
    public ResponseEntity<Resource> xemTep(@PathVariable String tenTep) {
        Resource resource = dichVuTepTin.docTep(tenTep);
        MediaType mediaType = dichVuTepTin.layMediaTypeTheoTenTep(tenTep);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/tai-ve/{tenTep}")
    public ResponseEntity<Resource> taiVeTep(@PathVariable String tenTep) {
        Resource resource = dichVuTepTin.docTep(tenTep);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
