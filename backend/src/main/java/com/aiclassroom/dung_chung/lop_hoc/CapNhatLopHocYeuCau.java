package com.aiclassroom.dung_chung.lop_hoc;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapNhatLopHocYeuCau {
    @NotBlank(message = "Ten lop khong duoc de trong")
    private String tenLop;
    private String moTa;
    private String anhBia;
}
