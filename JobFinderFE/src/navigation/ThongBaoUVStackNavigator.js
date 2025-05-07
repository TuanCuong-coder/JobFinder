import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ThongBaoUngVien from '../screens/UngVien/ThongBaoUngVien';
import ChiTietCongViec from '../screens/UngVien/ChiTietCongViec';

const Stack = createNativeStackNavigator();

export default function ThongBaoUVStackNavigator() {
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
        name="ThongBaoUngVien"
        component={ThongBaoUngVien}
        options={{title: 'Thông báo ứng viên'}}
      />
      <Stack.Screen
        name="ChiTietCongViec"
        component={ChiTietCongViec}
        options={{title: 'Chi tiết công việc'}}
      />
    </Stack.Navigator>
  );
}
