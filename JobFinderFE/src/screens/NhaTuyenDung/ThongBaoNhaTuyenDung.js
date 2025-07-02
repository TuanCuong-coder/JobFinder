import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import api from '../../services/api';

const ThongBaoNhaTuyenDung = ({ navigation }) => {
  const [danhSachThongBao, setDanhSachThongBao] = useState([]);

  //Gọi API để lấy thông báo từ server
  const taiThongBao = async () => {
    try {
      const response = await api.get('/ThongBao/NhaTuyenDung');
      setDanhSachThongBao(response.data);
    } catch (loi) {
      console.error('Không thể tải thông báo:', loi);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lấy thông báo');
    }
  };

  useEffect(() => {
    taiThongBao();
  }, []);

  // Hiển thị từng thông báo
  const renderThongBao = ({ item }) => (
    <TouchableOpacity
      style={styles.thongBaoBox}
      onPress={() => chuyenDenChiTiet(item.baiDangId)}
    >
      <Text style={styles.noiDung}>{item.noiDung}</Text>
      <Text style={styles.thoiGian}>
        {new Date(item.thoiGian).toLocaleString('vi-VN')}
      </Text>
    </TouchableOpacity>
  );

  // Chuyển sang màn hình chi tiết
  const chuyenDenChiTiet = (idBaiDang) => {
    if (!idBaiDang) {
      Alert.alert('Lỗi', 'Không có bài đăng phù hợp.');
      return;
    }
    navigation.navigate('ChiTietBaiDang', { id: idBaiDang });
  };

  return (
    <View style={styles.manHinh}>
      <Text style={styles.tieuDe}>📢 Trung tâm thông báo</Text>

      {danhSachThongBao.length === 0 ? (
        <Text style={styles.trangThai}>Không có thông báo nào.</Text>
      ) : (
        <FlatList
          data={danhSachThongBao}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderThongBao}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default ThongBaoNhaTuyenDung;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    borderBottomLeftRadius: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
  },
  headerText: {fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cardContent: {
    fontSize: 15,
    color: '#37474F',
    fontWeight: '500',
  },
  cardTime: {
    fontSize: 13,
    color: '#78909C',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 34,
  },
});