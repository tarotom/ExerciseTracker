import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';

const BACKEND_URL = 'http://192.168.1.25:3000';

interface Exercise {
  id: number;
  name: string;
}

const ViewExerciseScreen: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [editName, setEditName] = useState('');

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

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleEdit = (exercise: Exercise) => {
    setEditing(exercise);
    setEditName(exercise.name);
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      await fetch(`${BACKEND_URL}/exercises/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      setEditing(null);
      setEditName('');
      fetchExercises();
    } catch (err) {
      alert('Failed to update exercise');
    }
  };

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
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <View style={styles.exerciseItem}>
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No exercises found.</Text>}
      />

      {/* Edit Modal */}
      <Modal visible={!!editing} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Edit Exercise</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Exercise name"
            />
            <Button title="Save" onPress={handleSave} disabled={!editName.trim()} />
            <Button title="Cancel" onPress={() => setEditing(null)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  exerciseItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginVertical: 8, padding: 8 },
});

export default ViewExerciseScreen;