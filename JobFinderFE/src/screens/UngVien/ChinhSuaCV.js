import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChinhSuaCV = ({route, navigation}) => {
  const {cvData} = route.params;
  const [tieuDe, setTieuDe] = useState(cvData.tieuDe);
  const [thongTin, setThongTin] = useState({});

  useEffect(() => {
    if (cvData.noiDung) {
      try {
        const parsed =
          typeof cvData.noiDung === 'string'
            ? JSON.parse(cvData.noiDung)
            : cvData.noiDung;
        setThongTin(parsed);
      } catch (error) {
        console.log('Lỗi parse JSON:', error);
        setThongTin({});
      }
    }
  }, [cvData]);

  const handleSaveChanges = async () => {
    if (tieuDe.trim() === '') {
      Alert.alert('Lỗi', 'Tiêu đề CV không được để trống');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Lỗi', 'Không tìm thấy token đăng nhập');
        return;
      }

      const response = await api.put(`/cv/${cvData.id}`, {
        tieuDe: tieuDe,
        noiDung: JSON.stringify(thongTin),
      });

      if (response.status === 200) {
        Alert.alert('Thành công', 'Cập nhật CV thành công');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật CV');
      }
    } catch (error) {
      console.error('Lỗi cập nhật CV:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật CV');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa CV</Text>
        <TouchableOpacity onPress={handleSaveChanges}>
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
        value={thongTin?.thongTinCaNhan || ''}
        onChangeText={text => setThongTin({...thongTin, thongTinCaNhan: text})}
        style={styles.input}
        placeholder="Thông tin cá nhân"
      />
      <TextInput
        value={thongTin?.thongTinLienHe || ''}
        onChangeText={text => setThongTin({...thongTin, thongTinLienHe: text})}
        style={styles.input}
        placeholder="Thông tin liên hệ"
      />
      <TextInput
        value={thongTin?.hocVan || ''}
        onChangeText={text => setThongTin({...thongTin, hocVan: text})}
        style={styles.input}
        placeholder="Học vấn"
      />
      <TextInput
        value={thongTin?.kyNang || ''}
        onChangeText={text => setThongTin({...thongTin, kyNang: text})}
        style={styles.input}
        placeholder="Các kỹ năng"
      />
      <TextInput
        value={thongTin?.kinhNghiem || ''}
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

export default ChinhSuaCV;
