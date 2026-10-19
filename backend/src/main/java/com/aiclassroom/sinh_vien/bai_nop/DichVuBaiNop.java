package com.aiclassroom.sinh_vien.bai_nop;

import com.aiclassroom.dung_chung.bai_tap.BaiTap;
import com.aiclassroom.dung_chung.bai_tap.BaiTapRepository;
import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.giang_vien.cham_diem.ChamDiem;
import com.aiclassroom.giang_vien.cham_diem.ChamDiemRepository;
import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import com.aiclassroom.dung_chung.lop_hoc.LopHocRepository;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLopRepository;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuBaiNop {

    private final BaiNopRepository baiNopRepository;
    private final BaiTapRepository baiTapRepository;
    private final LopHocRepository lopHocRepository;
    private final ThanhVienLopRepository thanhVienLopRepository;
    private final ChamDiemRepository chamDiemRepository;
    private final TienDoRepository tienDoRepository;
    private final ThongBaoRepository thongBaoRepository;
    private final TienIchNguoiDung tienIchNguoiDung;

    @Transactional
    public BaiNopPhanHoi nopBai(NopBaiYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        if (nd.getVaiTro() != VaiTro.SINH_VIEN && nd.getVaiTro() != VaiTro.ADMIN) {
            throw new NgoaiLeKhongCoQuyen("Chỉ sinh viên mới có thể nộp bài tập");
        }

        BaiTap bt = baiTapRepository.findById(yeuCau.getBaiTapId())
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Không tìm thấy bài tập"));

        if (bt.getLopHoc() != null && !thanhVienLopRepository.existsByLopHocAndSinhVien(bt.getLopHoc(), nd)) {
            thanhVienLopRepository.save(com.aiclassroom.dung_chung.lop_hoc.ThanhVienLop.builder()
                    .lopHoc(bt.getLopHoc())
                    .sinhVien(nd)
                    .build());
        }

        TrangThaiBaiNop trangThai = (bt.getHanNop() != null && LocalDateTime.now().isAfter(bt.getHanNop())) ?
                TrangThaiBaiNop.NOP_MUON : TrangThaiBaiNop.DA_NOP;

        Optional<BaiNop> optBn = baiNopRepository.findByBaiTapAndSinhVien(bt, nd);
        BaiNop bn;
        boolean laLanDauNop = optBn.isEmpty();

        if (optBn.isPresent()) {
            bn = optBn.get();
            bn.setNoiDung(yeuCau.getNoiDung());
            if (yeuCau.getTepNop() != null) {
                bn.setTepNop(yeuCau.getTepNop());
            }
            if (bn.getTrangThai() != TrangThaiBaiNop.DA_CHAM) {
                bn.setTrangThai(trangThai);
            }
        } else {
            bn = BaiNop.builder()
                    .baiTap(bt)
                    .sinhVien(nd)
                    .noiDung(yeuCau.getNoiDung())
                    .tepNop(yeuCau.getTepNop())
                    .trangThai(trangThai)
                    .build();
        }

        bn = baiNopRepository.save(bn);

        // Cap nhat tien do
        if (laLanDauNop && bt.getLopHoc() != null) {
            try {
                Optional<TienDo> optTd = tienDoRepository.findBySinhVienAndLopHoc(nd, bt.getLopHoc());
                TienDo td = optTd.orElseGet(() -> TienDo.builder().sinhVien(nd).lopHoc(bt.getLopHoc()).build());
                td.setSoBaiDaNop((td.getSoBaiDaNop() != null ? td.getSoBaiDaNop() : 0) + 1);
                long tongBt = baiTapRepository.countByLopHoc(bt.getLopHoc());
                td.setTongBaiTap((int) tongBt);
                if (tongBt > 0) {
                    td.setPhanTramHoanThanh((td.getSoBaiDaNop() * 100.0) / tongBt);
                }
                tienDoRepository.save(td);
            } catch (Exception e) {
                // ignore progress update failure
            }
        }

        // Thong bao cho giao vien
        if (bt.getLopHoc() != null && bt.getLopHoc().getGiaoVien() != null) {
            try {
                thongBaoRepository.save(ThongBao.builder()
                        .nguoiNhan(bt.getLopHoc().getGiaoVien())
                        .tieuDe("Sinh viên nộp bài: " + nd.getHoTen())
                        .noiDung("Sinh viên " + nd.getHoTen() + " đã nộp bài tập " + bt.getTieuDe())
                        .loaiThongBao("SINH_VIEN_NOP_BAI")
                        .lienKet("/giao-vien/lop/" + bt.getLopHoc().getId())
                        .build());
            } catch (Exception e) {
                // ignore notification failure
            }
        }

        return lamGiauThongTinBaiNop(bn);
    }

    public List<BaiNopPhanHoi> layDanhSachBaiNop(Long baiTapId) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        List<BaiNop> ds;

        if (baiTapId != null) {
            BaiTap bt = baiTapRepository.findById(baiTapId)
                    .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay bai tap"));

            if (nd.getVaiTro() == VaiTro.SINH_VIEN) {
                ds = baiNopRepository.findByBaiTapAndSinhVien(bt, nd).stream().collect(Collectors.toList());
            } else if (nd.getVaiTro() == VaiTro.GIAO_VIEN) {
                if (!bt.getLopHoc().getGiaoVien().getId().equals(nd.getId())) {
                    throw new NgoaiLeKhongCoQuyen("Ban khong co quyen xem bai nop cua lop nay");
                }
                ds = baiNopRepository.findByBaiTap(bt);
            } else {
                ds = baiNopRepository.findByBaiTap(bt);
            }
        } else {
            if (nd.getVaiTro() == VaiTro.SINH_VIEN) {
                ds = baiNopRepository.findBySinhVien(nd);
            } else if (nd.getVaiTro() == VaiTro.GIAO_VIEN) {
                List<LopHoc> dsLop = lopHocRepository.findByGiaoVien(nd);
                if (dsLop.isEmpty()) {
                    ds = List.of();
                } else {
                    List<BaiTap> btList = baiTapRepository.findByLopHocInOrderByHanNopAsc(dsLop);
                    ds = btList.isEmpty() ? List.of() : baiNopRepository.findByBaiTapIn(btList);
                }
            } else {
                ds = baiNopRepository.findAll();
            }
        }

        return ds.stream().map(this::lamGiauThongTinBaiNop).collect(Collectors.toList());
    }

    public BaiNopPhanHoi layChiTietBaiNop(Long id) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        BaiNop bn = baiNopRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay bai nop"));

        if (nd.getVaiTro() == VaiTro.SINH_VIEN && !bn.getSinhVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen xem bai nop nay");
        }
        if (nd.getVaiTro() == VaiTro.GIAO_VIEN && !bn.getBaiTap().getLopHoc().getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen xem bai nop nay");
        }

        return lamGiauThongTinBaiNop(bn);
    }

    public BaiNopPhanHoi layBaiNopCuaToiTheoBaiTap(Long baiTapId) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        BaiTap bt = baiTapRepository.findById(baiTapId)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay bai tap"));

        return baiNopRepository.findByBaiTapAndSinhVien(bt, nd)
                .map(this::lamGiauThongTinBaiNop)
                .orElse(null);
    }

    private BaiNopPhanHoi lamGiauThongTinBaiNop(BaiNop bn) {
        BaiNopPhanHoi ph = BaiNopPhanHoi.tuThucThe(bn);
        Optional<ChamDiem> optCd = chamDiemRepository.findByBaiNop(bn);
        if (optCd.isPresent()) {
            ChamDiem cd = optCd.get();
            ph.setDiemSo(cd.getDiemSo());
            ph.setNhanXet(cd.getNhanXet());
            ph.setNgayCham(cd.getNgayCham());
        }
        return ph;
    }
}
