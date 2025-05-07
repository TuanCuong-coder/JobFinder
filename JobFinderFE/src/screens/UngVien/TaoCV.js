import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../services/config';

const TaoCV = ({navigation}) => {
  const [tieuDe, setTieuDe] = useState(
    'CV_' + Math.floor(Math.random() * 1000),
  );
  const [thongTin, setThongTin] = useState({
    thongTinCaNhan: '',
    thongTinLienHe: '',
    hocVan: '',
    kyNang: '',
    kinhNghiem: '',
  });

  const handleSaveCV = async () => {
    if (tieuDe.trim() === '') {
      Alert.alert('Lỗi', 'Tiêu đề CV không được để trống');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const noiDung = JSON.stringify(thongTin);
      const payload = {tieuDe, noiDung};

      const response = await axios.post(`${BASE_URL}/CV`, payload, {headers});

      if (response.status === 200) {
        Alert.alert('Thành công', 'CV đã được lưu');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Không thể lưu CV');
      }
    } catch (error) {
      console.error('Lỗi khi lưu CV:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu CV');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tạo CV</Text>
        <TouchableOpacity onPress={handleSaveCV}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={tieuDe}
        onChangeText={setTieuDe}
        style={styles.input}
        placeholder="Tiêu đề CV"
      />

      
      <TextInput
        value={thongTin.thongTinCaNhan}
        onChangeText={text => setThongTin({...thongTin, thongTinCaNhan: text})}
        style={styles.input}
        placeholder="Thông tin cá nhân"
      />
      <TextInput
        value={thongTin.thongTinLienHe}
        onChangeText={text => setThongTin({...thongTin, thongTinLienHe: text})}
        style={styles.input}
        placeholder="Thông tin liên hệ"
      />
      <TextInput
        value={thongTin.hocVan}
        onChangeText={text => setThongTin({...thongTin, hocVan: text})}
        style={styles.input}
        placeholder="Học vấn"
      />
      <TextInput
        value={thongTin.kyNang}
        onChangeText={text => setThongTin({...thongTin, kyNang: text})}
        style={styles.input}
        placeholder="Các kỹ năng"
      />
      <TextInput
        value={thongTin.kinhNghiem}
        onChangeText={text => setThongTin({...thongTin, kinhNghiem: text})}
        style={styles.input}
        placeholder="Kinh nghiệm làm việc"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
    color: '#FF5252',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
});

export default TaoCV;
