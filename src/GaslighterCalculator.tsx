import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
  Switch,
  Alert,
  Linking,
  Modal,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { RESPONSES, MOOD_LABELS } from './constants/responses';
import { useAnimations } from './hooks/useAnimations';
import { styles, darkColors, lightColors, getFontSize, BUTTON_SIZE_EXPORT } from './styles/calculator';
import { hapticKeyPress, hapticEquals } from './utils/haptics';
import { logCalculatorEquals, logModeSwitch, logModeLocked, logRewardedAdEarned, logThemeChange } from './utils/analytics';
import { AdBanner } from './ads/AdBanner';
import { useRewardedAd } from './ads/useRewardedAd';
import { usePremium } from './iap/PremiumContext';
import { BackspaceIcon } from './components/BackspaceIcon';
import { HistoryIcon } from './components/HistoryIcon';
import { SettingsIcon } from './components/SettingsIcon';
import { UnitConverter } from './components/UnitConverter';
import { TipCalculator } from './components/TipCalculator';
import { FuelCalculator } from './components/FuelCalculator';
import { GPACalculator } from './components/GPACalculator';
import { FuelEfficiencyCalculator } from './components/FuelEfficiencyCalculator';
import { HealthCalculator } from './components/HealthCalculator';
import { PercentageCalculator } from './components/PercentageCalculator';
import { LoanCalculator } from './components/LoanCalculator';
import { OvulationCalculator } from './components/OvulationCalculator';
import { HexCalculator } from './components/HexCalculator';
import { DiscountCalculator } from './components/DiscountCalculator';
import { CurrencyConverter } from './components/CurrencyConverter';
import { SavingsCalculator } from './components/SavingsCalculator';

const MOOD_EMOJIS = ['\u{1F60A}', '\u{1F610}', '\u{1F612}', '\u{1F624}', '\u{1F644}'];

// Button Components
interface ThemeColors {
  numButtonBg: string[];
  numButtonBgPressed: string[];
  funcButtonBg: string[];
  funcButtonBgPressed: string[];
  opButtonIdleBg: string[];
  opButtonActive: string[];
  opButtonPressed: string[];
  white: string;
  gray: string;
  orange: string;
  equalsButton: string[];
  equalsButtonPressed: string[];
  shadowColor: string;
}

interface NumButtonProps {
  value: string;
  onPress: () => void;
  pressed: boolean;
  themeColors: ThemeColors;
}

const NumButton: React.FC<NumButtonProps> = ({ value, onPress, pressed, themeColors }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.button, styles.buttonShadow, { shadowColor: themeColors.shadowColor, shadowOpacity: 1 }, pressed && styles.buttonPressed]}
  >
    <LinearGradient
      colors={pressed ? themeColors.numButtonBgPressed as [string, string] : themeColors.numButtonBg as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.buttonGradient}
    >
      <Text style={[styles.numButtonText, { color: themeColors.white }]}>{value}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

interface FuncButtonProps {
  value: string;
  onPress: () => void;
  pressed: boolean;
  icon?: React.ReactNode;
  themeColors: ThemeColors;
}

const FuncButton: React.FC<FuncButtonProps> = ({ value, onPress, pressed, icon, themeColors }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.button, styles.buttonShadow, { shadowColor: themeColors.shadowColor, shadowOpacity: 1 }, pressed && styles.buttonPressed]}
  >
    <LinearGradient
      colors={pressed ? themeColors.funcButtonBgPressed as [string, string] : themeColors.funcButtonBg as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.buttonGradient}
    >
      {icon || <Text style={[styles.funcButtonText, { color: themeColors.gray }]}>{value}</Text>}
    </LinearGradient>
  </TouchableOpacity>
);

interface OpButtonProps {
  value: string;
  displayValue?: string;
  onPress: () => void;
  pressed: boolean;
  isActive: boolean;
  themeColors: ThemeColors;
}

const OpButton: React.FC<OpButtonProps> = ({ value, displayValue, onPress, pressed, isActive, themeColors }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[
      styles.button,
      (isActive || pressed) ? styles.buttonShadow : {},
      { shadowColor: themeColors.orange },
      isActive ? styles.buttonShadowActive : {},
      pressed && styles.buttonPressed,
    ]}
  >
    {isActive ? (
      <LinearGradient
        colors={themeColors.opButtonActive as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonGradient}
      >
        <Text style={[styles.opButtonText, styles.opButtonTextActive]}>
          {displayValue || value}
        </Text>
      </LinearGradient>
    ) : pressed ? (
      <LinearGradient
        colors={themeColors.opButtonPressed as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonGradient}
      >
        <Text style={[styles.opButtonText, { color: themeColors.orange }]}>{displayValue || value}</Text>
      </LinearGradient>
    ) : (
      <View style={[styles.buttonGradient, { backgroundColor: 'transparent' }]}>
        <Text style={[styles.opButtonText, { color: themeColors.orange }]}>{displayValue || value}</Text>
      </View>
    )}
  </TouchableOpacity>
);

interface GaslighterCalculatorProps {
  onSurfaceColorChange?: (color: string) => void;
}

