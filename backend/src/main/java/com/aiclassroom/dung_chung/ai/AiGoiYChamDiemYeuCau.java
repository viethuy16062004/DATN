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
public class AiGoiYChamDiemYeuCau {
    @NotNull(message = "ID bài nộp không được để trống")
    private Long baiNopId;

    private String tieuChiBoSung;
}
