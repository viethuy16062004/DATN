package com.aiclassroom.dung_chung.nguoi_dung;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {
    Optional<NguoiDung> findByEmail(String email);
    boolean existsByEmail(String email);
    List<NguoiDung> findByVaiTro(VaiTro vaiTro);
    long countByVaiTro(VaiTro vaiTro);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM NguoiDung u WHERE u.vaiTro = :vaiTro AND (LOWER(u.hoTen) LIKE LOWER(CONCAT('%', :tuKhoa, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :tuKhoa, '%')))")
    List<NguoiDung> timKiemTheoVaiTroVaTuKhoa(@org.springframework.data.repository.query.Param("vaiTro") VaiTro vaiTro, @org.springframework.data.repository.query.Param("tuKhoa") String tuKhoa);
}
