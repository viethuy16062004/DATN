package com.aiclassroom.dung_chung.bai_tap;

import com.aiclassroom.sinh_vien.bai_nop.BaiNop;
import com.aiclassroom.sinh_vien.bai_nop.BaiNopRepository;
import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.giang_vien.cham_diem.ChamDiem;
import com.aiclassroom.giang_vien.cham_diem.ChamDiemRepository;
import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import com.aiclassroom.dung_chung.lop_hoc.LopHocRepository;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLop;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLopRepository;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongCoQuyen;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuBaiTap {

    private final BaiTapRepository baiTapRepository;
    private final LopHocRepository lopHocRepository;
    private final ThanhVienLopRepository thanhVienLopRepository;
    private final BaiNopRepository baiNopRepository;
    private final ChamDiemRepository chamDiemRepository;
    private final TienDoRepository tienDoRepository;
    private final ThongBaoRepository thongBaoRepository;
    private final TienIchNguoiDung tienIchNguoiDung;

    public List<BaiTapPhanHoi> layDanhSachBaiTap(Long lopHocId) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        List<BaiTap> danhSach;

        if (lopHocId != null) {
            LopHoc lh = lopHocRepository.findById(lopHocId)
                    .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay lop hoc"));
            kiemTraQuyenLop(lh, nd);
            danhSach = baiTapRepository.findByLopHocOrderByHanNopAsc(lh);
        } else {
            if (nd.getVaiTro() == VaiTro.ADMIN) {
                danhSach = baiTapRepository.findAll();
            } else if (nd.getVaiTro() == VaiTro.GIAO_VIEN) {
                List<LopHoc> dsLop = lopHocRepository.findByGiaoVien(nd);
                if (dsLop == null || dsLop.isEmpty()) {
                    danhSach = new ArrayList<>();
                } else {
                    danhSach = baiTapRepository.findByLopHocInOrderByHanNopAsc(dsLop);
                }
            } else {
                List<ThanhVienLop> tvList = thanhVienLopRepository.findBySinhVien(nd);
                List<LopHoc> dsLop = tvList.stream().map(ThanhVienLop::getLopHoc).collect(Collectors.toList());
                if (dsLop == null || dsLop.isEmpty()) {
                    danhSach = new ArrayList<>();
                } else {
                    danhSach = baiTapRepository.findByLopHocInOrderByHanNopAsc(dsLop);
                }
            }
        }

        return danhSach.stream().map(bt -> lamGiauThongTinBaiTap(bt, nd)).collect(Collectors.toList());
    }

    public BaiTapPhanHoi layChiTietBaiTap(Long id) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        BaiTap bt = baiTapRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay bai tap voi ID: " + id));

        kiemTraQuyenLop(bt.getLopHoc(), nd);
        return lamGiauThongTinBaiTap(bt, nd);
    }

    @Transactional
    public BaiTapPhanHoi taoBaiTap(TaoBaiTapYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        LopHoc lh = lopHocRepository.findById(yeuCau.getLopHocId())
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay lop hoc"));

        if (nd.getVaiTro() != VaiTro.ADMIN && !lh.getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen tao bai tap trong lop nay");
        }

        BaiTap bt = BaiTap.builder()
                .lopHoc(lh)
                .tieuDe(yeuCau.getTieuDe())
                .noiDung(yeuCau.getNoiDung())
                .hanNop(yeuCau.getHanNop())
                .diemToiDa(yeuCau.getDiemToiDa())
                .tepDinhKem(yeuCau.getTepDinhKem())
                .build();

        bt = baiTapRepository.save(bt);

        // Cap nhat tien do tong bai tap cho tat ca sinh vien trong lop
        List<ThanhVienLop> thanhVienList = thanhVienLopRepository.findByLopHoc(lh);
        long tongBt = baiTapRepository.countByLopHoc(lh);

        for (ThanhVienLop tv : thanhVienList) {
            Optional<TienDo> optTd = tienDoRepository.findBySinhVienAndLopHoc(tv.getSinhVien(), lh);
            TienDo td = optTd.orElseGet(() -> TienDo.builder().sinhVien(tv.getSinhVien()).lopHoc(lh).build());
            td.setTongBaiTap((int) tongBt);
            if (tongBt > 0) {
                td.setPhanTramHoanThanh((td.getSoBaiDaNop() * 100.0) / tongBt);
            }
            tienDoRepository.save(td);

            // Tao thong bao cho sinh vien
            thongBaoRepository.save(ThongBao.builder()
                    .nguoiNhan(tv.getSinhVien())
                    .tieuDe("Bai tap moi: " + bt.getTieuDe())
                    .noiDung("Lop " + lh.getTenLop() + " co bai tap moi. Han nop: " + bt.getHanNop())
                    .loaiThongBao("BAI_TAP_MOI")
                    .lienKet("/sinh-vien/bai-tap/" + bt.getId())
                    .build());
        }

        return lamGiauThongTinBaiTap(bt, nd);
    }

    @Transactional
    public BaiTapPhanHoi capNhatBaiTap(Long id, CapNhatBaiTapYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        BaiTap bt = baiTapRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay bai tap"));

        if (nd.getVaiTro() != VaiTro.ADMIN && !bt.getLopHoc().getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen cap nhat bai tap nay");
        }

        bt.setTieuDe(yeuCau.getTieuDe());
        bt.setNoiDung(yeuCau.getNoiDung());
        bt.setHanNop(yeuCau.getHanNop());
        bt.setDiemToiDa(yeuCau.getDiemToiDa());
        if (yeuCau.getTepDinhKem() != null) {
            bt.setTepDinhKem(yeuCau.getTepDinhKem());
        }

        bt = baiTapRepository.save(bt);
        return lamGiauThongTinBaiTap(bt, nd);
    }

    @Transactional
    public void xoaBaiTap(Long id) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        BaiTap bt = baiTapRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay bai tap"));

        if (nd.getVaiTro() != VaiTro.ADMIN && !bt.getLopHoc().getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen xoa bai tap nay");
        }

        LopHoc lh = bt.getLopHoc();
        baiTapRepository.delete(bt);

        // Cap nhat lai tong bai tap trong TienDo
        long tongBt = baiTapRepository.countByLopHoc(lh);
        List<TienDo> tdList = tienDoRepository.findByLopHoc(lh);
        for (TienDo td : tdList) {
            td.setTongBaiTap((int) tongBt);
            if (tongBt > 0) {
                td.setPhanTramHoanThanh(Math.min(100.0, (td.getSoBaiDaNop() * 100.0) / tongBt));
            } else {
                td.setPhanTramHoanThanh(0.0);
            }
            tienDoRepository.save(td);
        }
    }

    private BaiTapPhanHoi lamGiauThongTinBaiTap(BaiTap bt, NguoiDung nd) {
        BaiTapPhanHoi ph = BaiTapPhanHoi.tuThucThe(bt);

        if (nd.getVaiTro() == VaiTro.SINH_VIEN) {
            Optional<BaiNop> optBn = baiNopRepository.findByBaiTapAndSinhVien(bt, nd);
            if (optBn.isPresent()) {
                ph.setDaNop(true);
                ph.setTrangThaiBaiNop(optBn.get().getTrangThai());
                Optional<ChamDiem> optCd = chamDiemRepository.findByBaiNop(optBn.get());
                optCd.ifPresent(chamDiem -> ph.setDiemSo(chamDiem.getDiemSo()));
            } else {
                ph.setDaNop(false);
            }
        } else {
            List<BaiNop> dsBaiNop = baiNopRepository.findByBaiTap(bt);
            ph.setSoLuongBaiNop((long) dsBaiNop.size());
            long daCham = dsBaiNop.stream().filter(bn -> chamDiemRepository.findByBaiNop(bn).isPresent()).count();
            ph.setSoLuongDaCham(daCham);
        }

        return ph;
    }

    private void kiemTraQuyenLop(LopHoc lh, NguoiDung nd) {
        if (nd.getVaiTro() == VaiTro.ADMIN) return;
        if (nd.getVaiTro() == VaiTro.GIAO_VIEN && lh.getGiaoVien().getId().equals(nd.getId())) return;
        if (nd.getVaiTro() == VaiTro.SINH_VIEN && thanhVienLopRepository.existsByLopHocAndSinhVien(lh, nd)) return;

        throw new NgoaiLeKhongCoQuyen("Ban khong co quyen truy cap bai tap cua lop nay");
    }
}
