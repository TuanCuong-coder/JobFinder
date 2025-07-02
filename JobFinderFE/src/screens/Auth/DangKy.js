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
    <View style={styles.wrapper}>
      <Image
        source={require('../../assets/react-logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <Text style={styles.introText}>Chào mừng đến với JobFinder</Text>
      <Text style={styles.heading}>Tạo tài khoản mới</Text>

      <TextInput
        style={styles.textField}
        placeholder="Họ và tên"
        placeholderTextColor="#666"
        value={hoTen}
        onChangeText={setHoTen}
      />

      <TextInput
        style={styles.textField}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.textField}
        placeholder="Mật khẩu"
        placeholderTextColor="#666"
        value={matKhau}
        onChangeText={setMatKhau}
        secureTextEntry
      />

      <TextInput
        style={styles.textField}
        placeholder="Xác nhận mật khẩu"
        placeholderTextColor="#666"
        value={confirmMatKhau}
        onChangeText={setConfirmMatKhau}
        secureTextEntry
      />

      <Text style={styles.roleLabel}>Vai trò:</Text>
      <View style={styles.selectContainer}>
        <Picker
          selectedValue={vaiTro}
          onValueChange={value => setVaiTro(value)}
          style={styles.dropdown}>
          <Picker.Item label="Ứng viên" value="ung_vien" />
          <Picker.Item label="Nhà tuyển dụng" value="nha_tuyen_dung" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitText}>Đăng ký ngay</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.switchText}>Bạn đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f4f7f9',
    padding: 22,
    justifyContent: 'center',
  },
  logoImage: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 16,
  },
  introText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    color: '#1A1A1A',
    fontWeight: '700',
    marginBottom: 20,
  },
  textField: {
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    color: '#111',
    backgroundColor: '#fff',
  },
  roleLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 6,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  dropdown: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default DangKy;
