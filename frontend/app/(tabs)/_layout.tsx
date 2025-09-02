import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const TabsLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="home-screen" options={{ title: 'Home', tabBarIcon: () => <Text>🏠</Text> }} />
        <Tabs.Screen name="create-exercise-screen" options={{ title: 'Create Exercise', tabBarIcon: () => <Text>💪</Text> }} />
        <Tabs.Screen name="create-workout-screen" options={{ title: 'Create Workout', tabBarIcon: () => <Text>📋</Text> }} />
        <Tabs.Screen name="view-exercise-screen" options={{ title: 'View Exercise', tabBarIcon: () => <Text>📖</Text> }} />
        <Tabs.Screen name="view-workout-screen" options={{ title: 'View workout', tabBarIcon: () => <Text>🏋️</Text> }} />
        <Tabs.Screen name="view-history-screen" options={{ title: 'View history', tabBarIcon: () => <Text>📊</Text> }} />
        <Tabs.Screen name="track-workout-screen" options={{ title: 'Track workout', tabBarIcon: () => <Text>📋</Text> }} />
    </Tabs>
  );
}

export default TabsLayout;