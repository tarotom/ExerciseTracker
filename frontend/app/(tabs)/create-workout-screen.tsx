import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import ExerciseSelector from '../components/ExerciseSelector';
import { showMessage } from "react-native-flash-message";

// Extend Exercise type to include sets and reps
interface WorkoutExercise {
  id: number;
  name: string;
  sets: string;
  reps: string;
  instanceId: number; // unique per workout entry
}

const BACKEND_URL = 'http://192.168.1.25:3000';

const CreateWorkoutScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [exerciseSelectorKey, setExerciseSelectorKey] = useState(0); // for resetting selector

  // Add exercise with default sets/reps and unique instanceId
  const handleSelectExercise = (exercise: { id: number; name: string }) => {
    setSelectedExercises(prev => [
      ...prev,
      { ...exercise, sets: '3', reps: '10', instanceId: Date.now() + Math.random() },
    ]);
    setShowSelector(false);
  };

  // Update sets/reps for an exercise (by instanceId)
  const handleChangeSetsReps = (instanceId: number, field: 'sets' | 'reps', value: string) => {
    setSelectedExercises(prev =>
      prev.map(e => (e.instanceId === instanceId ? { ...e, [field]: value } : e))
    );
  };

  // Remove exercise (by instanceId)
  const handleRemoveExercise = (instanceId: number) => {
    setSelectedExercises(prev => prev.filter(e => e.instanceId !== instanceId));
  };

  // Submit workout
  const handleSubmit = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          exercises: selectedExercises.map(e => ({
            id: e.id,
            sets: e.sets,
            reps: e.reps,
          })),
        }),
      });
      if (!res.ok) {
        let errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.details || 'Failed to save workout');
        } catch {
          // Not JSON, show raw text
          throw new Error(errorText);
        }
      }
      const data = await res.json();
      console.log('Workout saved:', data);
      showMessage({
        message: "Workout saved!",
        type: "success",
        duration: 2000,
      });
      setName('');
      setDescription('');
      setSelectedExercises([]);
    } catch (err) {
      console.error('Save workout error: ', err);
      showMessage({
        message: "Saving workout failed.",
        type: "danger",
        duration: 2000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Workout Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Push Day"
        style={styles.input}
      />

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="e.g. Chest, shoulders, triceps"
        style={styles.input}
      />

      <Text style={styles.label}>Exercises</Text>
      {selectedExercises.length === 0 && <Text>No exercises added</Text>}
      <FlatList
        data={selectedExercises}
        keyExtractor={item => item.instanceId.toString()}
        renderItem={({ item }) => (
          <View style={styles.exerciseRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <View style={styles.setsRepsRow}>
                <TextInput
                  style={styles.setsRepsInput}
                  value={item.sets}
                  keyboardType="numeric"
                  onChangeText={val => handleChangeSetsReps(item.instanceId, 'sets', val)}
                  placeholder="Sets"
                />
                <Text style={{ marginHorizontal: 4 }}>x</Text>
                <TextInput
                  style={styles.setsRepsInput}
                  value={item.reps}
                  keyboardType="numeric"
                  onChangeText={val => handleChangeSetsReps(item.instanceId, 'reps', val)}
                  placeholder="Reps"
                />
              </View>
            </View>
            <TouchableOpacity onPress={() => handleRemoveExercise(item.instanceId)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Add Exercise" onPress={() => setShowSelector(true)} />

      {/* Exercise Selector Modal */}
      <Modal visible={showSelector} animationType="slide" onRequestClose={() => setShowSelector(false)}>
        <ExerciseSelector key={exerciseSelectorKey} onSelect={handleSelectExercise} />
        <Button title="Cancel" onPress={() => setShowSelector(false)} />
      </Modal>

      <View style={styles.submit}>
        <Button title="Save Workout" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginTop: 16, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  setsRepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  setsRepsInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 6,
    width: 50,
    textAlign: 'center',
  },
  remove: {
    color: 'red',
    marginLeft: 8,
  },
  submit: {
    marginTop: 24,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
});

export default CreateWorkoutScreen;
