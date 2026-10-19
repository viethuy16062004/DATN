package com.aiclassroom.dung_chung.nguoi_dung;

import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongTimThay;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DichVuNguoiDung {

    private final NguoiDungRepository nguoiDungRepository;
    private final TienIchNguoiDung tienIchNguoiDung;

    public NguoiDungPhanHoi layThongTinCaNhan() {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        return NguoiDungPhanHoi.tuThucThe(nd);
    }

    public NguoiDungPhanHoi layTheoId(Long id) {
        NguoiDung nd = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay nguoi dung voi ID: " + id));
        return NguoiDungPhanHoi.tuThucThe(nd);
    }

    @Transactional
    public NguoiDungPhanHoi capNhatThongTinCaNhan(CapNhatNguoiDungYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        nd.setHoTen(yeuCau.getHoTen());
        if (yeuCau.getSoDienThoai() != null) {
            nd.setSoDienThoai(yeuCau.getSoDienThoai());
        }
        if (yeuCau.getAnhDaiDien() != null) {
            nd.setAnhDaiDien(yeuCau.getAnhDaiDien());
        }
        nd = nguoiDungRepository.save(nd);
        return NguoiDungPhanHoi.tuThucThe(nd);
    }
}
