# AI CLASSROOM - Nền Tảng Quản Lý Lớp Học Trực Tuyến Tích Hợp AI

Website quản lý lớp học trực tuyến phong cách Google Classroom + Notion, được tích hợp 4 tính năng AI thông minh sử dụng **Google Gemini API** hỗ trợ sinh viên và giảng viên.

---

## 1. Kiến Trúc Hệ Thống

```
React (Frontend) ──> Spring Boot (Backend) ──> MySQL Database
                            │
                      AI Gateway (Node.js)
                            │
                    Google Gemini API
```

> **Bảo mật**: Khóa Gemini API Key được quản lý độc lập tại `AI Gateway` và được gọi thông qua Backend Spring Boot, tuyệt đối không bị lộ ở Frontend.

---

## 2. Công Nghệ Sử Dụng

### Frontend
- **React 18 / 19** + **Vite**
- **Tailwind CSS** (Thiết kế hiện đại, bảng màu Slate/Blue/Emerald, hỗ trợ Glassmorphism)
- **Axios** (JWT interceptor tự động đính kèm Token)
- **React Router v6** (Phân quyền và bảo vệ tuyến đường `BaoVeTuyenDuong`)
- **Lucide React** (Bộ biểu tượng giao diện)
- **Recharts** (Biểu đồ tiến độ, phân bố điểm và thống kê người dùng)

### Backend
- **Java 21** + **Spring Boot 3.2+**
- **Spring Security** + **JWT (jjwt 0.12.5)** + **BCrypt**
- **Spring Data JPA / Hibernate**
- **Maven**
- Kiến trúc chuẩn module: `Entity`, `Controller`, `Service`, `Repository`, `DTO`.
- Toàn bộ tên file và tên class bằng tiếng Việt không dấu (e.g. `NguoiDung.java`, `LopHoc.java`, `BaiTap.java`, `BaiNop.java`, `ChamDiem.java`, `TienDo.java`, `ThongBao.java`, `LichSuAi.java`).

### AI Service (AI Gateway)
- **Node.js** + **Express**
- **Google Generative AI SDK** (`gemini-1.5-flash`)
- Cơ chế Fallback thông minh đảm bảo hệ thống luôn sẵn sàng 100%.

### Database
- **MySQL 8+**
- Các bảng: `nguoi_dung`, `lop_hoc`, `thanh_vien_lop`, `bai_tap`, `bai_nop`, `cham_diem`, `tien_do`, `thong_bao`, `lich_su_ai`.

---

## 3. Vai Trò & Chức Năng

### 1. ADMIN (Quản trị viên)
- Đăng nhập, xem tổng quan hệ thống qua biểu đồ Recharts.
- Quản lý danh sách người dùng (tìm kiếm, lọc theo vai trò, phân quyền vai trò, xóa tài khoản).
- Giám sát toàn bộ lớp học và bài tập trên hệ thống.

### 2. GIAO_VIEN (Giảng viên)
- Tạo mới, chỉnh sửa, xóa lớp học. Mỗi lớp được cấp 1 mã tham gia ngẫu nhiên (ví dụ: `WEB2026`).
- Quản lý sinh viên trong lớp, xóa sinh viên khỏi lớp.
- Tạo, sửa, xóa bài tập với thời hạn nộp bài (deadline) và thang điểm tối đa.
- Xem danh sách bài nộp của sinh viên, tải tệp bài làm.
- Chấm điểm và ghi nhận xét sư phạm. Hệ thống tự động tính điểm trung bình và cập nhật tiến độ cho sinh viên.
- **AI Phân tích lớp**: Tự động phân tích chất lượng học tập, thống kê tỉ lệ nộp bài, phát hiện sinh viên cần hỗ trợ và đề xuất phương pháp sư phạm.

