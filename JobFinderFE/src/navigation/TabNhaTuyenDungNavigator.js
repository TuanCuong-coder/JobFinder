import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BaiDangStackNavigator from './BaiDangStackNavigator';
import TaiKhoanNTDStackNavigator from './TaiKhoanNTDStackNavigator';
import ThongBaoNTDStackNavigator from './ThongBaoNTDStackNavigator';

const Tab = createBottomTabNavigator();

export default function TabNhaTuyenDungNavigator() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="BaiDang"
        component={BaiDangStackNavigator}
        options={{tabBarLabel: 'Bài đăng'}}
      />
      <Tab.Screen
        name="ThongBao"
        component={ThongBaoNTDStackNavigator}
        options={{tabBarLabel: 'Thông báo'}}
      />
      <Tab.Screen
        name="TaiKhoan"
        component={TaiKhoanNTDStackNavigator}
        options={{tabBarLabel: 'Tài khoản'}}
      />
    </Tab.Navigator>
  );
}
