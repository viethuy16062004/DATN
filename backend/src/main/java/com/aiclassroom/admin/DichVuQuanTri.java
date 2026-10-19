package com.aiclassroom.admin;

import com.aiclassroom.dung_chung.ai.LichSuAi;
import com.aiclassroom.dung_chung.ai.LichSuAiRepository;
import com.aiclassroom.sinh_vien.bai_nop.BaiNopRepository;
import com.aiclassroom.dung_chung.bai_tap.BaiTapRepository;
import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import com.aiclassroom.dung_chung.lop_hoc.LopHocPhanHoi;
import com.aiclassroom.dung_chung.lop_hoc.LopHocRepository;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLopRepository;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongHopLe;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongTimThay;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungPhanHoi;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungRepository;
import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuQuanTri {

    private final NguoiDungRepository nguoiDungRepository;
    private final LopHocRepository lopHocRepository;
    private final ThanhVienLopRepository thanhVienLopRepository;
    private final BaiTapRepository baiTapRepository;
    private final BaiNopRepository baiNopRepository;
    private final LichSuAiRepository lichSuAiRepository;
    private final TienIchNguoiDung tienIchNguoiDung;
    private final PasswordEncoder passwordEncoder;

    public ThongKeQuanTriPhanHoi layThongKeHeThong() {
        return ThongKeQuanTriPhanHoi.builder()
                .tongNguoiDung(nguoiDungRepository.count())
                .tongSinhVien(nguoiDungRepository.countByVaiTro(VaiTro.SINH_VIEN))
                .tongGiaoVien(nguoiDungRepository.countByVaiTro(VaiTro.GIAO_VIEN))
                .tongAdmin(nguoiDungRepository.countByVaiTro(VaiTro.ADMIN))
                .tongLopHoc(lopHocRepository.count())
                .tongBaiTap(baiTapRepository.count())
                .tongBaiNop(baiNopRepository.count())
                .tongYeuCauAi(lichSuAiRepository.count())
                .build();
    }

    public List<NguoiDungPhanHoi> layDanhSachNguoiDung(VaiTro vaiTro) {
        List<NguoiDung> ds;
        if (vaiTro != null) {
            ds = nguoiDungRepository.findByVaiTro(vaiTro);
        } else {
            ds = nguoiDungRepository.findAll();
        }
        return ds.stream().map(NguoiDungPhanHoi::tuThucThe).collect(Collectors.toList());
    }

    @Transactional
    public NguoiDungPhanHoi taoNguoiDung(TaoNguoiDungYeuCau yeuCau) {
        if (nguoiDungRepository.existsByEmail(yeuCau.getEmail().trim().toLowerCase())) {
            throw new NgoaiLeKhongHopLe("Email nay da ton tai trong he thong");
        }

        NguoiDung nd = NguoiDung.builder()
                .email(yeuCau.getEmail().trim().toLowerCase())
                .matKhau(passwordEncoder.encode(yeuCau.getMatKhau()))
                .hoTen(yeuCau.getHoTen().trim())
                .vaiTro(yeuCau.getVaiTro())
                .soDienThoai(yeuCau.getSoDienThoai())
                .build();

        nd = nguoiDungRepository.save(nd);
        return NguoiDungPhanHoi.tuThucThe(nd);
    }

    @Transactional
    public NguoiDungPhanHoi doiVaiTro(Long id, DoiVaiTroYeuCau yeuCau) {
        NguoiDung ndHienTai = tienIchNguoiDung.layNguoiDungHienTai();
        if (ndHienTai.getId().equals(id)) {
            throw new NgoaiLeKhongHopLe("Khong the tu thay doi vai tro cua chinh minh");
        }

        NguoiDung target = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay nguoi dung"));

        target.setVaiTro(yeuCau.getVaiTroMoi());
        target = nguoiDungRepository.save(target);
        return NguoiDungPhanHoi.tuThucThe(target);
    }

    @Transactional
    public void datLaiMatKhau(Long id, DatLaiMatKhauYeuCau yeuCau) {
        NguoiDung target = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay nguoi dung"));

        target.setMatKhau(passwordEncoder.encode(yeuCau.getMatKhauMoi()));
        nguoiDungRepository.save(target);
    }

    @Transactional
    public void xoaNguoiDung(Long id) {
        NguoiDung ndHienTai = tienIchNguoiDung.layNguoiDungHienTai();
        if (ndHienTai.getId().equals(id)) {
            throw new NgoaiLeKhongHopLe("Khong the xoa tai khoan dang dang nhap");
        }

        NguoiDung target = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay nguoi dung"));

        nguoiDungRepository.delete(target);
    }

    public List<LopHocPhanHoi> layDanhSachTatCaLopHoc() {
        return lopHocRepository.findAll().stream()
                .map(lh -> {
                    long soLuongSV = thanhVienLopRepository.countByLopHoc(lh);
                    long soLuongBT = baiTapRepository.countByLopHoc(lh);
                    return LopHocPhanHoi.tuThucThe(lh, soLuongSV, soLuongBT);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void xoaLopHoc(Long id) {
        LopHoc lh = lopHocRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay lop hoc"));
        lopHocRepository.delete(lh);
    }

    public List<LichSuAiPhanHoi> layLichSuAiToanHeThong() {
        return lichSuAiRepository.findAllByOrderByNgayTaoDesc().stream()
                .limit(100)
                .map(LichSuAiPhanHoi::tuThucThe)
                .collect(Collectors.toList());
    }
}
