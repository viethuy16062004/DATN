package com.aiclassroom.dung_chung.xac_thuc;

import com.aiclassroom.dung_chung.cau_hinh.TienIchJwt;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongHopLe;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungRepository;
import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DichVuXacThuc {

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TienIchJwt tienIchJwt;

    @Transactional
    public XacThucPhanHoi dangKy(DangKyYeuCau yeuCau) {
        String email = yeuCau.getEmail().trim().toLowerCase();
        java.util.Optional<NguoiDung> existingOpt = nguoiDungRepository.findByEmail(email);
        NguoiDung nguoiDung;

        if (existingOpt.isPresent()) {
            NguoiDung existing = existingOpt.get();
            // Nếu tài khoản sinh viên đã được giáo viên thêm trước vào danh sách quản lý
            if (existing.getVaiTro() == VaiTro.SINH_VIEN && yeuCau.getVaiTro() == VaiTro.SINH_VIEN) {
                existing.setMatKhau(passwordEncoder.encode(yeuCau.getMatKhau()));
                if (yeuCau.getHoTen() != null && !yeuCau.getHoTen().trim().isEmpty()) {
                    existing.setHoTen(yeuCau.getHoTen().trim());
                }
                if (yeuCau.getSoDienThoai() != null && !yeuCau.getSoDienThoai().trim().isEmpty()) {
                    existing.setSoDienThoai(yeuCau.getSoDienThoai().trim());
                }
                nguoiDung = nguoiDungRepository.save(existing);
            } else {
                throw new NgoaiLeKhongHopLe("Email nay da duoc su dung");
            }
        } else {
            nguoiDung = NguoiDung.builder()
                    .email(email)
                    .matKhau(passwordEncoder.encode(yeuCau.getMatKhau()))
                    .hoTen(yeuCau.getHoTen())
                    .vaiTro(yeuCau.getVaiTro())
                    .soDienThoai(yeuCau.getSoDienThoai())
                    .build();
            nguoiDung = nguoiDungRepository.save(nguoiDung);
        }

        String token = tienIchJwt.taoToken(
                nguoiDung.getEmail(),
                nguoiDung.getVaiTro().name(),
                nguoiDung.getId(),
                nguoiDung.getHoTen()
        );

        return XacThucPhanHoi.builder()
                .token(token)
                .id(nguoiDung.getId())
                .email(nguoiDung.getEmail())
                .hoTen(nguoiDung.getHoTen())
                .vaiTro(nguoiDung.getVaiTro())
                .anhDaiDien(nguoiDung.getAnhDaiDien())
                .soDienThoai(nguoiDung.getSoDienThoai())
                .build();
    }

    public XacThucPhanHoi dangNhap(DangNhapYeuCau yeuCau) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(yeuCau.getEmail(), yeuCau.getMatKhau())
        );

        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(yeuCau.getEmail())
                .orElseThrow(() -> new NgoaiLeKhongHopLe("Tai khoan khong ton tai"));

        String token = tienIchJwt.taoToken(
                nguoiDung.getEmail(),
                nguoiDung.getVaiTro().name(),
                nguoiDung.getId(),
                nguoiDung.getHoTen()
        );

        return XacThucPhanHoi.builder()
                .token(token)
                .id(nguoiDung.getId())
                .email(nguoiDung.getEmail())
                .hoTen(nguoiDung.getHoTen())
                .vaiTro(nguoiDung.getVaiTro())
                .anhDaiDien(nguoiDung.getAnhDaiDien())
                .soDienThoai(nguoiDung.getSoDienThoai())
                .build();
    }
}
