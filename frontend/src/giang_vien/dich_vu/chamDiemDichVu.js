import api from '../../dung_chung/dich_vu/api';

export const chamDiemDichVu = {
  chamDiem: async (duLieu) => {
    const res = await api.post('/cham-diem', duLieu);
    return res.data;
  },

  capNhat: async (id, duLieu) => {
    const res = await api.put(`/cham-diem/${id}`, duLieu);
    return res.data;
  },

  layTheoBaiNop: async (baiNopId) => {
    const res = await api.get(`/cham-diem/bai-nop/${baiNopId}`);
    return res.data;
  }
};
