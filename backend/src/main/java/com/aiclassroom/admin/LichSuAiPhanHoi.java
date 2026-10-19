package com.aiclassroom.admin;

import com.aiclassroom.dung_chung.ai.LichSuAi;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungPhanHoi;
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
    private NguoiDungPhanHoi nguoiDung;
    private String chucNang;
    private String cauHoiDauVao;
    private String ketQuaAi;
    private LocalDateTime ngayTao;

    public static LichSuAiPhanHoi tuThucThe(LichSuAi ls) {
        if (ls == null) return null;
        return LichSuAiPhanHoi.builder()
                .id(ls.getId())
                .nguoiDung(ls.getNguoiDung() != null ? NguoiDungPhanHoi.tuThucThe(ls.getNguoiDung()) : null)
                .chucNang(ls.getChucNang())
                .cauHoiDauVao(ls.getCauHoiDauVao())
                .ketQuaAi(ls.getKetQuaAi())
                .ngayTao(ls.getNgayTao())
                .build();
    }
}
