package com.aiclassroom.dung_chung.lop_hoc;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungPhanHoi;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LopHocPhanHoi {
    private Long id;
    private String tenLop;
    private String moTa;
    private String maLop;
    private String anhBia;
    private NguoiDungPhanHoi giaoVien;
    private long soLuongSinhVien;
    private long soLuongBaiTap;
    private LocalDateTime ngayTao;

    public static LopHocPhanHoi tuThucThe(LopHoc lh, long soLuongSinhVien, long soLuongBaiTap) {
        return LopHocPhanHoi.builder()
                .id(lh.getId())
                .tenLop(lh.getTenLop())
                .moTa(lh.getMoTa())
                .maLop(lh.getMaLop())
                .anhBia(lh.getAnhBia())
                .giaoVien(NguoiDungPhanHoi.tuThucThe(lh.getGiaoVien()))
                .soLuongSinhVien(soLuongSinhVien)
                .soLuongBaiTap(soLuongBaiTap)
                .ngayTao(lh.getNgayTao())
                .build();
    }
}
