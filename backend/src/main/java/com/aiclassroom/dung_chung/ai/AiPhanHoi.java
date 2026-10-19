package com.aiclassroom.dung_chung.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiPhanHoi {
    private String chucNang;
    private String tieuDe;
    private String noiDung;
    private List<String> danhSachGoiY;
    private Map<String, Object> duLieuBoSung;
}
