import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Image ,TouchableOpacity} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { doc, updateDoc, onSnapshot, query, where, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

type Cab = {
  id: string;
  companyName: string;
  carModel: string;
  passengerCapacity: number;
  rating: number;
  costPerHour: number;
  status: boolean; 
};

type RootStackParamList = {
  CabsList: undefined;
  CabDetail: { cab: Cab };
};

type CabDetailScreenRouteProp = RouteProp<RootStackParamList, 'CabDetail'>;

const CabDetailScreen: React.FC = () => {
  const { params } = useRoute<CabDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { cab } = params;
  const [currentCab, setCurrentCab] = useState<Cab | null>(null);

  const fetchCabDetails = useCallback(() => {
    const cabRef = doc(firestore, 'cabs', cab.id);
    return onSnapshot(cabRef, (docSnap) => {
      if (docSnap.exists()) {
        setCurrentCab(docSnap.data() as Cab);
      } else {
        Alert.alert('Error', 'Cab not found!');
      }
    }, (error) => {
      Alert.alert('Error', 'Failed to fetch cab details.');
    });
  }, [cab.id]);

  useEffect(() => {
    const unsubscribe = fetchCabDetails();
    return () => unsubscribe();
  }, [fetchCabDetails]);

  const handleBooking = async () => {
    try {
      if (currentCab) {
        const bookedQuery = query(collection(firestore, 'cabs'), where('status', '==', true));
        const querySnapshot = await getDocs(bookedQuery);
        if (querySnapshot.docs.length >= 2) {
          Alert.alert('Booking Limit Reached', 'You can only book up to two cabs at a time.');
          return;
        }
        await updateDoc(doc(firestore, 'cabs', cab.id), { status: true });
        Alert.alert('Success', 'Cab has been booked successfully.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book the cab.');
      console.error('Error booking cab:', error);
    }
  };

  return (
    <View style={styles.container}>
      {currentCab ? (
        <>
          <Image source={require('../assets/bmw_m3.jpg')} style={styles.image} />
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{currentCab.companyName}</Text>
            <Text style={styles.detail}>Model: {currentCab.carModel}</Text>
            <Text style={styles.detail}>Passengers: {currentCab.passengerCapacity}</Text>
            <Text style={styles.detail}>Rating: {currentCab.rating}</Text>
            <Text style={styles.detail}>Cost/Hour: ${currentCab.costPerHour.toFixed(2)}</Text>
            <Text style={[styles.status, currentCab.status ? styles.statusBooked : styles.statusAvailable]}>
              {currentCab.status ? 'Booked' : 'Available'}
            </Text>
            {!currentCab.status && (
              <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
              <Text style={styles.bookButtonText}>Book This Cab</Text>
            </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 12,
  },
  detail: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 6,
  },
  status: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  statusAvailable: {
    color: '#007bff', // Blue for available
  },
  statusBooked: {
    color: '#28a745', // Green for booked
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CabDetailScreen;
