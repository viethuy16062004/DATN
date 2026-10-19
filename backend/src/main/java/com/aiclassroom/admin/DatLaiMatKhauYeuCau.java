package com.aiclassroom.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatLaiMatKhauYeuCau {

    @NotBlank(message = "Mat khau moi khong duoc de trong")
    @Size(min = 6, message = "Mat khau phai tu 6 ky tu tro len")
    private String matKhauMoi;
}
