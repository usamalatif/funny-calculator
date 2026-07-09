import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { AdBanner } from '../ads/AdBanner';

interface PercentageCalculatorProps {
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

type CalcType = 'percentOf' | 'whatPercent' | 'change' | 'increase' | 'decrease';

const CALC_TYPES: { label: string; value: CalcType; desc: string }[] = [
  { label: '% of', value: 'percentOf', desc: 'What is X% of Y?' },
  { label: 'is %', value: 'whatPercent', desc: 'X is what % of Y?' },
  { label: 'Change', value: 'change', desc: '% change from X to Y' },
  { label: '+ %', value: 'increase', desc: 'Increase X by Y%' },
  { label: '- %', value: 'decrease', desc: 'Decrease X by Y%' },
];

export const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({ colors, onTaskComplete }) => {
  const [calcType, setCalcType] = useState<CalcType>('percentOf');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const handleInputChange = (setter: (val: string) => void) => (text: string) => {
    setter(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

  const num1 = parseFloat(value1) || 0;
  const num2 = parseFloat(value2) || 0;

  const calculate = (): { result: string; formula: string } => {
    switch (calcType) {
      case 'percentOf':
        // What is X% of Y?
        const percentOf = (num1 / 100) * num2;
        return {
          result: percentOf.toFixed(2).replace(/\.?0+$/, ''),
          formula: `${num1}% of ${num2} = ${percentOf.toFixed(2).replace(/\.?0+$/, '')}`,
        };

      case 'whatPercent':
        // X is what % of Y?
        if (num2 === 0) return { result: '0', formula: 'Cannot divide by zero' };
        const whatPercent = (num1 / num2) * 100;
        return {
          result: whatPercent.toFixed(2).replace(/\.?0+$/, '') + '%',
          formula: `${num1} is ${whatPercent.toFixed(2).replace(/\.?0+$/, '')}% of ${num2}`,
        };

      case 'change':
        // Percentage change from X to Y
        if (num1 === 0) return { result: '0%', formula: 'Cannot calculate from zero' };
        const change = ((num2 - num1) / Math.abs(num1)) * 100;
        const sign = change >= 0 ? '+' : '';
        return {
          result: sign + change.toFixed(2).replace(/\.?0+$/, '') + '%',
          formula: `From ${num1} to ${num2} = ${sign}${change.toFixed(2).replace(/\.?0+$/, '')}%`,
        };

      case 'increase':
        // Increase X by Y%
        const increased = num1 + (num1 * num2 / 100);
        return {
          result: increased.toFixed(2).replace(/\.?0+$/, ''),
          formula: `${num1} + ${num2}% = ${increased.toFixed(2).replace(/\.?0+$/, '')}`,
        };

      case 'decrease':
        // Decrease X by Y%
        const decreased = num1 - (num1 * num2 / 100);
        return {
          result: decreased.toFixed(2).replace(/\.?0+$/, ''),
          formula: `${num1} - ${num2}% = ${decreased.toFixed(2).replace(/\.?0+$/, '')}`,
        };

      default:
        return { result: '0', formula: '' };
    }
  };

  const { result, formula } = calculate();

  const getLabels = (): { label1: string; label2: string } => {
    switch (calcType) {
      case 'percentOf':
        return { label1: 'Percentage (%)', label2: 'Of Number' };
      case 'whatPercent':
        return { label1: 'Number', label2: 'Of Total' };
      case 'change':
        return { label1: 'From (Original)', label2: 'To (New)' };
      case 'increase':
        return { label1: 'Number', label2: 'Increase by (%)' };
      case 'decrease':
        return { label1: 'Number', label2: 'Decrease by (%)' };
      default:
        return { label1: 'Value 1', label2: 'Value 2' };
    }
  };

  const labels = getLabels();
  const currentCalc = CALC_TYPES.find(c => c.value === calcType);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 14,
      marginTop: 24,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.gray,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    headerDesc: {
      fontSize: 12,
      color: colors.lightGray,
      maxWidth: '55%',
      textAlign: 'right',
    },
    // Hero result
    heroCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginBottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heroLeft: {
      flexShrink: 1,
      paddingRight: 12,
    },
    resultLabel: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    resultValue: {
      fontSize: 40,
      fontWeight: '700',
      color: colors.orange,
    },
    formulaText: {
      fontSize: 12,
      color: colors.gray,
      marginTop: 6,
    },
    // Calc Type Selector
    calcTypeScroll: {
      marginBottom: 14,
    },
    calcTypeRow: {
      flexDirection: 'row',
    },
    calcTypeButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginRight: 6,
      backgroundColor: colors.iconButtonBg,
    },
    calcTypeButtonActive: {
      backgroundColor: colors.orange,
    },
    calcTypeLabel: {
      fontSize: 12,
      fontWeight: '600',
    },
    calcTypeLabelActive: {
      color: '#ffffff',
    },
    calcTypeLabelInactive: {
      color: colors.gray,
    },
    // Inputs grid
    inputsGrid: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    inputCol: {
      flex: 1,
      backgroundColor: colors.panelBg,
      borderRadius: 14,
      padding: 12,
    },
    inputColGap: {
      width: 10,
    },
    label: {
      fontSize: 10,
      color: colors.lightGray,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
    },
    input: {
      flex: 1,
      fontSize: 20,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    inputSuffix: {
      fontSize: 15,
      color: colors.orange,
      paddingRight: 12,
      fontWeight: '500',
    },
    // Quick percentages
    quickSection: {
      marginBottom: 20,
    },
    quickTitle: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    quickRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    quickButton: {
      backgroundColor: colors.iconButtonBg,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
    },
    quickButtonText: {
      fontSize: 13,
      color: colors.gray,
      fontWeight: '500',
    },
  });

  const QuickPercentages = () => {
    if (calcType !== 'percentOf' && calcType !== 'increase' && calcType !== 'decrease') {
      return null;
    }

    const percentages = calcType === 'percentOf'
      ? ['5', '10', '15', '20', '25', '50', '75', '100']
      : ['5', '10', '15', '20', '25', '30', '50'];

    return (
      <View style={styles.quickSection}>
        <Text style={styles.quickTitle}>Quick Select</Text>
        <View style={styles.quickRow}>
          {percentages.map((p) => (
            <TouchableOpacity
              key={p}
              style={styles.quickButton}
              onPress={() => calcType === 'percentOf' ? setValue1(p) : setValue2(p)}
            >
              <Text style={styles.quickButtonText}>{p}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Percentage</Text>
        <Text style={styles.headerDesc}>{currentCalc?.desc}</Text>
      </View>

      {/* Hero Result */}
      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.resultLabel}>Result</Text>
          <Text style={styles.formulaText}>{formula}</Text>
        </View>
        <Text style={styles.resultValue}>{result}</Text>
      </View>

      {/* Calc Type Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.calcTypeScroll}
      >
        <View style={styles.calcTypeRow}>
          {CALC_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.calcTypeButton,
                calcType === type.value && styles.calcTypeButtonActive,
              ]}
              onPress={() => {
                setCalcType(type.value);
                setValue1('');
                setValue2('');
              }}
            >
              <Text
                style={[
                  styles.calcTypeLabel,
                  calcType === type.value
                    ? styles.calcTypeLabelActive
                    : styles.calcTypeLabelInactive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Inputs */}
      <View style={styles.inputsGrid}>
        <View style={styles.inputCol}>
          <Text style={styles.label}>{labels.label1}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={value1}
              onChangeText={handleInputChange(setValue1)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            {(calcType === 'percentOf' || calcType === 'increase' || calcType === 'decrease') &&
              calcType === 'percentOf' && (
              <Text style={styles.inputSuffix}>%</Text>
            )}
          </View>
        </View>

        <View style={styles.inputColGap} />

        <View style={styles.inputCol}>
          <Text style={styles.label}>{labels.label2}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={value2}
              onChangeText={handleInputChange(setValue2)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            {(calcType === 'increase' || calcType === 'decrease') && (
              <Text style={styles.inputSuffix}>%</Text>
            )}
          </View>
        </View>
      </View>

      <QuickPercentages />
    </ScrollView>
    <View style={{ marginTop: 16 }}>
      <AdBanner size="banner" />
    </View>
    </View>
  );
};
