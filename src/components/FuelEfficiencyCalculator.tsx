import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

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
}

type UnitSystem = 'metric' | 'imperial';

export const FuelEfficiencyCalculator: React.FC<FuelEfficiencyCalculatorProps> = ({ colors }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [distance, setDistance] = useState('');
  const [fuelUsed, setFuelUsed] = useState('');

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
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 12,
      textAlign: 'center',
    },
    // Unit Toggle
    unitToggle: {
      flexDirection: 'row',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
      padding: 4,
      marginBottom: 15,
    },
    unitButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    unitButtonActive: {
      backgroundColor: colors.orange,
    },
    unitButtonText: {
      fontSize: 13,
      fontWeight: '600',
    },
    unitButtonTextActive: {
      color: '#ffffff',
    },
    unitButtonTextInactive: {
      color: colors.gray,
    },
    // Card
    card: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    // Input Row
    inputRow: {
      marginBottom: 14,
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
      fontSize: 20,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    inputUnit: {
      fontSize: 14,
      color: colors.orange,
      paddingRight: 14,
      fontWeight: '500',
    },
    // Results
    resultsCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 16,
    },
    mainResult: {
      alignItems: 'center',
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    mainResultLabel: {
      fontSize: 12,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    mainResultValue: {
      fontSize: 42,
      fontWeight: '700',
      color: colors.orange,
      marginVertical: 4,
    },
    mainResultUnit: {
      fontSize: 14,
      color: colors.gray,
    },
    ratingBadge: {
      marginTop: 10,
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    ratingText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#ffffff',
    },
    secondaryResult: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 14,
    },
    secondaryLabel: {
      fontSize: 14,
      color: colors.gray,
    },
    secondaryValue: {
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
    },
    // Comparison
    comparisonCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
      marginTop: 12,
    },
    comparisonTitle: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
      textAlign: 'center',
    },
    comparisonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    comparisonItem: {
      alignItems: 'center',
    },
    comparisonIcon: {
      fontSize: 20,
      marginBottom: 4,
    },
    comparisonValue: {
      fontSize: 12,
      color: colors.white,
      fontWeight: '600',
    },
    comparisonLabel: {
      fontSize: 10,
      color: colors.gray,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fuel Efficiency Calculator</Text>

      {/* Unit System Toggle */}
      <View style={styles.unitToggle}>
        <TouchableOpacity
          style={[styles.unitButton, unitSystem === 'metric' && styles.unitButtonActive]}
          onPress={() => setUnitSystem('metric')}
        >
          <Text style={[
            styles.unitButtonText,
            unitSystem === 'metric' ? styles.unitButtonTextActive : styles.unitButtonTextInactive
          ]}>
            Metric (L/100km)
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
            Imperial (MPG)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {/* Distance */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Distance Traveled</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>{unitSystem === 'metric' ? 'km' : 'mi'}</Text>
          </View>
        </View>

        {/* Fuel Used */}
        <View style={[styles.inputRow, { marginBottom: 0 }]}>
          <Text style={styles.label}>Fuel Used</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={fuelUsed}
              onChangeText={setFuelUsed}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>{unitSystem === 'metric' ? 'L' : 'gal'}</Text>
          </View>
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsCard}>
        <View style={styles.mainResult}>
          <Text style={styles.mainResultLabel}>Your Fuel Efficiency</Text>
          <Text style={styles.mainResultValue}>
            {primary > 0 ? primary.toFixed(1) : '0'}
          </Text>
          <Text style={styles.mainResultUnit}>
            {unitSystem === 'metric' ? 'L/100km' : 'MPG'}
          </Text>
          <View style={[styles.ratingBadge, { backgroundColor: rating.color }]}>
            <Text style={styles.ratingText}>{rating.label}</Text>
          </View>
        </View>

        <View style={styles.secondaryResult}>
          <Text style={styles.secondaryLabel}>
            {unitSystem === 'metric' ? 'Kilometers per Liter' : 'Gallons per 100 mi'}
          </Text>
          <Text style={styles.secondaryValue}>
            {secondary > 0 ? secondary.toFixed(2) : '0'} {unitSystem === 'metric' ? 'km/L' : 'gal'}
          </Text>
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
            <Text style={styles.comparisonValue}>{unitSystem === 'metric' ? '3-4' : '45-60'}</Text>
            <Text style={styles.comparisonLabel}>Motorcycle</Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonIcon}>🚗</Text>
            <Text style={styles.comparisonValue}>{unitSystem === 'metric' ? '6-8' : '28-35'}</Text>
            <Text style={styles.comparisonLabel}>Sedan</Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonIcon}>🚙</Text>
            <Text style={styles.comparisonValue}>{unitSystem === 'metric' ? '9-12' : '20-25'}</Text>
            <Text style={styles.comparisonLabel}>SUV</Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonIcon}>🚚</Text>
            <Text style={styles.comparisonValue}>{unitSystem === 'metric' ? '12-16' : '15-20'}</Text>
            <Text style={styles.comparisonLabel}>Truck</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
