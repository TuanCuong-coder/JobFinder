// src/navigation/TabUngVienNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import UngVienStackNavigator from './UngVienStackNavigator';
import CVStackNavigator from './CVStackNavigator';
import HoTroUngVien from '../screens/UngVien/HoTroUngVien';
import TaiKhoanUVStackNavigator from './TaiKhoanUVStackNavigator';
import ThongBaoUVStackNavigator from './ThongBaoUVStackNavigator';
const Tab = createBottomTabNavigator();

export default function TabUngVienNavigator() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="TrangChu"
        component={UngVienStackNavigator}
        options={{tabBarLabel: 'Trang chủ'}}
      />
      <Tab.Screen
        name="CV"
        component={CVStackNavigator}
        options={{tabBarLabel: 'CV'}}
      />
      <Tab.Screen
        name="ThongBao"
        component={ThongBaoUVStackNavigator}
        options={{tabBarLabel: 'Thông báo'}}
      />
      <Tab.Screen
        name="HoTro"
        component={HoTroUngVien}
        options={{tabBarLabel: 'Hỗ trợ'}}
      />
      <Tab.Screen
        name="TaiKhoan"
        component={TaiKhoanUVStackNavigator}
        options={{tabBarLabel: 'Tài khoản'}}
      />
    </Tab.Navigator>
  );
}
