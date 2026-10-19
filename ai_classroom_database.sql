-- ==============================================================================
-- DATABASE INITIALIZATION SCRIPT FOR AI CLASSROOM
-- HỆ THỐNG QUẢN LÝ LỚP HỌC TRỰC TUYẾN TÍCH HỢP AI
-- ==============================================================================

-- 1. Tạo Database
CREATE DATABASE IF NOT EXISTS `ai_classroom` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `ai_classroom`;

-- Tắt kiểm tra khóa ngoại tạm thời để khởi tạo
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Xóa các bảng cũ nếu tồn tại
DROP TABLE IF EXISTS `thong_bao`;
DROP TABLE IF EXISTS `tien_do`;
DROP TABLE IF EXISTS `cham_diem`;
DROP TABLE IF EXISTS `bai_nop`;
DROP TABLE IF EXISTS `bai_tap`;
DROP TABLE IF EXISTS `thanh_vien_lop`;
DROP TABLE IF EXISTS `lop_hoc`;
DROP TABLE IF EXISTS `lich_su_ai`;
DROP TABLE IF EXISTS `nguoi_dung`;

-- ==============================================================================
-- 3. Tạo Cấu Trúc Bảng (TABLE SCHEMAS)
-- ==============================================================================

-- Bảng Người dùng (nguoi_dung)
CREATE TABLE `nguoi_dung` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `mat_khau` VARCHAR(255) NOT NULL,
  `ho_ten` VARCHAR(100) NOT NULL,
  `so_dien_thoai` VARCHAR(20),
  `vai_tro` ENUM('ADMIN', 'GIAO_VIEN', 'SINH_VIEN') NOT NULL DEFAULT 'SINH_VIEN',
  `anh_dai_dien` VARCHAR(255),
  `ngay_tao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Lớp học (lop_hoc)
CREATE TABLE `lop_hoc` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `ten_lop` VARCHAR(200) NOT NULL,
  `mo_ta` TEXT,
  `ma_lop` VARCHAR(50) NOT NULL UNIQUE,
  `anh_bia` VARCHAR(255) DEFAULT 'from-blue-600 to-indigo-700',
  `giao_vien_id` BIGINT NOT NULL,
  `ngay_tao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lop_giao_vien` FOREIGN KEY (`giao_vien_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Thành viên lớp học (thanh_vien_lop)
