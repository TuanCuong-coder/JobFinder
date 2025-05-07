import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import api from '../../services/api';
import {useNavigation} from '@react-navigation/native';

const DangKy = () => {
  const navigation = useNavigation();
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [confirmMatKhau, setConfirmMatKhau] = useState('');
  const [vaiTro, setVaiTro] = useState('ung_vien');

  const handleRegister = async () => {
    if (!hoTen || !email || !matKhau || !confirmMatKhau) {
      return Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
    }
    if (matKhau !== confirmMatKhau) {
      return Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp');
    }

    try {
      await api.post('/NguoiDung/dang-ky', {
        hoTen,
        email,
        matKhau,
        vaiTro,
        anhDaiDien: '',
      });

      Alert.alert('Thành công', 'Đăng ký thành công, hãy đăng nhập!');
      navigation.replace('DangNhap');
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Đăng ký thất bại',
        error?.response?.data?.message || 'Đã có lỗi xảy ra',
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
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      <TextInput
        style={styles.input}
        placeholder="Họ tên"
        placeholderTextColor="#777"
        value={hoTen}
        onChangeText={setHoTen}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#777"
        value={matKhau}
        onChangeText={setMatKhau}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        placeholderTextColor="#777"
        value={confirmMatKhau}
        onChangeText={setConfirmMatKhau}
        secureTextEntry
      />

      <Text style={styles.label}>Chọn vai trò:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={vaiTro}
          onValueChange={value => setVaiTro(value)}
          style={styles.picker}>
          <Picker.Item label="Ứng viên" value="ung_vien" />
          <Picker.Item label="Nhà tuyển dụng" value="nha_tuyen_dung" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
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
    marginBottom: 12,
    color: '#388E3C',
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
    marginBottom: 14,
    color: '#000',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#388E3C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    color: '#388E3C',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
});

export default DangKy;
