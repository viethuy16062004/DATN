package com.aiclassroom.giang_vien.quan_ly_sinh_vien;

import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLopRepository;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongCoQuyen;
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

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuSinhVienGiaoVien {

    private final SinhVienGiaoVienRepository sinhVienGiaoVienRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final ThanhVienLopRepository thanhVienLopRepository;
    private final TienIchNguoiDung tienIchNguoiDung;
    private final PasswordEncoder passwordEncoder;

    public List<SinhVienGiaoVienPhanHoi> layDanhSachSinhVienQuanLy() {
        NguoiDung gv = tienIchNguoiDung.layNguoiDungHienTai();
        if (gv.getVaiTro() != VaiTro.GIAO_VIEN && gv.getVaiTro() != VaiTro.ADMIN) {
            throw new NgoaiLeKhongCoQuyen("Chi giang vien hoac quan tri vien moi co the xem danh sach nay");
        }

        List<SinhVienGiaoVien> ds = sinhVienGiaoVienRepository.findByGiaoVienWithSinhVien(gv);
        return ds.stream().map(svgv -> {
            long soLop = thanhVienLopRepository.countBySinhVienAndLopHocGiaoVien(svgv.getSinhVien(), gv);
            return SinhVienGiaoVienPhanHoi.tuThucThe(svgv, soLop);
        }).collect(Collectors.toList());
    }

    @Transactional
    public SinhVienGiaoVienPhanHoi themSinhVien(ThemSinhVienQuanLyYeuCau yeuCau) {
        NguoiDung gv = tienIchNguoiDung.layNguoiDungHienTai();
        if (gv.getVaiTro() != VaiTro.GIAO_VIEN && gv.getVaiTro() != VaiTro.ADMIN) {
            throw new NgoaiLeKhongCoQuyen("Chi giang vien moi co the them sinh vien vao danh sach quan ly");
        }

        String email = yeuCau.getEmail().trim().toLowerCase();
        Optional<NguoiDung> svOpt = nguoiDungRepository.findByEmail(email);
        NguoiDung sv;
        if (svOpt.isPresent()) {
            sv = svOpt.get();
            if (sv.getVaiTro() != VaiTro.SINH_VIEN) {
                throw new NgoaiLeKhongHopLe("Nguoi dung nay khong phai la tai khoan sinh vien");
            }
        } else {
            // Tự động tạo tài khoản cho sinh viên nếu chưa đăng ký trước
            String hoTenMacDinh = email.split("@")[0];
            sv = NguoiDung.builder()
                    .email(email)
                    .matKhau(passwordEncoder.encode("123456"))
                    .hoTen(hoTenMacDinh)
                    .vaiTro(VaiTro.SINH_VIEN)
                    .build();
            sv = nguoiDungRepository.save(sv);
        }

        if (sinhVienGiaoVienRepository.existsByGiaoVienAndSinhVien(gv, sv)) {
            throw new NgoaiLeKhongHopLe("Sinh vien nay da co trong danh sach quan ly cua ban");
        }

        SinhVienGiaoVien svgv = SinhVienGiaoVien.builder()
                .giaoVien(gv)
                .sinhVien(sv)
                .ghiChu(yeuCau.getGhiChu() != null ? yeuCau.getGhiChu().trim() : null)
                .build();

        svgv = sinhVienGiaoVienRepository.save(svgv);
        long soLop = thanhVienLopRepository.countBySinhVienAndLopHocGiaoVien(sv, gv);
        return SinhVienGiaoVienPhanHoi.tuThucThe(svgv, soLop);
    }

    @Transactional
    public KetQuaThemHangLoatPhanHoi themHangLoatSinhVien(ThemHangLoatSinhVienYeuCau yeuCau) {
        NguoiDung gv = tienIchNguoiDung.layNguoiDungHienTai();
        if (gv.getVaiTro() != VaiTro.GIAO_VIEN && gv.getVaiTro() != VaiTro.ADMIN) {
            throw new NgoaiLeKhongCoQuyen("Chi giang vien moi co the them sinh vien vao danh sach quan ly");
        }

        List<ThemHangLoatSinhVienYeuCau.MucSinhVienNhap> danhSach = yeuCau.getDanhSachSinhVien();
        if (danhSach == null || danhSach.isEmpty()) {
            throw new NgoaiLeKhongHopLe("Danh sach sinh vien khong duoc de trong");
        }

        int thanhCong = 0;
        int daTonTai = 0;
        int loi = 0;
        List<KetQuaThemHangLoatPhanHoi.ChiTietKetQua> chiTietList = new ArrayList<>();
        Set<String> emailDaXuLyTrongDot = new HashSet<>();

        for (ThemHangLoatSinhVienYeuCau.MucSinhVienNhap muc : danhSach) {
            if (muc.getEmail() == null || muc.getEmail().trim().isEmpty()) {
                continue;
            }
            String email = muc.getEmail().trim().toLowerCase();
            String hoTen = (muc.getHoTen() != null && !muc.getHoTen().trim().isEmpty())
                    ? muc.getHoTen().trim()
                    : email.split("@")[0];
            String ghiChu = muc.getGhiChu() != null ? muc.getGhiChu().trim() : null;

            if (emailDaXuLyTrongDot.contains(email)) {
                continue; // Bỏ qua nếu trùng lặp email trong chính file/danh sách import
            }
            emailDaXuLyTrongDot.add(email);

            try {
                Optional<NguoiDung> svOpt = nguoiDungRepository.findByEmail(email);
                NguoiDung sv;
                if (svOpt.isPresent()) {
                    sv = svOpt.get();
                    if (sv.getVaiTro() != VaiTro.SINH_VIEN) {
                        loi++;
                        chiTietList.add(KetQuaThemHangLoatPhanHoi.ChiTietKetQua.builder()
                                .email(email)
                                .hoTen(sv.getHoTen())
                                .trangThai("LOI")
                                .thongBao("Tài khoản này có vai trò " + sv.getVaiTro() + ", không phải sinh viên")
                                .build());
                        continue;
                    }
                } else {
                    // Tự động khởi tạo tài khoản sinh viên với mật khẩu mặc định "123456"
                    sv = NguoiDung.builder()
                            .email(email)
                            .matKhau(passwordEncoder.encode("123456"))
                            .hoTen(hoTen)
                            .vaiTro(VaiTro.SINH_VIEN)
                            .build();
                    sv = nguoiDungRepository.save(sv);
                }

                if (sinhVienGiaoVienRepository.existsByGiaoVienAndSinhVien(gv, sv)) {
                    daTonTai++;
                    chiTietList.add(KetQuaThemHangLoatPhanHoi.ChiTietKetQua.builder()
                            .email(email)
                            .hoTen(sv.getHoTen())
                            .trangThai("DA_TON_TAI")
                            .thongBao("Đã có trong danh sách quản lý")
                            .build());
                    continue;
                }

                SinhVienGiaoVien svgv = SinhVienGiaoVien.builder()
                        .giaoVien(gv)
                        .sinhVien(sv)
                        .ghiChu(ghiChu)
                        .build();
                sinhVienGiaoVienRepository.save(svgv);

                thanhCong++;
                chiTietList.add(KetQuaThemHangLoatPhanHoi.ChiTietKetQua.builder()
                        .email(email)
                        .hoTen(sv.getHoTen())
                        .trangThai("THANH_CONG")
                        .thongBao("Đã thêm thành công")
                        .build());

            } catch (Exception e) {
                loi++;
                chiTietList.add(KetQuaThemHangLoatPhanHoi.ChiTietKetQua.builder()
                        .email(email)
                        .hoTen(hoTen)
                        .trangThai("LOI")
                        .thongBao("Lỗi: " + e.getMessage())
                        .build());
            }
        }

        return KetQuaThemHangLoatPhanHoi.builder()
                .tongSo(emailDaXuLyTrongDot.size())
                .thanhCong(thanhCong)
                .daTonTai(daTonTai)
                .loi(loi)
                .chiTiet(chiTietList)
                .build();
    }

    @Transactional
    public void xoaSinhVien(Long id) {
        NguoiDung gv = tienIchNguoiDung.layNguoiDungHienTai();
        SinhVienGiaoVien svgv = sinhVienGiaoVienRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay ban ghi sinh vien quan ly voi ID: " + id));

        if (gv.getVaiTro() != VaiTro.ADMIN && !svgv.getGiaoVien().getId().equals(gv.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen xoa sinh vien khoi danh sach nay");
        }

        sinhVienGiaoVienRepository.delete(svgv);
    }

    public List<NguoiDungPhanHoi> timKiemSinhVien(String tuKhoa) {
        String tk = tuKhoa != null ? tuKhoa.trim() : "";
        List<NguoiDung> ds = tk.isEmpty()
                ? nguoiDungRepository.findByVaiTro(VaiTro.SINH_VIEN)
                : nguoiDungRepository.timKiemTheoVaiTroVaTuKhoa(VaiTro.SINH_VIEN, tk);

        return ds.stream().map(NguoiDungPhanHoi::tuThucThe).collect(Collectors.toList());
    }
}
