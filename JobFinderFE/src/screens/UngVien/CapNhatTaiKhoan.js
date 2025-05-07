import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import api from '../../services/api';

const GREEN = '#388E3C';
const LIGHT_GRAY = '#888';
const BORDER_RADIUS = 8;

const CapNhatTaiKhoan = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [vaiTro, setVaiTro] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [anhDaiDien, setAnhDaiDien] = useState(null);
  const [linhVucList, setLinhVucList] = useState([]);
  const [selectedLinhVucIds, setSelectedLinhVucIds] = useState([]);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserInfo();
    fetchLinhVuc();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await api.get('/HoSo');
      const data = res.data;
      setUser(data);
      setHoTen(data.hoTen);
      setEmail(data.email);
      setVaiTro(data.vaiTro);
      setAnhDaiDien(data.anhDaiDien);
      setSelectedLinhVucIds(data.linhVucs.map(lv => lv.id));
    } catch {
      Alert.alert('Lỗi', 'Không lấy được thông tin người dùng');
    }
  };

  const fetchLinhVuc = async () => {
    try {
      const res = await api.get('/LinhVuc');
      setLinhVucList(res.data);
    } catch {
      Alert.alert('Lỗi', 'Không lấy được danh sách lĩnh vực');
    }
  };

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) return;
      if (response.errorCode) return Alert.alert('Lỗi', 'Không thể chọn ảnh');
      const asset = response.assets && response.assets[0];
      if (asset?.uri) setAnhDaiDien(asset.uri);
    });
  };

  const toggleLinhVuc = id => {
    setSelectedLinhVucIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleUpdate = async () => {
    if (!hoTen) return Alert.alert('Lỗi', 'Họ tên không được bỏ trống');
    if (matKhauMoi && matKhauMoi !== xacNhanMatKhau)
      return Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');

    const formData = new FormData();
    formData.append('hoTen', hoTen);
    formData.append('email', email);
    formData.append('matKhauMoi', matKhauMoi);

    selectedLinhVucIds.forEach(id => {
      formData.append('linhVucIds', id);
    });

    if (anhDaiDien && !anhDaiDien.startsWith('http')) {
      formData.append('anhDaiDien', {
        uri: anhDaiDien,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      await api.put('/HoSo', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      Alert.alert('Thành công', 'Cập nhật thành công', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert(
        'Cập nhật thất bại',
        error.response?.data?.message || error.message,
      );
    }
  };

  if (!user)
    return (
      <Text style={{textAlign: 'center', marginTop: 20}}>
        Đang tải dữ liệu...
      </Text>
    );

  const filteredFields = linhVucList.filter(lv =>
    lv.tenLinhVuc.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cập nhật tài khoản</Text>
      </View>

      <TouchableOpacity style={styles.avatarWrap} onPress={handlePickImage}>
        <Image
          source={
            anhDaiDien
              ? {uri: anhDaiDien}
              : require('../../assets/default-avatar.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.greenText}>Chọn ảnh mới</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Họ tên</Text>
      <TextInput style={styles.input} value={hoTen} onChangeText={setHoTen} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Vai trò</Text>
      <TextInput
        style={styles.input}
        value={vaiTro === 'ung_vien' ? 'Ứng viên' : 'Nhà tuyển dụng'}
        editable={false}
      />

      <Text style={styles.label}>Mật khẩu mới (nếu muốn)</Text>
      <TextInput
        style={styles.input}
        value={matKhauMoi}
        onChangeText={setMatKhauMoi}
        secureTextEntry
      />

      <Text style={styles.label}>Xác nhận mật khẩu</Text>
      <TextInput
        style={styles.input}
        value={xacNhanMatKhau}
        onChangeText={setXacNhanMatKhau}
        secureTextEntry
      />

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Lĩnh vực:</Text>
        <View style={{flex: 1, marginLeft: 8}}>
          {selectedLinhVucIds.length ? (
            selectedLinhVucIds.map(id => {
              const linhVuc = linhVucList.find(lv => lv.id === id);
              return linhVuc ? (
                <Text key={id} style={styles.chip}>
                  • {linhVuc.tenLinhVuc}
                </Text>
              ) : null;
            })
          ) : (
            <Text style={{color: LIGHT_GRAY}}>Chưa cập nhật</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => setShowFieldModal(true)}>
          <Text style={styles.link}>Cập nhật</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
      </TouchableOpacity>

      {/* Modal chọn lĩnh vực */}
      <Modal visible={showFieldModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowFieldModal(false)}>
              <Text style={styles.backArrow}>&lt;</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Chọn lĩnh vực</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Tìm kiếm lĩnh vực..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          <FlatList
            data={filteredFields}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => toggleLinhVuc(item.id)}>
                <View style={styles.checkbox}>
                  {selectedLinhVucIds.includes(item.id) && <Text>✔</Text>}
                </View>
                <Text>{item.tenLinhVuc}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={[styles.button, {marginTop: 16}]}
            onPress={() => setShowFieldModal(false)}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 16},
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  backArrow: {fontSize: 24, color: GREEN},
  title: {fontSize: 18, fontWeight: 'bold', marginLeft: 8, color: '#000'},
  avatarWrap: {alignItems: 'center', marginBottom: 16},
  avatar: {width: 100, height: 100, borderRadius: 50, marginBottom: 8},
  greenText: {color: GREEN},
  label: {color: '#000', marginTop: 8, marginBottom: 4},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: BORDER_RADIUS,
    padding: 10,
    backgroundColor: '#fff',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  chip: {marginVertical: 2, color: '#000'},
  link: {color: GREEN, marginTop: 4},
  button: {
    backgroundColor: GREEN,
    padding: 12,
    borderRadius: BORDER_RADIUS,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  modalContainer: {flex: 1, backgroundColor: '#fff', padding: 16},
  listItem: {flexDirection: 'row', alignItems: 'center', paddingVertical: 8},
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CapNhatTaiKhoan;
