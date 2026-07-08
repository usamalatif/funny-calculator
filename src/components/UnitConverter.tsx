import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';

interface UnitConverterProps {
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

type UnitCategory = 'length' | 'weight' | 'temp' | 'volume' | 'area' | 'speed';

interface UnitOption {
  label: string;
  value: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const UNITS: Record<UnitCategory, UnitOption[]> = {
  length: [
    { label: 'Meter', value: 'm', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Kilometer', value: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: 'Centimeter', value: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: 'Mile', value: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { label: 'Foot', value: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: 'Inch', value: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { label: 'Kilogram', value: 'kg', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Gram', value: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: 'Pound', value: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { label: 'Ounce', value: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { label: 'Ton', value: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  ],
  temp: [
    { label: 'Celsius', value: '°C', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Fahrenheit', value: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    { label: 'Kelvin', value: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { label: 'Liter', value: 'L', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Milliliter', value: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: 'Gallon', value: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { label: 'Cup', value: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
  ],
  area: [
    { label: 'Sq Meter', value: 'm²', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Sq Km', value: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { label: 'Sq Foot', value: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { label: 'Acre', value: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { label: 'Hectare', value: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  ],
  speed: [
    { label: 'M/s', value: 'm/s', toBase: (v) => v, fromBase: (v) => v },
    { label: 'Km/h', value: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { label: 'Mph', value: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { label: 'Knot', value: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  ],
};

interface IconProps {
  color: string;
  size: number;
}

const LengthIcon: React.FC<IconProps> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="9" width="20" height="6" rx="1.5" stroke={color} strokeWidth={1.8} />
    <Line x1="6" y1="9" x2="6" y2="12" stroke={color} strokeWidth={1.8} />
    <Line x1="10" y1="9" x2="10" y2="12" stroke={color} strokeWidth={1.8} />
    <Line x1="14" y1="9" x2="14" y2="12" stroke={color} strokeWidth={1.8} />
    <Line x1="18" y1="9" x2="18" y2="12" stroke={color} strokeWidth={1.8} />
  </Svg>
);

const WeightIcon: React.FC<IconProps> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="4" x2="12" y2="18" stroke={color} strokeWidth={1.8} />
    <Line x1="5" y1="7" x2="19" y2="7" stroke={color} strokeWidth={1.8} />
    <Path d="M2 7 L5 13 L8 7 Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <Path d="M16 7 L19 13 L22 7 Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <Path d="M8 20 H16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M9 18 H15 L14 20 H10 Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
  </Svg>
);

const TempIcon: React.FC<IconProps> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 15.5V4.5a1.5 1.5 0 0 0-3 0v11a3.5 3.5 0 1 0 3 0Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Circle cx="11.5" cy="17" r="1.4" fill={color} />
  </Svg>
);

const VolumeIcon: React.FC<IconProps> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 3 H16 L15 20 a1 1 0 0 1 -1 1 H10 a1 1 0 0 1 -1 -1 Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <Line x1="7.5" y1="9" x2="16.5" y2="9" stroke={color} strokeWidth={1.8} />
  </Svg>
);

const AreaIcon: React.FC<IconProps> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="16" rx="1.5" stroke={color} strokeWidth={1.8} />
    <Line x1="4" y1="16" x2="8" y2="16" stroke={color} strokeWidth={1.8} />
    <Line x1="16" y1="4" x2="16" y2="8" stroke={color} strokeWidth={1.8} />
  </Svg>
);

const SpeedIcon: React.FC<IconProps> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="13" r="8" stroke={color} strokeWidth={1.8} />
    <Path d="M12 13 L16 9" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx="12" cy="13" r="1.3" fill={color} />
    <Line x1="12" y1="3" x2="12" y2="5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const CATEGORIES: { label: string; Icon: React.FC<IconProps>; value: UnitCategory }[] = [
  { label: 'Length', Icon: LengthIcon, value: 'length' },
  { label: 'Weight', Icon: WeightIcon, value: 'weight' },
  { label: 'Temp', Icon: TempIcon, value: 'temp' },
  { label: 'Volume', Icon: VolumeIcon, value: 'volume' },
  { label: 'Area', Icon: AreaIcon, value: 'area' },
  { label: 'Speed', Icon: SpeedIcon, value: 'speed' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const UnitConverter: React.FC<UnitConverterProps> = ({ colors, onTaskComplete }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [inputValue, setInputValue] = useState('1');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const units = UNITS[category];
  const from = units[fromUnit];
  const to = units[toUnit];

  const convert = (): string => {
    const val = parseFloat(inputValue) || 0;
    const baseValue = from.toBase(val);
    const result = to.fromBase(baseValue);
    if (Math.abs(result) < 0.000001 && result !== 0) {
      return result.toExponential(2);
    }
    return result.toFixed(6).replace(/\.?0+$/, '');
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    onTaskComplete?.();
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 5,
      marginTop: 30,
    },
    // Category Grid - 3x2
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    categoryItem: {
      width: '31%',
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryItemActive: {
      backgroundColor: colors.orange,
    },
    categoryItemInactive: {
      backgroundColor: colors.iconButtonBg,
    },
    categoryIcon: {
      marginBottom: 4,
    },
    categoryLabel: {
      fontSize: 11,
      fontWeight: '600',
    },
    categoryLabelActive: {
      color: '#ffffff',
    },
    categoryLabelInactive: {
      color: colors.gray,
    },
    // Category Title
    categoryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 12,
      textAlign: 'center',
    },
    // Conversion Section
    conversionSection: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 16,
    },
    // Input Row
    inputRow: {
      marginBottom: 12,
    },
    rowLabel: {
      fontSize: 11,
      color: colors.lightGray,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    rowContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    unitDropdown: {
      backgroundColor: colors.iconButtonBg,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 10,
      marginRight: 10,
      minWidth: 100,
    },
    unitDropdownText: {
      fontSize: 15,
      color: colors.white,
      fontWeight: '500',
    },
    unitDropdownSymbol: {
      fontSize: 12,
      color: colors.orange,
      marginTop: 2,
    },
    valueInput: {
      flex: 1,
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontSize: 22,
      color: colors.white,
      fontWeight: '600',
      textAlign: 'right',
    },
    // Swap Button
    swapRow: {
      alignItems: 'center',
      marginVertical: 8,
    },
    swapBtn: {
      backgroundColor: colors.orange,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    swapIcon: {
      fontSize: 18,
      color: '#ffffff',
    },
    // Result Row
    resultRow: {
      marginTop: 4,
    },
    resultContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    resultDisplay: {
      flex: 1,
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    resultValue: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.orange,
      textAlign: 'right',
    },
    resultUnit: {
      fontSize: 12,
      color: colors.lightGray,
      textAlign: 'right',
      marginTop: 2,
    },
    // Picker Modal
    pickerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
    pickerContainer: {
      backgroundColor: colors.panelBg,
      borderRadius: 14,
      width: SCREEN_WIDTH * 0.75,
      maxHeight: 350,
      overflow: 'hidden',
    },
    pickerHeader: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    pickerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
      textAlign: 'center',
    },
    pickerList: {
      maxHeight: 280,
    },
    pickerItem: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    pickerItemSelected: {
      backgroundColor: 'rgba(245,166,35,0.15)',
    },
    pickerItemText: {
      fontSize: 15,
      color: colors.white,
    },
    pickerItemSymbol: {
      fontSize: 13,
      color: colors.orange,
    },
  });

  const UnitPicker = ({
    visible,
    onClose,
    selectedIndex,
    onSelect,
    title,
  }: {
    visible: boolean;
    onClose: () => void;
    selectedIndex: number;
    onSelect: (index: number) => void;
    title: string;
  }) => {
    if (!visible) return null;
    return (
      <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{title}</Text>
          </View>
          <ScrollView style={styles.pickerList}>
            {units.map((unit, index) => (
              <TouchableOpacity
                key={unit.value}
                style={[styles.pickerItem, index === selectedIndex && styles.pickerItemSelected]}
                onPress={() => {
                  onSelect(index);
                  onClose();
                }}
              >
                <Text style={styles.pickerItemText}>{unit.label}</Text>
                <Text style={styles.pickerItemSymbol}>{unit.value}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Category Grid */}
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.categoryItem,
              category === cat.value ? styles.categoryItemActive : styles.categoryItemInactive,
            ]}
            onPress={() => {
              setCategory(cat.value);
              setFromUnit(0);
              setToUnit(1);
            }}
          >
            <View style={styles.categoryIcon}>
              <cat.Icon
                color={category === cat.value ? '#ffffff' : colors.gray}
                size={20}
              />
            </View>
            <Text
              style={[
                styles.categoryLabel,
                category === cat.value ? styles.categoryLabelActive : styles.categoryLabelInactive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Title */}
      <Text style={styles.categoryTitle}>
        {CATEGORIES.find(c => c.value === category)?.label} Converter
      </Text>

      {/* Conversion Section */}
      <View style={styles.conversionSection}>
        {/* From */}
        <View style={styles.inputRow}>
          <Text style={styles.rowLabel}>From</Text>
          <View style={styles.rowContent}>
            <TouchableOpacity
              style={styles.unitDropdown}
              onPress={() => setShowFromPicker(true)}
            >
              <Text style={styles.unitDropdownText}>{from.label}</Text>
              <Text style={styles.unitDropdownSymbol}>{from.value}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.valueInput}
              value={inputValue}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
          </View>
        </View>

        {/* Swap */}
        <View style={styles.swapRow}>
          <TouchableOpacity style={styles.swapBtn} onPress={swapUnits}>
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>
        </View>

        {/* To */}
        <View style={styles.resultRow}>
          <Text style={styles.rowLabel}>To</Text>
          <View style={styles.rowContent}>
            <TouchableOpacity
              style={styles.unitDropdown}
              onPress={() => setShowToPicker(true)}
            >
              <Text style={styles.unitDropdownText}>{to.label}</Text>
              <Text style={styles.unitDropdownSymbol}>{to.value}</Text>
            </TouchableOpacity>
            <View style={styles.resultDisplay}>
              <Text style={styles.resultValue}>{convert()}</Text>
              <Text style={styles.resultUnit}>{to.label}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Pickers */}
      <UnitPicker
        visible={showFromPicker}
        onClose={() => setShowFromPicker(false)}
        selectedIndex={fromUnit}
        onSelect={setFromUnit}
        title="Select Source Unit"
      />
      <UnitPicker
        visible={showToPicker}
        onClose={() => setShowToPicker(false)}
        selectedIndex={toUnit}
        onSelect={setToUnit}
        title="Select Target Unit"
      />
    </View>
  );
};
