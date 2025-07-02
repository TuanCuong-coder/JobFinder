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
      }
    };

    fetchCV();
  }, [cvId]);

  if (!cvData) {
    return (
      <View style={styles.cvWrapper}>
        <Text>Đang tải CV...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.cvWrapper}>
      <View style={styles.cvHeader}>
        <Text style={styles.cvTitle}>{cvData.tieuDe}</Text>
      </View>

      <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
      <TextInput
        value={noiDung.thongTinCaNhan || ''}
        style={styles.readonlyBox}
        editable={false}
        multiline
      />

      <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
      <TextInput
        value={noiDung.thongTinLienHe || ''}
        style={styles.readonlyBox}
        editable={false}
        multiline
      />

      <Text style={styles.sectionTitle}>Học vấn</Text>
      <TextInput
        value={noiDung.hocVan || ''}
        style={styles.readonlyBox}
        editable={false}
        multiline
      />

      <Text style={styles.sectionTitle}>Kỹ năng</Text>
      <TextInput
        value={noiDung.kyNang || ''}
        style={styles.readonlyBox}
        editable={false}
        multiline
      />

      <Text style={styles.sectionTitle}>Kinh nghiệm</Text>
      <TextInput
        value={noiDung.kinhNghiem || ''}
        style={styles.readonlyBox}
        editable={false}
        multiline
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cvWrapper: {
    padding: 20,
    backgroundColor: '#f4f7f9',
    flexGrow: 1,
  },
  cvHeader: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
  },
  cvTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#444',
  },
  readonlyBox: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#111',
    minHeight: 50,
    textAlignVertical: 'top',
  },
});

export default XemCV;
