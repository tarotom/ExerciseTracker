import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Exercise = {
  id: number;
  name: string;
};

type Props = {
  onSelect: (exercise: Exercise) => void;
};

const ExerciseSelector = ({ onSelect }: Props) => {
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filtered, setFiltered] = useState<Exercise[]>([]);

  const BACKEND_URL = 'http://192.168.1.25:3000'; // replace with your actual backend IP

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/exercises`);
        const data = await res.json();
        console.log("data exercise picker = ", data);
        setExercises(data);
        setFiltered(data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(exercises.filter(e => e.name.toLowerCase().includes(q)));
  }, [search, exercises]);

  // Only show 'Add new' if search is not empty and not an exact match
  const showAddNew =
    search.trim().length > 0 &&
    !exercises.some(e => e.name.toLowerCase() === search.trim().toLowerCase());

  const handleAddNew = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: search.trim() }),
      });
      if (!res.ok) {
        throw new Error('Failed to create new exercise');
      }
      const data = await res.json();
      // Defensive: fallback to search if data.name is missing
      const newExercise: Exercise = {
        id: data.id ?? Date.now(),
        name: data.name ?? search.trim(),
      };
      setExercises(prev => [...prev, newExercise]);
      onSelect(newExercise);
    } catch (err) {
      console.error('Error adding new exercise:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search or add exercise"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelect(item)}
            style={styles.item}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          showAddNew ? (
            <TouchableOpacity onPress={handleAddNew} style={styles.addNew}>
              <Text>Add "{search.trim()}" as new exercise</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  addNew: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#d0f0c0',
    borderRadius: 6,
  },
});

export default ExerciseSelector;
