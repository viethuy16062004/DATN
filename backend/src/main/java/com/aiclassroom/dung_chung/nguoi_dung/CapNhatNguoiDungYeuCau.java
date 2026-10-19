package com.aiclassroom.dung_chung.nguoi_dung;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapNhatNguoiDungYeuCau {
    @NotBlank(message = "Ho ten khong duoc de trong")
    private String hoTen;
    private String soDienThoai;
    private String anhDaiDien;
}
