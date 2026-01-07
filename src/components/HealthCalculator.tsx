import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface HealthCalculatorProps {
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
}

type UnitSystem = 'metric' | 'imperial';
type Gender = 'male' | 'female';
type CalculationType = 'bmi' | 'bmr' | 'water' | 'ideal';

export const HealthCalculator: React.FC<HealthCalculatorProps> = ({ colors }) => {
  const [calcType, setCalcType] = useState<CalculationType>('bmi');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');

  const weightNum = parseFloat(weight) || 0;
  const heightNum = parseFloat(height) || 0;
  const ageNum = parseFloat(age) || 0;

  // Convert height for imperial
  const getHeightInCm = () => {
    if (unitSystem === 'metric') {
      return heightNum;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      return (ft * 12 + inches) * 2.54;
    }
  };

  // Convert weight to kg
  const getWeightInKg = () => {
    if (unitSystem === 'metric') {
      return weightNum;
    } else {
      return weightNum * 0.453592;
    }
  };

  // Calculate BMI
  const calculateBMI = () => {
    const h = getHeightInCm() / 100;
    const w = getWeightInKg();
    if (h === 0) return 0;
    return w / (h * h);
  };

  // Get BMI Category
  const getBMICategory = (bmi: number) => {
    if (bmi === 0) return { label: '-', color: colors.gray };
    if (bmi < 18.5) return { label: 'Underweight', color: '#2196F3' };
    if (bmi < 25) return { label: 'Normal', color: '#4CAF50' };
    if (bmi < 30) return { label: 'Overweight', color: '#FFC107' };
    return { label: 'Obese', color: '#F44336' };
  };

  // Calculate BMR (Mifflin-St Jeor Equation)
  const calculateBMR = () => {
    const h = getHeightInCm();
    const w = getWeightInKg();
    if (h === 0 || w === 0 || ageNum === 0) return 0;

    if (gender === 'male') {
      return 10 * w + 6.25 * h - 5 * ageNum + 5;
    } else {
      return 10 * w + 6.25 * h - 5 * ageNum - 161;
    }
  };

  // Calculate daily water intake (in liters)
  const calculateWater = () => {
    const w = getWeightInKg();
    if (w === 0) return 0;
    return w * 0.033;
  };

  // Calculate ideal weight (Devine Formula)
  const calculateIdealWeight = () => {
    const h = getHeightInCm();
    if (h === 0) return { min: 0, max: 0, ideal: 0 };

    const heightInInches = h / 2.54;
    let ideal: number;

    if (gender === 'male') {
      ideal = 50 + 2.3 * (heightInInches - 60);
    } else {
      ideal = 45.5 + 2.3 * (heightInInches - 60);
    }

    if (ideal < 0) ideal = 0;

    // BMI-based range (18.5-24.9)
    const hMeters = h / 100;
    const min = 18.5 * hMeters * hMeters;
    const max = 24.9 * hMeters * hMeters;

    return { min, max, ideal };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR();
  const water = calculateWater();
  const idealWeight = calculateIdealWeight();

  const CALC_TYPES: { label: string; icon: string; value: CalculationType }[] = [
    { label: 'BMI', icon: '⚖️', value: 'bmi' },
    { label: 'BMR', icon: '🔥', value: 'bmr' },
    { label: 'Water', icon: '💧', value: 'water' },
    { label: 'Ideal', icon: '🎯', value: 'ideal' },
  ];

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
    // Calc Type Selector
    calcTypeRow: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    calcTypeButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 3,
      backgroundColor: colors.iconButtonBg,
    },
    calcTypeButtonActive: {
      backgroundColor: colors.orange,
    },
    calcTypeIcon: {
      fontSize: 16,
      marginBottom: 2,
    },
    calcTypeLabel: {
      fontSize: 11,
      fontWeight: '600',
    },
    calcTypeLabelActive: {
      color: '#ffffff',
    },
    calcTypeLabelInactive: {
      color: colors.gray,
    },
    // Toggle Row
    toggleRow: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 3,
      backgroundColor: colors.iconButtonBg,
    },
    toggleButtonActive: {
      backgroundColor: colors.orange,
    },
    toggleText: {
      fontSize: 12,
      fontWeight: '600',
    },
    toggleTextActive: {
      color: '#ffffff',
    },
    toggleTextInactive: {
      color: colors.gray,
    },
    // Card
    card: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },
    // Input Row
    inputRow: {
      marginBottom: 12,
    },
    label: {
      fontSize: 11,
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
      fontSize: 18,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    inputUnit: {
      fontSize: 13,
      color: colors.orange,
      paddingRight: 12,
      fontWeight: '500',
    },
    heightRow: {
      flexDirection: 'row',
    },
    heightInput: {
      flex: 1,
      marginRight: 8,
    },
    // Results
    resultsCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 16,
    },
    mainResult: {
      alignItems: 'center',
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    mainResultLabel: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    mainResultValue: {
      fontSize: 40,
      fontWeight: '700',
      marginVertical: 4,
    },
    mainResultUnit: {
      fontSize: 13,
      color: colors.gray,
    },
    categoryBadge: {
      marginTop: 8,
      paddingVertical: 5,
      paddingHorizontal: 14,
      borderRadius: 16,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#ffffff',
    },
    secondaryResult: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
    },
    secondaryLabel: {
      fontSize: 13,
      color: colors.gray,
    },
    secondaryValue: {
      fontSize: 15,
      color: colors.white,
      fontWeight: '600',
    },
    // BMI Scale
    bmiScale: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.iconButtonBg,
    },
    bmiScaleRow: {
      flexDirection: 'row',
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 6,
    },
    bmiScaleSegment: {
      flex: 1,
    },
    bmiScaleLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bmiScaleLabel: {
      fontSize: 9,
      color: colors.gray,
    },
    // Ideal Weight Range
    rangeContainer: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.iconButtonBg,
    },
    rangeLabel: {
      fontSize: 11,
      color: colors.lightGray,
      marginBottom: 8,
      textAlign: 'center',
    },
    rangeBar: {
      height: 24,
      backgroundColor: colors.iconButtonBg,
      borderRadius: 12,
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    rangeText: {
      fontSize: 13,
      color: colors.white,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  const renderInputs = () => (
    <View style={styles.card}>
      {/* Unit System */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, unitSystem === 'metric' && styles.toggleButtonActive]}
          onPress={() => setUnitSystem('metric')}
        >
          <Text style={[styles.toggleText, unitSystem === 'metric' ? styles.toggleTextActive : styles.toggleTextInactive]}>
            kg / cm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, unitSystem === 'imperial' && styles.toggleButtonActive]}
          onPress={() => setUnitSystem('imperial')}
        >
          <Text style={[styles.toggleText, unitSystem === 'imperial' ? styles.toggleTextActive : styles.toggleTextInactive]}>
            lbs / ft-in
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gender (for BMR and Ideal) */}
      {(calcType === 'bmr' || calcType === 'ideal') && (
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleButton, gender === 'male' && styles.toggleButtonActive]}
            onPress={() => setGender('male')}
          >
            <Text style={[styles.toggleText, gender === 'male' ? styles.toggleTextActive : styles.toggleTextInactive]}>
              👨 Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, gender === 'female' && styles.toggleButtonActive]}
            onPress={() => setGender('female')}
          >
            <Text style={[styles.toggleText, gender === 'female' ? styles.toggleTextActive : styles.toggleTextInactive]}>
              👩 Female
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Age (for BMR) */}
      {calcType === 'bmr' && (
        <View style={styles.inputRow}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="25"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>years</Text>
          </View>
        </View>
      )}

      {/* Height */}
      <View style={styles.inputRow}>
        <Text style={styles.label}>Height</Text>
        {unitSystem === 'metric' ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="170"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>cm</Text>
          </View>
        ) : (
          <View style={styles.heightRow}>
            <View style={[styles.inputContainer, styles.heightInput]}>
              <TextInput
                style={styles.input}
                value={heightFt}
                onChangeText={setHeightFt}
                keyboardType="numeric"
                placeholder="5"
                placeholderTextColor={colors.gray}
              />
              <Text style={styles.inputUnit}>ft</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { width: 60 }]}
                value={heightIn}
                onChangeText={setHeightIn}
                keyboardType="numeric"
                placeholder="10"
                placeholderTextColor={colors.gray}
              />
              <Text style={styles.inputUnit}>in</Text>
            </View>
          </View>
        )}
      </View>

      {/* Weight (not needed for ideal weight calc) */}
      {calcType !== 'ideal' && (
        <View style={[styles.inputRow, { marginBottom: 0 }]}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="70"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>{unitSystem === 'metric' ? 'kg' : 'lbs'}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderBMIResult = () => (
    <View style={styles.resultsCard}>
      <View style={styles.mainResult}>
        <Text style={styles.mainResultLabel}>Your BMI</Text>
        <Text style={[styles.mainResultValue, { color: bmiCategory.color }]}>
          {bmi > 0 ? bmi.toFixed(1) : '0'}
        </Text>
        <Text style={styles.mainResultUnit}>kg/m²</Text>
        <View style={[styles.categoryBadge, { backgroundColor: bmiCategory.color }]}>
          <Text style={styles.categoryText}>{bmiCategory.label}</Text>
        </View>
      </View>
      <View style={styles.bmiScale}>
        <View style={styles.bmiScaleRow}>
          <View style={[styles.bmiScaleSegment, { backgroundColor: '#2196F3' }]} />
          <View style={[styles.bmiScaleSegment, { backgroundColor: '#4CAF50' }]} />
          <View style={[styles.bmiScaleSegment, { backgroundColor: '#FFC107' }]} />
          <View style={[styles.bmiScaleSegment, { backgroundColor: '#F44336' }]} />
        </View>
        <View style={styles.bmiScaleLabels}>
          <Text style={styles.bmiScaleLabel}>Under</Text>
          <Text style={styles.bmiScaleLabel}>Normal</Text>
          <Text style={styles.bmiScaleLabel}>Over</Text>
          <Text style={styles.bmiScaleLabel}>Obese</Text>
        </View>
      </View>
    </View>
  );

  const renderBMRResult = () => (
    <View style={styles.resultsCard}>
      <View style={styles.mainResult}>
        <Text style={styles.mainResultLabel}>Basal Metabolic Rate</Text>
        <Text style={[styles.mainResultValue, { color: colors.orange }]}>
          {bmr > 0 ? Math.round(bmr) : '0'}
        </Text>
        <Text style={styles.mainResultUnit}>calories/day</Text>
      </View>
      <View style={styles.secondaryResult}>
        <Text style={styles.secondaryLabel}>Sedentary (×1.2)</Text>
        <Text style={styles.secondaryValue}>{Math.round(bmr * 1.2)} cal</Text>
      </View>
      <View style={styles.secondaryResult}>
        <Text style={styles.secondaryLabel}>Light Active (×1.375)</Text>
        <Text style={styles.secondaryValue}>{Math.round(bmr * 1.375)} cal</Text>
      </View>
      <View style={styles.secondaryResult}>
        <Text style={styles.secondaryLabel}>Active (×1.55)</Text>
        <Text style={styles.secondaryValue}>{Math.round(bmr * 1.55)} cal</Text>
      </View>
      <View style={styles.secondaryResult}>
        <Text style={styles.secondaryLabel}>Very Active (×1.725)</Text>
        <Text style={styles.secondaryValue}>{Math.round(bmr * 1.725)} cal</Text>
      </View>
    </View>
  );

  const renderWaterResult = () => (
    <View style={styles.resultsCard}>
      <View style={styles.mainResult}>
        <Text style={styles.mainResultLabel}>Daily Water Intake</Text>
        <Text style={[styles.mainResultValue, { color: '#2196F3' }]}>
          {water > 0 ? water.toFixed(1) : '0'}
        </Text>
        <Text style={styles.mainResultUnit}>liters/day</Text>
      </View>
      <View style={styles.secondaryResult}>
        <Text style={styles.secondaryLabel}>In Glasses (250ml)</Text>
        <Text style={styles.secondaryValue}>{Math.round(water * 4)} glasses</Text>
      </View>
      <View style={styles.secondaryResult}>
        <Text style={styles.secondaryLabel}>In Bottles (500ml)</Text>
        <Text style={styles.secondaryValue}>{Math.round(water * 2)} bottles</Text>
      </View>
    </View>
  );

  const renderIdealResult = () => {
    const displayWeight = (kg: number) => {
      if (unitSystem === 'metric') {
        return `${kg.toFixed(1)} kg`;
      } else {
        return `${(kg * 2.20462).toFixed(1)} lbs`;
      }
    };

    return (
      <View style={styles.resultsCard}>
        <View style={styles.mainResult}>
          <Text style={styles.mainResultLabel}>Ideal Weight</Text>
          <Text style={[styles.mainResultValue, { color: '#4CAF50' }]}>
            {idealWeight.ideal > 0 ? displayWeight(idealWeight.ideal).split(' ')[0] : '0'}
          </Text>
          <Text style={styles.mainResultUnit}>{unitSystem === 'metric' ? 'kg' : 'lbs'}</Text>
        </View>
        <View style={styles.rangeContainer}>
          <Text style={styles.rangeLabel}>Healthy Weight Range (BMI 18.5-24.9)</Text>
          <View style={styles.rangeBar}>
            <Text style={styles.rangeText}>
              {idealWeight.min > 0 ? `${displayWeight(idealWeight.min)} - ${displayWeight(idealWeight.max)}` : '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Health Calculator</Text>

      {/* Calculation Type Selector */}
      <View style={styles.calcTypeRow}>
        {CALC_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[styles.calcTypeButton, calcType === type.value && styles.calcTypeButtonActive]}
            onPress={() => setCalcType(type.value)}
          >
            <Text style={styles.calcTypeIcon}>{type.icon}</Text>
            <Text style={[
              styles.calcTypeLabel,
              calcType === type.value ? styles.calcTypeLabelActive : styles.calcTypeLabelInactive
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inputs */}
      {renderInputs()}

      {/* Results */}
      {calcType === 'bmi' && renderBMIResult()}
      {calcType === 'bmr' && renderBMRResult()}
      {calcType === 'water' && renderWaterResult()}
      {calcType === 'ideal' && renderIdealResult()}
    </ScrollView>
  );
};
