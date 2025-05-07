import React, {useCallback, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import api from '../../services/api';

const DanhSachBaiDang = ({navigation}) => {
  const [baiDangs, setBaiDangs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBaiDang = async () => {
    try {
      setLoading(true);
      const res = await api.get('/BaiDang');
      setBaiDangs(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài đăng:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({title: 'Danh sách bài đăng'});
      fetchBaiDang();
    }, []),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChiTietBaiDang', {id: item.id})}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.tieuDe}</Text>
        <Text style={styles.infoText}>Hình thức: {item.hinhThuc}</Text>
        <Text style={styles.infoText}>Lĩnh vực: {item.linhVuc}</Text>
        <Text style={styles.infoText}>
          Ngày đăng: {new Date(item.ngayDang).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <Text style={styles.message}>Đang tải...</Text>
      ) : baiDangs.length === 0 ? (
        <Text style={styles.message}>Bạn chưa có bài đăng nào</Text>
      ) : (
        <FlatList
          data={baiDangs}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{padding: 16}}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('TaoBaiDang')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff', 
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#388E3C', 
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#333'}, 
  infoText: {
    fontSize: 14,
    color: '#666', 
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#388E3C',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: 'white',
    fontSize: 30,
  },
  message: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#555',
  },
});

export default DanhSachBaiDang;
