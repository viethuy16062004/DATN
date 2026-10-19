import api from '../../dung_chung/dich_vu/api';

export const tienDoDichVu = {
  layTongQuan: async () => {
    const res = await api.get('/tien-do');
    return res.data;
  },

  layDanhSach: async () => {
    const res = await api.get('/tien-do/danh-sach');
    return res.data;
  },

  layTheoLop: async (lopHocId) => {
    const res = await api.get(`/tien-do/lop/${lopHocId}`);
    return res.data;
  }
};
