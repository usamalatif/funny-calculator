import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

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
      padding: 14,
      marginBottom: 12,
    },
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
    // Quick Discounts
    quickSection: {
      marginTop: 4,
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
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 6,
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
      fontSize: 38,
      fontWeight: '700',
      color: colors.orange,
      marginTop: 4,
    },
    savingsText: {
      fontSize: 14,
      color: '#4CAF50',
      marginTop: 6,
      fontWeight: '600',
    },
    // Breakdown
    breakdownSection: {
      paddingTop: 14,
    },
    breakdownRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Discount Calculator</Text>

      <View style={styles.card}>
        {/* Original Price */}
        <View style={styles.inputRow}>
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

        {/* First Discount */}
        <View style={styles.inputRow}>
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
        </View>

        {/* Second Discount (Optional) */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Additional Discount (Optional)</Text>
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

        {/* Tax */}
        <View style={[styles.inputRow, { marginBottom: 0 }]}>
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

      {/* Results */}
      <View style={styles.resultsCard}>
        <View style={styles.mainResult}>
          <Text style={styles.mainResultLabel}>Final Price</Text>
          <Text style={styles.mainResultValue}>${formatCurrency(finalPrice)}</Text>
          {totalDiscount > 0 && (
            <Text style={styles.savingsText}>
              You save ${formatCurrency(totalDiscount)} ({totalDiscountPercent.toFixed(0)}% off)
            </Text>
          )}
        </View>

        <View style={styles.breakdownSection}>
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
      </View>
    </ScrollView>
  );
};
