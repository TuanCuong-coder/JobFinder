import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import api from '../../services/api';
import {useNavigation} from '@react-navigation/native';
import {jwtDecode} from 'jwt-decode';

const DanhSachYeuThich = () => {
  const [dsYeuThich, setDsYeuThich] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserIdAndData = async () => {
      try {
        const token = await api.getToken();
        const decoded = jwtDecode(token);

        const nameIdKey =
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
        const uid = parseInt(decoded[nameIdKey]);

        if (!uid) throw new Error('Token không chứa nameidentifier');

        setUserId(uid);
        fetchData(uid);
      } catch (error) {
        console.error('Lỗi giải mã token hoặc fetch:', error.message || error);
      }
    };

    fetchUserIdAndData();
  }, []);

  const fetchData = async uid => {
    try {
      const res = await api.get(`/YeuThich/ungvien/${uid}`);
      setDsYeuThich(res.data);
    } catch (error) {
      console.error(
        'Lỗi khi gọi API danh sách yêu thích:',
        error.response?.data || error.message,
      );
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ChiTietCongViec', {idCongViec: item.congViecId})
      }>
      <Text style={styles.title}>{item.tieuDe}</Text>
      <Text style={styles.desc}>{item.moTa?.slice(0, 100)}...</Text>
      <Text style={styles.date}>
        Ngày yêu thích: {new Date(item.ngayYeuThich).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách công việc yêu thích</Text>
      <FlatList
        data={dsYeuThich}
        keyExtractor={item => item.yeuThichId.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Chưa có công việc nào được yêu thích.
          </Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#388E3C',
  },
  card: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#212121',
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20,
  },
  separator: {
    height: 12,
  },
});

export default DanhSachYeuThich;
