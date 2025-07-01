import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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

  const renderBaiDang = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ChiTietBaiDang', {id: item.id})}>
        <View style={styles.postCard}>
          <Text style={styles.postTitle}>{item.tieuDe}</Text>
          <Text style={styles.postInfo}>Hình thức: {item.hinhThuc}</Text>
          <Text style={styles.postInfo}>Lĩnh vực: {item.linhVuc}</Text>
          <Text style={styles.postInfo}>
            Ngày đăng: {new Date(item.ngayDang).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenContainer}>
      {loading ? (
        <Text style={styles.statusMessage}>Đang tải...</Text>
      ) : baiDangs.length === 0 ? (
        <Text style={styles.statusMessage}>Bạn chưa có bài đăng nào</Text>
      ) : (
        <>
          <Text style={styles.counterText}>
            Tổng cộng: {baiDangs.length} bài đăng
          </Text>

          <FlatList
            data={baiDangs}
            renderItem={renderBaiDang}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('TaoBaiDang')}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
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
  postTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#2E7D32',
  },
  postInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#388E3C',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
  statusMessage: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#388E3C',
    marginLeft: 16,
    marginBottom: 8,
  },
});

export default DanhSachBaiDang;
