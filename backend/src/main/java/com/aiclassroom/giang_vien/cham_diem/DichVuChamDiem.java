package com.aiclassroom.giang_vien.cham_diem;

import com.aiclassroom.sinh_vien.bai_nop.BaiNop;
import com.aiclassroom.sinh_vien.bai_nop.BaiNopRepository;
import com.aiclassroom.sinh_vien.bai_nop.TrangThaiBaiNop;
import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongCoQuyen;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongHopLe;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongTimThay;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import com.aiclassroom.dung_chung.thong_bao.ThongBao;
import com.aiclassroom.dung_chung.thong_bao.ThongBaoRepository;
import com.aiclassroom.dung_chung.tien_do.TienDo;
import com.aiclassroom.dung_chung.tien_do.TienDoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DichVuChamDiem {

    private final ChamDiemRepository chamDiemRepository;
    private final BaiNopRepository baiNopRepository;
    private final TienDoRepository tienDoRepository;
    private final ThongBaoRepository thongBaoRepository;
    private final TienIchNguoiDung tienIchNguoiDung;

    @Transactional
    public ChamDiemPhanHoi chamDiem(ChamDiemYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        BaiNop bn = baiNopRepository.findById(yeuCau.getBaiNopId())
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay bai nop"));

        LopHoc lh = bn.getBaiTap().getLopHoc();
        if (nd.getVaiTro() != VaiTro.ADMIN && !lh.getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen cham bai cua lop nay");
        }

        if (yeuCau.getDiemSo() > bn.getBaiTap().getDiemToiDa()) {
            throw new NgoaiLeKhongHopLe("Diem so khong duoc vuot qua diem toi da (" + bn.getBaiTap().getDiemToiDa() + ")");
        }

        Optional<ChamDiem> optCd = chamDiemRepository.findByBaiNop(bn);
        ChamDiem cd;
        if (optCd.isPresent()) {
            cd = optCd.get();
            cd.setDiemSo(yeuCau.getDiemSo());
            cd.setNhanXet(yeuCau.getNhanXet());
            cd.setGiaoVien(nd);
        } else {
            cd = ChamDiem.builder()
                    .baiNop(bn)
                    .giaoVien(nd)
                    .diemSo(yeuCau.getDiemSo())
                    .nhanXet(yeuCau.getNhanXet())
                    .build();
        }

        cd = chamDiemRepository.save(cd);

        // Cap nhat trang thai bai nop
        bn.setTrangThai(TrangThaiBaiNop.DA_CHAM);
        baiNopRepository.save(bn);

        // Cap nhat tien do cho sinh vien
        capNhatTienDoHocTap(bn.getSinhVien(), lh);

        // Gui thong bao cho sinh vien
        thongBaoRepository.save(ThongBao.builder()
                .nguoiNhan(bn.getSinhVien())
                .tieuDe("Bai tap da duoc cham diem: " + bn.getBaiTap().getTieuDe())
                .noiDung("Giao vien " + nd.getHoTen() + " da cham: " + yeuCau.getDiemSo() + "/" + bn.getBaiTap().getDiemToiDa() + " diem")
                .loaiThongBao("BAI_TAP_DA_CHAM")
                .lienKet("/sinh-vien/bai-tap/" + bn.getBaiTap().getId())
                .build());

        return ChamDiemPhanHoi.tuThucThe(cd);
    }

    @Transactional
    public ChamDiemPhanHoi capNhatChamDiem(Long id, ChamDiemYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        ChamDiem cd = chamDiemRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay ban ghi cham diem"));

        LopHoc lh = cd.getBaiNop().getBaiTap().getLopHoc();
        if (nd.getVaiTro() != VaiTro.ADMIN && !lh.getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen sua diem cua lop nay");
        }

        if (yeuCau.getDiemSo() > cd.getBaiNop().getBaiTap().getDiemToiDa()) {
            throw new NgoaiLeKhongHopLe("Diem so khong duoc vuot qua diem toi da");
        }

        cd.setDiemSo(yeuCau.getDiemSo());
        cd.setNhanXet(yeuCau.getNhanXet());
        cd.setGiaoVien(nd);
        cd = chamDiemRepository.save(cd);

        capNhatTienDoHocTap(cd.getBaiNop().getSinhVien(), lh);

        return ChamDiemPhanHoi.tuThucThe(cd);
    }

    public ChamDiemPhanHoi layTheoBaiNop(Long baiNopId) {
        ChamDiem cd = chamDiemRepository.findByBaiNopId(baiNopId)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Chua co ket qua cham diem cho bai nop nay"));
        return ChamDiemPhanHoi.tuThucThe(cd);
    }

    private void capNhatTienDoHocTap(NguoiDung sinhVien, LopHoc lopHoc) {
        List<BaiNop> dsBaiNop = baiNopRepository.findBySinhVien(sinhVien);
        List<BaiNop> dsBaiNopTrongLop = dsBaiNop.stream()
                .filter(bn -> bn.getBaiTap().getLopHoc().getId().equals(lopHoc.getId()))
                .toList();

        List<ChamDiem> dsChamDiem = chamDiemRepository.findByBaiNopIn(dsBaiNopTrongLop);

        double tongDiem = 0.0;
        int soBaiDaCham = dsChamDiem.size();

        for (ChamDiem cd : dsChamDiem) {
            double diemThang10 = (cd.getDiemSo() / cd.getBaiNop().getBaiTap().getDiemToiDa()) * 10.0;
            tongDiem += diemThang10;
        }

        double dtb = soBaiDaCham > 0 ? (tongDiem / soBaiDaCham) : 0.0;
        // Lam tron 1 chu so thap phan
        dtb = Math.round(dtb * 10.0) / 10.0;

        Optional<TienDo> optTd = tienDoRepository.findBySinhVienAndLopHoc(sinhVien, lopHoc);
        TienDo td = optTd.orElseGet(() -> TienDo.builder().sinhVien(sinhVien).lopHoc(lopHoc).build());
        td.setSoBaiDaCham(soBaiDaCham);
        td.setDiemTrungBinh(dtb);
        tienDoRepository.save(td);
    }
}
