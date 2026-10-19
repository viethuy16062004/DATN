package com.aiclassroom.dung_chung.thong_bao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThongBaoPhanHoi {
    private Long id;
    private String tieuDe;
    private String noiDung;
    private Boolean daDoc;
    private String loaiThongBao;
    private String lienKet;
    private LocalDateTime ngayTao;

    public static ThongBaoPhanHoi tuThucThe(ThongBao tb) {
        return ThongBaoPhanHoi.builder()
                .id(tb.getId())
                .tieuDe(tb.getTieuDe())
                .noiDung(tb.getNoiDung())
                .daDoc(tb.getDaDoc())
                .loaiThongBao(tb.getLoaiThongBao())
                .lienKet(tb.getLienKet())
                .ngayTao(tb.getNgayTao())
                .build();
    }
}
