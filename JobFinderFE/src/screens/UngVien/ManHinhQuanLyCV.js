import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../../services/config';

const ManHinhQuanLyCV = () => {
  const [cvAppList, setCvAppList] = useState([]);
  const [cvImageList, setCvImageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const headers = {Authorization: `Bearer ${token}`};

      const [cvRes, fileRes] = await Promise.all([
        axios.get(`${BASE_URL}/CV`, {headers}),
        axios.get(`${BASE_URL}/TepTin?loai=cv`, {headers}),
      ]);
      console.log('Dữ liệu CV từ API:', cvRes.data);
      setCvAppList(cvRes.data || []);
      setCvImageList(fileRes.data || []);
    } catch (error) {
      console.log('Lỗi khi tải danh sách CV:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (id, type) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá CV này?', [
      {text: 'Hủy'},
      {
        text: 'Xoá',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const headers = {Authorization: `Bearer ${token}`};
            if (type === 'app') {
              await axios.delete(`${BASE_URL}/CV/${id}`, {headers});
            } else {
              await axios.delete(`${BASE_URL}/TepTin/${id}`, {headers});
            }
            Alert.alert('Thành công', 'Đã xoá CV');
            fetchData();
          } catch (error) {
            console.log('Lỗi xoá CV:', error);
            Alert.alert('Lỗi', 'Không thể xoá CV');
          }
        },
      },
    ]);
  };

  const renderCVApp = ({item}) => (
    <View style={styles.card}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>{item.tieuDe}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('token');
                const headers = {Authorization: `Bearer ${token}`};
                const res = await axios.get(`${BASE_URL}/CV/${item.id}`, {
                  headers,
                });

                navigation.navigate('XemCV', {cvId: item.id});
              } catch (error) {
                console.log('Lỗi khi tải chi tiết CV:', error);
                Alert.alert('Lỗi', 'Không thể tải chi tiết CV');
              }
            }}>
            <Text style={styles.link}>Xem</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('token');
                const headers = {Authorization: `Bearer ${token}`};
                const res = await axios.get(`${BASE_URL}/CV/${item.id}`, {
                  headers,
                });
                navigation.navigate('ChinhSuaCV', {cvData: res.data});
              } catch (error) {
                console.log('Lỗi khi tải chi tiết CV:', error);
                Alert.alert('Lỗi', 'Không thể tải chi tiết CV');
              }
            }}>
            <Text style={styles.link}>Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDeleteCV(item.id, 'app')}>
            <Text style={[styles.link, {color: 'red'}]}>Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCVImage = ({item}) => (
    <View style={styles.card}>
      <Image
        source={{uri: `${BASE_URL}/TepTin/tai-ve/${item.tenTep}`}}
        style={styles.image}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('XemAnhCV', {
              imageUrl: `${BASE_URL}/TepTin/tai-ve/${item.tenTep}`,
            })
          }>
          <Text style={styles.link}>Xem</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteCV(item.id, 'file')}>
          <Text style={[styles.link, {color: 'red'}]}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>CV tạo trên App</Text>
      <FlatList
        data={cvAppList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCVApp}
        ListEmptyComponent={<Text style={styles.empty}>Không có CV nào</Text>}
      />

      <Text style={styles.sectionTitle}>CV tải lên (ảnh)</Text>
      <FlatList
        data={cvImageList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCVImage}
        ListEmptyComponent={
          <Text style={styles.empty}>Không có ảnh CV nào</Text>
        }
      />

      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TaoCV')}>
          <Text style={styles.buttonText}>Tạo CV mới</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.uploadButton]}
          onPress={() => navigation.navigate('TaiCVAnh')}>
          <Text style={styles.buttonText}>Tải ảnh CV</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManHinhQuanLyCV;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  link: {
    color: '#007AFF',
    fontWeight: '500',
  },
  image: {
    width: 100,
    height: 130,
    borderRadius: 8,
  },
  empty: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#999',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
