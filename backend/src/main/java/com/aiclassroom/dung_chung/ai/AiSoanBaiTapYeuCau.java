package com.aiclassroom.dung_chung.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiSoanBaiTapYeuCau {
    private String chuDe;
    private String doKho; // CO_BAN, TRUNG_BINH, NANG_CAO
    private String yeuCauBoSung;
    private String tenMonHoc;
}
