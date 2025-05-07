import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import api from '../../services/api';

const TaiKhoanNhaTuyenDung = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [soLuongBaiDang, setSoLuongBaiDang] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, baiDangRes] = await Promise.all([
        api.get('/NguoiDung/thong-tin'),
        api.get('/BaiDang'),
      ]);

      setUser(userRes.data);
      setSoLuongBaiDang(baiDangRes.data.length || 0);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const handleDangXuat = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Đồng ý',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{name: 'DangNhap'}],
          });
        },
      },
    ]);
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#388E3C" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.userInfoContainer}>
        <Image
          source={
            user.anh_dai_dien
              ? {uri: user.anh_dai_dien}
              : require('../../assets/default-avatar.png')
          }
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.ho_ten}</Text>
          <Text>ID: {user.id}</Text>
        </View>
        <Button
          title="Cập nhật"
          onPress={() => navigation.navigate('CapNhatTaiKhoan')}
        />
      </View>

     
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('DanhSachBaiDang')}>
          <Text style={styles.statCount}>{soLuongBaiDang}</Text>
          <Text style={styles.statLabel}>Danh sách bài đăng</Text>
        </TouchableOpacity>
      </View>

    
      <View style={styles.logoutButtonContainer}>
        <Button title="Đăng xuất" onPress={handleDangXuat} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#388E3C',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#388E3C',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#E8F5E9', 
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#388E3C', 
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  logoutButtonContainer: {
    marginTop: 'auto',
    alignItems: 'flex-end',
  },
});

export default TaiKhoanNhaTuyenDung;
