package com.aiclassroom.giang_vien.quan_ly_sinh_vien;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KetQuaThemHangLoatPhanHoi {
    private int tongSo;
    private int thanhCong;
    private int daTonTai;
    private int loi;
    private List<ChiTietKetQua> chiTiet;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChiTietKetQua {
        private String email;
        private String hoTen;
        private String trangThai; // "THANH_CONG", "DA_TON_TAI", "LOI"
        private String thongBao;
    }
}
