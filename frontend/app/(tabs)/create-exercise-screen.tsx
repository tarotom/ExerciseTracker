// /app/(tabs)/create-exercise-screen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const CreateExerciseScreen = () => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Exercise name is required');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.25:3000/exercises', { // can't use '/api/exercises' because front and back runs on different domains
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.error || 'Could not add exercise.');
        return;
      }

      Alert.alert('Success', data.message || 'Exercise added!');
      setName("");
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Barbell Squat"
      />

      <Button title="Create Exercise" onPress={handleSubmit} />
    </View>
  );
};

export default CreateExerciseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
});