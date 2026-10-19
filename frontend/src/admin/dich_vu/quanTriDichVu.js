import api from '../../dung_chung/dich_vu/api';

export const quanTriDichVu = {
  layThongKe: async () => {
    const res = await api.get('/quan-tri/thong-ke');
    return res.data;
  },

  layDanhSachNguoiDung: async (vaiTro = null) => {
    const params = vaiTro ? { vaiTro } : {};
    const res = await api.get('/quan-tri/nguoi-dung', { params });
    return res.data;
  },

  taoNguoiDung: async (duLieu) => {
    const res = await api.post('/quan-tri/nguoi-dung', duLieu);
    return res.data;
  },

  doiVaiTro: async (id, vaiTroMoi) => {
    const res = await api.put(`/quan-tri/nguoi-dung/${id}/vai-tro`, { vaiTroMoi });
    return res.data;
  },

  datLaiMatKhau: async (id, matKhauMoi) => {
    const res = await api.put(`/quan-tri/nguoi-dung/${id}/dat-lai-mat-khau`, { matKhauMoi });
    return res.data;
  },

  xoaNguoiDung: async (id) => {
    const res = await api.delete(`/quan-tri/nguoi-dung/${id}`);
    return res.data;
  },

  layDanhSachLopHoc: async () => {
    const res = await api.get('/quan-tri/lop-hoc');
    return res.data;
  },

  xoaLopHoc: async (id) => {
    const res = await api.delete(`/quan-tri/lop-hoc/${id}`);
    return res.data;
  },

  layLichSuAi: async () => {
    const res = await api.get('/quan-tri/lich-su-ai');
    return res.data;
  }
};
