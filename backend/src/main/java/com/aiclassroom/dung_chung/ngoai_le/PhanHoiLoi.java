package com.aiclassroom.dung_chung.ngoai_le;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhanHoiLoi {
    private LocalDateTime thoiGian;
    private int maTrangThai;
    private String loi;
    private String thongDiep;
    private String duongDan;
}
