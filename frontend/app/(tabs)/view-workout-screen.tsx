import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const BACKEND_URL = 'http://192.168.1.25:3000';

interface WorkoutExercise {
  id: number;
  name: string;
  sets: string;
  reps: string;
}

interface Workout {
  id: number;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
}

const ViewWorkoutScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/workouts`);
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error('Failed to fetch workouts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
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
      <Text style={styles.title}>Workouts</Text>
      <FlatList
        data={workouts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <Text style={styles.workoutName}>{item.name}</Text>
            {item.description ? (
              <Text style={styles.workoutDesc}>{item.description}</Text>
            ) : null}
            <Text style={styles.sectionTitle}>Exercises:</Text>
            {item.exercises && item.exercises.length > 0 ? (
              item.exercises.map(ex => (
                <Text key={ex.id + ex.name} style={styles.exerciseText}>
                  • {ex.name} ({ex.sets} sets × {ex.reps} reps)
                </Text>
              ))
            ) : (
              <Text style={styles.exerciseText}>No exercises</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text>No workouts found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  workoutItem: { marginBottom: 24, padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  workoutName: { fontSize: 18, fontWeight: 'bold' },
  workoutDesc: { fontSize: 14, color: '#666', marginBottom: 6 },
  sectionTitle: { fontWeight: 'bold', marginTop: 8 },
  exerciseText: { marginLeft: 8, fontSize: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ViewWorkoutScreen;