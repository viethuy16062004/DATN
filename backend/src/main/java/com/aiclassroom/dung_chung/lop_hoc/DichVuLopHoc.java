package com.aiclassroom.dung_chung.lop_hoc;

import com.aiclassroom.dung_chung.bai_tap.BaiTapRepository;
import com.aiclassroom.dung_chung.cau_hinh.TienIchNguoiDung;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongCoQuyen;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongHopLe;
import com.aiclassroom.dung_chung.ngoai_le.NgoaiLeKhongTimThay;
import com.aiclassroom.dung_chung.nguoi_dung.NguoiDung;
import com.aiclassroom.dung_chung.nguoi_dung.VaiTro;
import com.aiclassroom.dung_chung.tien_do.TienDo;
import com.aiclassroom.dung_chung.tien_do.TienDoRepository;
import com.aiclassroom.giang_vien.quan_ly_sinh_vien.SinhVienGiaoVienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuLopHoc {

    private final LopHocRepository lopHocRepository;
    private final ThanhVienLopRepository thanhVienLopRepository;
    private final BaiTapRepository baiTapRepository;
    private final TienDoRepository tienDoRepository;
    private final SinhVienGiaoVienRepository sinhVienGiaoVienRepository;
    private final TienIchNguoiDung tienIchNguoiDung;

    private static final String CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private String taoMaLopDuyNhat() {
        String ma;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
            }
            ma = sb.toString();
        } while (lopHocRepository.existsByMaLop(ma));
        return ma;
    }

    public List<LopHocPhanHoi> layDanhSachLopHoc() {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        List<LopHoc> dsLop;

        if (nd.getVaiTro() == VaiTro.ADMIN) {
            dsLop = lopHocRepository.findAll();
        } else if (nd.getVaiTro() == VaiTro.GIAO_VIEN) {
            dsLop = lopHocRepository.findByGiaoVien(nd);
        } else {
            List<ThanhVienLop> tvList = thanhVienLopRepository.findBySinhVien(nd);
            dsLop = tvList.stream().map(ThanhVienLop::getLopHoc).collect(Collectors.toList());
        }

        return dsLop.stream().map(lh -> {
            long soSv = thanhVienLopRepository.countByLopHoc(lh);
            long soBt = baiTapRepository.countByLopHoc(lh);
            return LopHocPhanHoi.tuThucThe(lh, soSv, soBt);
        }).collect(Collectors.toList());
    }

    public LopHocPhanHoi layChiTietLopHoc(Long id) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        LopHoc lh = lopHocRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay lop hoc voi ID: " + id));

        kiemTraQuyenTruyCapLop(lh, nd);

        long soSv = thanhVienLopRepository.countByLopHoc(lh);
        long soBt = baiTapRepository.countByLopHoc(lh);
        return LopHocPhanHoi.tuThucThe(lh, soSv, soBt);
    }

    @Transactional
    public LopHocPhanHoi taoLopHoc(TaoLopHocYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        if (nd.getVaiTro() == VaiTro.SINH_VIEN) {
            throw new NgoaiLeKhongCoQuyen("Sinh vien khong co quyen tao lop hoc");
        }

        LopHoc lh = LopHoc.builder()
                .tenLop(yeuCau.getTenLop())
                .moTa(yeuCau.getMoTa())
                .anhBia(yeuCau.getAnhBia() != null ? yeuCau.getAnhBia() : "from-blue-600 to-indigo-700")
                .maLop(taoMaLopDuyNhat())
                .giaoVien(nd)
                .build();

        lh = lopHocRepository.save(lh);
        return LopHocPhanHoi.tuThucThe(lh, 0, 0);
    }

    @Transactional
    public LopHocPhanHoi capNhatLopHoc(Long id, CapNhatLopHocYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        LopHoc lh = lopHocRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay lop hoc voi ID: " + id));

        if (nd.getVaiTro() != VaiTro.ADMIN && !lh.getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen cap nhat lop hoc nay");
        }

        lh.setTenLop(yeuCau.getTenLop());
        if (yeuCau.getMoTa() != null) {
            lh.setMoTa(yeuCau.getMoTa());
        }
        if (yeuCau.getAnhBia() != null) {
            lh.setAnhBia(yeuCau.getAnhBia());
        }

        lh = lopHocRepository.save(lh);
        long soSv = thanhVienLopRepository.countByLopHoc(lh);
        long soBt = baiTapRepository.countByLopHoc(lh);
        return LopHocPhanHoi.tuThucThe(lh, soSv, soBt);
    }

    @Transactional
    public void xoaLopHoc(Long id) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        LopHoc lh = lopHocRepository.findById(id)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay lop hoc voi ID: " + id));

        if (nd.getVaiTro() != VaiTro.ADMIN && !lh.getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen xoa lop hoc nay");
        }

        lopHocRepository.delete(lh);
    }

    @Transactional
    public LopHocPhanHoi thamGiaLopHoc(ThamGiaLopYeuCau yeuCau) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        if (nd.getVaiTro() != VaiTro.SINH_VIEN) {
            throw new NgoaiLeKhongHopLe("Chỉ sinh viên mới có thể tham gia lớp bằng mã lớp hoặc liên kết mời");
        }

        LopHoc lh = lopHocRepository.findByMaLop(yeuCau.getMaLop().trim().toUpperCase())
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Mã lớp học không hợp lệ hoặc không tồn tại"));

        if (thanhVienLopRepository.existsByLopHocAndSinhVien(lh, nd)) {
            throw new NgoaiLeKhongHopLe("Bạn đã là thành viên của lớp học này rồi");
        }

        // Kiem tra sinh vien co trong danh sach quan ly rieng cua giao vien khong
        if (lh.getGiaoVien() != null) {
            boolean thuocDanhSach = sinhVienGiaoVienRepository.existsByGiaoVienAndSinhVien(lh.getGiaoVien(), nd);
            if (!thuocDanhSach) {
                String tenGv = lh.getGiaoVien().getHoTen() != null ? lh.getGiaoVien().getHoTen() : "giảng viên";
                throw new NgoaiLeKhongCoQuyen("Bạn không có trong danh sách quản lý sinh viên của " + tenGv + ". Vui lòng liên hệ giảng viên để được thêm vào danh sách quản lý trước khi vào lớp!");
            }
        }

        ThanhVienLop tv = ThanhVienLop.builder()
                .lopHoc(lh)
                .sinhVien(nd)
                .build();
        thanhVienLopRepository.save(tv);

        // Khoi tao tien do cho sinh vien
        long tongBt = baiTapRepository.countByLopHoc(lh);
        TienDo td = TienDo.builder()
                .sinhVien(nd)
                .lopHoc(lh)
                .tongBaiTap((int) tongBt)
                .soBaiDaNop(0)
                .soBaiDaCham(0)
                .diemTrungBinh(0.0)
                .phanTramHoanThanh(0.0)
                .build();
        tienDoRepository.save(td);

        long soSv = thanhVienLopRepository.countByLopHoc(lh);
        return LopHocPhanHoi.tuThucThe(lh, soSv, tongBt);
    }

    public LopHocMoiPhanHoi layThongTinLopTheoMa(String maLop) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        LopHoc lh = lopHocRepository.findByMaLop(maLop.trim().toUpperCase())
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Không tìm thấy lớp học với mã: " + maLop));

        boolean daThamGia = thanhVienLopRepository.existsByLopHocAndSinhVien(lh, nd);
        boolean thuocDanhSach = true;
        if (lh.getGiaoVien() != null && nd.getVaiTro() == VaiTro.SINH_VIEN) {
            thuocDanhSach = sinhVienGiaoVienRepository.existsByGiaoVienAndSinhVien(lh.getGiaoVien(), nd);
        }

        long soSv = thanhVienLopRepository.countByLopHoc(lh);
        long soBt = baiTapRepository.countByLopHoc(lh);

        return LopHocMoiPhanHoi.builder()
                .id(lh.getId())
                .tenLop(lh.getTenLop())
                .moTa(lh.getMoTa())
                .maLop(lh.getMaLop())
                .anhBia(lh.getAnhBia())
                .tenGiaoVien(lh.getGiaoVien() != null ? lh.getGiaoVien().getHoTen() : "Chưa cập nhật")
                .emailGiaoVien(lh.getGiaoVien() != null ? lh.getGiaoVien().getEmail() : "")
                .soSinhVien(soSv)
                .soBaiTap(soBt)
                .daThamGia(daThamGia)
                .thuocDanhSachQuanLy(thuocDanhSach)
                .build();
    }

    public List<ThanhVienLopPhanHoi> layDanhSachThanhVien(Long lopHocId) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        LopHoc lh = lopHocRepository.findById(lopHocId)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay lop hoc voi ID: " + lopHocId));

        kiemTraQuyenTruyCapLop(lh, nd);

        return thanhVienLopRepository.findByLopHoc(lh).stream()
                .map(ThanhVienLopPhanHoi::tuThucThe)
                .collect(Collectors.toList());
    }

    @Transactional
    public void xoaThanhVien(Long lopHocId, Long sinhVienId) {
        NguoiDung nd = tienIchNguoiDung.layNguoiDungHienTai();
        LopHoc lh = lopHocRepository.findById(lopHocId)
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Khong tim thay lop hoc voi ID: " + lopHocId));

        if (nd.getVaiTro() != VaiTro.ADMIN && !lh.getGiaoVien().getId().equals(nd.getId())) {
            throw new NgoaiLeKhongCoQuyen("Ban khong co quyen xoa thanh vien khoi lop hoc nay");
        }

        ThanhVienLop tv = thanhVienLopRepository.findByLopHocId(lopHocId).stream()
                .filter(t -> t.getSinhVien().getId().equals(sinhVienId))
                .findFirst()
                .orElseThrow(() -> new NgoaiLeKhongTimThay("Sinh vien khong co trong lop hoc"));

        thanhVienLopRepository.delete(tv);
    }

    private void kiemTraQuyenTruyCapLop(LopHoc lh, NguoiDung nd) {
        if (nd.getVaiTro() == VaiTro.ADMIN) return;
        if (nd.getVaiTro() == VaiTro.GIAO_VIEN && lh.getGiaoVien().getId().equals(nd.getId())) return;
        if (nd.getVaiTro() == VaiTro.SINH_VIEN && thanhVienLopRepository.existsByLopHocAndSinhVien(lh, nd)) return;

        throw new NgoaiLeKhongCoQuyen("Ban khong co quyen truy cap lop hoc nay");
    }
}
