package com.aiclassroom.sinh_vien.bai_nop;

import com.aiclassroom.dung_chung.bai_tap.BaiTap;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bai_nop", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"bai_tap_id", "sinh_vien_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaiNop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bai_tap_id", nullable = false)
    private BaiTap baiTap;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sinh_vien_id", nullable = false)
    private NguoiDung sinhVien;

    @Column(columnDefinition = "TEXT")
    private String noiDung;

    @Column(length = 500)
    private String tepNop;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ngayNop;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TrangThaiBaiNop trangThai;
}
