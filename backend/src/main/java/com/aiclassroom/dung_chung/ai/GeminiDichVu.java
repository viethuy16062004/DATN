package com.aiclassroom.dung_chung.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiDichVu {

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api-key:AIzaSyDMA_PIfqUYcVq-50sEd2xmA64raIypyBU}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-3.5-flash-lite}")
    private String geminiModel;

    private static final List<String> DANH_SACH_MODEL_DU_PHONG = List.of(
            "gemini-3.5-flash-lite",
            "gemini-3.1-flash-lite",
            "gemini-3-flash-preview",
            "gemma-4-26b-a4b-it",
            "gemini-2.5-flash"
    );

    public String goiGemini(String promptHeThong, String promptNguoiDung) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            log.warn("Chưa cấu hình GEMINI_API_KEY");
            return null;
        }

        String combinedPrompt = (promptHeThong != null && !promptHeThong.isBlank())
                ? (promptHeThong + "\n\n" + promptNguoiDung)
                : promptNguoiDung;

        // Thử model chính trước
        String ketQua = goiGeminiModel(geminiModel, combinedPrompt);
        if (ketQua != null && !ketQua.isBlank()) {
            return ketQua;
        }

        // Thử lần lượt các model dự phòng
        for (String modelPhu : DANH_SACH_MODEL_DU_PHONG) {
            if (!modelPhu.equalsIgnoreCase(geminiModel)) {
                log.info("Đang chuyển sang model dự phòng: {}", modelPhu);
                ketQua = goiGeminiModel(modelPhu, combinedPrompt);
                if (ketQua != null && !ketQua.isBlank()) {
                    return ketQua;
                }
            }
        }

        return null;
    }

    private String goiGeminiModel(String modelName, String combinedPrompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" 
                + modelName + ":generateContent?key=" + geminiApiKey;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", combinedPrompt)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 2048
                )
        );

        try {
            String rawJson = webClientBuilder.build()
                    .post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (rawJson != null) {
                JsonNode root = objectMapper.readTree(rawJson);
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    if (!textNode.isMissingNode()) {
                        return textNode.asText();
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Gọi model {} thất bại: {}", modelName, e.getMessage());
        }
        return null;
    }
}
