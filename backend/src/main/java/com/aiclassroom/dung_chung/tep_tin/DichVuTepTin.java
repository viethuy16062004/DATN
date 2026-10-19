package com.aiclassroom.dung_chung.tep_tin;

import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongHopLe;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongTimThay;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class DichVuTepTin {

    @Value("${app.upload.dir:uploads}")
    private String thuMucTaiLen;

    private Path duongDanLuuTru;

    @PostConstruct
    public void khoiTao() {
        try {
            this.duongDanLuuTru = Paths.get(thuMucTaiLen).toAbsolutePath().normalize();
            Files.createDirectories(this.duongDanLuuTru);
            log.info("Thu muc luu tru tep tin tai len: {}", this.duongDanLuuTru);
        } catch (IOException e) {
            log.error("Khong the tao thu muc luu tru tep tin: {}", e.getMessage());
            throw new RuntimeException("Khong the khoi tao thu muc luu tru tep", e);
        }
    }

    public TepTinPhanHoi luuTep(MultipartFile tep) {
        if (tep == null || tep.isEmpty()) {
            throw new NgoaiLeKhongHopLe("Tệp tin tải lên không được để trống");
        }

        String tenTepGoc = StringUtils.cleanPath(tep.getOriginalFilename() != null ? tep.getOriginalFilename() : "tep_tin");
        
        // Tránh path traversal
        if (tenTepGoc.contains("..")) {
            throw new NgoaiLeKhongHopLe("Tên tệp không hợp lệ: " + tenTepGoc);
        }

        // Lấy phần mở rộng
        String phanMoRong = "";
        int dotIdx = tenTepGoc.lastIndexOf('.');
        if (dotIdx > 0) {
            phanMoRong = tenTepGoc.substring(dotIdx);
        }

        // Tạo tên tệp duy nhất
        String tenTepLuu = UUID.randomUUID().toString() + phanMoRong;
        Path dichDen = this.duongDanLuuTru.resolve(tenTepLuu);

        try {
            Files.copy(tep.getInputStream(), dichDen, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("Lỗi khi ghi tệp: {}", e.getMessage());
            throw new RuntimeException("Không thể lưu trữ tệp tin", e);
        }

        String url = "/api/tep-tin/xem/" + tenTepLuu;

        return TepTinPhanHoi.builder()
                .url(url)
                .tenTepGoc(tenTepGoc)
                .tenTepLuu(tenTepLuu)
                .kichThuoc(tep.getSize())
                .dinhDang(tep.getContentType())
                .build();
    }

    public Resource docTep(String tenTep) {
        try {
            Path duongDanTep = this.duongDanLuuTru.resolve(tenTep).normalize();
            Resource resource = new UrlResource(duongDanTep.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new NgoaiLeKhongTimThay("Không tìm thấy tệp tin: " + tenTep);
            }
        } catch (MalformedURLException e) {
            throw new NgoaiLeKhongTimThay("Đường dẫn tệp tin không hợp lệ: " + tenTep);
        }
    }

    public MediaType layMediaTypeTheoTenTep(String tenTep) {
        String tenTepLower = tenTep.toLowerCase();
        if (tenTepLower.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (tenTepLower.endsWith(".jpg") || tenTepLower.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        if (tenTepLower.endsWith(".gif")) return MediaType.IMAGE_GIF;
        if (tenTepLower.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        if (tenTepLower.endsWith(".svg")) return MediaType.parseMediaType("image/svg+xml");
        if (tenTepLower.endsWith(".pdf")) return MediaType.APPLICATION_PDF;
        if (tenTepLower.endsWith(".txt")) return MediaType.TEXT_PLAIN;
        if (tenTepLower.endsWith(".json")) return MediaType.APPLICATION_JSON;
        return MediaType.APPLICATION_OCTET_STREAM;
    }
}
