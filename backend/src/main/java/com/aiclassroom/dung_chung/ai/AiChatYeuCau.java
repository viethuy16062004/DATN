package com.aiclassroom.dung_chung.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatYeuCau {
    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String tinNhan;
    private String nguCanh;
}
