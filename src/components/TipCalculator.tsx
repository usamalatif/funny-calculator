import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

interface TipCalculatorProps {
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

const TIP_PRESETS = [10, 15, 18, 20, 25];

export const TipCalculator: React.FC<TipCalculatorProps> = ({ colors }) => {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [splitCount, setSplitCount] = useState(1);

  const bill = parseFloat(billAmount) || 0;
  const tipAmount = bill * (tipPercent / 100);
  const totalAmount = bill + tipAmount;
  const perPerson = splitCount > 0 ? totalAmount / splitCount : totalAmount;

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
    card: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    // Bill Input
    inputSection: {
      marginBottom: 16,
    },
    label: {
      fontSize: 11,
      color: colors.lightGray,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    billInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 10,
      paddingHorizontal: 14,
    },
    currencySymbol: {
      fontSize: 22,
      color: colors.orange,
      fontWeight: '600',
      marginRight: 8,
    },
    billInput: {
      flex: 1,
      fontSize: 28,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 12,
    },
    // Tip Presets
    tipSection: {
      marginBottom: 16,
    },
    tipPresets: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tipButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 3,
    },
    tipButtonActive: {
      backgroundColor: colors.orange,
    },
    tipButtonInactive: {
      backgroundColor: colors.iconButtonBg,
    },
    tipButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    tipButtonTextActive: {
      color: '#ffffff',
    },
    tipButtonTextInactive: {
      color: colors.gray,
    },
    // Custom Tip
    customTipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    customTipLabel: {
      fontSize: 13,
      color: colors.gray,
      marginRight: 10,
    },
    customTipInput: {
      backgroundColor: colors.iconButtonBg,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      width: 70,
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
      textAlign: 'center',
    },
    percentSymbol: {
      fontSize: 14,
      color: colors.gray,
      marginLeft: 4,
    },
    // Split Section
    splitSection: {
      marginBottom: 8,
    },
    splitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    splitButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.iconButtonBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    splitButtonText: {
      fontSize: 24,
      color: colors.orange,
      fontWeight: '300',
    },
    splitValue: {
      fontSize: 28,
      color: colors.white,
      fontWeight: '600',
      marginHorizontal: 20,
      minWidth: 40,
      textAlign: 'center',
    },
    splitLabel: {
      fontSize: 12,
      color: colors.gray,
      textAlign: 'center',
      marginTop: 4,
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
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    resultRowLast: {
      borderBottomWidth: 0,
      paddingTop: 12,
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
      fontSize: 24,
      color: colors.orange,
      fontWeight: '700',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tip Calculator</Text>

      <View style={styles.card}>
        {/* Bill Amount */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Bill Amount</Text>
          <View style={styles.billInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.billInput}
              value={billAmount}
              onChangeText={setBillAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.gray}
            />
          </View>
        </View>

        {/* Tip Percentage */}
        <View style={styles.tipSection}>
          <Text style={styles.label}>Tip Percentage</Text>
          <View style={styles.tipPresets}>
            {TIP_PRESETS.map((percent) => (
              <TouchableOpacity
                key={percent}
                style={[
                  styles.tipButton,
                  tipPercent === percent ? styles.tipButtonActive : styles.tipButtonInactive,
                ]}
                onPress={() => setTipPercent(percent)}
              >
                <Text
                  style={[
                    styles.tipButtonText,
                    tipPercent === percent ? styles.tipButtonTextActive : styles.tipButtonTextInactive,
                  ]}
                >
                  {percent}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.customTipRow}>
            <Text style={styles.customTipLabel}>Custom:</Text>
            <TextInput
              style={styles.customTipInput}
              value={String(tipPercent)}
              onChangeText={(val) => setTipPercent(parseInt(val) || 0)}
              keyboardType="numeric"
            />
            <Text style={styles.percentSymbol}>%</Text>
          </View>
        </View>

        {/* Split */}
        <View style={styles.splitSection}>
          <Text style={styles.label}>Split Between</Text>
          <View style={styles.splitRow}>
            <TouchableOpacity
              style={styles.splitButton}
              onPress={() => setSplitCount(Math.max(1, splitCount - 1))}
            >
              <Text style={styles.splitButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.splitValue}>{splitCount}</Text>
            <TouchableOpacity
              style={styles.splitButton}
              onPress={() => setSplitCount(splitCount + 1)}
            >
              <Text style={styles.splitButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.splitLabel}>
            {splitCount === 1 ? 'person' : 'people'}
          </Text>
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsCard}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Tip Amount</Text>
          <Text style={styles.resultValue}>${tipAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Total</Text>
          <Text style={styles.resultValue}>${totalAmount.toFixed(2)}</Text>
        </View>
        <View style={[styles.resultRow, styles.resultRowLast]}>
          <Text style={styles.resultLabel}>Per Person</Text>
          <Text style={styles.resultValueHighlight}>${perPerson.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};
