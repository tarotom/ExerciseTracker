import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';

const BACKEND_URL = 'http://192.168.1.25:3000';

interface LogExercise {
  name: string;
  sets: string;
  reps: string;
  weight?: string;
}

interface WorkoutLog {
  id: number;
  date: string;
  notes?: string;
  workoutName?: string;
  exercises: LogExercise[];
}

const ViewHistoryScreen = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/workout-logs`);
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        setLogs([]);
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
          <TouchableOpacity style={styles.historyContainer} onPress={() => setSelectedLog(item)}>
            <Text style={styles.workoutName}>{item.workoutName || 'Unnamed Workout'}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No workout history found.</Text>}
      />

      {/* Detail Modal */}
      <Modal visible={!!selectedLog} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedLog && (
              <>
                <Text style={styles.title}>{selectedLog.workoutName || 'Unnamed Workout'}</Text>
                <Text style={styles.date}>{selectedLog.date}</Text>
                {selectedLog.notes ? <Text style={styles.notes}>{selectedLog.notes}</Text> : null}
                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Exercises:</Text>
                {selectedLog.exercises && selectedLog.exercises.length > 0 ? (
                  selectedLog.exercises.map((ex, idx) => (
                    <Text key={idx} style={styles.exerciseText}>
                      • {ex.name}: {ex.sets} sets × {ex.reps} reps{ex.weight ? ` @ ${ex.weight}` : ''}
                    </Text>
                  ))
                ) : (
                  <Text>No exercises</Text>
                )}
                <Button title="Close" onPress={() => setSelectedLog(null)} />
              </>
            )}
          </View>
        </View>
      </Modal>
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
  workoutName: { fontSize: 17, marginBottom: 2 },
  notes: { fontSize: 13, color: '#555', marginTop: 2 },
  exerciseText: { fontSize: 14, marginLeft: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' },
});

export default ViewHistoryScreen;