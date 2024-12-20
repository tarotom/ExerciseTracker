import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import ViewHistoryScreen from '../screens/ViewHistoryScreen';
import ViewWorkoutScreen from '../screens/ViewWorkoutScreen';
import AddExerciseScreen from '../screens/AddExerciseScreen';
import ViewExerciseScreen from '../screens/ViewExerciseScreen';

export type RootStackParamList = {
  Home: undefined;
  ViewHistory: undefined;
  AddWorkout: undefined;
  ViewWorkout: undefined;
  AddExercise: undefined;
  ViewExercise: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'App name(Home screen)' }} />
      <Stack.Screen name="ViewHistory" component={ViewHistoryScreen} options={{ title: 'View History' }} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} options={{ title: 'Add A Workout' }} />
      <Stack.Screen name="ViewWorkout" component={ViewWorkoutScreen} options={{ title: 'View Workout' }} />
      <Stack.Screen name="AddExercise" component={AddExerciseScreen} options={{ title: 'Add A Exercise' }} />
      <Stack.Screen name="ViewExercise" component={ViewExerciseScreen} options={{ title: 'View A Exercise' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;