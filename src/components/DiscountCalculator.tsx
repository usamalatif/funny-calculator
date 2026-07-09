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

interface DiscountCalculatorProps {
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

const QUICK_DISCOUNTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75];

export const DiscountCalculator: React.FC<DiscountCalculatorProps> = ({ colors, onTaskComplete }) => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [secondDiscount, setSecondDiscount] = useState('');
  const [taxPercent, setTaxPercent] = useState('');

  const handleInputChange = (setter: (val: string) => void) => (text: string) => {
    setter(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

  const price = parseFloat(originalPrice) || 0;
  const discount1 = parseFloat(discountPercent) || 0;
  const discount2 = parseFloat(secondDiscount) || 0;
  const tax = parseFloat(taxPercent) || 0;

  // Calculate discounts
  const discountAmount1 = price * (discount1 / 100);
  const priceAfterDiscount1 = price - discountAmount1;

  const discountAmount2 = priceAfterDiscount1 * (discount2 / 100);
  const priceAfterDiscount2 = priceAfterDiscount1 - discountAmount2;

  const totalDiscount = discountAmount1 + discountAmount2;
  const totalDiscountPercent = price > 0 ? (totalDiscount / price) * 100 : 0;

  const taxAmount = priceAfterDiscount2 * (tax / 100);
  const finalPrice = priceAfterDiscount2 + taxAmount;

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 14,
      marginTop: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    heroCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 18,
      marginBottom: 12,
    },
    heroTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    mainResultLabel: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    mainResultValue: {
      fontSize: 44,
      fontWeight: '700',
      color: colors.orange,
    },
    savingsBadge: {
      alignItems: 'flex-end',
    },
    savingsText: {
      fontSize: 13,
      color: '#4CAF50',
      fontWeight: '600',
    },
    savingsPercent: {
      fontSize: 20,
      color: '#4CAF50',
      fontWeight: '700',
    },
    card: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
    },
    priceRow: {
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
      borderRadius: 12,
    },
    inputPrefix: {
      fontSize: 18,
      color: colors.orange,
      paddingLeft: 14,
      fontWeight: '600',
    },
    input: {
      flex: 1,
      fontSize: 20,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 12,
      paddingHorizontal: 10,
    },
    inputSuffix: {
      fontSize: 14,
      color: colors.orange,
      paddingRight: 14,
      fontWeight: '500',
    },
    discountGrid: {
      flexDirection: 'row',
      gap: 10,
    },
    discountCol: {
      flex: 1,
    },
    // Quick Discounts
    quickSection: {
      marginTop: 10,
    },
    quickTitle: {
      fontSize: 10,
      color: colors.gray,
      marginBottom: 8,
    },
    quickRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    quickButton: {
      backgroundColor: colors.iconButtonBg,
      width: 42,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      marginRight: 6,
      marginBottom: 6,
    },
    quickButtonActive: {
      backgroundColor: colors.orange,
    },
    quickButtonText: {
      fontSize: 12,
      color: colors.gray,
      fontWeight: '500',
    },
    quickButtonTextActive: {
      color: '#ffffff',
    },
    // Breakdown
    breakdownCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      padding: 16,
    },
    breakdownHeading: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    breakdownRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 7,
    },
    breakdownLabel: {
      fontSize: 13,
      color: colors.gray,
    },
    breakdownValue: {
      fontSize: 14,
      color: colors.white,
      fontWeight: '600',
    },
    breakdownValueDiscount: {
      color: '#4CAF50',
    },
    breakdownValueTax: {
      color: '#F44336',
    },
    divider: {
      height: 1,
      backgroundColor: colors.iconButtonBg,
      marginVertical: 8,
    },
  });

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Discount Calculator</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.mainResultLabel}>Final Price</Text>
            <Text style={styles.mainResultValue}>${formatCurrency(finalPrice)}</Text>
          </View>
          {totalDiscount > 0 && (
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsPercent}>{totalDiscountPercent.toFixed(0)}%</Text>
              <Text style={styles.savingsText}>saved ${formatCurrency(totalDiscount)}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.priceRow}>
          <Text style={styles.label}>Original Price</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.input}
              value={originalPrice}
              onChangeText={handleInputChange(setOriginalPrice)}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.gray}
            />
          </View>
        </View>

        <View style={styles.discountGrid}>
          <View style={styles.discountCol}>
            <Text style={styles.label}>Discount</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={discountPercent}
                onChangeText={handleInputChange(setDiscountPercent)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.gray}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          </View>
          <View style={styles.discountCol}>
            <Text style={styles.label}>Additional</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={secondDiscount}
                onChangeText={handleInputChange(setSecondDiscount)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.gray}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>Quick select:</Text>
          <View style={styles.quickRow}>
            {QUICK_DISCOUNTS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.quickButton,
                  discount1 === d && styles.quickButtonActive,
                ]}
                onPress={() => setDiscountPercent(String(d))}
              >
                <Text
                  style={[
                    styles.quickButtonText,
                    discount1 === d && styles.quickButtonTextActive,
                  ]}
                >
                  {d}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.priceRow, { marginBottom: 0, marginTop: 14 }]}>
          <Text style={styles.label}>Sales Tax (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={taxPercent}
              onChangeText={handleInputChange(setTaxPercent)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputSuffix}>%</Text>
          </View>
        </View>
      </View>

      {/* Results Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownHeading}>Breakdown</Text>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Original Price</Text>
          <Text style={styles.breakdownValue}>${formatCurrency(price)}</Text>
        </View>

        {discount1 > 0 && (
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Discount ({discount1}%)</Text>
            <Text style={[styles.breakdownValue, styles.breakdownValueDiscount]}>
              -${formatCurrency(discountAmount1)}
            </Text>
          </View>
        )}

        {discount2 > 0 && (
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Additional ({discount2}%)</Text>
            <Text style={[styles.breakdownValue, styles.breakdownValueDiscount]}>
              -${formatCurrency(discountAmount2)}
            </Text>
          </View>
        )}

        {tax > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownValue}>${formatCurrency(priceAfterDiscount2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Tax ({tax}%)</Text>
              <Text style={[styles.breakdownValue, styles.breakdownValueTax]}>
                +${formatCurrency(taxAmount)}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
    <View style={{ marginTop: 16 }}>
      <AdBanner size="banner" />
    </View>
    </View>
  );
};
