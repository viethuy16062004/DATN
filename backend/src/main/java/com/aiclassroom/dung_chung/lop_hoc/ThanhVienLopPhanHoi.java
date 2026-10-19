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
public class ThanhVienLopPhanHoi {
    private Long id;
    private Long lopHocId;
    private NguoiDungPhanHoi sinhVien;
    private LocalDateTime ngayThamGia;

    public static ThanhVienLopPhanHoi tuThucThe(ThanhVienLop tv) {
        return ThanhVienLopPhanHoi.builder()
                .id(tv.getId())
                .lopHocId(tv.getLopHoc().getId())
                .sinhVien(NguoiDungPhanHoi.tuThucThe(tv.getSinhVien()))
                .ngayThamGia(tv.getNgayThamGia())
                .build();
    }
}
