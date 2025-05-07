import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from './config';


const instance = axios.create({
  baseURL: BASE_URL,
});


instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export default {
  ...instance,
  getToken,
};
