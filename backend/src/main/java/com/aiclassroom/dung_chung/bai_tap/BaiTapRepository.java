package com.aiclassroom.dung_chung.bai_tap;

import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaiTapRepository extends JpaRepository<BaiTap, Long> {
    List<BaiTap> findByLopHocOrderByHanNopAsc(LopHoc lopHoc);
    List<BaiTap> findByLopHocIdOrderByHanNopAsc(Long lopHocId);
    List<BaiTap> findByLopHocInOrderByHanNopAsc(List<LopHoc> lopHocs);
    long countByLopHoc(LopHoc lopHoc);
    long countByLopHocId(Long lopHocId);
}
