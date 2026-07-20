import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// On phones the calculator stays a comfortable thumb-width; on tablets it
// scales up with the screen instead of sitting phone-sized in empty space.
const IS_TABLET = SCREEN_WIDTH >= 700;
const CALCULATOR_MAX_WIDTH = IS_TABLET ? 620 : 380;
const CALCULATOR_WIDTH = Math.min(SCREEN_WIDTH - 40, CALCULATOR_MAX_WIDTH);
const BUTTON_SIZE = (CALCULATOR_WIDTH - 60) / 4; // 4 columns with gaps
const BUTTON_ROW_HEIGHT = (IS_TABLET ? Math.min(BUTTON_SIZE, 88) : 58) + 10;
// Height available for the display once the top bar and 5 button rows
// are subtracted, so digits never overlap buttons.
const DISPLAY_MAX_HEIGHT = Math.max(SCREEN_HEIGHT - 5 * BUTTON_ROW_HEIGHT - 140, 90);

export const darkColors = {
  background: '#0a0a0a',
  numButtonBg: ['#2a2a2a', '#1c1c1c'],
  numButtonBgPressed: ['#1a1a1a', '#0d0d0d'],
  funcButtonBg: ['#3a3a3a', '#2a2a2a'],
  funcButtonBgPressed: ['#2a2a2a', '#1d1d1d'],
  opButtonIdleBg: ['#2a2a2a', '#1c1c1c'],
  opButtonActive: ['#ffb347', '#ff6b35'],
  opButtonPressed: ['#cc7a00', '#b36b00'],
  equalsButton: ['#ff7b54', '#ff5733', '#c9302c'],
  equalsButtonPressed: ['#cc5a3a', '#b34a2a'],
  roastBubbleBg: ['rgba(45,45,45,0.98)', 'rgba(25,25,25,0.98)'],
  white: '#ffffff',
  gray: '#888888',
  darkGray: '#5a5a5a',
  lightGray: '#666666',
  orange: '#f5a623',
  displayText: '#ffffff',
  shadowColor: 'rgba(255, 255, 255, 0.3)',
  panelBg: '#1a1a1a',
  iconButtonBg: 'rgba(255,255,255,0.1)',
};

export const lightColors = {
  background: '#f5f5f5',
  numButtonBg: ['#ffffff', '#e8e8e8'],
  numButtonBgPressed: ['#e0e0e0', '#d0d0d0'],
  funcButtonBg: ['#e0e0e0', '#d0d0d0'],
  funcButtonBgPressed: ['#c8c8c8', '#b8b8b8'],
  opButtonIdleBg: ['#ffffff', '#e8e8e8'],
  opButtonActive: ['#ffb347', '#ff6b35'],
  opButtonPressed: ['#cc7a00', '#b36b00'],
  equalsButton: ['#ff7b54', '#ff5733', '#c9302c'],
  equalsButtonPressed: ['#cc5a3a', '#b34a2a'],
  roastBubbleBg: ['rgba(255,255,255,0.98)', 'rgba(240,240,240,0.98)'],
  white: '#1a1a1a',
  gray: '#666666',
  darkGray: '#888888',
  lightGray: '#999999',
  orange: '#f5a623',
  displayText: '#1a1a1a',
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  panelBg: '#ffffff',
  iconButtonBg: 'rgba(0,0,0,0.08)',
};

// Default to dark colors for backward compatibility
export const colors = darkColors;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  calculatorContainer: {
    flex: 1,
    width: CALCULATOR_WIDTH,
    paddingVertical: 10,
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    zIndex: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    color: colors.gray,
  },

  // Mood Indicator
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodLabel: {
    fontSize: 12,
    color: colors.lightGray,
    marginRight: 8,
  },
  moodEmoji: {
    fontSize: 18,
    color: colors.white,
  },

  // Roast Bubble
  roastBubble: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 30,
    borderRadius: 18,
    padding: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.7,
        shadowRadius: 35,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  roastText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
  },

  // Display Area
  displayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30,
  },
  displayWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  expressionText: {
    alignSelf: 'flex-end',
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.6,
    marginBottom: 4,
  },
  displayText: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  // 3D effect layers for display
  displayShadowLayer: {
    position: 'absolute',
  },

  // Button Grid
  buttonGrid: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  // Base button styles
  button: {
    width: BUTTON_SIZE,
    height: IS_TABLET ? Math.min(BUTTON_SIZE, 88) : 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },

  // Number button
  numButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: colors.white,
  },

  // Function button
  funcButtonText: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.gray,
  },

  // Operator button
  opButton: {
    backgroundColor: 'transparent',
  },
  opButtonText: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.orange,
  },
  opButtonTextActive: {
    color: colors.white,
  },

  // Equals button
  equalsButtonText: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.white,
  },

  // Button shadows
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonShadowActive: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(255,159,67,0.5)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 25,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  buttonPressed: {
    transform: [{ scale: 0.93 }],
  },

  // Footer
  footer: {
    marginTop: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.lightGray,
    fontStyle: 'italic',
    letterSpacing: 2,
  },

  // History Panel
  historyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  historyPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#1a1a1a',
    zIndex: 101,
    paddingTop: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
  },
  historyCloseButton: {
    padding: 10,
  },
  historyCloseText: {
    fontSize: 20,
    color: colors.gray,
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyEmpty: {
    color: colors.lightGray,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  historyItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  historyExpression: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  historyResult: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },

  // Settings Panel
  settingsPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#1a1a1a',
    zIndex: 101,
    paddingTop: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -5, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginHorizontal: -14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingsItemActive: {
    backgroundColor: 'rgba(245,166,35,0.12)',
    borderRadius: 10,
    borderBottomColor: 'transparent',
  },
  settingsLabel: {
    fontSize: 16,
    color: colors.white,
  },
  settingsValue: {
    fontSize: 16,
    color: colors.gray,
  },
  settingsSection: {
    marginBottom: 25,
    marginTop: 10,
  },
  settingsSectionTitle: {
    fontSize: 13,
    color: colors.lightGray,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  premiumButton: {
    backgroundColor: 'rgba(245,166,35,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.3)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 17,
    color: '#f5a623',
    fontWeight: '700',
  },
  premiumButtonSubtext: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 4,
  },
  premiumBadge: {
    fontSize: 12,
    color: '#f5a623',
    fontWeight: '700',
    backgroundColor: 'rgba(245,166,35,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  settingsButtonDanger: {
    marginTop: 10,
    backgroundColor: 'rgba(255,100,100,0.15)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  settingsButtonDangerText: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
});

// Dynamic font size based on display length, capped so it always fits
// above the button grid regardless of screen height.
export const getFontSize = (displayLength: number): number => {
  let size = 180;
  if (displayLength <= 1) size = 180;
  else if (displayLength <= 2) size = 150;
  else if (displayLength <= 3) size = 120;
  else if (displayLength <= 5) size = 90;
  else if (displayLength <= 7) size = 70;
  else size = 55;
  return Math.min(size, DISPLAY_MAX_HEIGHT);
};

export const BUTTON_SIZE_EXPORT = BUTTON_SIZE;
