import React, { createContext, useContext, useState, useEffect } from 'react';
import { xacThucDichVu } from '../dich_vu/xacThucDichVu';

const NguCanhXacThuc = createContext(null);

export const NhaCungCapXacThuc = ({ children }) => {
  const [nguoiDung, setNguoiDung] = useState(null);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    const khoiTaoNguoiDung = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('nguoiDung');

      if (token && savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed?.hoTen === 'Nguyễn Văn An') {
            parsed.hoTen = 'Trần Việt Huy';
            localStorage.setItem('nguoiDung', JSON.stringify(parsed));
          }
          setNguoiDung(parsed);
          // Refresh user profile in background
          const profile = await xacThucDichVu.layThongTinCaNhan();
          if (profile?.hoTen === 'Nguyễn Văn An') {
            profile.hoTen = 'Trần Việt Huy';
          }
          setNguoiDung(profile);
          localStorage.setItem('nguoiDung', JSON.stringify(profile));
        } catch (err) {
          console.error('Loi xac thuc lai:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('nguoiDung');
          setNguoiDung(null);
        }
      }
      setDangTai(false);
    };

    khoiTaoNguoiDung();
  }, []);

  const dangNhap = async (email, matKhau) => {
    const res = await xacThucDichVu.dangNhap({ email, matKhau });
    localStorage.setItem('token', res.token);
    const userInfo = {
      id: res.id,
      email: res.email,
      hoTen: res.hoTen,
      vaiTro: res.vaiTro,
      anhDaiDien: res.anhDaiDien,
      soDienThoai: res.soDienThoai
    };
    localStorage.setItem('nguoiDung', JSON.stringify(userInfo));
    setNguoiDung(userInfo);
    return userInfo;
  };

  const dangKy = async (duLieu) => {
    const res = await xacThucDichVu.dangKy(duLieu);
    localStorage.setItem('token', res.token);
    const userInfo = {
      id: res.id,
      email: res.email,
      hoTen: res.hoTen,
      vaiTro: res.vaiTro,
      anhDaiDien: res.anhDaiDien,
      soDienThoai: res.soDienThoai
    };
    localStorage.setItem('nguoiDung', JSON.stringify(userInfo));
    setNguoiDung(userInfo);
    return userInfo;
  };

  const dangXuat = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nguoiDung');
    setNguoiDung(null);
  };

  const capNhatThongTin = (thongTinMoi) => {
    const capNhat = { ...nguoiDung, ...thongTinMoi };
    setNguoiDung(capNhat);
    localStorage.setItem('nguoiDung', JSON.stringify(capNhat));
  };

  return (
    <NguCanhXacThuc.Provider
      value={{
        nguoiDung,
        dangTai,
        dangNhap,
        dangKy,
        dangXuat,
        capNhatThongTin,
        laAdmin: nguoiDung?.vaiTro === 'ADMIN',
        laGiaoVien: nguoiDung?.vaiTro === 'GIAO_VIEN',
        laSinhVien: nguoiDung?.vaiTro === 'SINH_VIEN',
      }}
    >
      {children}
    </NguCanhXacThuc.Provider>
  );
};

export const dungXacThuc = () => {
  const context = useContext(NguCanhXacThuc);
  if (!context) {
    throw new Error('dungXacThuc phai duoc su dung ben trong NhaCungCapXacThuc');
  }
  return context;
};
