package com.aiclassroom.dung_chung.ai;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiPhanTichLopYeuCau {
    @NotNull(message = "Lop hoc ID khong duoc de trong")
    private Long lopHocId;
}
