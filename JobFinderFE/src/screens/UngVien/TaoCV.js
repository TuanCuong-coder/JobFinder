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
  const [tieuDe, setTieuDe] = useState('CV_' + Math.floor(Math.random() * 1000));
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
    <View style={styles.pageWrapper}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.actionText}>Hủy</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Tạo mới CV</Text>
        <TouchableOpacity onPress={handleSaveCV}>
          <Text style={styles.actionText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={tieuDe}
        onChangeText={setTieuDe}
        style={styles.formBox}
        placeholder="Tiêu đề CV"
        placeholderTextColor="#888"
      />

      <TextInput
        value={thongTin.thongTinCaNhan}
        onChangeText={text => setThongTin({...thongTin, thongTinCaNhan: text})}
        style={styles.formBox}
        placeholder="Thông tin cá nhân"
        placeholderTextColor="#888"
      />

      <TextInput
        value={thongTin.thongTinLienHe}
        onChangeText={text => setThongTin({...thongTin, thongTinLienHe: text})}
        style={styles.formBox}
        placeholder="Thông tin liên hệ"
        placeholderTextColor="#888"
      />

      <TextInput
        value={thongTin.hocVan}
        onChangeText={text => setThongTin({...thongTin, hocVan: text})}
        style={styles.formBox}
        placeholder="Học vấn"
        placeholderTextColor="#888"
      />

      <TextInput
        value={thongTin.kyNang}
        onChangeText={text => setThongTin({...thongTin, kyNang: text})}
        style={styles.formBox}
        placeholder="Kỹ năng"
        placeholderTextColor="#888"
      />

      <TextInput
        value={thongTin.kinhNghiem}
        onChangeText={text => setThongTin({...thongTin, kinhNghiem: text})}
        style={styles.formBox}
        placeholder="Kinh nghiệm làm việc"
        placeholderTextColor="#888"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#f1f6f9',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  actionText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    color: '#111',
  },
});

export default TaoCV;
