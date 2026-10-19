package com.aiclassroom.giang_vien.quan_ly_sinh_vien;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThemSinhVienQuanLyYeuCau {

    @NotBlank(message = "Email hoặc mã sinh viên không được để trống")
    private String email;

    private String ghiChu;
}
