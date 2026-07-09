import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { AdBanner } from '../ads/AdBanner';

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
  onTaskComplete?: () => void;
}

const TIP_PRESETS = [10, 15, 18, 20, 25];

export const TipCalculator: React.FC<TipCalculatorProps> = ({ colors, onTaskComplete }) => {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [splitCount, setSplitCount] = useState(1);

  const handleBillChange = (text: string) => {
    setBillAmount(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

  const bill = parseFloat(billAmount) || 0;
  const tipAmount = bill * (tipPercent / 100);
  const totalAmount = bill + tipAmount;
  const perPerson = splitCount > 0 ? totalAmount / splitCount : totalAmount;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 14,
      marginTop: 24,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    headerBadge: {
      fontSize: 12,
      color: colors.gray,
    },
    heroCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 18,
      marginBottom: 10,
    },
    heroTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
    heroMain: {
      flexShrink: 1,
      marginRight: 10,
    },
    heroLabel: {
      fontSize: 12,
      color: colors.gray,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 2,
    },
    heroValue: {
      fontSize: 40,
      color: colors.orange,
      fontWeight: '700',
      flexShrink: 1,
    },
    twoColRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 10,
    },
    card: {
      backgroundColor: colors.panelBg,
      borderRadius: 18,
      padding: 14,
    },
    billCard: {
      flex: 1.2,
    },
    splitCard: {
      flex: 1,
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 10,
      color: colors.lightGray,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    billInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 12,
      paddingHorizontal: 12,
    },
    currencySymbol: {
      fontSize: 20,
      color: colors.orange,
      fontWeight: '600',
      marginRight: 6,
    },
    billInput: {
      flex: 1,
      fontSize: 24,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 10,
    },
    splitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    splitButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.iconButtonBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    splitButtonText: {
      fontSize: 18,
      color: colors.orange,
      fontWeight: '300',
    },
    splitValue: {
      fontSize: 22,
      color: colors.white,
      fontWeight: '600',
      marginHorizontal: 14,
      minWidth: 26,
      textAlign: 'center',
    },
    splitLabel: {
      fontSize: 11,
      color: colors.gray,
      textAlign: 'center',
      marginTop: 6,
    },
    tipCard: {
      marginBottom: 10,
    },
    tipHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    customTipRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    customTipLabel: {
      fontSize: 12,
      color: colors.gray,
      marginRight: 8,
    },
    customTipInput: {
      backgroundColor: colors.iconButtonBg,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
      width: 54,
      fontSize: 14,
      color: colors.white,
      fontWeight: '600',
      textAlign: 'center',
    },
    percentSymbol: {
      fontSize: 13,
      color: colors.gray,
      marginLeft: 4,
    },
    tipPresets: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tipButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
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
    resultsCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 18,
      paddingVertical: 6,
      paddingHorizontal: 14,
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
    },
    resultLabel: {
      fontSize: 13,
      color: colors.gray,
    },
    resultValue: {
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tip Calculator</Text>
        <Text style={styles.headerBadge}>
          {splitCount === 1 ? '1 person' : `${splitCount} people`}
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroMain}>
            <Text style={styles.heroLabel}>Per Person</Text>
            <Text
              style={styles.heroValue}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.4}
            >
              ${perPerson.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.twoColRow}>
        <View style={[styles.card, styles.billCard]}>
          <Text style={styles.label}>Bill Amount</Text>
          <View style={styles.billInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.billInput}
              value={billAmount}
              onChangeText={handleBillChange}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.gray}
            />
          </View>
        </View>

        <View style={[styles.card, styles.splitCard]}>
          <Text style={styles.label}>Split</Text>
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

      <View style={[styles.card, styles.tipCard]}>
        <View style={styles.tipHeaderRow}>
          <Text style={styles.label}>Tip Percentage</Text>
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
      </View>

      <View style={styles.resultsCard}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Tip Amount</Text>
          <Text style={styles.resultValue}>${tipAmount.toFixed(2)}</Text>
        </View>
        <View style={[styles.resultRow, styles.resultRowLast]}>
          <Text style={styles.resultLabel}>Total</Text>
          <Text style={styles.resultValue}>${totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <AdBanner size="banner" />
      </View>
    </View>
  );
};
