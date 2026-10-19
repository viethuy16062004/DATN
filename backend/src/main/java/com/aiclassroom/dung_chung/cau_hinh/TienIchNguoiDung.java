package com.aiclassroom.dung_chung.cau_hinh;

import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongCoQuyen;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TienIchNguoiDung {

    private final NguoiDungRepository nguoiDungRepository;

    public NguoiDung layNguoiDungHienTai() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new NgoaiLeKhongCoQuyen("Chua dang nhap");
        }
        String email = authentication.getName();
        return nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new NgoaiLeKhongCoQuyen("Khong tim thay thong tin nguoi dung hien tai"));
    }
}
