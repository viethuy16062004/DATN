package com.aiclassroom.dung_chung.ai;

import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_ai")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LichSuAi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung nguoiDung;

    @Column(nullable = false, length = 50)
    private String chucNang;

    @Column(name = "cau_hoi", columnDefinition = "LONGTEXT")
    private String cauHoiDauVao;

    @Column(name = "cau_tra_loi", columnDefinition = "LONGTEXT")
    private String ketQuaAi;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ngayTao;
}