export default function GaslighterCalculator({ onSurfaceColorChange }: GaslighterCalculatorProps) {
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [mood, setMood] = useState(0);
  const [roast, setRoast] = useState<string | null>(null);
  const [roastVisible, setRoastVisible] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  // Action counters
  const [clearCount, setClearCount] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [decimalCount, setDecimalCount] = useState(0);
  const [percentCount, setPercentCount] = useState(0);
  const [toggleCount, setToggleCount] = useState(0);
  const [equalsCount, setEqualsCount] = useState(0);
  const [operatorCounts, setOperatorCounts] = useState<Record<string, number>>({
    '+': 0,
    '-': 0,
    '\u00D7': 0,
    '\u00F7': 0,
  });
  const [digitCounts, setDigitCounts] = useState<Record<string, number>>({
    '0': 0, '1': 0, '2': 0, '3': 0, '4': 0,
    '5': 0, '6': 0, '7': 0, '8': 0, '9': 0,
  });
  const [lastCalc, setLastCalc] = useState<string | null>(null);
  const [sessionStart, setSessionStart] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // History state
  interface HistoryItem {
    expression: string;
    result: string;
    timestamp: number;
  }
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const historySlideAnim = useRef(new Animated.Value(-Dimensions.get('window').width * 0.8)).current;

  // Settings state
  const [settingsVisible, setSettingsVisible] = useState(false);
  const settingsSlideAnim = useRef(new Animated.Value(Dimensions.get('window').width * 0.8)).current;
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isPremium, purchasing, priceLabel, purchasePremium, restore } = usePremium();

  // Calculator mode
  type CalculatorMode = 'calculator' | 'unit-converter' | 'tip-calculator' | 'fuel-calculator' | 'gpa-calculator' | 'fuel-efficiency' | 'health' | 'percentage' | 'loan' | 'ovulation' | 'hex' | 'discount' | 'currency' | 'savings';
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>('calculator');
  const [modeMenuVisible, setModeMenuVisible] = useState(false);

  // Locked calculators unlocked via rewarded ad
  const LOCKED_MODES: CalculatorMode[] = ['loan', 'savings', 'currency', 'ovulation', 'hex'];
  const [unlockedModes, setUnlockedModes] = useState<CalculatorMode[]>([]);
  const [pendingUnlockMode, setPendingUnlockMode] = useState<CalculatorMode | null>(null);

  const CALCULATOR_MODES: { mode: CalculatorMode; label: string }[] = [
    { mode: 'calculator', label: 'Standard Calculator' },
    { mode: 'unit-converter', label: 'Unit Converter' },
    { mode: 'tip-calculator', label: 'Tip Calculator' },
    { mode: 'fuel-calculator', label: 'Fuel Calculator' },
    { mode: 'gpa-calculator', label: 'GPA Calculator' },
    { mode: 'fuel-efficiency', label: 'Fuel Efficiency' },
    { mode: 'health', label: 'Health Calculator' },
    { mode: 'percentage', label: 'Percentage Calculator' },
    { mode: 'loan', label: 'Loan Calculator' },
    { mode: 'ovulation', label: 'Ovulation Calculator' },
    { mode: 'hex', label: 'Hex Calculator' },
    { mode: 'discount', label: 'Discount Calculator' },
    { mode: 'currency', label: 'Currency Converter' },
    { mode: 'savings', label: 'Savings Calculator' },
  ];

  // Rating popup state
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [hasRatedApp, setHasRatedApp] = useState(false);
  const [dismissedThisSession, setDismissedThisSession] = useState(false);
  const [taskCount, setTaskCount] = useState(0);

  // Store URLs - Replace with your actual app store URLs
  const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.funnycalculator';

  // Theme colors
  const colors = useMemo(() => isDarkTheme ? darkColors : lightColors, [isDarkTheme]);

  // Report the currently visible surface color so the outer safe-area
  // insets (owned by App.tsx, above this component) can match it.
  useEffect(() => {
    const surfaceColor = settingsVisible || historyVisible ? colors.panelBg : colors.background;
    onSurfaceColorChange?.(surfaceColor);
  }, [colors, settingsVisible, historyVisible, onSurfaceColorChange]);

  // Timer refs
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animations
  const animations = useAnimations();

  // Helper functions
  // Remembers the last index picked per response pool so the same line
  // never shows twice in a row, even though selection is otherwise random.
  const lastPickRef = useRef(new WeakMap<string[], number>());

  const pickWithoutRepeat = (pool: string[]): string => {
    if (pool.length === 1) return pool[0];
    const lastIndex = lastPickRef.current.get(pool);
    let index = Math.floor(Math.random() * pool.length);
    if (index === lastIndex) {
      index = (index + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length;
    }
    lastPickRef.current.set(pool, index);
    return pool[index];
  };

  const getEscalatingResponse = (responses: string[][], count: number): string => {
    const tierIndex = Math.min(count, responses.length - 1);
    const tier = responses[tierIndex];
    return pickWithoutRepeat(tier);
  };

  const getRandomResponse = (pool: string[]): string => {
    return pickWithoutRepeat(pool);
  };

  const showRoast = useCallback((message: string) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

    setRoast(message);
    setRoastVisible(true);
    animations.showRoastBubble();

    hideTimerRef.current = setTimeout(() => {
      setRoastVisible(false);
      animations.hideRoastBubble();
    }, 4500);
    clearTimerRef.current = setTimeout(() => setRoast(null), 5000);
  }, [animations]);

  const degradeMood = useCallback(() => {
    setMood((prev) => Math.min(prev + 1, MOOD_EMOJIS.length - 1));
  }, []);

  // History panel functions
  const openHistory = useCallback(() => {
    setHistoryVisible(true);
    Animated.timing(historySlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [historySlideAnim]);

  const closeHistory = useCallback(() => {
    Animated.timing(historySlideAnim, {
      toValue: -Dimensions.get('window').width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setHistoryVisible(false);
    });
  }, [historySlideAnim]);

  const addToHistory = useCallback((expression: string, result: string) => {
    setHistory(prev => [{
      expression,
      result,
      timestamp: Date.now(),
    }, ...prev].slice(0, 50)); // Keep last 50 calculations
  }, []);

  // Settings panel functions
  const openSettings = useCallback(() => {
    setSettingsVisible(true);
    Animated.timing(settingsSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [settingsSlideAnim]);

  const closeSettings = useCallback(() => {
    Animated.timing(settingsSlideAnim, {
      toValue: Dimensions.get('window').width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSettingsVisible(false);
    });
  }, [settingsSlideAnim]);

  // Load rating state from AsyncStorage
  useEffect(() => {
    const loadRatingState = async () => {
      try {
        const hasRated = await AsyncStorage.getItem('hasRatedApp');
        if (hasRated === 'true') {
          setHasRatedApp(true);
        }
      } catch (error) {
        console.log('Error loading rating state:', error);
      }
    };
    loadRatingState();
  }, []);

  // Load unlocked calculator modes from AsyncStorage
  useEffect(() => {
    const loadUnlockedModes = async () => {
      try {
        const stored = await AsyncStorage.getItem('unlockedModes');
        if (stored) {
          setUnlockedModes(JSON.parse(stored));
        }
      } catch (error) {
        console.log('Error loading unlocked modes:', error);
      }
    };
    loadUnlockedModes();
  }, []);

  // Load saved theme preference from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem('isDarkTheme');
        if (stored !== null) {
          setIsDarkTheme(stored === 'true');
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Toggle theme and persist the choice
  const handleThemeChange = useCallback((value: boolean) => {
    setIsDarkTheme(value);
    logThemeChange(value);
    AsyncStorage.setItem('isDarkTheme', value ? 'true' : 'false').catch((error) =>
      console.log('Error saving theme:', error)
    );
  }, []);

  const handleUnlockEarned = useCallback(() => {
    setPendingUnlockMode((mode) => {
      if (!mode) return mode;
      logRewardedAdEarned(mode);
      setUnlockedModes((prev) => {
        if (prev.includes(mode)) return prev;
        const next = [...prev, mode];
        AsyncStorage.setItem('unlockedModes', JSON.stringify(next)).catch((error) =>
          console.log('Error saving unlocked modes:', error)
        );
        return next;
      });
      setCalculatorMode(mode);
      closeSettings();
      return null;
    });
  }, [closeSettings]);

  const rewardedAd = useRewardedAd(handleUnlockEarned);

  const handleModePress = useCallback((mode: CalculatorMode) => {
    const isLocked = LOCKED_MODES.includes(mode) && !unlockedModes.includes(mode);
    if (!isLocked) {
      setCalculatorMode(mode);
      logModeSwitch(mode);
      closeSettings();
      return;
    }
    logModeLocked(mode);
    const modeLabel = CALCULATOR_MODES.find((m) => m.mode === mode)?.label ?? 'this calculator';
    Alert.alert(
      'Locked Calculator',
      `Watch a short ad to unlock ${modeLabel}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Watch Ad',
          onPress: () => {
            const started = rewardedAd.show();
            if (started) {
              setPendingUnlockMode(mode);
            } else {
              Alert.alert('Ad Not Ready', 'The ad is still loading. Please try again in a few seconds.');
            }
          },
        },
      ]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedModes, closeSettings, rewardedAd]);

  // Check if should show rating popup after tasks
  useEffect(() => {
    // Show popup after 5 tasks, then every 10 tasks
    const shouldShow = (taskCount === 5 || (taskCount > 5 && taskCount % 10 === 0));
    if (shouldShow && !hasRatedApp && !dismissedThisSession && !showRatingPopup) {
      // Delay showing popup slightly
      setTimeout(() => {
        setShowRatingPopup(true);
      }, 500);
    }
  }, [taskCount, hasRatedApp, dismissedThisSession, showRatingPopup]);

  // Handle rating popup dismiss (session only)
  const handleDismissRating = useCallback(() => {
    setShowRatingPopup(false);
    setDismissedThisSession(true);
  }, []);

  // Handle rate app (permanent)
  const handleRateApp = useCallback(async () => {
    setShowRatingPopup(false);
    setHasRatedApp(true);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('hasRatedApp', 'true');
    } catch (error) {
      console.log('Error saving rating state:', error);
    }

    // Open store URL
    const storeUrl = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
    try {
      const canOpen = await Linking.canOpenURL(storeUrl);
      if (canOpen) {
        await Linking.openURL(storeUrl);
      }
    } catch (error) {
      console.log('Error opening store:', error);
    }
  }, [APP_STORE_URL, PLAY_STORE_URL]);

  // Increment task count (call this when user completes a task)
  const incrementTaskCount = useCallback(() => {
    setTaskCount(prev => prev + 1);
  }, []);

  // First load shake
  useEffect(() => {
    if (sessionStart) {
      // Shake immediately on mount
      animations.shake();
      // Show roast after a short delay
      setTimeout(() => {
        showRoast(getRandomResponse(RESPONSES.firstLoad));
        setSessionStart(false);
      }, 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Idle check
  useEffect(() => {
    const checkIdle = () => {
      if (Date.now() - lastInteraction > 30000 && !sessionStart) {
        showRoast(getRandomResponse(RESPONSES.idle));
        setLastInteraction(Date.now());
      }
    };
    const interval = setInterval(checkIdle, 31000);
    return () => clearInterval(interval);
  }, [lastInteraction, sessionStart, showRoast]);

  const handleButtonPress = (id: string) => {
    setPressedButton(id);
    setTimeout(() => setPressedButton(null), 150);
    setLastInteraction(Date.now());
    hapticKeyPress();
  };

  // DIGIT INPUT
  const inputDigit = (digit: string) => {
    handleButtonPress(digit);
    animations.triggerDisplayPulse();

    const newCount = digitCounts[digit] + 1;
    setDigitCounts((prev) => ({ ...prev, [digit]: newCount }));

    const responses = RESPONSES.digits[digit];
    const tierIndex = Math.min(Math.floor(newCount / 3), responses.length - 1);
    const response = responses[tierIndex][Math.floor(Math.random() * responses[tierIndex].length)];
    showRoast(response);

    if (newCount > 6) degradeMood();

    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  // DECIMAL INPUT
  const inputDecimal = () => {
    handleButtonPress('.');

    const newCount = decimalCount + 1;
    setDecimalCount(newCount);

    const response = getEscalatingResponse(RESPONSES.decimal, newCount - 1);
    showRoast(response);

    if (newCount > 3) degradeMood();

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) setDisplay(display + '.');
  };

  // CLEAR
  const clearAll = () => {
    handleButtonPress('C');

    const newCount = clearCount + 1;
    setClearCount(newCount);

    const response = getEscalatingResponse(RESPONSES.clear, newCount - 1);
    showRoast(response);

    if (newCount > 2) degradeMood();

    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // BACKSPACE
  const backspace = () => {
    handleButtonPress('back');

    const newCount = backspaceCount + 1;
    setBackspaceCount(newCount);

    const response = getEscalatingResponse(RESPONSES.backspace, newCount - 1);
    showRoast(response);

    if (newCount > 2) degradeMood();

    animations.triggerDisplayPulse();
    if (display.length === 1 || (display.length === 2 && display[0] === '-')) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // OPERATORS
  const handleOperator = (nextOperator: string) => {
    handleButtonPress(nextOperator);

    const newCount = operatorCounts[nextOperator] + 1;
    setOperatorCounts((prev) => ({ ...prev, [nextOperator]: newCount }));

    const responses = RESPONSES.operators[nextOperator];
    const tierIndex = Math.min(Math.floor(newCount / 2), responses.length - 1);
    const response = responses[tierIndex][Math.floor(Math.random() * responses[tierIndex].length)];
    showRoast(response);

    if (newCount > 4) degradeMood();

    const inputValue = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (): number => {
    const inputValue = parseFloat(display);
    let result: number;
    switch (operator) {
      case '+':
        result = (previousValue || 0) + inputValue;
        break;
      case '-':
        result = (previousValue || 0) - inputValue;
        break;
      case '\u00D7':
        result = (previousValue || 0) * inputValue;
        break;
      case '\u00F7':
        result = (previousValue || 0) / inputValue;
        break;
      default:
        result = inputValue;
    }
    return result;
  };

  // EQUALS
  const handleEquals = () => {
    setPressedButton('=');
    setTimeout(() => setPressedButton(null), 150);
    setLastInteraction(Date.now());

    // Shake and strong haptic on equals press
    animations.shake();
    hapticEquals();

    if (operator === null || waitingForOperand) {
      showRoast('Press some numbers first!');
      return;
    }

    const inputValue = parseFloat(display);
    const result = performCalculation();
    const calcKey = `${previousValue}${operator}${inputValue}`;

    logCalculatorEquals(operator);
    setEqualsCount((prev) => prev + 1);

    // Check for fatigue
    if (equalsCount > 0 && equalsCount % 10 === 0) {
      showRoast(getRandomResponse(RESPONSES.fatigue));
      degradeMood();
    }
    // Check repeated calc
    else if (lastCalc === calcKey) {
      showRoast(getRandomResponse(RESPONSES.equals.repeated));
    }
    // Division by zero
    else if (operator === '\u00F7' && inputValue === 0) {
      showRoast(getRandomResponse(RESPONSES.equals.divideByZero));
      setDisplay('Error');
      degradeMood();
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      setLastCalc(calcKey);
      return;
    }
    // Plus zero
    else if (operator === '+' && inputValue === 0) {
      showRoast(getRandomResponse(RESPONSES.patterns.plusZero));
      degradeMood();
    }
    // Times one
    else if (operator === '\u00D7' && (inputValue === 1 || previousValue === 1)) {
      showRoast(getRandomResponse(RESPONSES.patterns.timesOne));
      degradeMood();
    }
    // Divide by one
    else if (operator === '\u00F7' && inputValue === 1) {
      showRoast(getRandomResponse(RESPONSES.patterns.divideByOne));
      degradeMood();
    }
    // Times zero
    else if (operator === '\u00D7' && (inputValue === 0 || previousValue === 0)) {
      showRoast(getRandomResponse(RESPONSES.patterns.timesZero));
    }
    // Very simple (single digit + single digit)
    else if (
      previousValue !== null &&
      previousValue < 10 &&
      inputValue < 10 &&
      previousValue > 0 &&
      inputValue > 0
    ) {
      showRoast(getRandomResponse(RESPONSES.equals.verySimple));
      degradeMood();
    }
    // Negative result
    else if (result < 0) {
      showRoast(getRandomResponse(RESPONSES.equals.negative));
    }
    // Large result
    else if (result > 1000000) {
      showRoast(getRandomResponse(RESPONSES.equals.large));
    }
    // Random "are you sure" (20% chance)
    else if (Math.random() < 0.2) {
      setTimeout(() => showRoast(getRandomResponse(RESPONSES.equals.correct)), 1000);
      showRoast(getRandomResponse(RESPONSES.equals.firstTime));
    }
    // Occasional wrong answer (5%)
    else if (Math.random() < 0.05 && result !== 0) {
      const deviation = result > 100 ? Math.floor(result * 0.02) : Math.random() < 0.5 ? 1 : -1;
      const wrongResult = result + deviation;
      setDisplay(String(parseFloat(wrongResult.toFixed(10))));
      showRoast(getRandomResponse(RESPONSES.equals.wrong));
      setLastCalc(calcKey);
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      return;
    }
    // Normal response
    else {
      showRoast(getRandomResponse(RESPONSES.equals.firstTime));
    }

    if (!isFinite(result)) {
      setDisplay('Error');
    } else {
      const resultStr = String(parseFloat(result.toFixed(10)));
      setDisplay(resultStr);
      // Add to history
      addToHistory(`${previousValue} ${operator} ${inputValue}`, resultStr);
    }

    setLastCalc(calcKey);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);

    // Increment task count for rating popup
    incrementTaskCount();
  };

  // PERCENTAGE
  const handlePercent = () => {
    handleButtonPress('%');

    const newCount = percentCount + 1;
    setPercentCount(newCount);

    const response = getEscalatingResponse(RESPONSES.percent, newCount - 1);
    showRoast(response);

    if (newCount > 3) degradeMood();

    setDisplay(String(parseFloat(display) / 100));
    animations.triggerDisplayPulse();
  };

  // TOGGLE SIGN
  const toggleSign = () => {
    handleButtonPress('\u00B1');

    const newCount = toggleCount + 1;
    setToggleCount(newCount);

    const response = getEscalatingResponse(RESPONSES.toggleSign, newCount - 1);
    showRoast(response);

    if (newCount > 3) degradeMood();

    setDisplay(String(parseFloat(display) * -1));
    animations.triggerDisplayPulse();
  };

  const formatDisplay = (value: string): string => {
    if (value === 'Error') return value;
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    // Show up to 10 significant digits before falling back to scientific
    // notation for numbers too large/small to fit the display.
    const abs = Math.abs(num);
    if (abs !== 0 && (abs >= 1e10 || abs < 1e-9)) {
      return num.toExponential(3);
    }
    // While the user is actively typing a decimal (e.g. "0.500"), keep the
    // raw input as-is so trailing zeros aren't silently dropped.
    if (value.includes('.')) {
      return value;
    }
    // Trim to at most 10 significant digits, dropping trailing zeros.
    return String(parseFloat(num.toPrecision(10)));
  };

  const fontSize = getFontSize(display.length);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Animated.View
        style={[
          styles.calculatorContainer,
          {
            transform: [
              { translateX: animations.shakeX },
              { rotate: animations.shakeRotate },
              { scale: animations.smashScale },
            ],
          },
        ]}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          {/* History Button - Left */}
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.iconButtonBg }]} onPress={openHistory}>
            <HistoryIcon color={colors.gray} size={22} />
          </TouchableOpacity>

          {/* Mood Indicator - Center */}
          <View style={styles.moodContainer}>
            <Text style={[styles.moodLabel, { color: colors.lightGray }]}>{MOOD_LABELS[mood]}</Text>
            <Text
              style={[
                styles.moodEmoji,
                mood > 2 && { textShadowColor: 'rgba(255,80,80,0.8)', textShadowRadius: 8 },
                mood > 3 && { transform: [{ rotate: '180deg' }] },
              ]}
            >
              {MOOD_EMOJIS[mood]}
            </Text>
          </View>

          {/* Settings Button - Right */}
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.iconButtonBg }]} onPress={openSettings}>
            <SettingsIcon color={colors.gray} size={22} />
          </TouchableOpacity>
        </View>

        {/* Roast Bubble - only show in calculator mode */}
        {calculatorMode === 'calculator' && roast && (
          <Animated.View
            style={[
              styles.roastBubble,
              {
                borderColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                shadowColor: colors.shadowColor,
                shadowOpacity: 1,
                opacity: animations.roastOpacity,
                transform: [
                  { translateY: animations.roastTranslateY },
                  { scale: animations.roastScale },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={colors.roastBubbleBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 18,
              }}
            />
            <Text style={[styles.roastText, { color: colors.white }]}>{roast}</Text>
          </Animated.View>
        )}

        {/* Calculator Mode Content */}
        {calculatorMode === 'calculator' ? (
          <>
            {/* Display Area */}
            <Animated.View
              style={[
                styles.displayContainer,
                {
                  transform: [
                    { translateX: animations.glitchX },
                    { translateY: animations.glitchY },
                  ],
                },
              ]}
            >
              {previousValue !== null && operator && (
                <Text style={[styles.expressionText, { color: colors.displayText }]}>
                  {formatDisplay(String(previousValue))}{operator}{!waitingForOperand ? formatDisplay(display) : ''}
                </Text>
              )}
              <Animated.View
                style={[
                  styles.displayWrapper,
                  { transform: [{ scale: animations.displayPulse }] },
                ]}
              >
                {/* Shadow layers for 3D effect */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.displayShadowLayer,
                      {
                        fontSize,
                        fontWeight: '700',
                        letterSpacing: -1,
                        fontVariant: ['tabular-nums'],
                        color: colors.shadowColor.replace('0.3', String(0.14 - i * 0.04)),
                        left: (i + 1) * 1.1,
                        top: (i + 1) * 1.1,
                      },
                    ]}
                  >
                    {formatDisplay(display)}
                  </Text>
                ))}
                <Text style={[styles.displayText, { fontSize, color: colors.displayText }]}>
                  {formatDisplay(display)}
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Button Grid */}
            <View style={styles.buttonGrid}>
              {/* Row 1 */}
              <View style={styles.buttonRow}>
                <FuncButton value="C" onPress={clearAll} pressed={pressedButton === 'C'} themeColors={colors} />
                <FuncButton value="%" onPress={handlePercent} pressed={pressedButton === '%'} themeColors={colors} />
                <FuncButton
                  value="back"
                  onPress={backspace}
                  pressed={pressedButton === 'back'}
                  icon={<BackspaceIcon color={colors.gray} />}
                  themeColors={colors}
                />
                <OpButton
                  value={'\u00F7'}
                  onPress={() => handleOperator('\u00F7')}
                  pressed={pressedButton === '\u00F7'}
                  isActive={operator === '\u00F7' && waitingForOperand}
                  themeColors={colors}
                />
              </View>

              {/* Row 2 */}
              <View style={styles.buttonRow}>
                <NumButton value="7" onPress={() => inputDigit('7')} pressed={pressedButton === '7'} themeColors={colors} />
                <NumButton value="8" onPress={() => inputDigit('8')} pressed={pressedButton === '8'} themeColors={colors} />
                <NumButton value="9" onPress={() => inputDigit('9')} pressed={pressedButton === '9'} themeColors={colors} />
                <OpButton
                  value={'\u00D7'}
                  onPress={() => handleOperator('\u00D7')}
                  pressed={pressedButton === '\u00D7'}
                  isActive={operator === '\u00D7' && waitingForOperand}
                  themeColors={colors}
                />
              </View>

              {/* Row 3 */}
              <View style={styles.buttonRow}>
                <NumButton value="4" onPress={() => inputDigit('4')} pressed={pressedButton === '4'} themeColors={colors} />
                <NumButton value="5" onPress={() => inputDigit('5')} pressed={pressedButton === '5'} themeColors={colors} />
                <NumButton value="6" onPress={() => inputDigit('6')} pressed={pressedButton === '6'} themeColors={colors} />
                <OpButton
                  value="-"
                  displayValue={'\u2212'}
                  onPress={() => handleOperator('-')}
                  pressed={pressedButton === '-'}
                  isActive={operator === '-' && waitingForOperand}
                  themeColors={colors}
                />
              </View>

              {/* Row 4 */}
              <View style={styles.buttonRow}>
                <NumButton value="1" onPress={() => inputDigit('1')} pressed={pressedButton === '1'} themeColors={colors} />
                <NumButton value="2" onPress={() => inputDigit('2')} pressed={pressedButton === '2'} themeColors={colors} />
                <NumButton value="3" onPress={() => inputDigit('3')} pressed={pressedButton === '3'} themeColors={colors} />
                <OpButton
                  value="+"
                  onPress={() => handleOperator('+')}
                  pressed={pressedButton === '+'}
                  isActive={operator === '+' && waitingForOperand}
                  themeColors={colors}
                />
              </View>

              {/* Row 5 */}
              <View style={styles.buttonRow}>
                <NumButton value="." onPress={inputDecimal} pressed={pressedButton === '.'} themeColors={colors} />
                <NumButton value="0" onPress={() => inputDigit('0')} pressed={pressedButton === '0'} themeColors={colors} />
                <FuncButton
                  value={'\u00B1'}
                  onPress={toggleSign}
                  pressed={pressedButton === '\u00B1'}
                  themeColors={colors}
                />
                <TouchableOpacity
                  onPress={handleEquals}
                  activeOpacity={0.8}
                  style={[
                    styles.button,
                    styles.buttonShadow,
                    { shadowColor: colors.shadowColor, shadowOpacity: 1 },
                    pressedButton === '=' && styles.buttonPressed,
                  ]}
                >
                  <LinearGradient
                    colors={
                      pressedButton === '='
                        ? colors.equalsButtonPressed as [string, string, string]
                        : colors.equalsButton as [string, string, string]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.equalsButtonText}>=</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Home screen bottom banner ad */}
            {!isPremium && (
              <View style={{ marginTop: 10 }}>
                <AdBanner size="banner" />
              </View>
            )}
          </>
        ) : calculatorMode === 'unit-converter' ? (
          /* Unit Converter Mode */
          <UnitConverter colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'tip-calculator' ? (
          /* Tip Calculator Mode */
          <TipCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'fuel-calculator' ? (
          /* Fuel Calculator Mode */
          <FuelCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'gpa-calculator' ? (
          /* GPA Calculator Mode */
          <GPACalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'fuel-efficiency' ? (
          /* Fuel Efficiency Calculator Mode */
          <FuelEfficiencyCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'health' ? (
          /* Health Calculator Mode */
          <HealthCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'percentage' ? (
          /* Percentage Calculator Mode */
          <PercentageCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'loan' ? (
          /* Loan Calculator Mode */
          <LoanCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'ovulation' ? (
          /* Ovulation Calculator Mode */
          <OvulationCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'hex' ? (
          /* Hex Calculator Mode */
          <HexCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'discount' ? (
          /* Discount Calculator Mode */
          <DiscountCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        ) : calculatorMode === 'currency' ? (
          /* Currency Converter Mode */
          <CurrencyConverter colors={colors} onTaskComplete={incrementTaskCount} />
        ) : (
          /* Savings Calculator Mode */
          <SavingsCalculator colors={colors} onTaskComplete={incrementTaskCount} />
        )}

        {/* Footer */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>The Gaslighter</Text>
        </View> */}
      </Animated.View>

      {/* History Panel Overlay */}
      {historyVisible && (
        <TouchableOpacity
          style={styles.historyOverlay}
          activeOpacity={1}
          onPress={closeHistory}
        />
      )}

      {/* History Panel */}
      <Animated.View
        style={[
          styles.historyPanel,
          { backgroundColor: colors.panelBg },
          { transform: [{ translateX: historySlideAnim }] },
        ]}
      >
        <View style={styles.historyHeader}>
          <Text style={[styles.historyTitle, { color: colors.white }]}>History</Text>
          <TouchableOpacity onPress={closeHistory} style={styles.historyCloseButton}>
            <Text style={[styles.historyCloseText, { color: colors.gray }]}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
          {history.length === 0 ? (
            <Text style={[styles.historyEmpty, { color: colors.lightGray }]}>No calculations yet</Text>
          ) : (
            history.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => {
                  setDisplay(item.result);
                  closeHistory();
                }}
              >
                <Text style={[styles.historyExpression, { color: colors.gray }]}>{item.expression}</Text>
                <Text style={[styles.historyResult, { color: colors.white }]}>= {item.result}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* Settings Panel Overlay */}
      {settingsVisible && (
        <TouchableOpacity
          style={styles.historyOverlay}
          activeOpacity={1}
          onPress={closeSettings}
        />
      )}

      {/* Settings Panel */}
      <Animated.View
        style={[
          styles.settingsPanel,
          { backgroundColor: colors.panelBg },
          { transform: [{ translateX: settingsSlideAnim }] },
        ]}
      >
        <View style={styles.settingsHeader}>
          <TouchableOpacity onPress={closeSettings} style={styles.historyCloseButton}>
            <Text style={[styles.historyCloseText, { color: colors.gray }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.historyTitle, { color: colors.white }]}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
          {/* Theme Toggle */}
          <View style={styles.settingsSection}>
            <Text style={[styles.settingsSectionTitle, { color: colors.lightGray, marginTop: 10 }]}>Appearance</Text>
            <View style={styles.settingsItem}>
              <Text style={[styles.settingsLabel, { color: colors.white }]}>Dark Theme</Text>
              <Switch
                value={isDarkTheme}
                onValueChange={handleThemeChange}
                trackColor={{ false: '#3a3a3a', true: '#f5a623' }}
                thumbColor={isDarkTheme ? '#ffffff' : '#888888'}
              />
            </View>
          </View>

          {/* Premium */}
          <View style={styles.settingsSection}>
            <Text style={[styles.settingsSectionTitle, { color: colors.lightGray }]}>Premium</Text>
            {isPremium ? (
              <View style={styles.settingsItem}>
                <Text style={[styles.settingsLabel, { color: colors.white }]}>Premium Active</Text>
                <Text style={styles.premiumBadge}>PRO</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.premiumButton}
                  disabled={purchasing}
                  onPress={() => {
                    Alert.alert(
                      'Go Premium',
                      `Remove ads and unlock exclusive features!\n\nPrice: ${priceLabel}`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Buy Now', onPress: () => purchasePremium() },
                      ]
                    );
                  }}
                >
                  <Text style={styles.premiumButtonText}>
                    {purchasing ? 'Processing…' : `Remove Ads - ${priceLabel}`}
                  </Text>
                  <Text style={[styles.premiumButtonSubtext, { color: colors.gray }]}>Unlock premium features</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsItem} onPress={() => restore()}>
                  <Text style={[styles.settingsLabel, { color: colors.gray, fontSize: 14 }]}>Restore Purchases</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Calculator Mode */}
          <View style={styles.settingsSection}>
            <Text style={[styles.settingsSectionTitle, { color: colors.lightGray }]}>Calculator Mode</Text>
            {CALCULATOR_MODES.slice(0, 7).map(({ mode, label }) => {
              const isLocked = LOCKED_MODES.includes(mode) && !unlockedModes.includes(mode);
              return (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.settingsItem,
                    calculatorMode === mode && styles.settingsItemActive,
                  ]}
                  onPress={() => handleModePress(mode)}
                >
                  <Text style={[styles.settingsLabel, { color: colors.white }]}>{label}</Text>
                  {isLocked ? (
                    <Text style={{ color: colors.gray, fontSize: 16 }}>🔒</Text>
                  ) : (
                    calculatorMode === mode && (
                      <Text style={{ color: colors.orange, fontSize: 16 }}>✓</Text>
                    )
                  )}
                </TouchableOpacity>
              );
            })}

            {!isPremium && (
              <View style={{ marginVertical: 14 }}>
                <AdBanner size="square" />
              </View>
            )}

            {CALCULATOR_MODES.slice(7).map(({ mode, label }) => {
              const isLocked = LOCKED_MODES.includes(mode) && !unlockedModes.includes(mode);
              return (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.settingsItem,
                    calculatorMode === mode && styles.settingsItemActive,
                  ]}
                  onPress={() => handleModePress(mode)}
                >
                  <Text style={[styles.settingsLabel, { color: colors.white }]}>{label}</Text>
                  {isLocked ? (
                    <Text style={{ color: colors.gray, fontSize: 16 }}>🔒</Text>
                  ) : (
                    calculatorMode === mode && (
                      <Text style={{ color: colors.orange, fontSize: 16 }}>✓</Text>
                    )
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* App Info */}
          <View style={styles.settingsSection}>
            <Text style={[styles.settingsSectionTitle, { color: colors.lightGray }]}>App Info</Text>
            <View style={styles.settingsItem}>
              <Text style={[styles.settingsLabel, { color: colors.white }]}>Version</Text>
              <Text style={[styles.settingsValue, { color: colors.gray }]}>1.0.0</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                Alert.alert(
                  'About Calculatude',
                  'Calculatude — the calculator with an attitude.\n\nA calculator that judges your math skills, made with love and sarcasm.\n\n© 2026 Calculatude',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={[styles.settingsLabel, { color: colors.white }]}>About</Text>
              <Text style={[styles.settingsValue, { color: colors.gray }]}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Data */}
          <View style={styles.settingsSection}>
            <Text style={[styles.settingsSectionTitle, { color: colors.lightGray }]}>Data</Text>
            <View style={styles.settingsItem}>
              <Text style={[styles.settingsLabel, { color: colors.white }]}>Calculations Done</Text>
              <Text style={[styles.settingsValue, { color: colors.gray }]}>{equalsCount}</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButtonDanger}
              onPress={() => {
                Alert.alert(
                  'Clear History',
                  'Are you sure you want to clear all calculation history?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear',
                      style: 'destructive',
                      onPress: () => {
                        setHistory([]);
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.settingsButtonDangerText}>Clear History</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Rating Popup Modal */}
      <Modal
        visible={showRatingPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDismissRating}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: colors.panelBg,
            borderRadius: 20,
            padding: 24,
            width: '90%',
            maxWidth: 340,
            alignItems: 'center',
          }}>
            {/* Close Button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: colors.iconButtonBg,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleDismissRating}
            >
              <Text style={{ color: colors.gray, fontSize: 16, fontWeight: '600' }}>✕</Text>
            </TouchableOpacity>

            {/* Stars Icon */}
            <Text style={{ fontSize: 50, marginBottom: 16 }}>⭐</Text>

            {/* Title */}
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: colors.white,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Enjoying the App?
            </Text>

            {/* Subtitle */}
            <Text style={{
              fontSize: 14,
              color: colors.gray,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 20,
            }}>
              We'd love to hear your feedback! Please take a moment to rate us on the {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}.
            </Text>

            {/* Rate Button */}
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: colors.orange,
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 12,
              }}
              onPress={handleRateApp}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '700',
              }}>
                Rate Now ⭐
              </Text>
            </TouchableOpacity>

            {/* Maybe Later Button */}
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: colors.iconButtonBg,
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
              }}
              onPress={handleDismissRating}
            >
              <Text style={{
                color: colors.gray,
                fontSize: 14,
                fontWeight: '600',
              }}>
                Maybe Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
