import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ManHinhUngVien from '../screens/UngVien/ManHinhUngVien';
import TimKiemViecLam from '../screens/UngVien/TimKiemViecLam';
import ViecLamPhuHop from '../screens/UngVien/ViecLamPhuHop';
import ChiTietCongViec from '../screens/UngVien/ChiTietCongViec';
import DanhSachPhuHop from '../screens/UngVien/DanhSachPhuHop';
const Stack = createNativeStackNavigator();

export default function UngVienStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ManHinhUngVien"
      screenOptions={{
        headerStyle: {backgroundColor: '#388E3C'},
        headerTintColor: '#fff',
        contentStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen
        name="ManHinhUngVien"
        component={ManHinhUngVien}
        options={{title: 'Trang chủ'}}
      />
      <Stack.Screen
        name="DanhSachPhuHop"
        component={DanhSachPhuHop}
        options={{title: 'Việc làm phù hợp'}}
      />
      <Stack.Screen
        name="TimKiemViecLam"
        component={TimKiemViecLam}
        options={{title: 'Tìm kiếm việc làm'}}
      />
      <Stack.Screen
        name="ViecLamPhuHop"
        component={ViecLamPhuHop}
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
