import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoadingScreen = ({navigation}) => {
  useEffect(() => {
    const checkLogin = async () => {
      try { 
        const role = await AsyncStorage.getItem('role');
        const token = await AsyncStorage.getItem('token');
        if (token && role) {
          if (role === 'ung_vien') {
            navigation.reset({
              index: 0,
              routes: [{name: 'UngVienTab'}],
            });
          } else if (role === 'nha_tuyen_dung') {
            navigation.reset({
              index: 0,
              routes: [{name: 'NhaTuyenDungTab'}],
            });
          } else {
            navigation.replace('DangNhap');
          }
        } else {
          navigation.replace('DangNhap');
        }
      } catch (error) {
        console.error(error);
        navigation.replace('DangNhap');
      }
    };
    checkLogin();
  }, []);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" />
      <Text>Đang kiểm tra đăng nhập...</Text>
    </View>
  );
};
export default LoadingScreen;
