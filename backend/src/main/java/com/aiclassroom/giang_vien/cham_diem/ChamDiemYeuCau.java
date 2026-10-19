package com.aiclassroom.giang_vien.cham_diem;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChamDiemYeuCau {

    @NotNull(message = "Bai nop ID khong duoc de trong")
    private Long baiNopId;

    @NotNull(message = "Diem so khong duoc de trong")
    @Min(value = 0, message = "Diem so khong duoc nho hon 0")
    private Double diemSo;

    private String nhanXet;
}
