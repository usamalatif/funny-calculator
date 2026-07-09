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
import { AdBanner } from '../ads/AdBanner';

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
  const primaryConversion = conversions.find(c => c.value !== inputBase) || conversions[0];
  const secondaryConversions = conversions.filter(c => c.value !== primaryConversion.value);

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
      paddingHorizontal: 14,
      marginTop: 20,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    // Base Selector - compact pill row anchored to header
    baseRow: {
      flexDirection: 'row',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 20,
      padding: 3,
    },
    baseButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      alignItems: 'center',
    },
    baseButtonActive: {
      backgroundColor: colors.orange,
    },
    baseLabel: {
      fontSize: 11,
      fontWeight: '700',
    },
    baseLabelActive: {
      color: '#ffffff',
    },
    baseLabelInactive: {
      color: colors.gray,
    },
    // Hero card: input + primary conversion combined
    heroCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 16,
      marginBottom: 10,
    },
    heroTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    inputLabel: {
      fontSize: 10,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    inputPrefixTag: {
      fontSize: 11,
      color: colors.orange,
      fontWeight: '700',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputPrefix: {
      fontSize: 20,
      color: colors.orange,
      fontWeight: '600',
    },
    input: {
      flex: 1,
      fontSize: 34,
      color: colors.white,
      fontWeight: '700',
      paddingVertical: 4,
      fontFamily: 'monospace',
    },
    heroDivider: {
      height: 1,
      backgroundColor: colors.iconButtonBg,
      marginVertical: 14,
    },
    heroResultLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    heroResultLabel: {
      fontSize: 10,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    heroResultValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    heroResultPrefix: {
      fontSize: 16,
      color: colors.orange,
      marginRight: 4,
      fontWeight: '600',
    },
    heroResultValue: {
      fontSize: 28,
      color: colors.orange,
      fontWeight: '700',
      fontFamily: 'monospace',
      flexShrink: 1,
    },
    // Secondary conversions - horizontal chip grid
    chipGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 14,
    },
    chip: {
      flexGrow: 1,
      flexBasis: '47%',
      backgroundColor: colors.panelBg,
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    chipTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    chipLabel: {
      fontSize: 11,
      color: colors.gray,
      fontWeight: '700',
    },
    copyButton: {
      paddingVertical: 3,
      paddingHorizontal: 8,
      backgroundColor: colors.iconButtonBg,
      borderRadius: 8,
      alignItems: 'center',
    },
    copyButtonCopied: {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    copyButtonText: {
      fontSize: 10,
      color: colors.gray,
      fontWeight: '500',
    },
    copyButtonTextCopied: {
      color: '#4CAF50',
    },
    chipValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    chipPrefix: {
      fontSize: 11,
      color: colors.orange,
      marginRight: 3,
    },
    chipValue: {
      fontSize: 15,
      color: colors.white,
      fontWeight: '600',
      fontFamily: 'monospace',
    },
    // Keypad
    keypadCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      padding: 10,
    },
    keypadRow: {
      flexDirection: 'row',
      marginBottom: 8,
      gap: 8,
    },
    keypadRowLast: {
      marginBottom: 0,
    },
    keyButton: {
      flex: 1,
      height: 46,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
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
      gap: 8,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Hex Calc</Text>
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
      </View>

      {/* Hero: Input + primary result */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Text style={styles.inputLabel}>
            {BASES.find(b => b.value === inputBase)?.label} Input
          </Text>
          <Text style={styles.inputPrefixTag}>
            {BASES.find(b => b.value === inputBase)?.prefix || '—'}
          </Text>
        </View>
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

        <View style={styles.heroDivider} />

        <View style={styles.heroResultLabelRow}>
          <Text style={styles.heroResultLabel}>{primaryConversion.label} Result</Text>
          <TouchableOpacity
            style={[
              styles.copyButton,
              copiedBase === primaryConversion.value && styles.copyButtonCopied,
            ]}
            onPress={() =>
              copyToClipboard(primaryConversion.result || '0', primaryConversion.prefix, primaryConversion.value)
            }
          >
            <Text
              style={[
                styles.copyButtonText,
                copiedBase === primaryConversion.value && styles.copyButtonTextCopied,
              ]}
            >
              {copiedBase === primaryConversion.value ? 'Copied!' : 'Copy'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroResultValueRow}>
          <Text style={styles.heroResultPrefix}>{primaryConversion.prefix}</Text>
          <Text style={styles.heroResultValue}>{primaryConversion.result || '0'}</Text>
        </View>
      </View>

      {/* Secondary conversions as chips */}
      <View style={styles.chipGrid}>
        {secondaryConversions.map((conv) => (
          <View key={conv.value} style={styles.chip}>
            <View style={styles.chipTopRow}>
              <Text style={styles.chipLabel}>{conv.label}</Text>
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
                  {copiedBase === conv.value ? '✓' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chipValueRow}>
              <Text style={styles.chipPrefix}>{conv.prefix}</Text>
              <Text style={styles.chipValue}>{conv.result || '0'}</Text>
            </View>
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

      <View style={{ marginTop: 16 }}>
        <AdBanner size="banner" />
      </View>
    </ScrollView>
  );
};
