import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TaoBaiDang from '../screens/NhaTuyenDung/TaoBaiDang';
import DanhSachBaiDang from '../screens/NhaTuyenDung/DanhSachBaiDang';
import ChiTietBaiDang from '../screens/NhaTuyenDung/ChiTietBaiDang';
import SuaBaiDang from '../screens/NhaTuyenDung/SuaBaiDang';
import XemCV from '../screens/UngVien/XemCV';
import DanhSachUngVien from '../screens/NhaTuyenDung/DanhSachUngVien';

const Stack = createNativeStackNavigator();

export default function BaiDangStackNavigator() {
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
      <Stack.Screen name="DanhSachBaiDang" component={DanhSachBaiDang} />
      <Stack.Screen name="TaoBaiDang" component={TaoBaiDang} />
      <Stack.Screen name="ChiTietBaiDang" component={ChiTietBaiDang} />
      <Stack.Screen name="SuaBaiDang" component={SuaBaiDang} />
      <Stack.Screen
        name="DanhSachUngVien"
        component={DanhSachUngVien}
        options={{title: 'Ứng viên đã ứng tuyển'}}
      />
      <Stack.Screen name="XemCV" component={XemCV} />
    </Stack.Navigator>
  );
}
