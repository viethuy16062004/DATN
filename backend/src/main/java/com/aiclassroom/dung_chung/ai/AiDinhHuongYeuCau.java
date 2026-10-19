package com.aiclassroom.dung_chung.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiDinhHuongYeuCau {
    private Long baiTapId;
    private String cauHoiThem;
    private String tieuDe;
    private String noiDung;
    private String tenLop;
}
