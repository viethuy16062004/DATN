package com.aiclassroom.dung_chung.xac_thuc;

import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DangKyYeuCau {

    @NotBlank(message = "Email khong duoc de trong")
    @Email(message = "Email khong dung dinh dang")
    private String email;

    @NotBlank(message = "Mat khau khong duoc de trong")
    @Size(min = 6, message = "Mat khau phai co it nhat 6 ky tu")
    private String matKhau;

    @NotBlank(message = "Ho ten khong duoc de trong")
    private String hoTen;

    @NotNull(message = "Vai tro khong duoc de trong")
    private VaiTro vaiTro;

    private String soDienThoai;
}
