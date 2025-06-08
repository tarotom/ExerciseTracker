import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { RootStackParamList } from '../navigation/AppNavigator';

// type Props = NativeStackScreenProps<RootStackParamList, 'ViewHistory'>;
// const buttonTextUP = "19.12.2024\nUpper Power"
// const buttonTextLP = "20.12.2024\nLower Power"
// const buttonTextUH = "20.12.2024\nUpper Hypertrophy"
// const buttonTextLH = "20.12.2024\nLower Hypertrophy"

const ViewHistoryScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>History</Text>
      {/* show list of workouts */}
        {/* <TouchableOpacity style={styles.historyContainer} onPress={() => navigation.navigate('ViewWorkout')} ><Text>{buttonTextUP}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.historyContainer} onPress={() => navigation.navigate('ViewWorkout')} ><Text>{buttonTextLP}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.historyContainer} onPress={() => navigation.navigate('ViewWorkout')} ><Text>{buttonTextUH}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.historyContainer} onPress={() => navigation.navigate('ViewWorkout')} ><Text>{buttonTextLH}</Text></TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    flex: 0.10,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 7
  },
});

export default ViewHistoryScreen;
