import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import api from '../../services/api';
import {useNavigation} from '@react-navigation/native';

const DanhSachPhuHop = () => {
  const [goiY, setGoiY] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchGoiY();
  }, []);

  const fetchGoiY = async () => {
    try {
      const res = await api.get('/CongViec/goi-y');
      setGoiY(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ChiTietCongViec', {idCongViec: item.id})
      }>
      <Text style={styles.title}>{item.tieuDe}</Text>
      <Text style={styles.desc}>{item.moTa?.slice(0, 100)}...</Text>
      <Text style={styles.date}>
        Ngày đăng: {new Date(item.ngayDang).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Việc làm phù hợp</Text>
      <FlatList
        data={goiY}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
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
});

export default DanhSachPhuHop;
