package com.aiclassroom.admin;

import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoiVaiTroYeuCau {
    @NotNull(message = "Vai tro moi khong duoc de trong")
    private VaiTro vaiTroMoi;
}
