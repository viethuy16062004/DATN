package com.aiclassroom.dung_chung.tien_do;

import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TienDoRepository extends JpaRepository<TienDo, Long> {
    Optional<TienDo> findBySinhVienAndLopHoc(NguoiDung sinhVien, LopHoc lopHoc);
    Optional<TienDo> findBySinhVienIdAndLopHocId(Long sinhVienId, Long lopHocId);
    List<TienDo> findBySinhVien(NguoiDung sinhVien);
    List<TienDo> findBySinhVienId(Long sinhVienId);
    List<TienDo> findByLopHoc(LopHoc lopHoc);
    List<TienDo> findByLopHocId(Long lopHocId);
}
