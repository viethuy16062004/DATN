package com.aiclassroom.dung_chung.cau_hinh;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class CauHinhWeb {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
