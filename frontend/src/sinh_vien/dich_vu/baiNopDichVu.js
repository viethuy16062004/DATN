import api from '../../dung_chung/dich_vu/api';

export const baiNopDichVu = {
  layDanhSach: async (baiTapId = null) => {
    const params = baiTapId ? { baiTapId } : {};
    const res = await api.get('/bai-nop', { params });
    return res.data;
  },

  layChiTiet: async (id) => {
    const res = await api.get(`/bai-nop/${id}`);
    return res.data;
  },

  layBaiNopCuaToi: async (baiTapId) => {
    const res = await api.get(`/bai-nop/bai-tap/${baiTapId}/cua-toi`);
    return res.data;
  },

  nopBai: async (duLieu) => {
    const res = await api.post('/bai-nop', duLieu);
    return res.data;
  }
};
