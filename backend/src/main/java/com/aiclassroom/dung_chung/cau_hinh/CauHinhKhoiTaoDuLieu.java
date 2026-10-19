package com.aiclassroom.dung_chung.cau_hinh;

import com.aiclassroom.sinh_vien.bai_nop.BaiNop;
import com.aiclassroom.sinh_vien.bai_nop.BaiNopRepository;
import com.aiclassroom.sinh_vien.bai_nop.TrangThaiBaiNop;
import com.aiclassroom.dung_chung.bai_tap.BaiTap;
import com.aiclassroom.dung_chung.bai_tap.BaiTapRepository;
import com.aiclassroom.giang_vien.cham_diem.ChamDiem;
import com.aiclassroom.giang_vien.cham_diem.ChamDiemRepository;
import com.aiclassroom.dung_chung.lop_hoc.LopHoc;
import com.aiclassroom.dung_chung.lop_hoc.LopHocRepository;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLop;
import com.aiclassroom.dung_chung.lop_hoc.ThanhVienLopRepository;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDungRepository;
import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import com.aiclassroom.dung_chung.thong_bao.ThongBao;
import com.aiclassroom.dung_chung.thong_bao.ThongBaoRepository;
import com.aiclassroom.dung_chung.tien_do.TienDo;
import com.aiclassroom.dung_chung.tien_do.TienDoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class CauHinhKhoiTaoDuLieu implements CommandLineRunner {

    private final NguoiDungRepository nguoiDungRepository;
    private final LopHocRepository lopHocRepository;
    private final ThanhVienLopRepository thanhVienLopRepository;
    private final BaiTapRepository baiTapRepository;
    private final BaiNopRepository baiNopRepository;
    private final ChamDiemRepository chamDiemRepository;
    private final TienDoRepository tienDoRepository;
    private final ThongBaoRepository thongBaoRepository;
    private final com.aiclassroom.giang_vien.quan_ly_sinh_vien.SinhVienGiaoVienRepository sinhVienGiaoVienRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (nguoiDungRepository.count() > 0) {
            log.info("Du lieu da ton tai trong he thong, dong bo lai mat khau tai khoan mau 123456...");
            nguoiDungRepository.findByEmail("sinhvien@aiclassroom.edu.vn").ifPresent(sv -> {
                if ("Nguyễn Văn An".equals(sv.getHoTen())) {
                    sv.setHoTen("Trần Việt Huy");
                    nguoiDungRepository.save(sv);
                }
            });
            nguoiDungRepository.findAll().forEach(nd -> {
                if (nd.getEmail().endsWith("@aiclassroom.edu.vn")) {
                    nd.setMatKhau(passwordEncoder.encode("123456"));
                    nguoiDungRepository.save(nd);
                }
            });

            // Dong bo danh sach quan ly sinh vien cho giang vien neu chua co
            nguoiDungRepository.findByEmail("giaovien@aiclassroom.edu.vn").ifPresent(gv -> {
                nguoiDungRepository.findByEmail("sinhvien@aiclassroom.edu.vn").ifPresent(sv1 -> {
                    if (!sinhVienGiaoVienRepository.existsByGiaoVienAndSinhVien(gv, sv1)) {
                        sinhVienGiaoVienRepository.save(com.aiclassroom.giang_vien.quan_ly_sinh_vien.SinhVienGiaoVien.builder()
                                .giaoVien(gv)
                                .sinhVien(sv1)
                                .ghiChu("Sinh viên chính khóa - Lớp KTPM K20")
                                .build());
                    }
                });
                nguoiDungRepository.findByEmail("sinhvien2@aiclassroom.edu.vn").ifPresent(sv2 -> {
                    if (!sinhVienGiaoVienRepository.existsByGiaoVienAndSinhVien(gv, sv2)) {
                        sinhVienGiaoVienRepository.save(com.aiclassroom.giang_vien.quan_ly_sinh_vien.SinhVienGiaoVien.builder()
                                .giaoVien(gv)
                                .sinhVien(sv2)
                                .ghiChu("Sinh viên chính khóa - Lớp HTTT K20")
                                .build());
                    }
                });
            });

            // Dong bo danh sach lop hoc va thanh vien lop cho sinh vien mau neu chua co
            nguoiDungRepository.findByEmail("sinhvien@aiclassroom.edu.vn").ifPresent(sv1 -> {
                lopHocRepository.findAll().forEach(lh -> {
                    if (!thanhVienLopRepository.existsByLopHocAndSinhVien(lh, sv1)) {
                        thanhVienLopRepository.save(ThanhVienLop.builder().lopHoc(lh).sinhVien(sv1).build());
                    }
                    if (!tienDoRepository.findBySinhVienAndLopHoc(sv1, lh).isPresent()) {
                        long tongBt = baiTapRepository.countByLopHoc(lh);
                        tienDoRepository.save(TienDo.builder()
                                .sinhVien(sv1)
                                .lopHoc(lh)
                                .tongBaiTap((int) tongBt)
                                .soBaiDaNop(0)
                                .soBaiDaCham(0)
                                .diemTrungBinh(0.0)
                                .phanTramHoanThanh(0.0)
                                .build());
                    }
                });
            });

            // Dong bo danh sach lop hoc va thanh vien lop cho sinh vien 2 neu chua co
            nguoiDungRepository.findByEmail("sinhvien2@aiclassroom.edu.vn").ifPresent(sv2 -> {
                lopHocRepository.findAll().forEach(lh -> {
                    if (!thanhVienLopRepository.existsByLopHocAndSinhVien(lh, sv2)) {
                        thanhVienLopRepository.save(ThanhVienLop.builder().lopHoc(lh).sinhVien(sv2).build());
                    }
                    if (!tienDoRepository.findBySinhVienAndLopHoc(sv2, lh).isPresent()) {
                        long tongBt = baiTapRepository.countByLopHoc(lh);
                        tienDoRepository.save(TienDo.builder()
                                .sinhVien(sv2)
                                .lopHoc(lh)
                                .tongBaiTap((int) tongBt)
                                .soBaiDaNop(0)
                                .soBaiDaCham(0)
                                .diemTrungBinh(0.0)
                                .phanTramHoanThanh(0.0)
                                .build());
                    }
                });

                // Neu sinhvien2 chua co bai nop nao, tao 1 bai nop dat diem 5.5 de the hien su khac biet ro ret ve AI ke hoach
                if (baiNopRepository.findBySinhVien(sv2).isEmpty()) {
                    List<BaiTap> btList = baiTapRepository.findAll();
                    if (!btList.isEmpty()) {
                        BaiTap bt = btList.get(0);
                        BaiNop bn2 = baiNopRepository.save(BaiNop.builder()
                                .baiTap(bt)
                                .sinhVien(sv2)
                                .noiDung("Em nộp bài tập ạ. Còn một số chức năng em chưa kịp làm xong.")
                                .tepNop("https://github.com/tranthibich/assignment-demo.zip")
                                .trangThai(TrangThaiBaiNop.DA_CHAM)
                                .build());

                        nguoiDungRepository.findByEmail("giaovien@aiclassroom.edu.vn").ifPresent(gv -> {
                            chamDiemRepository.save(ChamDiem.builder()
                                    .baiNop(bn2)
                                    .giaoVien(gv)
                                    .diemSo(5.5)
                                    .nhanXet("Bài làm chưa hoàn thiện tính năng, còn thiếu xử lý ngoại lệ và giao diện chưa responsive.")
                                    .build());

                            tienDoRepository.findBySinhVienAndLopHoc(sv2, bt.getLopHoc()).ifPresent(td -> {
                                td.setSoBaiDaNop(1);
                                td.setSoBaiDaCham(1);
                                td.setDiemTrungBinh(5.5);
                                td.setPhanTramHoanThanh(33.0);
                                tienDoRepository.save(td);
                            });
                        });
                    }
                }
            });

            return;
        }

        log.info("Bat dau khoi tao du lieu mau cho AI CLASSROOM...");

        // 1. Tao tai khoan Admin, Giao vien, Sinh vien
        NguoiDung admin = nguoiDungRepository.save(NguoiDung.builder()
                .email("admin@aiclassroom.edu.vn")
                .matKhau(passwordEncoder.encode("123456"))
                .hoTen("Quản Trị Viên Hệ Thống")
                .vaiTro(VaiTro.ADMIN)
                .soDienThoai("0901234567")
                .build());

        NguoiDung giaoVien = nguoiDungRepository.save(NguoiDung.builder()
                .email("giaovien@aiclassroom.edu.vn")
                .matKhau(passwordEncoder.encode("123456"))
                .hoTen("TS. Lê Hoàng Nam")
                .vaiTro(VaiTro.GIAO_VIEN)
                .soDienThoai("0912345678")
                .build());

        NguoiDung sinhVien1 = nguoiDungRepository.save(NguoiDung.builder()
                .email("sinhvien@aiclassroom.edu.vn")
                .matKhau(passwordEncoder.encode("123456"))
                .hoTen("Trần Việt Huy")
                .vaiTro(VaiTro.SINH_VIEN)
                .soDienThoai("0923456789")
                .build());

        NguoiDung sinhVien2 = nguoiDungRepository.save(NguoiDung.builder()
                .email("sinhvien2@aiclassroom.edu.vn")
                .matKhau(passwordEncoder.encode("123456"))
                .hoTen("Trần Thị Bích")
                .vaiTro(VaiTro.SINH_VIEN)
                .soDienThoai("0934567890")
                .build());

        // 2. Tao Lop hoc mau
        LopHoc lop1 = lopHocRepository.save(LopHoc.builder()
                .tenLop("Lập Trình Web Nâng Cao & React")
                .moTa("Khóa học xây dựng ứng dụng web hiện đại với React 19, Spring Boot 3 và Tích hợp Trí tuệ nhân tạo (AI).")
                .maLop("WEB2026")
                .anhBia("from-blue-600 to-indigo-700")
                .giaoVien(giaoVien)
                .build());

        LopHoc lop2 = lopHocRepository.save(LopHoc.builder()
                .tenLop("Cấu Trúc Dữ Liệu & Giải Thuật AI")
                .moTa("Nghiên cứu cấu trúc dữ liệu nâng cao, thuật toán tìm kiếm, quy hoạch động và thuật toán đồ thị.")
                .maLop("DSA2026")
                .anhBia("from-emerald-600 to-teal-700")
                .giaoVien(giaoVien)
                .build());

        // 3. Them sinh vien vao lop
        thanhVienLopRepository.save(ThanhVienLop.builder().lopHoc(lop1).sinhVien(sinhVien1).build());
        thanhVienLopRepository.save(ThanhVienLop.builder().lopHoc(lop1).sinhVien(sinhVien2).build());
        thanhVienLopRepository.save(ThanhVienLop.builder().lopHoc(lop2).sinhVien(sinhVien1).build());

        // 4. Tao bai tap mau
        BaiTap bt1 = baiTapRepository.save(BaiTap.builder()
                .lopHoc(lop1)
                .tieuDe("Bài tập 1: Thiết kế Giao diện Quản trị với Tailwind CSS & React")
                .noiDung("Xây dựng layout Dashboard quản trị viên responsive, tích hợp component Sidebar, Navbar và Recharts.")
                .hanNop(LocalDateTime.now().plusDays(2))
                .diemToiDa(10.0)
                .tepDinhKem("https://example.com/tail-react-guide.pdf")
                .build());

        BaiTap bt2 = baiTapRepository.save(BaiTap.builder()
                .lopHoc(lop1)
                .tieuDe("Bài tập 2: Xây dựng RESTful API Spring Boot & Spring Security JWT")
                .noiDung("Cấu hình bảo mật JWT Token, phân quyền RBAC cho 3 nhóm người dùng: ADMIN, GIAO_VIEN, SINH_VIEN.")
                .hanNop(LocalDateTime.now().plusDays(5))
                .diemToiDa(10.0)
                .build());

        BaiTap bt3 = baiTapRepository.save(BaiTap.builder()
                .lopHoc(lop2)
                .tieuDe("Bài tập 1: Cài đặt thuật toán Dijkstra và A* Pathfinding")
                .noiDung("Cài đặt thuật toán tìm đường đi ngắn nhất Dijkstra và A* ứng dụng trong bài toán điều hướng Robot.")
                .hanNop(LocalDateTime.now().plusHours(18))
                .diemToiDa(10.0)
                .build());

        // 5. Tao Bai nop mau & Cham diem
        BaiNop bn1 = baiNopRepository.save(BaiNop.builder()
                .baiTap(bt1)
                .sinhVien(sinhVien1)
                .noiDung("Em gửi link Github bài làm: https://github.com/nguyenvanan/react-dashboard-assignment. Em đã hoàn thành đủ các tiêu chí.")
                .tepNop("https://github.com/nguyenvanan/react-dashboard-assignment.zip")
                .trangThai(TrangThaiBaiNop.DA_CHAM)
                .build());

        chamDiemRepository.save(ChamDiem.builder()
                .baiNop(bn1)
                .giaoVien(giaoVien)
                .diemSo(9.5)
                .nhanXet("Giao diện rất trực quan, thiết kế chuẩn Notion/Google Classroom, responsive mượt mà.")
                .build());

        // 6. Khoi tao tien do
        tienDoRepository.save(TienDo.builder()
                .sinhVien(sinhVien1)
                .lopHoc(lop1)
                .tongBaiTap(2)
                .soBaiDaNop(1)
                .soBaiDaCham(1)
                .diemTrungBinh(9.5)
                .phanTramHoanThanh(50.0)
                .build());

        tienDoRepository.save(TienDo.builder()
                .sinhVien(sinhVien2)
                .lopHoc(lop1)
                .tongBaiTap(2)
                .soBaiDaNop(0)
                .soBaiDaCham(0)
                .diemTrungBinh(0.0)
                .phanTramHoanThanh(0.0)
                .build());

        tienDoRepository.save(TienDo.builder()
                .sinhVien(sinhVien1)
                .lopHoc(lop2)
                .tongBaiTap(1)
                .soBaiDaNop(0)
                .soBaiDaCham(0)
                .diemTrungBinh(0.0)
                .phanTramHoanThanh(0.0)
                .build());

        // 7. Thong bao mau
        thongBaoRepository.save(ThongBao.builder()
                .nguoiNhan(sinhVien1)
                .tieuDe("Chào mừng đến với AI CLASSROOM!")
                .noiDung("Hệ thống quản lý học tập thông minh tích hợp AI hỗ trợ học tập trực tuyến 24/7.")
                .loaiThongBao("HE_THONG")
                .lienKet("/")
                .build());

        thongBaoRepository.save(ThongBao.builder()
                .nguoiNhan(sinhVien1)
                .tieuDe("Bài tập đã được chấm điểm: " + bt1.getTieuDe())
                .noiDung("Giảng viên đã chấm: 9.5 / 10 điểm.")
                .loaiThongBao("BAI_TAP_DA_CHAM")
                .lienKet("/sinh-vien/bai-tap/" + bt1.getId())
                .build());

        log.info("Khoi tao du lieu mau hoan tat thanh cong!");
    }
}
