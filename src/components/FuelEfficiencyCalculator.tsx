import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { AdBanner } from '../ads/AdBanner';

interface FuelEfficiencyCalculatorProps {
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

type UnitSystem = 'metric' | 'imperial';

export const FuelEfficiencyCalculator: React.FC<FuelEfficiencyCalculatorProps> = ({ colors, onTaskComplete }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [distance, setDistance] = useState('');
  const [fuelUsed, setFuelUsed] = useState('');

  const handleInputChange = (setter: (val: string) => void) => (text: string) => {
    setter(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

  const distanceNum = parseFloat(distance) || 0;
  const fuelNum = parseFloat(fuelUsed) || 0;

  // Calculate efficiency
  const calculateEfficiency = () => {
    if (fuelNum === 0 || distanceNum === 0) {
      return { primary: 0, secondary: 0 };
    }

    if (unitSystem === 'metric') {
      // L/100km
      const lPer100km = (fuelNum / distanceNum) * 100;
      // Also show km/L
      const kmPerL = distanceNum / fuelNum;
      return { primary: lPer100km, secondary: kmPerL };
    } else {
      // MPG
      const mpg = distanceNum / fuelNum;
      // Also show gallons per 100 miles
      const galPer100mi = (fuelNum / distanceNum) * 100;
      return { primary: mpg, secondary: galPer100mi };
    }
  };

  const { primary, secondary } = calculateEfficiency();

  // Get efficiency rating
  const getEfficiencyRating = () => {
    if (primary === 0) return { label: '-', color: colors.gray };

    if (unitSystem === 'metric') {
      // L/100km - lower is better
      if (primary <= 5) return { label: 'Excellent', color: '#4CAF50' };
      if (primary <= 7) return { label: 'Good', color: '#8BC34A' };
      if (primary <= 9) return { label: 'Average', color: colors.orange };
      if (primary <= 12) return { label: 'Below Avg', color: '#FFC107' };
      return { label: 'Poor', color: '#F44336' };
    } else {
      // MPG - higher is better
      if (primary >= 40) return { label: 'Excellent', color: '#4CAF50' };
      if (primary >= 30) return { label: 'Good', color: '#8BC34A' };
      if (primary >= 25) return { label: 'Average', color: colors.orange };
      if (primary >= 18) return { label: 'Below Avg', color: '#FFC107' };
      return { label: 'Poor', color: '#F44336' };
    }
  };

  const rating = getEfficiencyRating();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 5,
      marginTop: 30,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.gray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    // Unit Toggle
    unitToggle: {
      flexDirection: 'row',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
      padding: 3,
    },
    unitButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    unitButtonActive: {
      backgroundColor: colors.orange,
    },
    unitButtonText: {
      fontSize: 11,
      fontWeight: '600',
    },
    unitButtonTextActive: {
      color: '#ffffff',
    },
    unitButtonTextInactive: {
      color: colors.gray,
    },
    // Hero result
    heroCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 18,
      paddingVertical: 22,
      paddingHorizontal: 20,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heroLeft: {
      flexShrink: 1,
    },
    mainResultLabel: {
      fontSize: 12,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    mainResultRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    mainResultValue: {
      fontSize: 48,
      fontWeight: '700',
      color: colors.orange,
    },
    mainResultUnit: {
      fontSize: 14,
      color: colors.gray,
      marginLeft: 6,
    },
    secondaryInline: {
      fontSize: 13,
      color: colors.gray,
      marginTop: 6,
    },
    ratingBadge: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#ffffff',
    },
    // Inputs
    inputsRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 12,
    },
    inputCard: {
      flex: 1,
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
    },
    label: {
      fontSize: 10,
      color: colors.lightGray,
      marginBottom: 8,
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
      minWidth: 0,
    },
    inputUnit: {
      fontSize: 13,
      color: colors.orange,
      paddingRight: 12,
      fontWeight: '500',
    },
    // Comparison
    comparisonCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
    },
    comparisonTitle: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    comparisonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    comparisonItem: {
      flexBasis: '47%',
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    comparisonIcon: {
      fontSize: 20,
      marginRight: 8,
    },
    comparisonTextCol: {
      alignItems: 'flex-start',
      flexShrink: 1,
    },
    comparisonValue: {
      fontSize: 15,
      color: colors.white,
      fontWeight: '700',
    },
    comparisonLabel: {
      fontSize: 11,
      color: colors.gray,
      marginTop: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Efficiency</Text>

        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, unitSystem === 'metric' && styles.unitButtonActive]}
            onPress={() => setUnitSystem('metric')}
          >
            <Text style={[
              styles.unitButtonText,
              unitSystem === 'metric' ? styles.unitButtonTextActive : styles.unitButtonTextInactive
            ]}>
              Metric
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unitSystem === 'imperial' && styles.unitButtonActive]}
            onPress={() => setUnitSystem('imperial')}
          >
            <Text style={[
              styles.unitButtonText,
              unitSystem === 'imperial' ? styles.unitButtonTextActive : styles.unitButtonTextInactive
            ]}>
              Imperial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Result */}
      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.mainResultLabel}>Your Fuel Efficiency</Text>
          <View style={styles.mainResultRow}>
            <Text style={styles.mainResultValue}>
              {primary > 0 ? primary.toFixed(1) : '0'}
            </Text>
            <Text style={styles.mainResultUnit}>
              {unitSystem === 'metric' ? 'L/100km' : 'MPG'}
            </Text>
          </View>
          <Text style={styles.secondaryInline}>
            {secondary > 0 ? secondary.toFixed(2) : '0'} {unitSystem === 'metric' ? 'km/L' : 'gal/100mi'}
            {'  ·  '}
            {unitSystem === 'metric' ? 'Kilometers per Liter' : 'Gallons per 100 mi'}
          </Text>
        </View>
        <View style={[styles.ratingBadge, { backgroundColor: rating.color }]}>
          <Text style={styles.ratingText}>{rating.label}</Text>
        </View>
      </View>

      {/* Inputs */}
      <View style={styles.inputsRow}>
        <View style={styles.inputCard}>
          <Text style={styles.label}>Distance</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={distance}
              onChangeText={handleInputChange(setDistance)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>{unitSystem === 'metric' ? 'km' : 'mi'}</Text>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Fuel Used</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={fuelUsed}
              onChangeText={handleInputChange(setFuelUsed)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>{unitSystem === 'metric' ? 'L' : 'gal'}</Text>
          </View>
        </View>
      </View>

      {/* Comparison Reference */}
      <View style={styles.comparisonCard}>
        <Text style={styles.comparisonTitle}>
          {unitSystem === 'metric' ? 'Reference (L/100km)' : 'Reference (MPG)'}
        </Text>
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonIcon}>🏍️</Text>
            <View style={styles.comparisonTextCol}>
              <Text style={styles.comparisonValue}>{unitSystem === 'metric' ? '3-4' : '45-60'}</Text>
              <Text style={styles.comparisonLabel}>Motorcycle</Text>
            </View>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonIcon}>🚗</Text>
            <View style={styles.comparisonTextCol}>
              <Text style={styles.comparisonValue}>{unitSystem === 'metric' ? '6-8' : '28-35'}</Text>
              <Text style={styles.comparisonLabel}>Sedan</Text>
            </View>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonIcon}>🚙</Text>
            <View style={styles.comparisonTextCol}>
              <Text style={styles.comparisonValue}>{unitSystem === 'metric' ? '9-12' : '20-25'}</Text>
              <Text style={styles.comparisonLabel}>SUV</Text>
            </View>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonIcon}>🚚</Text>
            <View style={styles.comparisonTextCol}>
              <Text style={styles.comparisonValue}>{unitSystem === 'metric' ? '12-16' : '15-20'}</Text>
              <Text style={styles.comparisonLabel}>Truck</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <AdBanner size="banner" />
      </View>
    </View>
  );
};
