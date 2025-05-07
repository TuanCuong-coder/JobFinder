// src/navigation/CVStackNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ManHinhQuanLyCV from '../screens/UngVien/ManHinhQuanLyCV';
import TaoCV from '../screens/UngVien/TaoCV';
import XemCV from '../screens/UngVien/XemCV';
import ChinhSuaCV from '../screens/UngVien/ChinhSuaCV';
import TaiCVAnh from '../screens/UngVien/TaiCVAnh';

const Stack = createNativeStackNavigator();

export default function CVStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ManHinhQuanLyCV"
      screenOptions={{
        headerStyle: {backgroundColor: '#388E3C'},
        headerTintColor: '#fff',
        contentStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen
        name="ManHinhQuanLyCV"
        component={ManHinhQuanLyCV}
        options={{title: 'Quản lý CV'}}
      />
      <Stack.Screen
        name="TaiCVAnh"
        component={TaiCVAnh}
        options={{title: 'Tải ảnh CV'}}
      />
      <Stack.Screen
        name="TaoCV"
        component={TaoCV}
        options={{title: 'Tạo CV mới'}}
      />
      <Stack.Screen
        name="XemCV"
        component={XemCV}
        options={{title: 'Xem CV'}}
      />
      <Stack.Screen
        name="ChinhSuaCV"
        component={ChinhSuaCV}
        options={{title: 'Chỉnh sửa CV'}}
      />
    </Stack.Navigator>
  );
}
