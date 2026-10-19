package com.aiclassroom.dung_chung.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiKeHoachYeuCau {
    private Integer soGioMoiNgay;
    private String mucTieu;
}
