import { StyleSheet } from 'react-native';
import { UI_CONFIG } from '../constants/config';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
    padding: UI_CONFIG.SPACING.MD,
  },
  title: {
    fontSize: UI_CONFIG.FONT_SIZES.XLARGE,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.BLACK,
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  subtitle: {
    fontSize: UI_CONFIG.FONT_SIZES.LARGE,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.GRAY.DARK,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  button: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    padding: UI_CONFIG.SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: UI_CONFIG.SPACING.SM,
  },
  buttonText: {
    color: UI_CONFIG.COLORS.WHITE,
    fontSize: UI_CONFIG.FONT_SIZES.MEDIUM,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
  },
  buttonSecondaryText: {
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  input: {
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.GRAY.MEDIUM,
    borderRadius: 8,
    padding: UI_CONFIG.SPACING.MD,
    fontSize: UI_CONFIG.FONT_SIZES.MEDIUM,
    backgroundColor: UI_CONFIG.COLORS.WHITE,
  },
  card: {
    backgroundColor: UI_CONFIG.COLORS.WHITE,
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.MD,
    marginBottom: UI_CONFIG.SPACING.MD,
    shadowColor: UI_CONFIG.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});