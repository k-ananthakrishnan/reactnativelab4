
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CabsListScreen from '../screens/CabsListScreen';
import CabDetailScreen from '../screens/CabDetailScreen';
import BookingsScreen from '../screens/BookingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CabsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CabsList" component={CabsListScreen} options={{ title: 'Available Cabs' }} />
      <Stack.Screen name="CabDetail" component={CabDetailScreen} options={{ title: 'Cab Details' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string = '';

            if (route.name === 'Home') {
              iconName = 'car';
            } else if (route.name === 'My Cabs') {
              iconName = 'person-circle-sharp';
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name="Home" component={CabsStack} />
        <Tab.Screen name="My Cabs" component={BookingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

