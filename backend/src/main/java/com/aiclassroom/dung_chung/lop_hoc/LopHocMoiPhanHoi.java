package com.aiclassroom.dung_chung.lop_hoc;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LopHocMoiPhanHoi {
    private Long id;
    private String tenLop;
    private String moTa;
    private String maLop;
    private String anhBia;
    private String tenGiaoVien;
    private String emailGiaoVien;
    private long soSinhVien;
    private long soBaiTap;
    private boolean daThamGia;
    private boolean thuocDanhSachQuanLy;
}
