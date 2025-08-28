import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Modal, Button, Alert } from 'react-native';

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

interface Exercise {
  id: number;
  name: string;
}

const ViewWorkoutScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Workout | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editExercises, setEditExercises] = useState<WorkoutExercise[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [addSets, setAddSets] = useState('');
  const [addReps, setAddReps] = useState('');

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

  const startEdit = (workout: Workout) => {
    setEditing(workout);
    setEditName(workout.name);
    setEditDesc(workout.description || '');
    setEditExercises([...workout.exercises]);
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      await fetch(`${BACKEND_URL}/workouts/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          description: editDesc,
          exercises: editExercises.map(e => ({
            id: e.id,
            sets: e.sets,
            reps: e.reps,
          })),
        }),
      });
      setEditing(null);
      setEditName('');
      setEditDesc('');
      setEditExercises([]);
      // Refresh workouts
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/workouts`);
      setWorkouts(await res.json());
      setLoading(false);
    } catch (err) {
      Alert.alert('Failed to update workout');
    }
  };

  const handleRemoveExercise = (idx: number) => {
    setEditExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEditExercise = (idx: number, field: 'sets' | 'reps', value: string) => {
    setEditExercises(prev =>
      prev.map((ex, i) =>
        i === idx ? { ...ex, [field]: value } : ex
      )
    );
  };

  // Add Exercise Modal logic
  const openAddModal = async () => {
    setShowAddModal(true);
    try {
      const res = await fetch(`${BACKEND_URL}/exercises`);
      setAllExercises(await res.json());
    } catch {
      setAllExercises([]);
    }
    setSelectedExercise(null);
    setAddSets('');
    setAddReps('');
  };

  const handleAddExercise = () => {
    if (!selectedExercise || !addSets || !addReps) return;
    setEditExercises(prev => [
      ...prev,
      {
        id: selectedExercise.id,
        name: selectedExercise.name,
        sets: addSets,
        reps: addReps,
      },
    ]);
    setShowAddModal(false);
    setSelectedExercise(null);
    setAddSets('');
    setAddReps('');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Edit mode
  if (editing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Edit Workout</Text>
        <TextInput
          style={styles.input}
          value={editName}
          onChangeText={setEditName}
          placeholder="Workout name"
        />
        <TextInput
          style={styles.input}
          value={editDesc}
          onChangeText={setEditDesc}
          placeholder="Description"
        />
        <Text style={styles.sectionTitle}>Exercises:</Text>
        <FlatList
          data={editExercises}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.exerciseEditRow}>
              <Text style={{ flex: 1 }}>{item.name}</Text>
              <TextInput
                style={styles.inputSmall}
                value={item.sets}
                onChangeText={val => handleEditExercise(index, 'sets', val)}
                placeholder="Sets"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.inputSmall}
                value={item.reps}
                onChangeText={val => handleEditExercise(index, 'reps', val)}
                placeholder="Reps"
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={() => handleRemoveExercise(index)}>
                <Text style={{ color: 'red', fontWeight: 'bold', marginLeft: 8 }}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text>No exercises</Text>}
        />
        <Button title="Add Exercise" onPress={openAddModal} />
        <Button title="Save Changes" onPress={handleSave} />
        <Button title="Cancel" onPress={() => setEditing(null)} />
        {/* Add Exercise Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent>
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
                    value={addSets}
                    onChangeText={setAddSets}
                    placeholder="e.g. 3"
                    keyboardType="numeric"
                  />
                  <Text>Reps:</Text>
                  <TextInput
                    style={styles.input}
                    value={addReps}
                    onChangeText={setAddReps}
                    placeholder="e.g. 10"
                    keyboardType="numeric"
                  />
                  <Button title="Add to Workout" onPress={handleAddExercise} disabled={!addSets || !addReps} />
                  <Button title="Cancel" onPress={() => setSelectedExercise(null)} />
                </View>
              )}
              {!selectedExercise && <Button title="Cancel" onPress={() => setShowAddModal(false)} />}
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // View mode
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workouts</Text>
      <FlatList
        data={workouts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => startEdit(item)}>
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
          </TouchableOpacity>
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginVertical: 8, padding: 8 },
  inputSmall: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginHorizontal: 4, padding: 4, width: 60 },
  exerciseEditRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' },
  exerciseItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
});

export default ViewWorkoutScreen;