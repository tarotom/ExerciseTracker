import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ViewHistory'>;

const ViewHistoryScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>History</Text>
      {/* show list of workouts */}
      <Button title="Name or time or something of the Workout here" onPress={() => navigation.navigate('ViewWorkout')} />
    </View>
  );
};

export default ViewHistoryScreen;
