import api from '../../dung_chung/dich_vu/api';

export const aiDichVu = {
  uuTienBaiTap: async (lopHocId = null) => {
    const res = await api.post('/ai/uu-tien-bai-tap', { lopHocId });
    return res.data;
  },

  dinhHuongBaiTap: async (baiTapId, cauHoiThem = '', tieuDe = '', noiDung = '', tenLop = '') => {
    const isNum = !isNaN(Number(baiTapId));
    const payload = {
      baiTapId: isNum ? Number(baiTapId) : null,
      cauHoiThem,
      tieuDe,
      noiDung,
      tenLop
    };
    const res = await api.post('/ai/dinh-huong-bai-tap', payload);
    return res.data;
  },

  taoKeHoach: async (soGioMoiNgay = 3, mucTieu = '') => {
    const res = await api.post('/ai/tao-ke-hoach', { soGioMoiNgay, mucTieu });
    return res.data;
  },

  layDinhHuongHomNay: async () => {
    const res = await api.get('/ai/dinh-huong-hom-nay');
    return res.data;
  },

  phanTichLop: async (lopHocId) => {
    const res = await api.post('/ai/phan-tich-lop', { lopHocId });
    return res.data;
  },

  layLichSu: async () => {
    const res = await api.get('/ai/lich-su');
    return res.data;
  },

  chat: async (tinNhan, nguCanh = '') => {
    const res = await api.post('/ai/chat', { tinNhan, nguCanh });
    return res.data;
  },

  soanBaiTap: async (duLieu) => {
    const res = await api.post('/ai/soan-bai-tap', duLieu);
    return res.data;
  },

  goiYChamDiem: async (baiNopId, tieuChiBoSung = '') => {
    const res = await api.post('/ai/goi-y-cham-diem', { baiNopId, tieuChiBoSung });
    return res.data;
  }
};

