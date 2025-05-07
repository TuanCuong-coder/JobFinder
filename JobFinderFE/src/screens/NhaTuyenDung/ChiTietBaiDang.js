import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import api from '../../services/api';

const ChiTietBaiDang = ({route, navigation}) => {
  const {id} = route.params;
  const [baiDang, setBaiDang] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    navigation.setOptions({title: 'Chi tiết bài đăng'});

    const fetchData = async () => {
      try {
        const res = await api.get(`/BaiDang/${id}`);
        setBaiDang(res.data);
      } catch (error) {
        console.error('Lỗi khi tải chi tiết bài đăng:', error);
      }
    };

    if (isFocused) {
      fetchData();
    }
  }, [id, isFocused]);

  const handleDelete = async () => {
    Alert.alert('Xác nhận xoá', 'Bạn có chắc muốn xoá bài đăng này?', [
      {text: 'Huỷ', style: 'cancel'},
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/BaiDang/${id}`);
            Alert.alert('Thành công', 'Bài đăng đã được xoá.');
            navigation.goBack();
          } catch (error) {
            console.error('Lỗi khi xoá:', error);
            Alert.alert('Lỗi', 'Không thể xoá bài đăng.');
          }
        },
      },
    ]);
  };

  if (!baiDang) {
    return (
      <ActivityIndicator style={{marginTop: 50}} size="large" color="#388E3C" />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{baiDang.tieuDe}</Text>

      <Text style={styles.label}>Lĩnh vực:</Text>
      <Text style={styles.infoText}>
        {typeof baiDang.linhVuc === 'string'
          ? baiDang.linhVuc
          : baiDang.linhVuc?.ten}
      </Text>

      <Text style={styles.label}>Hình thức:</Text>
      <Text style={styles.infoText}>
        {typeof baiDang.hinhThuc === 'string'
          ? baiDang.hinhThuc
          : baiDang.hinhThuc?.ten}
      </Text>

      <Text style={styles.label}>Mô tả:</Text>
      <Text style={styles.infoText}>{baiDang.moTa}</Text>

      <Text style={styles.label}>Ngày đăng:</Text>
      <Text style={styles.infoText}>
        {new Date(baiDang.ngayDang).toLocaleDateString()}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('DanhSachUngVien', {congViecId: id})}
        style={[styles.button, {backgroundColor: '#007bff'}]} // Xanh dương
      >
        <Text style={styles.buttonText}>Xem danh sách ứng viên</Text>
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#dc3545', flex: 1}]}
          onPress={handleDelete}>
          <Text style={styles.buttonText}>Xoá bài đăng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#388E3C', flex: 1}]}
          onPress={() => navigation.navigate('SuaBaiDang', {id})}>
          <Text style={styles.buttonText}>Sửa bài đăng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#388E3C',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    color: '#388E3C',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  buttonGroup: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChiTietBaiDang;
