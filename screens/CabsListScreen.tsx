import React, { useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

type Cab = {
  id: string;
  companyName: string;
  carModel: string;
  status: boolean; 
};

type RootStackParamList = {
  CabsList: undefined;
  CabDetail: { cab: Cab };
};

type CabsListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CabsList'>;

const CabsListScreen = () => {
  const navigation = useNavigation<CabsListScreenNavigationProp>();
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshRef = useRef<() => void>(() => {});

  const fetchCabs = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'cabs'));
      const cabsList: Cab[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Cab,
      }));
      setCabs(cabsList);
    } catch (error) {
      setError('Failed to fetch cabs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshRef.current = fetchCabs;
      fetchCabs();
    }, [])
  );

  const goToCabDetail = (cab: Cab) => {
    navigation.navigate('CabDetail', { cab });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Cab }) => (
    <TouchableOpacity
      onPress={() => goToCabDetail(item)}
      style={styles.item}
    >
      <Image source={require('../assets/bmw_m3.jpg')} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.companyName}>{item.companyName}</Text>
        <Text style={styles.carModel}>{item.carModel}</Text>
        <Text style={[styles.status, item.status ? styles.statusBooked : styles.statusAvailable]}>
          {item.status ? 'Booked' : 'Available'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cabs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: 100,
    height: 80,
    marginRight: 16,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
  },
  carModel: {
    fontSize: 16,
    color: '#6c757d',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusAvailable: {
    color: '#007bff', // Blue for available
  },
  statusBooked: {
    color: '#28a745', // Green for booked
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default CabsListScreen;
