import api from '../../dung_chung/dich_vu/api';

export const baiTapDichVu = {
  layDanhSach: async (lopHocId = null) => {
    const params = lopHocId ? { lopHocId } : {};
    const res = await api.get('/bai-tap', { params });
    return res.data;
  },

  layChiTiet: async (id) => {
    const res = await api.get(`/bai-tap/${id}`);
    return res.data;
  },

  taomoi: async (duLieu) => {
    const res = await api.post('/bai-tap', duLieu);
    return res.data;
  },

  capNhat: async (id, duLieu) => {
    const res = await api.put(`/bai-tap/${id}`, duLieu);
    return res.data;
  },

  xoa: async (id) => {
    const res = await api.delete(`/bai-tap/${id}`);
    return res.data;
  }
};
