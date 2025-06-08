import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="add-exercise-screen" options={{ title: 'Add Exercise' }} />
        <Tabs.Screen name="add-workout-screen" options={{ title: 'Add Workout' }} />
        <Tabs.Screen name="view-exercise-screen" options={{ title: 'View Exercise' }} />
        <Tabs.Screen name="view-history-screen" options={{ title: 'View history' }} />
        <Tabs.Screen name="view-workout-screen" options={{ title: 'View workout' }} />
    </Tabs>
  );
}

export default TabsLayout;