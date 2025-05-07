import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TaiKhoanUngVien from '../screens/UngVien/TaiKhoanUngVien';
import DanhSachYeuThich from '../screens/UngVien/DanhSachYeuThich';
import ViecLamUngTuyen from '../screens/UngVien/ViecLamUngTuyen';
import DanhSachPhuHop from '../screens/UngVien/DanhSachPhuHop';
import ChiTietCongViec from '../screens/UngVien/ChiTietCongViec';

const Stack = createNativeStackNavigator();

export default function TaiKhoanUVStackNavigator() {
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
        component={TaiKhoanUngVien}
        options={{title: 'Tài khoản'}}
      />
      <Stack.Screen
        name="DanhSachYeuThich"
        component={DanhSachYeuThich}
        options={{title: 'Việc làm yêu thích'}}
      />
      <Stack.Screen
        name="ViecLamUngTuyen"
        component={ViecLamUngTuyen}
        options={{title: 'Việc đã ứng tuyển'}}
      />
      <Stack.Screen
        name="DanhSachPhuHop"
        component={DanhSachPhuHop}
        options={{title: 'Việc làm phù hợp'}}
      />
      <Stack.Screen
        name="ChiTietCongViec"
        component={ChiTietCongViec}
        options={{title: 'Chi tiết công việc'}}
      />
    </Stack.Navigator>
  );
}
