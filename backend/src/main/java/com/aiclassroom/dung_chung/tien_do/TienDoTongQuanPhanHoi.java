package com.aiclassroom.dung_chung.tien_do;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TienDoTongQuanPhanHoi {
    private int tongSoLop;
    private int tongSoBaiTap;
    private int tongSoBaiDaNop;
    private int tongSoBaiChuaNop;
    private double phanTramHoanThanhChung;
    private double diemTrungBinhChung;
    private List<TienDoPhanHoi> chiTietCacLop;
}
