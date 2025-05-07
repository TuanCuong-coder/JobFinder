import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';

const XemCVFile = ({route, navigation}) => {
  const {tepTinId} = route.params;
  const [cvImageUri, setCvImageUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVFile = async () => {
      try {
        const res = await api.get(`/teptin/${tepTinId}`);
        setCvImageUri(res.data.duongDan);
      } catch (error) {
        console.error('Lỗi khi tải CV file:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCVFile();
  }, [tepTinId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : cvImageUri ? (
        <Image
          source={{uri: cvImageUri}}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text>Không tìm thấy CV</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#388E3C',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  image: {
    width: '100%',
    height: 600,
  },
});

export default XemCVFile;
