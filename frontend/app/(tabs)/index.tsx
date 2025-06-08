import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link, router } from 'expo-router';

export default function Index() {
  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.text}>Home screen</Text>
  //     <Link href="/home-screen" style={styles.button}>
  //       Go to About screen
  //     </Link>
  //   </View>
  // );
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Text style={{fontWeight: 'bold'}}>Your Workout History</Text> */}
      {/* <Button title="Add A Workout" onPress={() => navigation.navigate('AddWorkout')} />
      <Button title="Add A Exercise" onPress={() => navigation.navigate('AddExercise')} />
      <Button title="View History" onPress={() => navigation.navigate('ViewHistory')} /> */}
      <Text>Exercise tracker</Text>
      {/* <Link href="/home-screen" style={styles.button}>
            Home
      </Link> */}
      <Link href="/add-exercise-screen" style={styles.button}>
            Add exercise
      </Link>
      <Link href="/add-workout-screen" style={styles.button}>
            Add workout
      </Link>
      <Link href="/view-exercise-screen" style={styles.button}>
            View exercise
      </Link>
      <Link href="/view-history-screen" style={styles.button}>
            View history
      </Link>
      <Link href="/view-workout-screen" style={styles.button}>
            View workout
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: 'black',
  },
});