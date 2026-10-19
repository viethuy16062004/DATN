package com.aiclassroom.dung_chung.bai_tap;

import com.aiclassroom.sinh_vien.bai_nop.TrangThaiBaiNop;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaiTapPhanHoi {
    private Long id;
    private Long lopHocId;
    private String tenLop;
    private String tieuDe;
    private String noiDung;
    private LocalDateTime hanNop;
    private Double diemToiDa;
    private String tepDinhKem;
    private LocalDateTime ngayTao;

    // Additional metadata for views
    private Boolean daNop;
    private TrangThaiBaiNop trangThaiBaiNop;
    private Double diemSo;
    private Long soLuongBaiNop;
    private Long soLuongDaCham;

    public static BaiTapPhanHoi tuThucThe(BaiTap bt) {
        return BaiTapPhanHoi.builder()
                .id(bt.getId())
                .lopHocId(bt.getLopHoc().getId())
                .tenLop(bt.getLopHoc().getTenLop())
                .tieuDe(bt.getTieuDe())
                .noiDung(bt.getNoiDung())
                .hanNop(bt.getHanNop())
                .diemToiDa(bt.getDiemToiDa())
                .tepDinhKem(bt.getTepDinhKem())
                .ngayTao(bt.getNgayTao())
                .build();
    }
}
