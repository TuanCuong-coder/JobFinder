import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import api from '../../services/api';

export default function TimKiemViecLam({route, navigation}) {
  const {query} = route.params || {};
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState(query || '');

  const [hinhThucList, setHinhThucList] = useState([]);
  const [linhVucList, setLinhVucList] = useState([]);
  const [selectedHinhThuc, setSelectedHinhThuc] = useState('');
  const [selectedLinhVuc, setSelectedLinhVuc] = useState('');

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    api.get('/CongViec').then(res => {
      setJobs(res.data);
      setFiltered(res.data);
    });

    api.get('/HinhThucLamViec').then(res => setHinhThucList(res.data));
    api.get('/LinhVuc').then(res => setLinhVucList(res.data));
  }, []);

  const handleSearch = () => {
    let result = [...jobs];

    if (searchText)
      result = result.filter(j =>
        j.tieuDe.toLowerCase().includes(searchText.toLowerCase()),
      );

    if (selectedHinhThuc)
      result = result.filter(j => j.hinhThuc.id === selectedHinhThuc);

    if (selectedLinhVuc)
      result = result.filter(j => j.linhVuc.id === selectedLinhVuc);

    setFiltered(result);
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedHinhThuc('');
    setSelectedLinhVuc('');
    setFiltered(jobs);
  };

  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 100}}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Tìm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilter(!showFilter)}>
            <Text style={styles.buttonText}>Lọc {showFilter ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleReset}>
            <Text style={styles.buttonText}>Xóa lọc</Text>
          </TouchableOpacity>
        </View>

        {showFilter && (
          <View style={styles.pickerRow}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Hình thức</Text>
              <Picker
                selectedValue={selectedHinhThuc}
                onValueChange={value => setSelectedHinhThuc(value)}
                style={styles.picker}>
                <Picker.Item label="Chọn hình thức" value="" />
                {hinhThucList.map(ht => (
                  <Picker.Item key={ht.id} label={ht.ten} value={ht.id} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Lĩnh vực</Text>
              <Picker
                selectedValue={selectedLinhVuc}
                onValueChange={value => setSelectedLinhVuc(value)}
                style={styles.picker}>
                <Picker.Item label="Chọn lĩnh vực" value="" />
                {linhVucList.map(lv => (
                  <Picker.Item
                    key={lv.id}
                    label={lv.tenLinhVuc}
                    value={lv.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {filtered.map(item => (
          <TouchableOpacity
            key={item.id.toString()}
            style={styles.card}
            onPress={() =>
              navigation.navigate('ChiTietCongViec', {idCongViec: item.id})
            }>
            <Text style={styles.title}>{item.tieuDe}</Text>
            <Text numberOfLines={2} style={styles.description}>
              {item.moTa}
            </Text>
            <Text style={styles.dateText}>
              Ngày đăng: {formatDate(item.ngayDang)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },
  searchButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  clearButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerWrapper: {
    flex: 1,
    marginRight: 8,
  },
  pickerLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1e293b',
  },
  picker: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  card: {
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
  },
});
