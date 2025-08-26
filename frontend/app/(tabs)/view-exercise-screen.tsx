import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const BACKEND_URL = 'http://192.168.1.25:3000';

interface Exercise {
  id: number;
  name: string;
}

const ViewExerciseScreen: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/exercises`);
        const data = await res.json();
        setExercises(data);
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercises</Text>
      <FlatList
        data={exercises}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No exercises found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  exerciseItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ViewExerciseScreen;