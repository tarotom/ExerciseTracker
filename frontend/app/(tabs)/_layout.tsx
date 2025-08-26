import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="home-screen" options={{ title: 'Home' }} />
        <Tabs.Screen name="create-exercise-screen" options={{ title: 'Create Exercise' }} />
        <Tabs.Screen name="create-workout-screen" options={{ title: 'Create Workout' }} />
        <Tabs.Screen name="view-exercise-screen" options={{ title: 'View Exercise' }} />
        <Tabs.Screen name="view-history-screen" options={{ title: 'View history' }} />
        <Tabs.Screen name="view-workout-screen" options={{ title: 'View workout' }} />
        <Tabs.Screen name="track-workout-screen" options={{ title: 'Track workout' }} />
    </Tabs>
  );
}

export default TabsLayout;