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
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#1976D2',
  },
  message: {
    fontSize: 16,
    color: '#37474F',
    fontWeight: '500',
  },
  date: {
    fontSize: 13,
    color: '#78909C',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 40,
  },
});

