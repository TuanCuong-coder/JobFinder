// src/navigation/StackNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DangNhap from '../screens/Auth/DangNhap';
import DangKy from '../screens/Auth/DangKy';
import LoadingScreen from '../screens/LoadingScreen';
import TabUngVienNavigator from './TabUngVienNavigator';
import TabNhaTuyenDungNavigator from './TabNhaTuyenDungNavigator';
import CapNhatTaiKhoan from '../screens/UngVien/CapNhatTaiKhoan';
const Stack = createNativeStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator
    initialRouteName="Loading"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="Loading" component={LoadingScreen} />
    <Stack.Screen name="DangNhap" component={DangNhap} />
    <Stack.Screen name="DangKy" component={DangKy} />
    <Stack.Screen name="UngVienTab" component={TabUngVienNavigator} />
    <Stack.Screen name="NhaTuyenDungTab" component={TabNhaTuyenDungNavigator} />
    <Stack.Screen name="CapNhatTaiKhoan" component={CapNhatTaiKhoan} />
  </Stack.Navigator>
);

export default StackNavigator;
