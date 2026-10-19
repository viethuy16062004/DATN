package com.aiclassroom.dung_chung.ai;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuAiRepository extends JpaRepository<LichSuAi, Long> {
    List<LichSuAi> findByNguoiDungOrderByNgayTaoDesc(NguoiDung nguoiDung);
    List<LichSuAi> findByNguoiDungIdOrderByNgayTaoDesc(Long nguoiDungId);
    List<LichSuAi> findByNguoiDungAndChucNangOrderByNgayTaoDesc(NguoiDung nguoiDung, String chucNang);
    List<LichSuAi> findAllByOrderByNgayTaoDesc();
}
