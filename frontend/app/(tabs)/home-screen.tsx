import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Exercise tracker</Text>
      <Link href="/create-exercise-screen" style={styles.button}>
            Create exercise
      </Link>
      <Link href="/create-workout-screen" style={styles.button}>
            Create workout
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
      <Link href="/track-workout-screen" style={styles.button}>
            Track workout
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