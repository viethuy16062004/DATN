package com.aiclassroom.dung_chung.tep_tin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TepTinPhanHoi {
    private String url;
    private String tenTepGoc;
    private String tenTepLuu;
    private Long kichThuoc;
    private String dinhDang;
}
