package com.aiclassroom.dung_chung.lop_hoc;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LopHocRepository extends JpaRepository<LopHoc, Long> {
    Optional<LopHoc> findByMaLop(String maLop);
    boolean existsByMaLop(String maLop);
    List<LopHoc> findByGiaoVien(NguoiDung giaoVien);
    List<LopHoc> findByGiaoVienId(Long giaoVienId);
}
