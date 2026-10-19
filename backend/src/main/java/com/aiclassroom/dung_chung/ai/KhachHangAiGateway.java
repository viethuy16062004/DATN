package com.aiclassroom.dung_chung.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class KhachHangAiGateway {

    private final WebClient.Builder webClientBuilder;

    @Value("${app.ai.gateway-url}")
    private String aiGatewayUrl;

    public Map<String, Object> goiAiGateway(String endpoint, Map<String, Object> body) {
        try {
            return webClientBuilder.build()
                    .post()
                    .uri(aiGatewayUrl + endpoint)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .timeout(Duration.ofSeconds(15))
                    .onErrorResume(e -> {
                        log.warn("Loi ket noi AI Gateway ({}): {}", endpoint, e.getMessage());
                        return Mono.empty();
                    })
                    .block();
        } catch (Exception e) {
            log.warn("Khong the goi AI Gateway: {}", e.getMessage());
            return null;
        }
    }
}
