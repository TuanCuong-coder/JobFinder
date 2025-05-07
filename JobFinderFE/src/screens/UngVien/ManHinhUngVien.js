import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SectionList,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import api from '../../services/api';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

export default function ManHinhUngVien() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [sections, setSections] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const goiY = (await api.get('/CongViec/goi-y')).data.slice(0, 3);
          const tatCa = (await api.get('/CongViec')).data.slice(0, 3);
          setSections([
            {title: 'Việc làm phù hợp', data: goiY},
            {title: 'Tất cả việc làm', data: tatCa},
          ]);
        } catch (e) {
          console.error(e);
        }
      };

      fetchData();
    }, []),
  );

  const handleChiTiet = id => {
    navigation.navigate('ChiTietCongViec', {idCongViec: id});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleChiTiet(item.id)}>
      <Text style={styles.title}>{item.tieuDe}</Text>
      <Text numberOfLines={2} style={styles.desc}>
        {item.moTa}
      </Text>
      <Text style={styles.date}>
        Ngày đăng: {new Date(item.ngayDang).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({section: {title}}) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity
        onPress={() => {
          if (title === 'Việc làm phù hợp')
            navigation.navigate('DanhSachPhuHop');
          else navigation.navigate('TimKiemViecLam', {query: ''});
        }}>
        <Text style={styles.linkText}>Xem tất cả</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm việc làm..."
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() =>
              navigation.navigate('TimKiemViecLam', {query: searchText})
            }
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() =>
              navigation.navigate('TimKiemViecLam', {query: searchText})
            }>
            <Text style={styles.searchBtnText}>Tìm</Text>
          </TouchableOpacity>
        </View>
      }
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={<Text style={styles.emptyText}>Chưa có dữ liệu</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff', 
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#388E3C',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9', 
    color: '#333', 
  },
  searchBtn: {
    marginLeft: 8,
    backgroundColor: '#388E3C', 
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#388E3C', 
  },
  sectionTitle: {
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#333', 
  },
  linkText: {
    color: '#388E3C',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff', 
    padding: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: '#388E3C',
    borderWidth: 1, 
  },
  title: {
    fontSize: 18, 
    fontWeight: '600',
    color: '#333', 
  },
  desc: {
    marginTop: 6,
    color: '#666', 
    fontSize: 14,
  },
  date: {
    fontSize: 13,
    color: '#888', 
    marginTop: 10,
    textAlign: 'right',
  },
  separator: {
    height: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
