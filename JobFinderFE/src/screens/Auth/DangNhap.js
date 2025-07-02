import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DangNhap = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');

  const handleDangNhap = async () => {
    if (!email || !matKhau) {
      return Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
    }

    try {
      const res = await api.post('/NguoiDung/dang-nhap', {email, matKhau});
      const {token, user} = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', user.vaiTro);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      if (user.vaiTro === 'ung_vien') {
        navigation.reset({
          index: 0,
          routes: [{name: 'UngVienTab'}],
        });
      } else if (user.vaiTro === 'nha_tuyen_dung') {
        navigation.reset({
          index: 0,
          routes: [{name: 'NhaTuyenDungTab'}],
        });
      } else {
        Alert.alert('Lỗi', 'Vai trò không hợp lệ: ' + user.vaiTro);
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Đăng nhập thất bại',
        err?.response?.data?.message || err.message,
      );
    }
  };

  return (
    <View style={styles.screen}>
      <Image
        source={require('../../assets/react-logo.png')}
        style={styles.brandLogo}
        resizeMode="contain"
      />

      <Text style={styles.greeting}>Rất vui được gặp lại bạn!</Text>
      <Text style={styles.heading}>Đăng nhập vào JobFinder</Text>

      <TextInput
        style={styles.formInput}
        placeholder="Nhập email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.formInput}
        placeholder="Nhập mật khẩu"
        placeholderTextColor="#777"
        value={matKhau}
        onChangeText={setMatKhau}
        secureTextEntry
      />

      <TouchableOpacity style={styles.signinBtn} onPress={handleDangNhap}>
        <Text style={styles.signinText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('DangKy')}>
        <Text style={styles.switchText}>Bạn chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f7f9',
    padding: 24,
    justifyContent: 'center',
  },
  brandLogo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 17,
    textAlign: 'center',
    color: '#388E3C',
    fontWeight: '600',
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '700',
    color: '#222',
    marginBottom: 24,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: '#fff',
    color: '#111',
  },
  signinBtn: {
    backgroundColor: '#388E3C',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  signinText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#388E3C',
    fontWeight: '500',
  },
});

export default DangNhap;