### 3. SINH_VIEN (Sinh viên)
- Đăng ký, đăng nhập tài khoản.
- Tham gia lớp học bằng mã tham gia (Class Code).
- Xem danh sách lớp học, bài tập và theo dõi hạn nộp (Deadline).
- Nộp bài tập (văn bản giải trình + link tệp/Github/Drive).
- Xem kết quả chấm điểm và lời nhận xét chi tiết của giảng viên.
- Theo dõi tiến độ học tập qua biểu đồ trực quan.
- **3 Tính năng AI hỗ trợ học tập**:
  1. **AI Ưu tiên bài tập**: Sắp xếp thứ tự ưu tiên làm bài dựa trên mức độ khẩn cấp của deadline và trọng số điểm.
  2. **AI Định hướng cách làm bài**: Hướng dẫn tư duy và phương pháp từng bước, kiên quyết không giải bài hộ.
  3. **AI Tạo kế hoạch học tập**: Lập thời gian biểu chi tiết theo phiên học Pomodoro dựa trên số giờ học mỗi ngày.

---

## 4. Tài Khoản Trải Nghiệm Mẫu

Hệ thống được thiết lập sẵn tài khoản mẫu khi khởi động:

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `admin@aiclassroom.edu.vn` | `123456` |
| **Giảng viên (GIAO_VIEN)** | `giaovien@aiclassroom.edu.vn` | `123456` |
| **Sinh viên 1 (SINH_VIEN)** | `sinhvien@aiclassroom.edu.vn` | `123456` |
| **Sinh viên 2 (SINH_VIEN)** | `sinhvien2@aiclassroom.edu.vn` | `123456` |

---

## 5. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Cách 1: Chạy trực tiếp trên máy cục bộ (Local Development)

#### 1. Khởi động AI Gateway (Node.js)
```bash
cd ai-gateway
npm install
# Tạo file .env và điền GEMINI_API_KEY (tùy chọn)
node server.js
```
*AI Gateway sẽ chạy tại `http://localhost:5000`.*

#### 2. Khởi động Backend (Spring Boot 3)
Yêu cầu Java 21, Maven và MySQL 8+.
```bash
cd backend
mvn clean spring-boot:run
```
*Backend Spring Boot sẽ chạy tại `http://localhost:8080`.*

#### 3. Khởi động Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend sẽ chạy tại `http://localhost:3000` (hoặc `http://localhost:5173`).*

---

### Cách 2: Triển khai bằng Docker Compose (1 Lệnh duy nhất)

```bash
docker compose up --build -d
```

Sau khi các container khởi động thành công:
- **Frontend Web UI**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **AI Gateway**: `http://localhost:5000`
- **MySQL DB**: `localhost:3306`

---

## 6. Danh Sách Endpoint REST API Chính

- `POST /api/xac-thuc/dang-ky` : Đăng ký tài khoản
- `POST /api/xac-thuc/dang-nhap` : Đăng nhập & cấp JWT token
- `GET /api/lop-hoc` : Lấy danh sách lớp học
- `POST /api/lop-hoc` : Tạo lớp học mới
- `POST /api/lop-hoc/tham-gia` : Tham gia lớp học bằng mã
- `GET /api/bai-tap` : Lấy danh sách bài tập (hỗ trợ lọc theo `lopHocId`)
- `POST /api/bai-tap` : Tạo bài tập mới
- `GET /api/bai-nop` : Lấy danh sách bài nộp
- `POST /api/bai-nop` : Sinh viên nộp bài
- `POST /api/cham-diem` : Giảng viên chấm điểm bài nộp
- `GET /api/tien-do` : Xem tổng quan tiến độ học tập
- `POST /api/ai/uu-tien-bai-tap` : AI xếp thứ tự ưu tiên bài tập
- `POST /api/ai/dinh-huong-bai-tap` : AI hướng dẫn cách làm theo từng bước
- `POST /api/ai/tao-ke-hoach` : AI tạo kế hoạch học tập cá nhân
- `POST /api/ai/phan-tich-lop` : AI phân tích tiến độ lớp cho giảng viên
