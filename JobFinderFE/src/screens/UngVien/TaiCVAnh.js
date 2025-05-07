import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../../services/config';

const TaiCVAnh = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  const chooseImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) return;

      if (response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chọn ảnh');
      } else {
        const asset = response.assets?.[0];
        if (asset) {
          setSelectedImage(asset);
        }
      }
    });
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Chưa chọn ảnh', 'Vui lòng chọn ảnh CV trước khi tải lên');
      return;
    }

    setUploading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage.uri,
        name: selectedImage.fileName || 'cv.jpg',
        type: selectedImage.type || 'image/jpeg',
      });

      await axios.post(`${BASE_URL}/TepTin/upload?loai=cv`, formData, {
        headers,
      });

      Alert.alert('Thành công', 'Tải ảnh CV thành công');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi tải ảnh:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh CV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tải ảnh CV</Text>

      <TouchableOpacity style={styles.button} onPress={chooseImage}>
        <Text style={styles.buttonText}>Chọn ảnh từ thư viện</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{uri: selectedImage.uri}} style={styles.preview} />
      )}

      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#007AFF'}]}
        onPress={uploadImage}
        disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Tải ảnh lên</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TaiCVAnh;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#888',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  preview: {
    width: '100%',
    height: 300,
    marginVertical: 20,
    borderRadius: 10,
  },
});
