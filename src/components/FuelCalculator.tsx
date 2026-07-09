import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { AdBanner } from '../ads/AdBanner';

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
  onTaskComplete?: () => void;
}

type UnitSystem = 'metric' | 'imperial';

export const FuelCalculator: React.FC<FuelCalculatorProps> = ({ colors, onTaskComplete }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [distance, setDistance] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');

  const handleInputChange = (setter: (val: string) => void) => (text: string) => {
    setter(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    headerLeft: {
      flex: 1,
    },
    eyebrow: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.white,
    },
    // Hero cost block
    heroCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 18,
      paddingVertical: 20,
      paddingHorizontal: 18,
      marginBottom: 12,
    },
    heroLabel: {
      fontSize: 12,
      color: colors.gray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    heroRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
    },
    heroValue: {
      fontSize: 40,
      color: colors.orange,
      fontWeight: '700',
    },
    heroSubStack: {
      alignItems: 'flex-end',
    },
    heroSubValue: {
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
    },
    heroSubLabel: {
      fontSize: 11,
      color: colors.lightGray,
      marginTop: 2,
    },
    // Unit Toggle
    unitToggle: {
      flexDirection: 'row',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
      padding: 4,
      marginBottom: 12,
    },
    unitButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    unitButtonActive: {
      backgroundColor: colors.orange,
    },
    unitButtonText: {
      fontSize: 12,
      fontWeight: '600',
    },
    unitButtonTextActive: {
      color: '#ffffff',
    },
    unitButtonTextInactive: {
      color: colors.gray,
    },
    // Input grid
    inputGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 12,
    },
    inputCard: {
      flexGrow: 1,
      flexBasis: '47%',
      backgroundColor: colors.panelBg,
      borderRadius: 14,
      padding: 12,
    },
    inputCardWide: {
      flexBasis: '100%',
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
    // Info
    infoText: {
      fontSize: 11,
      color: colors.lightGray,
      textAlign: 'left',
      marginTop: 4,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.eyebrow}>Trip Estimate</Text>
          <Text style={styles.title}>Fuel Cost</Text>
        </View>
      </View>

      {/* Hero result */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total Cost</Text>
        <View style={styles.heroRow}>
          <Text style={styles.heroValue}>${totalCost.toFixed(2)}</Text>
          <View style={styles.heroSubStack}>
            <Text style={styles.heroSubValue}>
              {fuelNeeded.toFixed(2)} {unitSystem === 'metric' ? 'L' : 'gal'}
            </Text>
            <Text style={styles.heroSubLabel}>fuel needed</Text>
          </View>
        </View>
      </View>

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

      {/* Inputs grid */}
      <View style={styles.inputGrid}>
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
          <Text style={styles.label}>Efficiency</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={fuelEfficiency}
              onChangeText={handleInputChange(setFuelEfficiency)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>{unitSystem === 'metric' ? 'L/100km' : 'MPG'}</Text>
          </View>
        </View>

        <View style={[styles.inputCard, styles.inputCardWide]}>
          <Text style={styles.label}>Fuel Price</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={fuelPrice}
              onChangeText={handleInputChange(setFuelPrice)}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputUnit}>{unitSystem === 'metric' ? '$/L' : '$/gal'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.infoText}>
        {unitSystem === 'metric'
          ? 'Enter consumption in Liters per 100 kilometers'
          : 'Enter efficiency in Miles per Gallon'}
      </Text>

      <View style={{ marginTop: 16 }}>
        <AdBanner size="banner" />
      </View>
    </View>
  );
};
