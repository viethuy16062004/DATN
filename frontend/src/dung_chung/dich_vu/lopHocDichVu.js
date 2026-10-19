import api from './api';

export const lopHocDichVu = {
  layDanhSach: async () => {
    const res = await api.get('/lop-hoc');
    return res.data;
  },

  layChiTiet: async (id) => {
    const res = await api.get(`/lop-hoc/${id}`);
    return res.data;
  },

  taomoi: async (duLieu) => {
    const res = await api.post('/lop-hoc', duLieu);
    return res.data;
  },

  capNhat: async (id, duLieu) => {
    const res = await api.put(`/lop-hoc/${id}`, duLieu);
    return res.data;
  },

  xoa: async (id) => {
    const res = await api.delete(`/lop-hoc/${id}`);
    return res.data;
  },

  thamGia: async (maLop) => {
    const res = await api.post('/lop-hoc/tham-gia', { maLop });
    return res.data;
  },

  layThongTinTheoMa: async (maLop) => {
    const res = await api.get(`/lop-hoc/thong-tin-ma/${maLop}`);
    return res.data;
  },

  layThanhVien: async (lopHocId) => {
    const res = await api.get(`/lop-hoc/${lopHocId}/thanh-vien`);
    return res.data;
  },

  xoaThanhVien: async (lopHocId, sinhVienId) => {
    const res = await api.delete(`/lop-hoc/${lopHocId}/thanh-vien/${sinhVienId}`);
    return res.data;
  }
};

