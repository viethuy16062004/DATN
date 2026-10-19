import api from '../../dung_chung/dich_vu/api';

export const tepTinDichVu = {
  taiLen: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/tep-tin/tai-len', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
