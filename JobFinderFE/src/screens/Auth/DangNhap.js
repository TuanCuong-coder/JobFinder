import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
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
    <View style={styles.container}>
      <Image
        source={require('../../assets/react-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>Chào mừng bạn đến với JobFinder</Text>

      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#888"
        value={matKhau}
        onChangeText={setMatKhau}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleDangNhap}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('DangKy')}>
        <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#388E3C',
    marginBottom: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#000',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 14,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    color: '#388E3C',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default DangNhap;
