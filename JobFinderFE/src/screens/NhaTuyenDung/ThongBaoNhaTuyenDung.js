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
  manHinh: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  tieuDe: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2E7D32',
  },
  thongBaoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  noiDung: {
    fontSize: 16,
    color: '#212121',
  },
  thoiGian: {
    fontSize: 13,
    color: '#757575',
    marginTop: 8,
  },
  trangThai: {
    fontSize: 16,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 32,
  },
});
