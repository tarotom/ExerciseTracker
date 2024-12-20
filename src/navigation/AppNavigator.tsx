import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import ViewHistoryScreen from '../screens/ViewHistoryScreen';

export type RootStackParamList = {
  Home: undefined;
  AddWorkout: undefined;
  ViewHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'App name(Home screen)' }} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} options={{ title: 'Add A Workout' }} />
      <Stack.Screen name="ViewHistory" component={ViewHistoryScreen} options={{ title: 'View History' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;