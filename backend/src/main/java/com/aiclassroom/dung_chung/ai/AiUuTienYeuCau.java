package com.aiclassroom.dung_chung.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiUuTienYeuCau {
    private Long lopHocId; // Tuỳ chọn, nếu null thì phân tích toàn bộ các lớp của sinh viên
}
