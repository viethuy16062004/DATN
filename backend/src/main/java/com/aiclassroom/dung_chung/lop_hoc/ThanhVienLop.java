package com.aiclassroom.dung_chung.lop_hoc;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "thanh_vien_lop", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"lop_hoc_id", "sinh_vien_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThanhVienLop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lop_hoc_id", nullable = false)
    private LopHoc lopHoc;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sinh_vien_id", nullable = false)
    private NguoiDung sinhVien;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ngayThamGia;
}
