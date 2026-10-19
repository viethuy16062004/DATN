import api from '../../dung_chung/dich_vu/api';

export const sinhVienGiaoVienDichVu = {
  layDanhSach: async () => {
    const res = await api.get('/giao-vien/sinh-vien-quan-ly');
    return res.data;
  },

  themSinhVien: async (email, ghiChu) => {
    const res = await api.post('/giao-vien/sinh-vien-quan-ly', { email, ghiChu });
    return res.data;
  },

  themHangLoat: async (danhSachSinhVien) => {
    const res = await api.post('/giao-vien/sinh-vien-quan-ly/hang-loat', { danhSachSinhVien });
    return res.data;
  },

  xoaSinhVien: async (id) => {
    const res = await api.delete(`/giao-vien/sinh-vien-quan-ly/${id}`);
    return res.data;
  },

  timKiemHeThong: async (tuKhoa) => {
    const res = await api.get(`/giao-vien/sinh-vien-quan-ly/tim-kiem-he-thong?q=${encodeURIComponent(tuKhoa || '')}`);
    return res.data;
  }
};
