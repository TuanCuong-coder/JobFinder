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

const TaiKhoanUngVien = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [jobCounts, setJobCounts] = useState({
    daUngTuyen: 0,
    uaThich: 0,
    phuHop: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, countRes] = await Promise.all([
        api.get('/NguoiDung/thong-tin'),
        api.get('/NguoiDung/so-luong-cong-viec'),
      ]);

      setUser(userRes.data);
      setJobCounts({
        daUngTuyen: countRes.data.daUngTuyen || 0,
        uaThich: countRes.data.uaThich || 0,
        phuHop: countRes.data.phuHop || 0,
      });
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

  const handleNavigate = loai => {
    switch (loai) {
      case 'ungTuyen':
        navigation.navigate('ViecLamUngTuyen');
        break;
      case 'yeuThich':
        navigation.navigate('DanhSachYeuThich');
        break;
      case 'phuHop':
        navigation.navigate('DanhSachPhuHop');
        break;
      default:
        Alert.alert('Lỗi', 'Không xác định loại công việc');
    }
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
      {/* Thông tin người dùng */}
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

      {/* Các mục thống kê */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => handleNavigate('ungTuyen')}>
          <Text style={styles.statCount}>{jobCounts.daUngTuyen}</Text>
          <Text style={styles.statLabel}>Việc làm đã ứng tuyển</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => handleNavigate('yeuThich')}>
          <Text style={styles.statCount}>{jobCounts.uaThich}</Text>
          <Text style={styles.statLabel}>Việc làm yêu thích</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => handleNavigate('phuHop')}>
          <Text style={styles.statCount}>{jobCounts.phuHop}</Text>
          <Text style={styles.statLabel}>Việc làm phù hợp</Text>
        </TouchableOpacity>
      </View>

      {/* Nút đăng xuất */}
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

export default TaiKhoanUngVien;
