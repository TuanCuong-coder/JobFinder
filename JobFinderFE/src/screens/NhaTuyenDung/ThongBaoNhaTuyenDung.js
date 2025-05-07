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

const ThongBaoNhaTuyenDung = ({navigation}) => {
  const [thongBao, setThongBao] = useState([]);

  useEffect(() => {
    const fetchThongBao = async () => {
      try {
        const res = await api.get('/ThongBao/NhaTuyenDung');
        setThongBao(res.data);
      } catch (err) {
        console.error('Lỗi khi tải thông báo nhà tuyển dụng:', err);
        Alert.alert('Lỗi', 'Không thể tải thông báo');
      }
    };
    fetchThongBao();
  }, []);

  const handleNotificationPress = baiDangId => {
    if (!baiDangId) {
      Alert.alert('Lỗi', 'Không tìm thấy bài đăng liên quan.');
      return;
    }
    navigation.navigate('ChiTietBaiDang', {id: baiDangId});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      // onPress={() => handleNotificationPress(item.baiDangId)}
      activeOpacity={0.7}>
      <View style={styles.card}>
        <Text style={styles.message}>{item.noiDung}</Text>
        <Text style={styles.date}>
          {new Date(item.thoiGian).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Thông báo nhà tuyển dụng</Text>
      {thongBao.length === 0 ? (
        <Text style={styles.emptyText}>Hiện không có thông báo nào.</Text>
      ) : (
        <FlatList
          data={thongBao}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}
    </View>
  );
};

export default ThongBaoNhaTuyenDung;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#388E3C', 
  },
  card: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#e8f0fe',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  message: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  date: {
    marginTop: 6,
    color: '#666',
    fontSize: 13,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
});
