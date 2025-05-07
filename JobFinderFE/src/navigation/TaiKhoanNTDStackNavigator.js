import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TaiKhoanNhaTuyenDung from '../screens/NhaTuyenDung/TaiKhoanNhaTuyenDung';
import DanhSachBaiDang from '../screens/NhaTuyenDung/DanhSachBaiDang';
import ChiTietBaiDang from '../screens/NhaTuyenDung/ChiTietBaiDang';
import SuaBaiDang from '../screens/NhaTuyenDung/SuaBaiDang';
import TaoBaiDang from '../screens/NhaTuyenDung/TaoBaiDang';
import DanhSachUngVien from '../screens/NhaTuyenDung/DanhSachUngVien';
import XemCV from '../screens/UngVien/XemCV';

const Stack = createNativeStackNavigator();

export default function TaiKhoanNTDStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#388E3C',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="TaiKhoanMain"
        component={TaiKhoanNhaTuyenDung}
        options={{title: 'Tài khoản'}}
      />
      <Stack.Screen
        name="DanhSachBaiDang"
        component={DanhSachBaiDang}
        options={{title: 'Danh sách bài đăng'}}
      />
      <Stack.Screen
        name="ChiTietBaiDang"
        component={ChiTietBaiDang}
        options={{title: 'Chi tiết bài đăng'}}
      />
      <Stack.Screen
        name="SuaBaiDang"
        component={SuaBaiDang}
        options={{title: 'Sửa bài đăng'}}
      />
      <Stack.Screen
        name="TaoBaiDang"
        component={TaoBaiDang}
        options={{title: 'Tạo bài đăng'}}
      />
      <Stack.Screen
        name="DanhSachUngVien"
        component={DanhSachUngVien}
        options={{title: 'Danh sách ứng viên'}}
      />
      <Stack.Screen
        name="XemCV"
        component={XemCV}
        options={{title: 'CV ứng viên'}}
      />
    </Stack.Navigator>
  );
}
