package com.aiclassroom.dung_chung.bai_tap;

import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bai_tap")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaiTap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lop_hoc_id", nullable = false)
    private LopHoc lopHoc;

    @Column(nullable = false, length = 200)
    private String tieuDe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String noiDung;

    @Column(nullable = false)
    private LocalDateTime hanNop;

    @Column(nullable = false)
    private Double diemToiDa;

    @Column(length = 500)
    private String tepDinhKem;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ngayTao;
}
