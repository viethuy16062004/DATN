package com.aiclassroom.dung_chung.tien_do;

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
public class TienDoPhanHoi {
    private Long id;
    private NguoiDungPhanHoi sinhVien;
    private Long lopHocId;
    private String tenLop;
    private Integer tongBaiTap;
    private Integer soBaiDaNop;
    private Integer soBaiDaCham;
    private Double diemTrungBinh;
    private Double phanTramHoanThanh;
    private LocalDateTime ngayCapNhat;

    public static TienDoPhanHoi tuThucThe(TienDo td) {
        return TienDoPhanHoi.builder()
                .id(td.getId())
                .sinhVien(NguoiDungPhanHoi.tuThucThe(td.getSinhVien()))
                .lopHocId(td.getLopHoc().getId())
                .tenLop(td.getLopHoc().getTenLop())
                .tongBaiTap(td.getTongBaiTap())
                .soBaiDaNop(td.getSoBaiDaNop())
                .soBaiDaCham(td.getSoBaiDaCham())
                .diemTrungBinh(td.getDiemTrungBinh())
                .phanTramHoanThanh(td.getPhanTramHoanThanh())
                .ngayCapNhat(td.getNgayCapNhat())
                .build();
    }
}
