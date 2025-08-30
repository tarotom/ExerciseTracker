import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const BACKEND_URL = 'http://192.168.1.25:3000';

interface Exercise {
  id: number;
  name: string;
  sets?: string;
  reps?: string;
}

interface Workout {
  id: number;
  name: string;
  exercises: Exercise[];
  description?: string;
}

interface OngoingSet {
  reps: string;
  weight?: string;
  completed: boolean;
}

interface OngoingExercise extends Exercise {
  performedSets: OngoingSet[];
}

type TabParamList = {
  'home-screen': undefined;
  'track-workout-screen': undefined;
  'view-exercise-screen': undefined;
  'view-workout-screen': undefined;
  'view-history-screen': undefined;
  'create-workout-screen': undefined;
  'create-exercise-screen': undefined;
};

const AddExerciseModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onAdd: (exercise: Exercise) => void;
  workoutId: number;
}> = ({ visible, onClose, onAdd, workoutId }) => {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  useEffect(() => {
    if (visible) {
      fetch(`${BACKEND_URL}/exercises`)
        .then(res => res.json())
        .then(setAllExercises)
        .catch(() => setAllExercises([]));
      setSelectedExercise(null);
      setSets('');
      setReps('');
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (!selectedExercise || !sets || !reps) return;
    // Save to WorkoutExercises if unique
    await fetch(`${BACKEND_URL}/workout-exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workoutId,
        exerciseId: selectedExercise.id,
        sets,
        reps,
      }),
    });
    onAdd({ ...selectedExercise, sets, reps });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Exercise</Text>
          {!selectedExercise ? (
            <FlatList
              data={allExercises}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.exerciseItem}
                  onPress={() => setSelectedExercise(item)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>No exercises found.</Text>}
            />
          ) : (
            <View>
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{selectedExercise.name}</Text>
              <Text>Sets:</Text>
              <TextInput
                style={styles.input}
                value={sets}
                onChangeText={setSets}
                placeholder="e.g. 3"
                keyboardType="numeric"
              />
              <Text>Reps:</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                placeholder="e.g. 10"
                keyboardType="numeric"
              />
              <Button title="Add to Workout" onPress={handleConfirm} disabled={!sets || !reps} />
              <Button title="Cancel" onPress={() => setSelectedExercise(null)} />
            </View>
          )}
          {!selectedExercise && <Button title="Cancel" onPress={onClose} />}
        </View>
      </View>
    </Modal>
  );
};

const TrackWorkoutScreen = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<OngoingExercise[]>([]);
  const [originalExercises, setOriginalExercises] = useState<Exercise[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  // When a workout is selected, initialize exercises for tracking
  useEffect(() => {
    if (selectedWorkout) {
      setOriginalExercises(selectedWorkout.exercises);
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

  // Remove exercise from current workout
  const handleRemoveExercise = (exIdx: number) => {
    setExercises(prev => prev.filter((_, i) => i !== exIdx));
  };

  const handleFinishWorkout = async () => {
    // Log the performed workout
    try {
      await fetch(`${BACKEND_URL}/workout-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutId: selectedWorkout?.id,
          date: new Date().toISOString(),
          notes: '', // Optionally add a notes field
          exercises: exercises.map(e => ({
            id: e.id,
            performedSets: e.performedSets,
          })),
        }),
      });
    } catch (err) {
      alert('Failed to log workout!');
      return;
    }

    // Save as new template if edited
    if (isWorkoutEdited()) {
      const newName = `${selectedWorkout!.name} (edited) ${new Date().toLocaleString()}`;
      try {
        await fetch(`${BACKEND_URL}/workouts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newName,
            description: selectedWorkout!.description || '',
            exercises: exercises.map(e => ({
              id: e.id,
              sets: e.sets,
              reps: e.reps,
            })),
          }),
        });
        alert('Workout logged and new template saved!');
      } catch (err) {
        alert('Workout logged, but failed to save new template.');
      }
    } else {
      alert('Workout logged!');
    }
    setSelectedWorkout(null);
    navigation.navigate('home-screen');
  };

  const handleBack = () => {
    if (!isWorkoutEdited()) {
      setSelectedWorkout(null);
      return;
    }

    Alert.alert(
      'Discard Progress?',
      'Going back will reset any changes you made to this workout. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, go back', style: 'destructive', onPress: () => setSelectedWorkout(null) },
      ]
    );
  };

  const isWorkoutEdited = () => {
    if (originalExercises.length !== exercises.length) return true;
    for (let i = 0; i < originalExercises.length; i++) {
      const orig = originalExercises[i];
      const curr = exercises[i];
      if (
        orig.id !== curr.id ||
        orig.sets !== curr.sets ||
        orig.reps !== curr.reps
      ) {
        return true;
      }

      if (curr.performedSets) {
        for (let j = 0; j < curr.performedSets.length; j++) {
          const set = curr.performedSets[j];
          if (
            set.reps !== '' ||
            set.weight !== '' ||
            set.completed
          ) {
            return true;
          }
        }
      }
    }
    return false;
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
      <Button title="Add Exercise" onPress={() => setShowAddModal(true)} />
      <FlatList
        data={exercises}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index: exIdx }) => (
          <View style={styles.exerciseBlock}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.targetText}>
                  Target: {item.sets} sets × {item.reps} reps
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveExercise(exIdx)}>
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Remove</Text>
              </TouchableOpacity>
            </View>
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

      {/* Add Exercise Modal */}
      <AddExerciseModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={exercise => {
          setExercises(prev => [
            ...prev,
            {
              ...exercise,
              performedSets: Array.from({ length: Number(exercise.sets) || 1 }, () => ({
                reps: '',
                weight: '',
                completed: false,
              })),
            },
          ]);
        }}
        workoutId={selectedWorkout!.id}
      />
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' },
  exerciseItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
});

export default TrackWorkoutScreen;