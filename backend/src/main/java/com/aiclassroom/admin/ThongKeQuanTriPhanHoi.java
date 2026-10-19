package com.aiclassroom.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeQuanTriPhanHoi {
    private long tongNguoiDung;
    private long tongSinhVien;
    private long tongGiaoVien;
    private long tongAdmin;
    private long tongLopHoc;
    private long tongBaiTap;
    private long tongBaiNop;
    private long tongYeuCauAi;
}
