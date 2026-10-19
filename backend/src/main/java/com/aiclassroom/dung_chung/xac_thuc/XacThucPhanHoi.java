package com.aiclassroom.dung_chung.xac_thuc;

import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class XacThucPhanHoi {
    private String token;
    @Builder.Default
    private String loaiToken = "Bearer";
    private Long id;
    private String email;
    private String hoTen;
    private VaiTro vaiTro;
    private String anhDaiDien;
    private String soDienThoai;
}
