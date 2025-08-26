import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const BACKEND_URL = 'http://192.168.1.25:3000';

interface WorkoutLog {
  id: number;
  date: string;
  notes?: string;
  workoutName?: string;
}

const ViewHistoryScreen = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/workout-logs`);
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch workout history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
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
      <Text style={styles.title}>Workout History</Text>
      <FlatList
        data={logs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyContainer}>
            <Text style={styles.date}>{item.date}</Text>
            {item.workoutName && <Text style={styles.workoutName}>{item.workoutName}</Text>}
            {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
          </View>
        )}
        ListEmptyComponent={<Text>No workout history found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  historyContainer: {
    backgroundColor: 'lightblue',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
  },
  date: { fontWeight: 'bold', fontSize: 16 },
  workoutName: { fontSize: 15, marginTop: 2 },
  notes: { fontSize: 13, color: '#555', marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ViewHistoryScreen;