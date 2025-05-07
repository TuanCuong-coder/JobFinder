import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import api from '../../services/api';

const ThongBaoUngVien = ({navigation}) => {
  const [thongBao, setThongBao] = useState([]);

  useEffect(() => {
    const fetchThongBao = async () => {
      try {
        const res = await api.get('/ThongBao/ung-vien');
        setThongBao(res.data);
      } catch (err) {
        console.error('Lỗi khi tải thông báo ứng viên:', err);
        Alert.alert('Lỗi', 'Không thể tải thông báo');
      }
    };
    fetchThongBao();
  }, []);

  const handleNotificationPress = congViecId => {
    // Điều hướng đến màn hình ChiTietCongViec với công việc id
    navigation.navigate('ChiTietCongViec', {congViecId});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo của bạn</Text>
      <FlatList
        data={thongBao}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleNotificationPress(item.congViecId)}>
            <View style={styles.card}>
              <Text style={styles.message}>{item.noiDung}</Text>
              <Text style={styles.date}>
                {new Date(item.ngayTao).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ThongBaoUngVien;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 12},
  card: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  message: {fontSize: 16},
  date: {marginTop: 4, color: '#888', fontSize: 12},
});

