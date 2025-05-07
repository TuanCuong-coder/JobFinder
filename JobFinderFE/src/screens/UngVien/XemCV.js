import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const XemCV = ({route, navigation}) => {
  const {cvId, congViecId} = route.params;
  const [isNhaTuyenDung, setIsNhaTuyenDung] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [noiDung, setNoiDung] = useState({});

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const vaiTro = await AsyncStorage.getItem('vaiTro');
        setIsNhaTuyenDung(vaiTro === 'nha_tuyen_dung');

        let res;
        if (vaiTro === 'nha_tuyen_dung') {
          res = await api.get(`/cv/xem-cv-ntd/${cvId}`);
        } else {
          res = await api.get(`/cv/${cvId}`);
        }

        setCvData(res.data);
        const nd =
          typeof res.data.noiDung === 'string'
            ? JSON.parse(res.data.noiDung)
            : res.data.noiDung;

        setNoiDung(nd || {});
      } catch (error) {
        console.error('Lỗi khi tải CV:', error);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Message:', error.response.data);
        }
      }
    };

    fetchCV();
  }, [cvId]);

  if (!cvData) {
    return (
      <View style={styles.container}>
        <Text>Đang tải CV...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{cvData.tieuDe}</Text>
      </View>

      <Text style={styles.label}>Thông tin cá nhân</Text>
      <TextInput
        value={noiDung.thongTinCaNhan || ''}
        style={styles.input}
        editable={false}
      />

      <Text style={styles.label}>Thông tin liên hệ</Text>
      <TextInput
        value={noiDung.thongTinLienHe || ''}
        style={styles.input}
        editable={false}
      />

      <Text style={styles.label}>Học vấn</Text>
      <TextInput
        value={noiDung.hocVan || ''}
        style={styles.input}
        editable={false}
      />

      <Text style={styles.label}>Kỹ năng</Text>
      <TextInput
        value={noiDung.kyNang || ''}
        style={styles.input}
        editable={false}
      />

      <Text style={styles.label}>Kinh nghiệm</Text>
      <TextInput
        value={noiDung.kinhNghiem || ''}
        style={styles.input}
        editable={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#FF5252',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
});

export default XemCV;
