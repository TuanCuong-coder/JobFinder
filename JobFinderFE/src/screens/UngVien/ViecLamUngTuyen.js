import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import api from '../../services/api';
import {useNavigation} from '@react-navigation/native';

const ViecLamUngTuyen = () => {
  const [danhSach, setDanhSach] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/NopDon');
      setDanhSach(res.data);
    } catch (error) {
      console.error(
        'Lỗi khi gọi API ứng tuyển:',
        error.response?.data || error.message,
      );
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ChiTietCongViec', {idCongViec: item.congViec.id})
      }>
      <Text style={styles.title}>{item.congViec.tieuDe}</Text>
      <Text style={styles.desc}>CV đã nộp: {item.cv.tieuDe}</Text>
      <Text style={styles.date}>
        Ngày nộp: {new Date(item.ngayNop).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Việc làm đã ứng tuyển</Text>
      <FlatList
        data={danhSach}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa ứng tuyển công việc nào.</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
  separator: {
    height: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default ViecLamUngTuyen;