CREATE TABLE `thanh_vien_lop` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `lop_hoc_id` BIGINT NOT NULL,
  `sinh_vien_id` BIGINT NOT NULL,
  `ngay_tham_gia` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_lop_sinh_vien` (`lop_hoc_id`, `sinh_vien_id`),
  CONSTRAINT `fk_tv_lop` FOREIGN KEY (`lop_hoc_id`) REFERENCES `lop_hoc` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tv_sinh_vien` FOREIGN KEY (`sinh_vien_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Bài tập (bai_tap)
CREATE TABLE `bai_tap` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `lop_hoc_id` BIGINT NOT NULL,
  `tieu_de` VARCHAR(255) NOT NULL,
  `noi_dung` LONGTEXT,
  `han_nop` DATETIME NOT NULL,
  `diem_toi_da` DOUBLE DEFAULT 10.0,
  `tep_dinh_kem` VARCHAR(255),
  `ngay_tao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bt_lop` FOREIGN KEY (`lop_hoc_id`) REFERENCES `lop_hoc` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Bài nộp (bai_nop)
CREATE TABLE `bai_nop` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `bai_tap_id` BIGINT NOT NULL,
  `sinh_vien_id` BIGINT NOT NULL,
  `noi_dung` LONGTEXT,
  `tep_nop` VARCHAR(255),
  `trang_thai` ENUM('CHUA_NOP', 'DA_NOP', 'NOP_MUON', 'DA_CHAM') NOT NULL DEFAULT 'DA_NOP',
  `ngay_nop` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bn_bai_tap` FOREIGN KEY (`bai_tap_id`) REFERENCES `bai_tap` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bn_sinh_vien` FOREIGN KEY (`sinh_vien_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Chấm điểm & Nhận xét (cham_diem)
CREATE TABLE `cham_diem` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `bai_nop_id` BIGINT NOT NULL UNIQUE,
  `giao_vien_id` BIGINT NOT NULL,
  `diem_so` DOUBLE NOT NULL,
  `nhan_xet` TEXT,
  `ngay_cham` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cd_bai_nop` FOREIGN KEY (`bai_nop_id`) REFERENCES `bai_nop` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cd_giao_vien` FOREIGN KEY (`giao_vien_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Tiến độ học tập (tien_do)
CREATE TABLE `tien_do` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `sinh_vien_id` BIGINT NOT NULL,
  `lop_hoc_id` BIGINT NOT NULL,
  `tong_bai_tap` INT DEFAULT 0,
  `so_bai_da_nop` INT DEFAULT 0,
  `so_bai_da_cham` INT DEFAULT 0,
  `diem_trung_binh` DOUBLE DEFAULT 0.0,
  `phan_tram_hoan_thanh` DOUBLE DEFAULT 0.0,
  `ngay_cap_nhat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_td_sinh_vien_lop` (`sinh_vien_id`, `lop_hoc_id`),
  CONSTRAINT `fk_td_sinh_vien` FOREIGN KEY (`sinh_vien_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_td_lop_hoc` FOREIGN KEY (`lop_hoc_id`) REFERENCES `lop_hoc` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Thông báo (thong_bao)
CREATE TABLE `thong_bao` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `nguoi_nhan_id` BIGINT NOT NULL,
  `tieu_de` VARCHAR(255) NOT NULL,
  `noi_dung` TEXT,
  `loai_thong_bao` VARCHAR(50) DEFAULT 'HE_THONG',
  `lien_ket` VARCHAR(255),
  `da_doc` BOOLEAN DEFAULT FALSE,
  `ngay_tao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tb_nguoi_nhan` FOREIGN KEY (`nguoi_nhan_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Lịch sử tương tác AI (lich_su_ai)
CREATE TABLE `lich_su_ai` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `nguoi_dung_id` BIGINT NOT NULL,
  `cau_hoi` LONGTEXT NOT NULL,
  `cau_tra_loi` LONGTEXT NOT NULL,
  `ngay_tao` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ai_nguoi_dung` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 4. NẠP DỮ LIỆU MẪU (Mật khẩu cho tất cả tài khoản: 123456)
-- Password Hash: $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
-- ==============================================================================

-- 4.1. Tạo Người dùng mẫu
INSERT INTO `nguoi_dung` (`id`, `email`, `mat_khau`, `ho_ten`, `so_dien_thoai`, `vai_tro`) VALUES
(1, 'admin@aiclassroom.edu.vn', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Quản Trị Viên Hệ Thống', '0901234567', 'ADMIN'),
(2, 'giaovien@aiclassroom.edu.vn', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'TS. Lê Hoàng Nam', '0912345678', 'GIAO_VIEN'),
(3, 'sinhvien@aiclassroom.edu.vn', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Nguyễn Văn An', '0923456789', 'SINH_VIEN'),
(4, 'sinhvien2@aiclassroom.edu.vn', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Trần Thị Bích', '0934567890', 'SINH_VIEN');

-- 4.2. Tạo Lớp học mẫu
INSERT INTO `lop_hoc` (`id`, `ten_lop`, `mo_ta`, `ma_lop`, `anh_bia`, `giao_vien_id`) VALUES
(1, 'Lập Trình Web Nâng Cao & React', 'Khóa học xây dựng ứng dụng web hiện đại với React 19, Spring Boot 3 và Tích hợp Trí tuệ nhân tạo (AI).', 'WEB2026', 'from-blue-600 to-indigo-700', 2),
(2, 'Cấu Trúc Dữ Liệu & Giải Thuật AI', 'Nghiên cứu cấu trúc dữ liệu nâng cao, thuật toán tìm kiếm, quy hoạch động và thuật toán đồ thị.', 'DSA2026', 'from-emerald-600 to-teal-700', 2);

-- 4.3. Thêm Sinh viên vào lớp
INSERT INTO `thanh_vien_lop` (`id`, `lop_hoc_id`, `sinh_vien_id`) VALUES
(1, 1, 3),
(2, 1, 4),
(3, 2, 3);

-- 4.4. Tạo Bài tập mẫu
INSERT INTO `bai_tap` (`id`, `lop_hoc_id`, `tieu_de`, `noi_dung`, `han_nop`, `diem_toi_da`) VALUES
(1, 1, 'Bài tập 1: Thiết kế Giao diện Quản trị với Tailwind CSS & React', 'Xây dựng layout Dashboard quản trị viên responsive, tích hợp component Sidebar, Navbar và Breadcrumb theo phong cách Google Classroom + Notion.', DATE_ADD(NOW(), INTERVAL 2 DAY), 10.0),
(2, 1, 'Bài tập 2: Xây dựng RESTful API Spring Boot & Spring Security JWT', 'Cấu hình bảo mật JWT Token, phân quyền RBAC cho 3 nhóm người dùng: ADMIN, GIAO_VIEN, SINH_VIEN.', DATE_ADD(NOW(), INTERVAL 5 DAY), 10.0),
(3, 2, 'Bài tập 1: Cài đặt thuật toán Dijkstra và A* Pathfinding', 'Cài đặt thuật toán tìm đường đi ngắn nhất Dijkstra và A* ứng dụng trong bài toán điều hướng Robot.', DATE_ADD(NOW(), INTERVAL 18 HOUR), 10.0);

-- 4.5. Tạo Bài nộp mẫu
INSERT INTO `bai_nop` (`id`, `bai_tap_id`, `sinh_vien_id`, `noi_dung`, `tep_nop`, `trang_thai`) VALUES
(1, 1, 3, 'Em gửi link Github bài làm: https://github.com/nguyenvanan/react-dashboard-assignment. Em đã hoàn thành đủ các tiêu chí layout Notion.', 'https://example.com/bai-lam-an.zip', 'DA_CHAM');

-- 4.6. Chấm điểm bài nộp
INSERT INTO `cham_diem` (`id`, `bai_nop_id`, `giao_vien_id`, `diem_so`, `nhan_xet`) VALUES
(1, 1, 2, 9.5, 'Giao diện rất trực quan, thiết kế chuẩn Notion/Google Classroom, responsive mượt mà.');

-- 4.7. Tiến độ học tập
INSERT INTO `tien_do` (`id`, `sinh_vien_id`, `lop_hoc_id`, `tong_bai_tap`, `so_bai_da_nop`, `so_bai_da_cham`, `diem_trung_binh`, `phan_tram_hoan_thanh`) VALUES
(1, 3, 1, 2, 1, 1, 9.5, 50.0),
(2, 4, 1, 2, 0, 0, 0.0, 0.0),
(3, 3, 2, 1, 0, 0, 0.0, 0.0);

-- 4.8. Thông báo mẫu
INSERT INTO `thong_bao` (`id`, `nguoi_nhan_id`, `tieu_de`, `noi_dung`, `loai_thong_bao`, `lien_ket`, `da_doc`) VALUES
(1, 3, 'Chào mừng đến với AI CLASSROOM!', 'Hệ thống quản lý học tập thông minh tích hợp AI hỗ trợ học tập trực tuyến 24/7.', 'HE_THONG', '/', 1),
(2, 3, 'Bài tập đã được chấm điểm: Bài tập 1', 'Giảng viên đã chấm: 9.5 / 10 điểm kèm nhận xét đánh giá.', 'BAI_TAP_DA_CHAM', '/sinh-vien/tien-do', 0);

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- HOÀN TẤT NẠP DỮ LIỆU THÀNH CÔNG VÀO DATABASE ai_classroom!
-- ==============================================================================
