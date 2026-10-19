import api from './api';

export const thongBaoDichVu = {
  layDanhSach: async () => {
    const res = await api.get('/thong-bao');
    return res.data;
  },

  demChuaDoc: async () => {
    const res = await api.get('/thong-bao/chua-doc/so-luong');
    return res.data;
  },

  danhDauDaDoc: async (id) => {
    const res = await api.put(`/thong-bao/${id}/da-doc`);
    return res.data;
  },

  danhDauDocTatCa: async () => {
    const res = await api.put('/thong-bao/doc-tat-ca');
    return res.data;
  }
};
