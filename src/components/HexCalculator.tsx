import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

interface HexCalculatorProps {
  colors: {
    background: string;
    white: string;
    gray: string;
    lightGray: string;
    orange: string;
    numButtonBg: string[];
    numButtonBgPressed: string[];
    funcButtonBg: string[];
    panelBg: string;
    iconButtonBg: string;
  };
  onTaskComplete?: () => void;
}

type NumberBase = 'dec' | 'hex' | 'bin' | 'oct';

const BASES: { label: string; value: NumberBase; prefix: string; radix: number }[] = [
  { label: 'DEC', value: 'dec', prefix: '', radix: 10 },
  { label: 'HEX', value: 'hex', prefix: '0x', radix: 16 },
  { label: 'BIN', value: 'bin', prefix: '0b', radix: 2 },
  { label: 'OCT', value: 'oct', prefix: '0o', radix: 8 },
];

const HEX_KEYS = [
  ['A', 'B', 'C', 'D'],
  ['E', 'F', 'CLR', '⌫'],
];

const NUM_KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['0', '00', '.'],
];

export const HexCalculator: React.FC<HexCalculatorProps> = ({ colors, onTaskComplete }) => {
  const [inputBase, setInputBase] = useState<NumberBase>('dec');
  const [inputValue, setInputValue] = useState('');
  const [copiedBase, setCopiedBase] = useState<string | null>(null);

  const copyToClipboard = (value: string, prefix: string, base: string) => {
    const fullValue = prefix + value;
    Clipboard.setString(fullValue);
    setCopiedBase(base);
    setTimeout(() => setCopiedBase(null), 1500);
  };

  // Parse input value to decimal
  const parseToDecimal = (value: string, base: NumberBase): number => {
    if (!value || value === '') return 0;
    const baseConfig = BASES.find(b => b.value === base);
    if (!baseConfig) return 0;

    try {
      const parsed = parseInt(value, baseConfig.radix);
      return isNaN(parsed) ? 0 : parsed;
    } catch {
      return 0;
    }
  };

  // Convert decimal to other bases
  const convertFromDecimal = (decimal: number, base: NumberBase): string => {
    if (decimal === 0) return '0';
    const baseConfig = BASES.find(b => b.value === base);
    if (!baseConfig) return '0';

    return decimal.toString(baseConfig.radix).toUpperCase();
  };

  const decimalValue = parseToDecimal(inputValue, inputBase);

  // Get all conversions
  const getConversions = () => {
    return BASES.map(base => ({
      ...base,
      value: base.value,
      result: convertFromDecimal(decimalValue, base.value),
    }));
  };

  const conversions = getConversions();

  // Check if key is valid for current base
  const isKeyValid = (key: string): boolean => {
    if (key === 'CLR' || key === '⌫' || key === '.' || key === '00') return true;

    switch (inputBase) {
      case 'bin':
        return ['0', '1'].includes(key);
      case 'oct':
        return ['0', '1', '2', '3', '4', '5', '6', '7'].includes(key);
      case 'dec':
        return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key);
      case 'hex':
        return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].includes(key);
      default:
        return false;
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'CLR') {
      setInputValue('');
    } else if (key === '⌫') {
      setInputValue(inputValue.slice(0, -1));
    } else if (key === '.') {
      // Ignore decimal for integer conversion
    } else if (key === '00') {
      if (inputValue !== '' && inputValue !== '0') {
        setInputValue(inputValue + '00');
        onTaskComplete?.();
      }
    } else if (isKeyValid(key)) {
      if (inputValue === '0') {
        setInputValue(key);
      } else {
        setInputValue(inputValue + key);
      }
      onTaskComplete?.();
    }
  };

  const handleInputChange = (text: string) => {
    // Filter valid characters based on current base
    let filtered = text.toUpperCase();
    switch (inputBase) {
      case 'bin':
        filtered = filtered.replace(/[^01]/g, '');
        break;
      case 'oct':
        filtered = filtered.replace(/[^0-7]/g, '');
        break;
      case 'dec':
        filtered = filtered.replace(/[^0-9]/g, '');
        break;
      case 'hex':
        filtered = filtered.replace(/[^0-9A-F]/g, '');
        break;
    }
    setInputValue(filtered);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 5,
      marginTop: 30,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 12,
      textAlign: 'center',
    },
    // Base Selector
    baseRow: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    baseButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 3,
      backgroundColor: colors.iconButtonBg,
    },
    baseButtonActive: {
      backgroundColor: colors.orange,
    },
    baseLabel: {
      fontSize: 14,
      fontWeight: '700',
    },
    baseLabelActive: {
      color: '#ffffff',
    },
    baseLabelInactive: {
      color: colors.gray,
    },
    // Input Card
    inputCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },
    inputLabel: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
    },
    inputPrefix: {
      fontSize: 14,
      color: colors.orange,
      paddingLeft: 12,
      fontWeight: '600',
    },
    input: {
      flex: 1,
      fontSize: 24,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 12,
      paddingHorizontal: 10,
      fontFamily: 'monospace',
    },
    // Results Card
    resultsCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },
    resultsTitle: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    resultRowLast: {
      borderBottomWidth: 0,
    },
    resultLabel: {
      width: 50,
      fontSize: 12,
      color: colors.gray,
      fontWeight: '600',
    },
    resultPrefix: {
      fontSize: 12,
      color: colors.orange,
      marginRight: 4,
    },
    resultValue: {
      flex: 1,
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
      fontFamily: 'monospace',
    },
    resultValueHighlight: {
      color: colors.orange,
    },
    copyButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: colors.iconButtonBg,
      borderRadius: 6,
      minWidth: 50,
      alignItems: 'center',
    },
    copyButtonCopied: {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    copyButtonText: {
      fontSize: 11,
      color: colors.gray,
      fontWeight: '500',
    },
    copyButtonTextCopied: {
      color: '#4CAF50',
    },
    // Keypad
    keypadCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 10,
    },
    keypadRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    keypadRowLast: {
      marginBottom: 0,
    },
    keyButton: {
      flex: 1,
      height: 44,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 3,
      backgroundColor: colors.iconButtonBg,
    },
    keyButtonDisabled: {
      opacity: 0.3,
    },
    keyButtonSpecial: {
      backgroundColor: 'rgba(245,166,35,0.2)',
    },
    keyButtonText: {
      fontSize: 18,
      color: colors.white,
      fontWeight: '600',
    },
    keyButtonTextSpecial: {
      color: colors.orange,
    },
    keyButtonTextDisabled: {
      color: colors.gray,
    },
    // Hex keys row
    hexRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Hex Calculator</Text>

      {/* Base Selector */}
      <View style={styles.baseRow}>
        {BASES.map((base) => (
          <TouchableOpacity
            key={base.value}
            style={[
              styles.baseButton,
              inputBase === base.value && styles.baseButtonActive,
            ]}
            onPress={() => {
              // Convert current value to new base
              const newValue = convertFromDecimal(decimalValue, base.value);
              setInputBase(base.value);
              setInputValue(newValue === '0' && inputValue === '' ? '' : newValue);
            }}
          >
            <Text
              style={[
                styles.baseLabel,
                inputBase === base.value
                  ? styles.baseLabelActive
                  : styles.baseLabelInactive,
              ]}
            >
              {base.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          Enter {BASES.find(b => b.value === inputBase)?.label} Value
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputPrefix}>
            {BASES.find(b => b.value === inputBase)?.prefix}
          </Text>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={handleInputChange}
            placeholder="0"
            placeholderTextColor={colors.gray}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsCard}>
        <Text style={styles.resultsTitle}>Conversions</Text>
        {conversions.map((conv, index) => (
          <View
            key={conv.value}
            style={[
              styles.resultRow,
              index === conversions.length - 1 && styles.resultRowLast,
            ]}
          >
            <Text style={styles.resultLabel}>{conv.label}</Text>
            <Text style={styles.resultPrefix}>{conv.prefix}</Text>
            <Text
              style={[
                styles.resultValue,
                conv.value === inputBase && styles.resultValueHighlight,
              ]}
            >
              {conv.result || '0'}
            </Text>
            <TouchableOpacity
              style={[
                styles.copyButton,
                copiedBase === conv.value && styles.copyButtonCopied,
              ]}
              onPress={() => copyToClipboard(conv.result || '0', conv.prefix, conv.value)}
            >
              <Text
                style={[
                  styles.copyButtonText,
                  copiedBase === conv.value && styles.copyButtonTextCopied,
                ]}
              >
                {copiedBase === conv.value ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Keypad */}
      <View style={styles.keypadCard}>
        {/* Hex Keys (A-F) */}
        {HEX_KEYS.map((row, rowIndex) => (
          <View key={`hex-${rowIndex}`} style={styles.hexRow}>
            {row.map((key) => {
              const isValid = isKeyValid(key);
              const isSpecial = key === 'CLR' || key === '⌫';
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.keyButton,
                    !isValid && !isSpecial && styles.keyButtonDisabled,
                    isSpecial && styles.keyButtonSpecial,
                  ]}
                  onPress={() => handleKeyPress(key)}
                  disabled={!isValid && !isSpecial}
                >
                  <Text
                    style={[
                      styles.keyButtonText,
                      !isValid && !isSpecial && styles.keyButtonTextDisabled,
                      isSpecial && styles.keyButtonTextSpecial,
                    ]}
                  >
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Number Keys */}
        {NUM_KEYS.map((row, rowIndex) => (
          <View
            key={`num-${rowIndex}`}
            style={[
              styles.keypadRow,
              rowIndex === NUM_KEYS.length - 1 && styles.keypadRowLast,
            ]}
          >
            {row.map((key) => {
              const isValid = isKeyValid(key);
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.keyButton,
                    !isValid && styles.keyButtonDisabled,
                  ]}
                  onPress={() => handleKeyPress(key)}
                  disabled={!isValid}
                >
                  <Text
                    style={[
                      styles.keyButtonText,
                      !isValid && styles.keyButtonTextDisabled,
                    ]}
                  >
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
