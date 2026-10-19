package com.aiclassroom.dung_chung.thong_bao;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "thong_bao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThongBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nguoi_nhan_id", nullable = false)
    private NguoiDung nguoiNhan;

    @Column(nullable = false, length = 200)
    private String tieuDe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String noiDung;

    @Column(nullable = false)
    @Builder.Default
    private Boolean daDoc = false;

    @Column(length = 50)
    private String loaiThongBao;

    @Column(length = 255)
    private String lienKet;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ngayTao;
}
