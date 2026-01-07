import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

interface FuelCalculatorProps {
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

export const FuelCalculator: React.FC<FuelCalculatorProps> = ({ colors }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [distance, setDistance] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');

  const distanceNum = parseFloat(distance) || 0;
  const efficiencyNum = parseFloat(fuelEfficiency) || 0;
  const priceNum = parseFloat(fuelPrice) || 0;

  // Calculate fuel needed and cost
  const calculateFuel = () => {
    if (efficiencyNum === 0) return { fuelNeeded: 0, totalCost: 0 };

    let fuelNeeded: number;
    if (unitSystem === 'metric') {
      // L/100km: fuel = (distance / 100) * efficiency
      fuelNeeded = (distanceNum / 100) * efficiencyNum;
    } else {
      // MPG: fuel = distance / efficiency
      fuelNeeded = distanceNum / efficiencyNum;
    }

    const totalCost = fuelNeeded * priceNum;
    return { fuelNeeded, totalCost };
  };

  const { fuelNeeded, totalCost } = calculateFuel();

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
    resultRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    resultRowLast: {
      borderBottomWidth: 0,
      paddingTop: 14,
    },
    resultLabel: {
      fontSize: 14,
      color: colors.gray,
    },
    resultValue: {
      fontSize: 18,
      color: colors.white,
      fontWeight: '600',
    },
    resultValueHighlight: {
      fontSize: 26,
      color: colors.orange,
      fontWeight: '700',
    },
    // Info
    infoText: {
      fontSize: 11,
      color: colors.lightGray,
      textAlign: 'center',
      marginTop: 12,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fuel Cost Calculator</Text>

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
            Metric (km, L)
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
            Imperial (mi, gal)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {/* Distance */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Distance</Text>
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

        {/* Fuel Efficiency */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Fuel Efficiency</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={fuelEfficiency}
              onChangeText={setFuelEfficiency}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>{unitSystem === 'metric' ? 'L/100km' : 'MPG'}</Text>
          </View>
        </View>

        {/* Fuel Price */}
        <View style={[styles.inputRow, { marginBottom: 0 }]}>
          <Text style={styles.label}>Fuel Price</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={fuelPrice}
              onChangeText={setFuelPrice}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>{unitSystem === 'metric' ? '$/L' : '$/gal'}</Text>
          </View>
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsCard}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Fuel Needed</Text>
          <Text style={styles.resultValue}>
            {fuelNeeded.toFixed(2)} {unitSystem === 'metric' ? 'L' : 'gal'}
          </Text>
        </View>
        <View style={[styles.resultRow, styles.resultRowLast]}>
          <Text style={styles.resultLabel}>Total Cost</Text>
          <Text style={styles.resultValueHighlight}>${totalCost.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.infoText}>
        {unitSystem === 'metric'
          ? 'Enter consumption in Liters per 100 kilometers'
          : 'Enter efficiency in Miles per Gallon'}
      </Text>
    </View>
  );
};
