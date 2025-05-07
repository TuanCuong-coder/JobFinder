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

const TaoBaiDang = ({navigation}) => {
  const [tieuDe, setTieuDe] = useState('');
  const [moTa, setMoTa] = useState('');
  const [selectedLinhVuc, setSelectedLinhVuc] = useState(null);
  const [selectedHinhThuc, setSelectedHinhThuc] = useState(null);
  const [linhVucItems, setLinhVucItems] = useState([]);
  const [hinhThucItems, setHinhThucItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({title: 'Tạo bài đăng'});

    const fetchData = async () => {
      try {
        const [lvRes, htRes] = await Promise.all([
          api.get('/LinhVuc'),
          api.get('/HinhThucLamViec'),
        ]);

        setLinhVucItems(
          lvRes.data.map(item => ({
            label: item.tenLinhVuc,
            value: item.id,
          })),
        );

        setHinhThucItems(
          htRes.data.map(item => ({
            label: item.ten,
            value: item.id,
          })),
        );
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        Alert.alert('Lỗi', 'Không thể tải lĩnh vực hoặc hình thức.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!tieuDe || !moTa || !selectedLinhVuc || !selectedHinhThuc) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      await api.post('/BaiDang', {
        tieuDe,
        moTa,
        linhVucId: selectedLinhVuc,
        hinhThucId: selectedHinhThuc,
      });

      Alert.alert('Thành công', 'Bài đăng đã được tạo.');
      navigation.goBack(); 
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tạo bài đăng.');
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Tạo bài đăng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#B0B0B0', marginTop: 10}]}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Huỷ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TaoBaiDang;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#388E3C',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
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
