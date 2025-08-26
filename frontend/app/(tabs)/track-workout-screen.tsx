import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const BACKEND_URL = 'http://192.168.1.25:3000';

interface Exercise {
  id: number;
  name: string;
  sets: string;
  reps: string;
}

interface Workout {
  id: number;
  name: string;
  exercises: Exercise[];
}

interface OngoingSet {
  reps: string;
  weight?: string;
  completed: boolean;
}

interface OngoingExercise extends Exercise {
  performedSets: OngoingSet[];
}

const TrackWorkoutScreen = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<OngoingExercise[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/workouts`);
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error('Failed to fetch workouts:', err);
      }
    };
    fetchWorkouts();
  }, []);

  // When a workout is selected, initialize exercises for tracking
  useEffect(() => {
    if (selectedWorkout) {
      setExercises(
        selectedWorkout.exercises.map(ex => ({
          ...ex,
          performedSets: Array.from({ length: Number(ex.sets) || 1 }, () => ({
            reps: '',
            weight: '',
            completed: false,
          })),
        }))
      );
    }
  }, [selectedWorkout]);

  const handleSetChange = (exIdx: number, setIdx: number, field: 'reps' | 'weight', value: string) => {
    setExercises(prev =>
      prev.map((ex, i) =>
        i === exIdx
          ? {
              ...ex,
              performedSets: ex.performedSets.map((set, j) =>
                j === setIdx ? { ...set, [field]: value } : set
              ),
            }
          : ex
      )
    );
  };

  const handleCompleteSet = (exIdx: number, setIdx: number) => {
    setExercises(prev =>
      prev.map((ex, i) =>
        i === exIdx
          ? {
              ...ex,
              performedSets: ex.performedSets.map((set, j) =>
                j === setIdx ? { ...set, completed: true } : set
              ),
            }
          : ex
      )
    );
  };

  const handleFinishWorkout = () => {
    // TODO: POST the completed workout to backend
    alert('Workout saved!');
  };

  const handleBack = () => {
    Alert.alert(
        'Discard Progress?',
        'Going back will reset any changes you made to this workout. Are you sure?',
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes, go back', style: 'destructive', onPress: () => setSelectedWorkout(null) },
        ]
    );
  };

  // Step 1: Select workout
  if (!selectedWorkout) {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Select a Workout</Text>
        <FlatList
            data={workouts}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
            <TouchableOpacity
                style={styles.workoutItem}
                onPress={() => setSelectedWorkout(item)}
            >
                <Text style={styles.workoutName}>{item.name}</Text>
            </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No workouts found.</Text>}
        />
        </View>
    );
  }

  // Step 2: Track workout
  return (
    <View style={styles.container}>
        <Button title="Back" onPress={handleBack} />
        <Text style={styles.title}>Track Workout: {selectedWorkout.name}</Text>
        <FlatList
        data={exercises}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index: exIdx }) => (
            <View style={styles.exerciseBlock}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.targetText}>
            Target: {item.sets} sets × {item.reps} reps
            </Text>
            {item.performedSets.map((set, setIdx) => (
                <View key={setIdx} style={styles.setRow}>
                <Text>Set {setIdx + 1}:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Reps"
                    keyboardType="numeric"
                    value={set.reps}
                    onChangeText={val => handleSetChange(exIdx, setIdx, 'reps', val)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Weight"
                    keyboardType="numeric"
                    value={set.weight || ''}
                    onChangeText={val => handleSetChange(exIdx, setIdx, 'weight', val)}
                />
                <Button
                    title={set.completed ? 'Done' : 'Complete'}
                    onPress={() => handleCompleteSet(exIdx, setIdx)}
                    color={set.completed ? 'green' : undefined}
                />
                </View>
            ))}
            </View>
        )}
        />
        <Button title="Finish Workout" onPress={handleFinishWorkout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  workoutItem: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  workoutName: { fontSize: 18 },
  exerciseBlock: { marginBottom: 24 },
  exerciseName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginHorizontal: 4, padding: 4, width: 60 },
  targetText: { fontSize: 14, color: '#666', marginBottom: 4 },
});

export default TrackWorkoutScreen;