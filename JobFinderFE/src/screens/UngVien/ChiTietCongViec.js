import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import api from '../../services/api';
import {useNavigation} from '@react-navigation/native';

const ChiTietCongViec = ({route}) => {
  const {idCongViec} = route.params;
  const navigation = useNavigation();

  const [congViec, setCongViec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [cvType, setCVType] = useState(null);
  const [listCV, setListCV] = useState([]);
  const [daUngTuyen, setDaUngTuyen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCongViec = await api.get(`/CongViec/${idCongViec}`);
        setCongViec(resCongViec.data);

        const resListCV = await api.get('/CV');
        setListCV(resListCV.data || []);

        const resNopDon = await api.get('/NopDon');
        const daNop = resNopDon.data.some(
          item => item.congViec.id === idCongViec,
        );
        setDaUngTuyen(daNop);

        const resCheckYeuThich = await api.get(
          `/YeuThich/check?congViecId=${idCongViec}`,
        );
        setIsFavorite(resCheckYeuThich.data.isYeuThich);
      } catch (error) {
        console.error('Lỗi:', error);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idCongViec]);

  const toggleFavorite = async () => {
    try {
      const res = await api.post('/YeuThich/toggle', {congViecId: idCongViec});
      setIsFavorite(res.data.isYeuThich);
    } catch (err) {
      console.error('Lỗi toggle yêu thích:', err);
      Alert.alert('Lỗi', 'Không thể thay đổi trạng thái yêu thích.');
    }
  };

  const openApplyModal = () => {
    setSelectedCV(null);
    setCVType(null);
    setShowApplyModal(true);
  };
  const closeApplyModal = () => setShowApplyModal(false);

  const handleSelectCVTemplate = () => {
    if (listCV.length === 0) {
      Alert.alert('Chưa có CV mẫu', 'Bạn chưa tạo CV mẫu nào. Tạo ngay nhé?', [
        {text: 'Hủy', style: 'cancel'},
        {text: 'Tạo CV', onPress: () => navigation.navigate('TaoCV')},
      ]);
    } else {
      Alert.alert(
        'Chọn CV mẫu',
        'Hãy chọn một CV mẫu:',
        [
          ...listCV.map(cv => ({
            text: cv.tieuDe,
            onPress: () => {
              setSelectedCV(cv);
              setCVType('cv');
            },
          })),
          {text: 'Hủy', style: 'cancel'},
        ],
        {cancelable: true},
      );
    }
  };

  const pickImageFromDevice = async () => {
    try {
      const result = await launchImageLibrary({mediaType: 'photo'});
      if (!result.didCancel && result.assets?.length > 0) {
        const image = result.assets[0];
        setSelectedCV(image);
        setCVType('image');
      }
    } catch (err) {
      console.error('Lỗi chọn ảnh:', err);
      Alert.alert('Lỗi', 'Không thể tải CV từ thiết bị.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (cvType === 'cv') {
        await api.post('/NopDon', {
          congViecId: idCongViec,
          cvId: selectedCV.id,
        });
      } else if (cvType === 'image') {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedCV.uri,
          type: selectedCV.type,
          name: selectedCV.fileName,
        });

        const uploadRes = await api.post('/TepTin/upload', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        await api.post('/NopDon', {
          congViecId: idCongViec,
          tepTinId: uploadRes.data.id,
        });
      }

      Alert.alert('Thành công', 'Bạn đã ứng tuyển thành công!');
      setDaUngTuyen(true);
      closeApplyModal();
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể nộp đơn.');
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#388E3C"
        style={{flex: 1, justifyContent: 'center'}}
      />
    );
  }

  if (!congViec) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy công việc.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
            }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{congViec.tieuDe}</Text>
          <Text style={styles.description}>{congViec.moTa}</Text>
          <Text style={styles.field}>
            Lĩnh vực: {congViec.linhVuc?.tenLinhVuc}
          </Text>
          <Text style={styles.field}>
            Hình thức: {congViec.hinhThuc?.tenHinhThuc}
          </Text>
          <Text style={styles.field}>
            Nhà tuyển dụng: {congViec.nhaTuyenDung}
          </Text>
          <Text style={styles.field}>
            Ngày đăng: {new Date(congViec.ngayDang).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={toggleFavorite}
          style={styles.favoriteButton}>
          <Text style={{fontSize: 24, color: isFavorite ? '#E53935' : '#888'}}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>

        {daUngTuyen ? (
          <View style={[styles.applyButton, {backgroundColor: '#aaa'}]}>
            <Text style={styles.applyButtonText}>Đã ứng tuyển</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={openApplyModal} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Ứng tuyển ngay</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={showApplyModal} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chọn cách nộp CV</Text>

            <Button
              title="Chọn CV mẫu đã tạo"
              color="#388E3C"
              onPress={handleSelectCVTemplate}
            />
            <Button
              title="Tải CV từ thiết bị (ảnh)"
              color="#388E3C"
              onPress={pickImageFromDevice}
            />

            {selectedCV && (
              <View style={{marginTop: 20}}>
                <Text style={{color: '#333'}}>Đã chọn:</Text>
                {cvType === 'cv' ? (
                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginVertical: 5,
                      color: '#333',
                    }}>
                    {selectedCV.tieuDe}
                  </Text>
                ) : (
                  <Image
                    source={{uri: selectedCV.uri}}
                    style={{width: 100, height: 140, resizeMode: 'contain'}}
                  />
                )}
                <Button
                  title="Xác nhận ứng tuyển"
                  color="#388E3C"
                  onPress={handleSubmit}
                />
              </View>
            )}

            <Button title="Đóng" onPress={closeApplyModal} color="#E53935" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChiTietCongViec;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 16},
  logoContainer: {alignItems: 'center', marginBottom: 20},
  logo: {width: 100, height: 100},
  contentContainer: {flex: 1},
  title: {fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 12},
  description: {fontSize: 16, color: '#555'},
  field: {fontSize: 14, marginTop: 6, color: '#666'},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  favoriteButton: {padding: 10},
  applyButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
