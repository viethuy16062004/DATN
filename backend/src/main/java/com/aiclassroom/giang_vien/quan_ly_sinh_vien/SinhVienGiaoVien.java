package com.aiclassroom.giang_vien.quan_ly_sinh_vien;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "sinh_vien_giao_vien",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"giao_vien_id", "sinh_vien_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SinhVienGiaoVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", nullable = false)
    private NguoiDung giaoVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sinh_vien_id", nullable = false)
    private NguoiDung sinhVien;

    @Column(length = 255)
    private String ghiChu;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ngayTao;
}
