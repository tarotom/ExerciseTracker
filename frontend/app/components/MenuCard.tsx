import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UI_CONFIG } from '../constants/config';

interface MenuCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  title,
  description,
  icon,
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_CONFIG.COLORS.WHITE,
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.MD,
    borderLeftWidth: 4,
    shadowColor: UI_CONFIG.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  iconContainer: {
    marginRight: UI_CONFIG.SPACING.MD,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: UI_CONFIG.FONT_SIZES.LARGE,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.BLACK,
    marginBottom: 4,
  },
  description: {
    fontSize: UI_CONFIG.FONT_SIZES.MEDIUM - 2,
    color: UI_CONFIG.COLORS.GRAY.DARK,
  },
  arrow: {
    marginLeft: UI_CONFIG.SPACING.SM,
  },
  arrowText: {
    fontSize: 24,
    color: UI_CONFIG.COLORS.GRAY.MEDIUM,
    fontWeight: '300',
  },
});

export default MenuCard;