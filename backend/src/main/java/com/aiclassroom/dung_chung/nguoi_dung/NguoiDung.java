package com.aiclassroom.dung_chung.nguoi_dung;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "nguoi_dung")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NguoiDung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @JsonIgnore
    @Column(nullable = false, length = 255)
    private String matKhau;

    @Column(nullable = false, length = 100)
    private String hoTen;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VaiTro vaiTro;

    @Column(length = 500)
    private String anhDaiDien;

    @Column(length = 20)
    private String soDienThoai;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ngayTao;
}
