package com.aiclassroom.dung_chung.thong_bao;

import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongCoQuyen;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongTimThay;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuThongBao {

    private final ThongBaoRepository thongBaoRepository;
    private final TienIchNguoiDung tienIchNguoiDung;

    public List<ThongBaoPhanHoi> layDanhSachThongBao() {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        return thongBaoRepository.findByNguoiNhanOrderByNgayTaoDesc(nd).stream()
                .map(ThongBaoPhanHoi::tuThucThe)
                .collect(Collectors.toList());
    }

    public long demThongBaoChuaDoc() {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        return thongBaoRepository.countByNguoiNhanAndDaDocFalse(nd);
    }

    @Transactional
    public void danhDauDaDoc(Long id) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        ThongBao tb = thongBaoRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay thong bao"));

        if (!tb.getNguoiNhan().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen cap nhat thong bao nay");
        }

        tb.setDaDoc(true);
        thongBaoRepository.save(tb);
    }

    @Transactional
    public void danhDauDocTatCa() {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        List<ThongBao> ds = thongBaoRepository.findByNguoiNhanOrderByNgayTaoDesc(nd);
        for (ThongBao tb : ds) {
            tb.setDaDoc(true);
        }
        thongBaoRepository.saveAll(ds);
    }
}
