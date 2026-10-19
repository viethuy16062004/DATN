package com.aiclassroom.dung_chung.lop_hoc;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThanhVienLopRepository extends JpaRepository<ThanhVienLop, Long> {
    List<ThanhVienLop> findByLopHoc(LopHoc lopHoc);
    List<ThanhVienLop> findByLopHocId(Long lopHocId);
    List<ThanhVienLop> findBySinhVien(NguoiDung sinhVien);
    List<ThanhVienLop> findBySinhVienId(Long sinhVienId);
    boolean existsByLopHocAndSinhVien(LopHoc lopHoc, NguoiDung sinhVien);
    Optional<ThanhVienLop> findByLopHocAndSinhVien(LopHoc lopHoc, NguoiDung sinhVien);
    long countByLopHoc(LopHoc lopHoc);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(tv) FROM ThanhVienLop tv WHERE tv.sinhVien = :sinhVien AND tv.lopHoc.giaoVien = :giaoVien")
    long countBySinhVienAndLopHocGiaoVien(@org.springframework.data.repository.query.Param("sinhVien") NguoiDung sinhVien, @org.springframework.data.repository.query.Param("giaoVien") NguoiDung giaoVien);
}
