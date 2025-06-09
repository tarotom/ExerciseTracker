import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const API_URL = 'http://192.168.1.25:3000';

  // useEffect(() => {
    fetch('http://192.168.1.25:3000/api/test')
    .then(async (res) => {
      const text = await res.text(); // log raw response
      console.log('Raw response:', text);
    })
    .catch((err) => console.error(err));
  // }, []);

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