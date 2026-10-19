package com.aiclassroom.dung_chung.bai_tap;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaoBaiTapYeuCau {

    @NotNull(message = "Lop hoc ID khong duoc de trong")
    private Long lopHocId;

    @NotBlank(message = "Tieu de khong duoc de trong")
    private String tieuDe;

    @NotBlank(message = "Noi dung khong duoc de trong")
    private String noiDung;

    @NotNull(message = "Han nop khong duoc de trong")
    private LocalDateTime hanNop;

    @NotNull(message = "Diem toi da khong duoc de trong")
    @Min(value = 1, message = "Diem toi da phai lon hon 0")
    private Double diemToiDa;

    private String tepDinhKem;
}
