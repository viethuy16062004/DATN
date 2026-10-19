package com.aiclassroom.dung_chung.lop_hoc;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lop_hoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LopHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String tenLop;

    @Column(columnDefinition = "TEXT")
    private String moTa;

    @Column(nullable = false, unique = true, length = 20)
    private String maLop;

    @Column(length = 255)
    private String anhBia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "giao_vien_id", nullable = false)
    private NguoiDung giaoVien;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ngayTao;
}
