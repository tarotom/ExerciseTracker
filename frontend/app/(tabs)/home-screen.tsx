import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import MenuCard from '../components/MenuCard';
import { commonStyles } from '../styles/commonStyles';
import { UI_CONFIG } from '../constants/config';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'create-exercise',
    title: 'Create Exercise',
    description: 'Add new exercises to your library',
    route: '/create-exercise-screen',
    icon: '💪',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  {
    id: 'create-workout',
    title: 'Create Workout',
    description: 'Design your workout routine',
    route: '/create-workout-screen',
    icon: '📋',
    color: UI_CONFIG.COLORS.SECONDARY,
  },
  {
    id: 'view-exercises',
    title: 'View Exercises',
    description: 'Browse and edit your exercises',
    route: '/view-exercise-screen',
    icon: '📖',
    color: UI_CONFIG.COLORS.WARNING,
  },
  {
    id: 'view-workouts',
    title: 'View Workouts',
    description: 'Manage your workout routines',
    route: '/view-workout-screen',
    icon: '📝',
    color: '#5856D6',
  },
  {
    id: 'view-history',
    title: 'View History',
    description: 'Check your workout progress',
    route: '/view-history-screen',
    icon: '📊',
    color: '#FF9500',
  },
  {
    id: 'track-workout',
    title: 'Track Workout',
    description: 'Start your workout session',
    route: '/track-workout-screen',
    icon: '🏋️',
    color: UI_CONFIG.COLORS.SUCCESS,
  },
];

const HomeScreen: React.FC = () => {
  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Exercise Tracker</Text>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <MenuCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            color={item.color}
            onPress={() => handleNavigation(item.route)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = {
  header: {
    alignItems: 'center' as const,
    marginBottom: UI_CONFIG.SPACING.XL,
    paddingTop: UI_CONFIG.SPACING.LG,
  },
  appTitle: {
    fontSize: UI_CONFIG.FONT_SIZES.XLARGE + 4,
    fontWeight: 'bold' as const,
    color: UI_CONFIG.COLORS.BLACK,
  },
  menuGrid: {
    gap: UI_CONFIG.SPACING.MD,
  },
};

export default HomeScreen;