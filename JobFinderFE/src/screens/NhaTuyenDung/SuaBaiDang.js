import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import api from '../../services/api';

const SuaBaiDang = ({route, navigation}) => {
  const {id} = route.params;

  const [tieuDe, setTieuDe] = useState('');
  const [moTa, setMoTa] = useState('');
  const [selectedLinhVuc, setSelectedLinhVuc] = useState(null);
  const [selectedHinhThuc, setSelectedHinhThuc] = useState(null);
  const [linhVucItems, setLinhVucItems] = useState([]);
  const [hinhThucItems, setHinhThucItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({title: 'Sửa bài đăng'});

    const fetchData = async () => {
      try {
        const [lvRes, htRes, baiDangRes] = await Promise.all([
          api.get('/LinhVuc'),
          api.get('/HinhThucLamViec'),
          api.get(`/BaiDang/${id}`),
        ]);

        setLinhVucItems(
          lvRes.data.map(item => ({label: item.tenLinhVuc, value: item.id})),
        );
        setHinhThucItems(
          htRes.data.map(item => ({label: item.ten, value: item.id})),
        );

        setTieuDe(baiDangRes.data.tieuDe);
        setMoTa(baiDangRes.data.moTa);
        setSelectedLinhVuc(baiDangRes.data.linhVuc.linhVucId);
        setSelectedHinhThuc(baiDangRes.data.hinhThuc.hinhThucId);
      } catch (error) {
        console.error(error);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu bài đăng.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigation]);

  const handleUpdate = async () => {
    if (!tieuDe || !moTa || !selectedLinhVuc || !selectedHinhThuc) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      await api.put(`/BaiDang/${id}`, {
        tieuDe,
        moTa,
        linhVucId: selectedLinhVuc,
        hinhThucId: selectedHinhThuc,
      });

      Alert.alert('Thành công', 'Bài đăng đã được cập nhật.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể cập nhật bài đăng.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#388E3C" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        value={tieuDe}
        onChangeText={setTieuDe}
        placeholder="Nhập tiêu đề"
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, {height: 100}]}
        value={moTa}
        onChangeText={setMoTa}
        placeholder="Nhập mô tả"
        multiline
      />

      <Text style={styles.label}>Lĩnh vực</Text>
      <Picker
        selectedValue={selectedLinhVuc}
        onValueChange={value => setSelectedLinhVuc(value)}
        style={styles.picker}>
        <Picker.Item label="Chọn lĩnh vực" value={null} />
        {linhVucItems.map(item => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>

      <Text style={styles.label}>Hình thức</Text>
      <Picker
        selectedValue={selectedHinhThuc}
        onValueChange={value => setSelectedHinhThuc(value)}
        style={styles.picker}>
        <Picker.Item label="Chọn hình thức" value={null} />
        {hinhThucItems.map(item => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>

      {/* Nút Cập nhật */}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập nhật bài đăng</Text>
      </TouchableOpacity>

      {/* Nút Huỷ */}
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'gray', marginTop: 10}]}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Huỷ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SuaBaiDang;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 18, 
    color: '#388E3C',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
    fontSize: 16, 
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
    height: 50,
  },
  button: {
    backgroundColor: '#388E3C',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
