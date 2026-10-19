import api from './api';

export const xacThucDichVu = {
  dangKy: async (duLieu) => {
    const res = await api.post('/xac-thuc/dang-ky', duLieu);
    return res.data;
  },

  dangNhap: async (duLieu) => {
    const res = await api.post('/xac-thuc/dang-nhap', duLieu);
    return res.data;
  },

  layThongTinCaNhan: async () => {
    const res = await api.get('/nguoi-dung/me');
    return res.data;
  },

  capNhatThongTinCaNhan: async (duLieu) => {
    const res = await api.put('/nguoi-dung/me', duLieu);
    return res.data;
  }
};
