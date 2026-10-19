package com.aiclassroom.giang_vien.cham_diem;

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
public class ChamDiemPhanHoi {
    private Long id;
    private Long baiNopId;
    private Long baiTapId;
    private String tieuDeBaiTap;
    private NguoiDungPhanHoi giaoVien;
    private Double diemSo;
    private Double diemToiDa;
    private String nhanXet;
    private LocalDateTime ngayCham;

    public static ChamDiemPhanHoi tuThucThe(ChamDiem cd) {
        return ChamDiemPhanHoi.builder()
                .id(cd.getId())
                .baiNopId(cd.getBaiNop().getId())
                .baiTapId(cd.getBaiNop().getBaiTap().getId())
                .tieuDeBaiTap(cd.getBaiNop().getBaiTap().getTieuDe())
                .giaoVien(NguoiDungPhanHoi.tuThucThe(cd.getGiaoVien()))
                .diemSo(cd.getDiemSo())
                .diemToiDa(cd.getBaiNop().getBaiTap().getDiemToiDa())
                .nhanXet(cd.getNhanXet())
                .ngayCham(cd.getNgayCham())
                .build();
    }
}
