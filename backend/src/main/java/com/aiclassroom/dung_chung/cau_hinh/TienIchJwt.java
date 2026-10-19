package com.aiclassroom.dung_chung.cau_hinh;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class TienIchJwt {

    @Value("${app.jwt.secret}")
    private String biMatJwt;

    @Value("${app.jwt.expiration-ms}")
    private long thoiGianHetHan;

    private SecretKey layKhoaBiMat() {
        return Keys.hmacShaKeyFor(biMatJwt.getBytes(StandardCharsets.UTF_8));
    }

    public String taoToken(String email, String vaiTro, Long id, String hoTen) {
        Date bayGio = new Date();
        Date ngayHetHan = new Date(bayGio.getTime() + thoiGianHetHan);

        return Jwts.builder()
                .subject(email)
                .claim("id", id)
                .claim("vaiTro", vaiTro)
                .claim("hoTen", hoTen)
                .issuedAt(bayGio)
                .expiration(ngayHetHan)
                .signWith(layKhoaBiMat(), Jwts.SIG.HS256)
                .compact();
    }

    public String layEmailTuToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(layKhoaBiMat())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public boolean xacThucToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(layKhoaBiMat())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
