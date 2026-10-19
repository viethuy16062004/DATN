package com.aiclassroom.dung_chung.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LichSuAiPhanHoi {
    private Long id;
    private String chucNang;
    private String cauHoiDauVao;
    private String ketQuaAi;
    private LocalDateTime ngayTao;

    public static LichSuAiPhanHoi tuThucThe(LichSuAi ls) {
        return LichSuAiPhanHoi.builder()
                .id(ls.getId())
                .chucNang(ls.getChucNang())
                .cauHoiDauVao(ls.getCauHoiDauVao())
                .ketQuaAi(ls.getKetQuaAi())
                .ngayTao(ls.getNgayTao())
                .build();
    }
}
