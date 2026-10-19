package com.aiclassroom.giang_vien.quan_ly_sinh_vien;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThemHangLoatSinhVienYeuCau {

    @NotEmpty(message = "Danh sách sinh viên không được để trống")
    @Valid
    private List<MucSinhVienNhap> danhSachSinhVien;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MucSinhVienNhap {
        private String email;
        private String hoTen;
        private String ghiChu;
    }
}
