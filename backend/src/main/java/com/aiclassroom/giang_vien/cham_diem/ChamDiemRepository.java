package com.aiclassroom.giang_vien.cham_diem;

import com.aiclassroom.sinh_vien.bai_nop.BaiNop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChamDiemRepository extends JpaRepository<ChamDiem, Long> {
    Optional<ChamDiem> findByBaiNop(BaiNop baiNop);
    Optional<ChamDiem> findByBaiNopId(Long baiNopId);
    List<ChamDiem> findByBaiNopIn(List<BaiNop> baiNops);
}
