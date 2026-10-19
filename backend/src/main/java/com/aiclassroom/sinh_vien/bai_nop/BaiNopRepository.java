package com.aiclassroom.sinh_vien.bai_nop;

import com.aiclassroom.dung_chung.bai_tap.BaiTap;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BaiNopRepository extends JpaRepository<BaiNop, Long> {
    Optional<BaiNop> findByBaiTapAndSinhVien(BaiTap baiTap, NguoiDung sinhVien);
    Optional<BaiNop> findByBaiTapIdAndSinhVienId(Long baiTapId, Long sinhVienId);
    List<BaiNop> findByBaiTap(BaiTap baiTap);
    List<BaiNop> findByBaiTapId(Long baiTapId);
    List<BaiNop> findBySinhVien(NguoiDung sinhVien);
    List<BaiNop> findBySinhVienId(Long sinhVienId);
    List<BaiNop> findByBaiTapIn(List<BaiTap> baiTaps);
    long countByBaiTap(BaiTap baiTap);
    long countBySinhVien(NguoiDung sinhVien);
    long countByTrangThai(TrangThaiBaiNop trangThai);
}
