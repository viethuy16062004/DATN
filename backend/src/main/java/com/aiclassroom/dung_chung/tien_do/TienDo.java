package com.aiclassroom.dung_chung.tien_do;

import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tien_do", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"sinh_vien_id", "lop_hoc_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TienDo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sinh_vien_id", nullable = false)
    private NguoiDung sinhVien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lop_hoc_id", nullable = false)
    private LopHoc lopHoc;

    @Column(nullable = false)
    @Builder.Default
    private Integer tongBaiTap = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer soBaiDaNop = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer soBaiDaCham = 0;

    @Column(nullable = false)
    @Builder.Default
    private Double diemTrungBinh = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double phanTramHoanThanh = 0.0;

    @UpdateTimestamp
    private LocalDateTime ngayCapNhat;
}
