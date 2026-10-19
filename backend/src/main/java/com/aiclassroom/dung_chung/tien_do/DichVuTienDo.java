package com.aiclassroom.dung_chung.tien_do;

import com.aiclassroom.dung_chung.bai_tap.BaiTapRepository;
import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import com.aiclassroom.dung_chung.lop_hoc.LopHocRepository;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLop;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLopRepository;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongCoQuyen;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongTimThay;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuTienDo {

    private final TienDoRepository tienDoRepository;
    private final LopHocRepository lopHocRepository;
    private final ThanhVienLopRepository thanhVienLopRepository;
    private final BaiTapRepository baiTapRepository;
    private final TienIchNguoiDung tienIchNguoiDung;

    public TienDoTongQuanPhanHoi layTongQuanTienDo() {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        List<TienDo> dsTienDo = tienDoRepository.findBySinhVien(nd);

        int tongLop = dsTienDo.size();
        int tongBt = 0;
        int tongDaNop = 0;
        double tongDiem = 0.0;
        int lopCoDiem = 0;

        for (TienDo td : dsTienDo) {
            tongBt += td.getTongBaiTap();
            tongDaNop += td.getSoBaiDaNop();
            if (td.getSoBaiDaCham() > 0) {
                tongDiem += td.getDiemTrungBinh();
                lopCoDiem++;
            }
        }

        double ptHoanThanh = tongBt > 0 ? ((double) tongDaNop * 100.0 / tongBt) : 0.0;
        double dtbChung = lopCoDiem > 0 ? (tongDiem / lopCoDiem) : 0.0;

        ptHoanThanh = Math.round(ptHoanThanh * 10.0) / 10.0;
        dtbChung = Math.round(dtbChung * 10.0) / 10.0;

        List<TienDoPhanHoi> chiTiet = dsTienDo.stream()
                .map(TienDoPhanHoi::tuThucThe)
                .collect(Collectors.toList());

        return TienDoTongQuanPhanHoi.builder()
                .tongSoLop(tongLop)
                .tongSoBaiTap(tongBt)
                .tongSoBaiDaNop(tongDaNop)
                .tongSoBaiChuaNop(Math.max(0, tongBt - tongDaNop))
                .phanTramHoanThanhChung(ptHoanThanh)
                .diemTrungBinhChung(dtbChung)
                .chiTietCacLop(chiTiet)
                .build();
    }

    public List<TienDoPhanHoi> layTienDoTheoLop(Long lopHocId) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        LopHoc lh = lopHocRepository.findById(lopHocId)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay lop hoc"));

        if (nd.getVaiTro() == VaiTro.SINH_VIEN) {
            return tienDoRepository.findBySinhVienAndLopHoc(nd, lh).stream()
                    .map(TienDoPhanHoi::tuThucThe)
                    .collect(Collectors.toList());
        }

        if (nd.getVaiTro() == VaiTro.GIAO_VIEN && !lh.getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen xem tien do lop nay");
        }

        return tienDoRepository.findByLopHoc(lh).stream()
                .map(TienDoPhanHoi::tuThucThe)
                .collect(Collectors.toList());
    }

    public List<TienDoPhanHoi> layTatCaTienDo() {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        if (nd.getVaiTro() == VaiTro.SINH_VIEN) {
            return tienDoRepository.findBySinhVien(nd).stream()
                    .map(TienDoPhanHoi::tuThucThe)
                    .collect(Collectors.toList());
        } else if (nd.getVaiTro() == VaiTro.GIAO_VIEN) {
            List<LopHoc> dsLop = lopHocRepository.findByGiaoVien(nd);
            return dsLop.stream()
                    .flatMap(lh -> tienDoRepository.findByLopHoc(lh).stream())
                    .map(TienDoPhanHoi::tuThucThe)
                    .collect(Collectors.toList());
        } else {
            return tienDoRepository.findAll().stream()
                    .map(TienDoPhanHoi::tuThucThe)
                    .collect(Collectors.toList());
        }
    }
}
