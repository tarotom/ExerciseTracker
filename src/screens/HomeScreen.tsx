import React from 'react';
import { View, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Text style={{fontWeight: 'bold'}}>Your Workout History</Text> */}
      <Button title="Add A Workout" onPress={() => navigation.navigate('AddWorkout')} />
      <Button title="View History" onPress={() => navigation.navigate('ViewHistory')} />
    </View>
  );
};

export default HomeScreen;
