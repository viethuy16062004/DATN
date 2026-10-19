package com.aiclassroom.giang_vien.cham_diem;

import com.aiclassroom.sinh_vien.bai_nop.BaiNop;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cham_diem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChamDiem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bai_nop_id", nullable = false, unique = true)
    private BaiNop baiNop;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "giao_vien_id", nullable = false)
    private NguoiDung giaoVien;

    @Column(nullable = false)
    private Double diemSo;

    @Column(columnDefinition = "TEXT")
    private String nhanXet;

    @CreationTimestamp
    private LocalDateTime ngayCham;
}
