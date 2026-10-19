package com.aiclassroom.giang_vien.quan_ly_sinh_vien;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungPhanHoi;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SinhVienGiaoVienPhanHoi {
    private Long id;
    private NguoiDungPhanHoi sinhVien;
    private String ghiChu;
    private LocalDateTime ngayTao;
    private long soLopDangHoc;

    public static SinhVienGiaoVienPhanHoi tuThucThe(SinhVienGiaoVien svgv, long soLopDangHoc) {
        return SinhVienGiaoVienPhanHoi.builder()
                .id(svgv.getId())
                .sinhVien(NguoiDungPhanHoi.tuThucThe(svgv.getSinhVien()))
                .ghiChu(svgv.getGhiChu())
                .ngayTao(svgv.getNgayTao())
                .soLopDangHoc(soLopDangHoc)
                .build();
    }
}
