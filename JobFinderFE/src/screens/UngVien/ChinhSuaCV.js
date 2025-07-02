import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
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
    <ScrollView contentContainerStyle={styles.cvEditorWrapper}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.topAction}>Hủy</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Chỉnh sửa CV</Text>
        <TouchableOpacity onPress={handleSaveChanges}>
          <Text style={styles.topAction}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={tieuDe}
        onChangeText={setTieuDe}
        style={styles.inputField}
        placeholder="Tiêu đề CV"
      />

      <TextInput
        value={thongTin?.thongTinCaNhan || ''}
        onChangeText={text =>
          setThongTin({...thongTin, thongTinCaNhan: text})
        }
        style={styles.inputField}
        placeholder="Thông tin cá nhân"
        multiline
      />
      <TextInput
        value={thongTin?.thongTinLienHe || ''}
        onChangeText={text =>
          setThongTin({...thongTin, thongTinLienHe: text})
        }
        style={styles.inputField}
        placeholder="Thông tin liên hệ"
        multiline
      />
      <TextInput
        value={thongTin?.hocVan || ''}
        onChangeText={text => setThongTin({...thongTin, hocVan: text})}
        style={styles.inputField}
        placeholder="Học vấn"
        multiline
      />
      <TextInput
        value={thongTin?.kyNang || ''}
        onChangeText={text => setThongTin({...thongTin, kyNang: text})}
        style={styles.inputField}
        placeholder="Các kỹ năng"
        multiline
      />
      <TextInput
        value={thongTin?.kinhNghiem || ''}
        onChangeText={text =>
          setThongTin({...thongTin, kinhNghiem: text})
        }
        style={styles.inputField}
        placeholder="Kinh nghiệm làm việc"
        multiline
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cvEditorWrapper: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9fafa',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  topAction: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '500',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 14,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});

export default ChinhSuaCV;
