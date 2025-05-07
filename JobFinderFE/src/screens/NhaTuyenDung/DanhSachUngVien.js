import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import api from '../../services/api';

const DanhSachUngVien = ({route, navigation}) => {
  const {congViecId} = route.params;
  const [loading, setLoading] = useState(true);
  const [danhSach, setDanhSach] = useState([]);
  const [error, setError] = useState(null);

  const fetchUngViens = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('congViecId gửi API:', congViecId);
      const res = await api.get(`/nopdon/ung-vien-da-ung-tuyen/${congViecId}`);
      setDanhSach(res.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách ứng viên:', err);
      setError('Đã xảy ra lỗi khi tải danh sách. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({title: 'Ứng viên đã ứng tuyển'});
      fetchUngViens();
    }, [congViecId]),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        console.log('Điều hướng đến CV:', item.cvId);
        navigation.navigate('XemCV', {
          cvId: item.cvId,
          congViecId: congViecId,
        });
      }}>
      <Image
        source={
          item.anhDaiDien
            ? {uri: item.anhDaiDien}
            : require('../../assets/default-avatar.png')
        }
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.hoTen}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.cv} numberOfLines={1} ellipsizeMode="tail">
          CV: {item.cvTieuDe || 'Không rõ'}
        </Text>
        <Text style={styles.date}>
          Ngày nộp: {new Date(item.ngayNop).toLocaleDateString('vi-VN')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#388E3C" />
        <Text style={{marginTop: 10}}>Đang tải danh sách ứng viên...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{color: 'red'}}>{error}</Text>
      </View>
    );
  }

  if (danhSach.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Chưa có ứng viên nào nộp đơn cho công việc này.</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, padding: 12}}>
      <FlatList
        data={danhSach}
        keyExtractor={(item, index) => `${item.ungVienId}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 16}}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchUngViens}
        refreshing={loading}
      />
    </View>
  );
};

export default DanhSachUngVien;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#388E3C',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cv: {
    fontSize: 14,
    marginTop: 4,
    color: '#444',
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
});
