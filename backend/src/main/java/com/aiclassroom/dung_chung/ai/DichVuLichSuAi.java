package com.aiclassroom.dung_chung.ai;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DichVuLichSuAi {

    private final LichSuAiRepository lichSuAiRepository;
    private final NguoiDungRepository nguoiDungRepository;

    public void luuLichSu(NguoiDung nd, String chucNang, String cauHoi, String ketQua) {
        if (nd == null) return;
        try {
            NguoiDung ndManaged = (nd.getId() != null) 
                    ? nguoiDungRepository.findById(nd.getId()).orElse(nd) 
                    : nd;

            LichSuAi ls = LichSuAi.builder()
                    .nguoiDung(ndManaged)
                    .chucNang(chucNang != null ? chucNang : "AI_ACTION")
                    .cauHoiDauVao(cauHoi)
                    .ketQuaAi(ketQua)
                    .build();

            lichSuAiRepository.save(ls);
        } catch (Throwable t) {
            log.warn("Lưu lịch sử AI không thành công (được bỏ qua an toàn để trả kết quả về cho người dùng): {}", t.getMessage());
        }
    }
}
