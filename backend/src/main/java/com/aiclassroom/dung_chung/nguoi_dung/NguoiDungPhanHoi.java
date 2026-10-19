package com.aiclassroom.dung_chung.nguoi_dung;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NguoiDungPhanHoi {
    private Long id;
    private String email;
    private String hoTen;
    private VaiTro vaiTro;
    private String anhDaiDien;
    private String soDienThoai;
    private LocalDateTime ngayTao;

    public static NguoiDungPhanHoi tuThucThe(NguoiDung nd) {
        return NguoiDungPhanHoi.builder()
                .id(nd.getId())
                .email(nd.getEmail())
                .hoTen(nd.getHoTen())
                .vaiTro(nd.getVaiTro())
                .anhDaiDien(nd.getAnhDaiDien())
                .soDienThoai(nd.getSoDienThoai())
                .ngayTao(nd.getNgayTao())
                .build();
    }
}
