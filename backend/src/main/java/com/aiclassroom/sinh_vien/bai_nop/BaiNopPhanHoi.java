package com.aiclassroom.sinh_vien.bai_nop;

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
public class BaiNopPhanHoi {
    private Long id;
    private Long baiTapId;
    private String tieuDeBaiTap;
    private Long lopHocId;
    private String tenLop;
    private NguoiDungPhanHoi sinhVien;
    private String noiDung;
    private String tepNop;
    private LocalDateTime ngayNop;
    private TrangThaiBaiNop trangThai;

    // Grading info if already graded
    private Double diemSo;
    private Double diemToiDa;
    private String nhanXet;
    private LocalDateTime ngayCham;

    public static BaiNopPhanHoi tuThucThe(BaiNop bn) {
        return BaiNopPhanHoi.builder()
                .id(bn.getId())
                .baiTapId(bn.getBaiTap().getId())
                .tieuDeBaiTap(bn.getBaiTap().getTieuDe())
                .lopHocId(bn.getBaiTap().getLopHoc().getId())
                .tenLop(bn.getBaiTap().getLopHoc().getTenLop())
                .sinhVien(NguoiDungPhanHoi.tuThucThe(bn.getSinhVien()))
                .noiDung(bn.getNoiDung())
                .tepNop(bn.getTepNop())
                .ngayNop(bn.getNgayNop())
                .trangThai(bn.getTrangThai())
                .diemToiDa(bn.getBaiTap().getDiemToiDa())
                .build();
    }
}
