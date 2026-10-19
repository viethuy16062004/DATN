package com.aiclassroom.giang_vien.quan_ly_sinh_vien;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SinhVienGiaoVienRepository extends JpaRepository<SinhVienGiaoVien, Long> {

    @Query("SELECT s FROM SinhVienGiaoVien s JOIN FETCH s.sinhVien WHERE s.giaoVien = :giaoVien ORDER BY s.ngayTao DESC")
    List<SinhVienGiaoVien> findByGiaoVienWithSinhVien(@Param("giaoVien") NguoiDung giaoVien);

    List<SinhVienGiaoVien> findByGiaoVien(NguoiDung giaoVien);

    boolean existsByGiaoVienAndSinhVien(NguoiDung giaoVien, NguoiDung sinhVien);

    Optional<SinhVienGiaoVien> findByGiaoVienAndSinhVien(NguoiDung giaoVien, NguoiDung sinhVien);

    long countByGiaoVien(NguoiDung giaoVien);
}
