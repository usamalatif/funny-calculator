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

interface LoanCalculatorProps {
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

type LoanType = 'personal' | 'mortgage' | 'auto' | 'student';

const LOAN_TYPES: { label: string; icon: string; value: LoanType; defaultRate: string; defaultTerm: string }[] = [
  { label: 'Personal', icon: '💳', value: 'personal', defaultRate: '10', defaultTerm: '3' },
  { label: 'Mortgage', icon: '🏠', value: 'mortgage', defaultRate: '6.5', defaultTerm: '30' },
  { label: 'Auto', icon: '🚗', value: 'auto', defaultRate: '7', defaultTerm: '5' },
  { label: 'Student', icon: '🎓', value: 'student', defaultRate: '5', defaultTerm: '10' },
];

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ colors, onTaskComplete }) => {
  const [loanType, setLoanType] = useState<LoanType>('personal');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('10');
  const [termYears, setTermYears] = useState('3');
  const [termMonths, setTermMonths] = useState('');

  const handleInputChange = (setter: (val: string) => void) => (text: string) => {
    setter(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

  const principalNum = parseFloat(principal) || 0;
  const rateNum = parseFloat(interestRate) || 0;
  const yearsNum = parseFloat(termYears) || 0;
  const monthsNum = parseFloat(termMonths) || 0;
  const totalMonths = yearsNum * 12 + monthsNum;

  // Calculate loan details
  const calculateLoan = () => {
    if (principalNum === 0 || totalMonths === 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
    }

    const monthlyRate = rateNum / 100 / 12;

    if (monthlyRate === 0) {
      // No interest loan
      const monthlyPayment = principalNum / totalMonths;
      return {
        monthlyPayment,
        totalPayment: principalNum,
        totalInterest: 0,
      };
    }

    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment =
      (principalNum * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - principalNum;

    return { monthlyPayment, totalPayment, totalInterest };
  };

  const { monthlyPayment, totalPayment, totalInterest } = calculateLoan();

  // Calculate amortization breakdown for visualization
  const getPaymentBreakdown = () => {
    const principalPercent = principalNum > 0 ? (principalNum / totalPayment) * 100 : 0;
    const interestPercent = totalInterest > 0 ? (totalInterest / totalPayment) * 100 : 0;
    return { principalPercent, interestPercent };
  };

  const { principalPercent, interestPercent } = getPaymentBreakdown();

  const handleLoanTypeChange = (type: LoanType) => {
    const loanConfig = LOAN_TYPES.find(l => l.value === type);
    setLoanType(type);
    if (loanConfig) {
      setInterestRate(loanConfig.defaultRate);
      setTermYears(loanConfig.defaultTerm);
      setTermMonths('');
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 14,
      marginTop: 24,
    },
    // Header
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    eyebrow: {
      fontSize: 10,
      color: colors.gray,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.white,
    },
    activeTypeChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    activeTypeIcon: {
      fontSize: 14,
      marginRight: 4,
    },
    activeTypeLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.orange,
    },
    // Hero result
    heroCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 18,
      marginBottom: 14,
    },
    heroTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    heroLabel: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    heroUnit: {
      fontSize: 11,
      color: colors.gray,
      textAlign: 'right',
    },
    heroValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginTop: 6,
    },
    heroPrefix: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.orange,
      marginRight: 2,
    },
    heroValue: {
      fontSize: 42,
      fontWeight: '800',
      color: colors.orange,
    },
    // Loan Type Selector
    loanTypeRow: {
      flexDirection: 'row',
      marginBottom: 14,
    },
    loanTypeButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
      marginRight: 8,
      backgroundColor: colors.iconButtonBg,
    },
    loanTypeButtonActive: {
      backgroundColor: colors.orange,
    },
    loanTypeIcon: {
      fontSize: 20,
      marginBottom: 4,
    },
    loanTypeLabel: {
      fontSize: 10,
      fontWeight: '600',
    },
    loanTypeLabelActive: {
      color: '#ffffff',
    },
    loanTypeLabelInactive: {
      color: colors.gray,
    },
    // Card
    card: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      padding: 16,
      marginBottom: 14,
    },
    sectionHeading: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.white,
      marginBottom: 12,
    },
    // Input Row
    inputRow: {
      marginBottom: 12,
    },
    inputGrid: {
      flexDirection: 'row',
    },
    inputGridItem: {
      flex: 1,
      marginRight: 10,
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
      borderRadius: 12,
    },
    inputPrefix: {
      fontSize: 16,
      color: colors.orange,
      paddingLeft: 12,
      fontWeight: '600',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    inputSuffix: {
      fontSize: 12,
      color: colors.orange,
      paddingRight: 12,
      fontWeight: '500',
    },
    // Term Row
    termRow: {
      flexDirection: 'row',
    },
    termInput: {
      flex: 1,
      marginRight: 8,
    },
    termInputSmall: {
      flex: 0.6,
    },
    // Breakdown
    breakdownSection: {},
    breakdownTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.white,
      marginBottom: 10,
    },
    breakdownBar: {
      flexDirection: 'row',
      height: 10,
      borderRadius: 5,
      overflow: 'hidden',
      marginBottom: 12,
    },
    breakdownPrincipal: {
      backgroundColor: '#4CAF50',
    },
    breakdownInterest: {
      backgroundColor: '#F44336',
    },
    breakdownLegend: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    legendLabel: {
      fontSize: 11,
      color: colors.gray,
    },
    legendValue: {
      fontSize: 11,
      color: colors.white,
      fontWeight: '700',
      marginLeft: 4,
    },
    // Summary
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 4,
    },
    summaryTile: {
      width: '50%',
      paddingVertical: 10,
    },
    summaryLabel: {
      fontSize: 10,
      color: colors.gray,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 16,
      color: colors.white,
      fontWeight: '700',
    },
  });

  const activeLoan = LOAN_TYPES.find(l => l.value === loanType);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Calculator</Text>
          <Text style={styles.title}>Loan</Text>
        </View>
        {activeLoan && (
          <View style={styles.activeTypeChip}>
            <Text style={styles.activeTypeIcon}>{activeLoan.icon}</Text>
            <Text style={styles.activeTypeLabel}>{activeLoan.label}</Text>
          </View>
        )}
      </View>

      {/* Hero Result */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroLabel}>Monthly Payment</Text>
          <Text style={styles.heroUnit}>{totalMonths} months</Text>
        </View>
        <View style={styles.heroValueRow}>
          <Text style={styles.heroPrefix}>$</Text>
          <Text style={styles.heroValue}>{formatCurrency(monthlyPayment)}</Text>
        </View>
      </View>

      {/* Loan Type Selector */}
      <View style={styles.loanTypeRow}>
        {LOAN_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.loanTypeButton,
              loanType === type.value && styles.loanTypeButtonActive,
              type.value === 'student' && { marginRight: 0 },
            ]}
            onPress={() => handleLoanTypeChange(type.value)}
          >
            <Text style={styles.loanTypeIcon}>{type.icon}</Text>
            <Text
              style={[
                styles.loanTypeLabel,
                loanType === type.value
                  ? styles.loanTypeLabelActive
                  : styles.loanTypeLabelInactive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inputs */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Loan Details</Text>

        {/* Loan Amount */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Loan Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.input}
              value={principal}
              onChangeText={handleInputChange(setPrincipal)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
          </View>
        </View>

        {/* Interest Rate + Term grouped in a grid */}
        <View style={styles.inputGrid}>
          <View style={styles.inputGridItem}>
            <Text style={styles.label}>Interest Rate</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={interestRate}
                onChangeText={handleInputChange(setInterestRate)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.gray}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          </View>
          <View style={[styles.inputGridItem, { marginRight: 0 }]}>
            <Text style={styles.label}>Term</Text>
            <View style={styles.termRow}>
              <View style={[styles.inputContainer, styles.termInput]}>
                <TextInput
                  style={styles.input}
                  value={termYears}
                  onChangeText={handleInputChange(setTermYears)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.gray}
                />
                <Text style={styles.inputSuffix}>yr</Text>
              </View>
              <View style={[styles.inputContainer, styles.termInputSmall]}>
                <TextInput
                  style={styles.input}
                  value={termMonths}
                  onChangeText={handleInputChange(setTermMonths)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.gray}
                />
                <Text style={styles.inputSuffix}>mo</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Payment Breakdown */}
      <View style={styles.card}>
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
          <View style={styles.breakdownBar}>
            <View
              style={[
                styles.breakdownPrincipal,
                { flex: principalPercent || 1 },
              ]}
            />
            <View
              style={[
                styles.breakdownInterest,
                { flex: interestPercent || 0 },
              ]}
            />
          </View>
          <View style={styles.breakdownLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendLabel}>Principal</Text>
              <Text style={styles.legendValue}>{principalPercent.toFixed(0)}%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendLabel}>Interest</Text>
              <Text style={styles.legendValue}>{interestPercent.toFixed(0)}%</Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Principal Amount</Text>
            <Text style={styles.summaryValue}>${formatCurrency(principalNum)}</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Total Interest</Text>
            <Text style={[styles.summaryValue, { color: '#F44336' }]}>
              ${formatCurrency(totalInterest)}
            </Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryLabel}>Total Payment</Text>
            <Text style={[styles.summaryValue, { color: colors.orange }]}>
              ${formatCurrency(totalPayment)}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <AdBanner size="banner" />
      </View>
    </ScrollView>
  );
};
