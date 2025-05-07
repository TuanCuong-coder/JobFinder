import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ThongBaoNhaTuyenDung from '../screens/NhaTuyenDung/ThongBaoNhaTuyenDung';
import ChiTietBaiDang from '../screens/NhaTuyenDung/ChiTietBaiDang';

const Stack = createNativeStackNavigator();

export default function ThongBaoNTDStackNavigator() {
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
        name="ThongBaoNhaTuyenDung"
        component={ThongBaoNhaTuyenDung}
        options={{title: 'Thông báo nhà tuyển dụng'}}
      />
      <Stack.Screen
        name="ChiTietBaiDang"
        component={ChiTietBaiDang}
        options={{title: 'Chi tiết bài đăng'}}
      />
    </Stack.Navigator>
  );
}
