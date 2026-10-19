package com.aiclassroom.sinh_vien.bai_nop;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NopBaiYeuCau {

    @NotNull(message = "Bai tap ID khong duoc de trong")
    private Long baiTapId;

    private String noiDung;
    private String tepNop;
}
