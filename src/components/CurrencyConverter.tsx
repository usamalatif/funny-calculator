import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

interface CurrencyConverterProps {
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

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
];

// Static exchange rates (relative to USD) - updated approximations
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.15,
  BRL: 4.97,
  KRW: 1298.50,
  SGD: 1.34,
  HKD: 7.82,
  SEK: 10.42,
  NOK: 10.65,
  NZD: 1.64,
  ZAR: 18.65,
  RUB: 89.50,
  AED: 3.67,
  PKR: 278.50,
  SAR: 3.75,
  TRY: 29.15,
  THB: 35.50,
};

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ colors, onTaskComplete }) => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleAmountChange = (text: string) => {
    setAmount(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

  const amountNum = parseFloat(amount) || 0;

  // Convert amount
  const convert = (value: number, from: string, to: string): number => {
    const fromRate = EXCHANGE_RATES[from] || 1;
    const toRate = EXCHANGE_RATES[to] || 1;
    // Convert to USD first, then to target currency
    const inUSD = value / fromRate;
    return inUSD * toRate;
  };

  const convertedAmount = convert(amountNum, fromCurrency, toCurrency);
  const exchangeRate = convert(1, fromCurrency, toCurrency);
  const inverseRate = convert(1, toCurrency, fromCurrency);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const getCurrency = (code: string): Currency => {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  };

  const fromCurrencyData = getCurrency(fromCurrency);
  const toCurrencyData = getCurrency(toCurrency);

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1000000) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return num.toFixed(decimals);
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
    // Card
    card: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },
    // Currency Input Section
    currencySection: {
      marginBottom: 16,
    },
    label: {
      fontSize: 11,
      color: colors.lightGray,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    currencyRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    currencySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginRight: 10,
      minWidth: 110,
    },
    currencyFlag: {
      fontSize: 22,
      marginRight: 8,
    },
    currencyCode: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.white,
    },
    currencyArrow: {
      fontSize: 12,
      color: colors.gray,
      marginLeft: 6,
    },
    inputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
    },
    inputPrefix: {
      fontSize: 16,
      color: colors.orange,
      paddingLeft: 12,
      fontWeight: '600',
    },
    input: {
      flex: 1,
      fontSize: 22,
      color: colors.white,
      fontWeight: '700',
      paddingVertical: 10,
      paddingHorizontal: 8,
      textAlign: 'right',
    },
    // Swap Button
    swapContainer: {
      alignItems: 'center',
      marginVertical: 4,
    },
    swapButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.orange,
      justifyContent: 'center',
      alignItems: 'center',
    },
    swapIcon: {
      fontSize: 20,
      color: '#ffffff',
    },
    // Result Section
    resultSection: {
      marginTop: 4,
    },
    resultValue: {
      fontSize: 18,
      color: colors.white,
      fontWeight: '600',
      textAlign: 'right',
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
    },
    // Exchange Rate Info
    rateCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },
    rateTitle: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    rateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    rateLabel: {
      fontSize: 13,
      color: colors.gray,
    },
    rateValue: {
      fontSize: 14,
      color: colors.white,
      fontWeight: '600',
    },
    // Disclaimer
    disclaimer: {
      backgroundColor: colors.panelBg,
      borderRadius: 12,
      padding: 12,
    },
    disclaimerText: {
      fontSize: 10,
      color: colors.gray,
      textAlign: 'center',
      lineHeight: 14,
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
      width: '85%',
      maxHeight: 400,
      overflow: 'hidden',
    },
    pickerHeader: {
      paddingVertical: 12,
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
      maxHeight: 340,
    },
    pickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    pickerItemSelected: {
      backgroundColor: 'rgba(245,166,35,0.15)',
    },
    pickerItemFlag: {
      fontSize: 22,
      marginRight: 12,
    },
    pickerItemContent: {
      flex: 1,
    },
    pickerItemCode: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.white,
    },
    pickerItemName: {
      fontSize: 12,
      color: colors.gray,
      marginTop: 2,
    },
  });

  const CurrencyPicker = ({ visible, onClose, selected, onSelect, title }: {
    visible: boolean;
    onClose: () => void;
    selected: string;
    onSelect: (code: string) => void;
    title: string;
  }) => {
    if (!visible) return null;
    return (
      <TouchableOpacity
        style={styles.pickerOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{title}</Text>
          </View>
          <ScrollView style={styles.pickerList}>
            {CURRENCIES.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.pickerItem,
                  selected === currency.code && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  onSelect(currency.code);
                  onClose();
                }}
              >
                <Text style={styles.pickerItemFlag}>{currency.flag}</Text>
                <View style={styles.pickerItemContent}>
                  <Text style={styles.pickerItemCode}>{currency.code}</Text>
                  <Text style={styles.pickerItemName}>{currency.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Currency Converter</Text>

      <View style={styles.card}>
        {/* From Currency */}
        <View style={styles.currencySection}>
          <Text style={styles.label}>From</Text>
          <View style={styles.currencyRow}>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setShowFromPicker(true)}
            >
              <Text style={styles.currencyFlag}>{fromCurrencyData.flag}</Text>
              <Text style={styles.currencyCode}>{fromCurrency}</Text>
              <Text style={styles.currencyArrow}>▼</Text>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPrefix}>{fromCurrencyData.symbol}</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.gray}
              />
            </View>
          </View>
        </View>

        {/* Swap Button */}
        <View style={styles.swapContainer}>
          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>
        </View>

        {/* To Currency */}
        <View style={styles.currencySection}>
          <Text style={styles.label}>To</Text>
          <View style={styles.currencyRow}>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setShowToPicker(true)}
            >
              <Text style={styles.currencyFlag}>{toCurrencyData.flag}</Text>
              <Text style={styles.currencyCode}>{toCurrency}</Text>
              <Text style={styles.currencyArrow}>▼</Text>
            </TouchableOpacity>
            <View style={[styles.inputContainer, { backgroundColor: 'transparent' }]}>
              <Text style={[styles.resultValue, { flex: 1 }]}>
                {toCurrencyData.symbol} {formatNumber(convertedAmount)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Exchange Rate Info */}
      <View style={styles.rateCard}>
        <Text style={styles.rateTitle}>Exchange Rate</Text>
        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>1 {fromCurrency}</Text>
          <Text style={styles.rateValue}>
            {toCurrencyData.symbol} {formatNumber(exchangeRate, 4)}
          </Text>
        </View>
        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>1 {toCurrency}</Text>
          <Text style={styles.rateValue}>
            {fromCurrencyData.symbol} {formatNumber(inverseRate, 4)}
          </Text>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Exchange rates are approximate and for reference only.
          Actual rates may vary. Last updated: Static rates.
        </Text>
      </View>

      <CurrencyPicker
        visible={showFromPicker}
        onClose={() => setShowFromPicker(false)}
        selected={fromCurrency}
        onSelect={setFromCurrency}
        title="Select Currency"
      />
      <CurrencyPicker
        visible={showToPicker}
        onClose={() => setShowToPicker(false)}
        selected={toCurrency}
        onSelect={setToCurrency}
        title="Select Currency"
      />
    </ScrollView>
  );
};
