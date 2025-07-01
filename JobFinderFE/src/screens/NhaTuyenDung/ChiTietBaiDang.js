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

    const loadChiTietBaiDang = async () => {
      try {
        const res = await api.get(`/BaiDang/${id}`);
        setBaiDang(res.data);
        console.log('Chi tiết bài đăng:', res.data); 
      } catch (error) {
        console.error('Lỗi khi tải chi tiết bài đăng:', error);
      }
    };

    if (isFocused) {
      loadChiTietBaiDang();
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
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Text style={styles.postTitle}>{baiDang.tieuDe}</Text>

      <Text style={styles.fieldLabel}>Lĩnh vực:</Text>
      <Text style={styles.fieldValue}>
        {typeof baiDang.linhVuc === 'string'
          ? baiDang.linhVuc
          : baiDang.linhVuc?.ten}
      </Text>

      <Text style={styles.fieldLabel}>Hình thức:</Text>
      <Text style={styles.fieldValue}>
        {typeof baiDang.hinhThuc === 'string'
          ? baiDang.hinhThuc
          : baiDang.hinhThuc?.ten}
      </Text>

      <Text style={styles.fieldLabel}>Mô tả:</Text>
      <Text style={styles.fieldValue}>{baiDang.moTa}</Text>

      <Text style={styles.fieldLabel}>Ngày đăng:</Text>
      <Text style={styles.fieldValue}>
        {new Date(baiDang.ngayDang).toLocaleDateString()}
      </Text>

      <TouchableOpacity
        testID="btn-xem-ung-vien"
        onPress={() => navigation.navigate('DanhSachUngVien', {congViecId: id})}
        style={[styles.actionButton, {backgroundColor: '#007bff'}]}
      >
        <Text style={styles.actionButtonText}>Xem danh sách ứng viên</Text>
      </TouchableOpacity>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          testID="btn-xoa"
          style={[styles.actionButton, {backgroundColor: '#dc3545'}]}
          onPress={handleDelete}>
          <Text style={styles.actionButtonText}>Xoá bài đăng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="btn-sua"
          style={[styles.actionButton, {backgroundColor: '#388E3C'}]}
          onPress={() => navigation.navigate('SuaBaiDang', {id})}>
          <Text style={styles.actionButtonText}>Sửa bài đăng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    padding: 20,
    paddingBottom: 72, 
    backgroundColor: '#F9F9F9',
  },
  postTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
    textAlign: 'center',
  },
  fieldLabel: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 14,
    marginBottom: 4,
    color: '#2E7D32',
  },
  fieldValue: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButtonsContainer: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChiTietBaiDang;
