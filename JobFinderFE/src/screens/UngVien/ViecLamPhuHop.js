import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import api from '../../services/api';
import {useFocusEffect} from '@react-navigation/native';

export default function ViecLamPhuHop({navigation}) {
  const [suggestions, setSuggestions] = useState([]);
  const [shown, setShown] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await api.get('/CongViec/goi-y');
          setSuggestions(res.data);
          setShown(res.data.slice(0, 3));
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    }, []),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ChiTietCongViec', {idCongViec: item.id})
      }>
      <Text style={styles.title}>{item.tieuDe}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {item.moTa}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shown}
        keyExtractor={i => i.id.toString()}
        renderItem={renderItem}
      />
      {shown.length < suggestions.length && (
        <TouchableOpacity
          style={styles.btnAll}
          onPress={() => setShown(suggestions)}>
          <Text style={styles.btnAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  card: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  btnAll: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#388E3C',
    borderRadius: 10,
    marginTop: 10,
  },
  btnAllText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
