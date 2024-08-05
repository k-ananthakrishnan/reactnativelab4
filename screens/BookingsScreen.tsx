import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

type BookedCab = {
  id: string;
  companyName: string;
  carModel: string;
  status: boolean;
};

const BookingsScreen = () => {
  const [bookedCabs, setBookedCabs] = useState<BookedCab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bookingsRef = collection(firestore, 'cabs');
    const unsubscribe = onSnapshot(
      bookingsRef,
      (querySnapshot) => {
        try {
          const cabsData = querySnapshot.docs
            .map(doc => ({ ...doc.data(), id: doc.id } as BookedCab))
            .filter(cab => cab.status);
          setBookedCabs(cabsData);
        } catch (error) {
          setError('Failed to process booked cabs.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError('Failed to fetch booked cabs.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const cancelBooking = async (cabId: string) => {
    try {
      await updateDoc(doc(firestore, 'cabs', cabId), { status: false });
      Alert.alert('Success', 'Booking has been cancelled.');
      setBookedCabs(cabs => cabs.filter(cab => cab.id !== cabId));
    } catch {
      Alert.alert('Error', 'Failed to cancel the booking.');
    }
  };

  const renderCabItem = ({ item }: { item: BookedCab }) => (
    <View style={styles.item}>
      <Text style={styles.companyName}>{item.companyName}</Text>
      <Text style={styles.carModel}>{item.carModel}</Text>
      <TouchableOpacity style={styles.cancelButton} onPress={() => cancelBooking(item.id)}>
        <Text style={styles.cancelButtonText}>Cancel Booking</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#007bff" style={styles.centered} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <FlatList
      data={bookedCabs}
      keyExtractor={item => item.id}
      renderItem={renderCabItem}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginVertical: 20,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#dc3545',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  separator: {
    height: 8,
    backgroundColor: '#f8f9fa',
  },
});

export default BookingsScreen;
