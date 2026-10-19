package com.aiclassroom.dung_chung.ngoai_le;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class XuLyNgoaiLeToanCuc {

    @ExceptionHandler(NgoaiLeKhongTimThay.class)
    public ResponseEntity<PhanHoiLoi> xuLyKhongTimThay(NgoaiLeKhongTimThay ex, HttpServletRequest request) {
        PhanHoiLoi loi = PhanHoiLoi.builder()
                .thoiGian(LocalDateTime.now())
                .maTrangThai(HttpStatus.NOT_FOUND.value())
                .loi(HttpStatus.NOT_FOUND.getReasonPhrase())
                .thongDiep(ex.getMessage())
                .duongDan(request.getRequestURI())
                .build();
        return new ResponseEntity<>(loi, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NgoaiLeKhongHopLe.class)
    public ResponseEntity<PhanHoiLoi> xuLyKhongHopLe(NgoaiLeKhongHopLe ex, HttpServletRequest request) {
        PhanHoiLoi loi = PhanHoiLoi.builder()
                .thoiGian(LocalDateTime.now())
                .maTrangThai(HttpStatus.BAD_REQUEST.value())
                .loi(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .thongDiep(ex.getMessage())
                .duongDan(request.getRequestURI())
                .build();
        return new ResponseEntity<>(loi, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NgoaiLeKhongCoQuyen.class)
    public ResponseEntity<PhanHoiLoi> xuLyKhongCoQuyen(NgoaiLeKhongCoQuyen ex, HttpServletRequest request) {
        PhanHoiLoi loi = PhanHoiLoi.builder()
                .thoiGian(LocalDateTime.now())
                .maTrangThai(HttpStatus.FORBIDDEN.value())
                .loi(HttpStatus.FORBIDDEN.getReasonPhrase())
                .thongDiep(ex.getMessage())
                .duongDan(request.getRequestURI())
                .build();
        return new ResponseEntity<>(loi, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<PhanHoiLoi> xuLyAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        PhanHoiLoi loi = PhanHoiLoi.builder()
                .thoiGian(LocalDateTime.now())
                .maTrangThai(HttpStatus.FORBIDDEN.value())
                .loi("Khong co quyen truy cap")
                .thongDiep("Ban khong co quyen thuc hien hanh dong nay")
                .duongDan(request.getRequestURI())
                .build();
        return new ResponseEntity<>(loi, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<PhanHoiLoi> xuLyBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        PhanHoiLoi loi = PhanHoiLoi.builder()
                .thoiGian(LocalDateTime.now())
                .maTrangThai(HttpStatus.UNAUTHORIZED.value())
                .loi("Xac thuc that bai")
                .thongDiep("Email hoac mat khau khong chinh xac")
                .duongDan(request.getRequestURI())
                .build();
        return new ResponseEntity<>(loi, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<PhanHoiLoi> xuLyValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> chiTietLoi = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            chiTietLoi.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        PhanHoiLoi loi = PhanHoiLoi.builder()
                .thoiGian(LocalDateTime.now())
                .maTrangThai(HttpStatus.BAD_REQUEST.value())
                .loi("Du lieu khong hop le")
                .thongDiep(chiTietLoi.toString())
                .duongDan(request.getRequestURI())
                .build();
        return new ResponseEntity<>(loi, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<PhanHoiLoi> xuLyLoiChung(Exception ex, HttpServletRequest request) {
        PhanHoiLoi loi = PhanHoiLoi.builder()
                .thoiGian(LocalDateTime.now())
                .maTrangThai(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .loi("Loi he thong")
                .thongDiep(ex.getMessage() != null ? ex.getMessage() : "Da xay ra loi khong mong muon")
                .duongDan(request.getRequestURI())
                .build();
        return new ResponseEntity<>(loi, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
