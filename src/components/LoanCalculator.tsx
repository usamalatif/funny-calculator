import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

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
}

type LoanType = 'personal' | 'mortgage' | 'auto' | 'student';

const LOAN_TYPES: { label: string; icon: string; value: LoanType; defaultRate: string; defaultTerm: string }[] = [
  { label: 'Personal', icon: '💳', value: 'personal', defaultRate: '10', defaultTerm: '3' },
  { label: 'Mortgage', icon: '🏠', value: 'mortgage', defaultRate: '6.5', defaultTerm: '30' },
  { label: 'Auto', icon: '🚗', value: 'auto', defaultRate: '7', defaultTerm: '5' },
  { label: 'Student', icon: '🎓', value: 'student', defaultRate: '5', defaultTerm: '10' },
];

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ colors }) => {
  const [loanType, setLoanType] = useState<LoanType>('personal');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('10');
  const [termYears, setTermYears] = useState('3');
  const [termMonths, setTermMonths] = useState('');

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
    // Loan Type Selector
    loanTypeRow: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    loanTypeButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 3,
      backgroundColor: colors.iconButtonBg,
    },
    loanTypeButtonActive: {
      backgroundColor: colors.orange,
    },
    loanTypeIcon: {
      fontSize: 18,
      marginBottom: 2,
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
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },
    // Input Row
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
      fontSize: 18,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    inputSuffix: {
      fontSize: 14,
      color: colors.orange,
      paddingRight: 14,
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
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    mainResultValue: {
      fontSize: 36,
      fontWeight: '700',
      color: colors.orange,
      marginTop: 4,
    },
    mainResultUnit: {
      fontSize: 13,
      color: colors.gray,
      marginTop: 2,
    },
    // Breakdown
    breakdownSection: {
      paddingTop: 14,
    },
    breakdownTitle: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    breakdownBar: {
      flexDirection: 'row',
      height: 12,
      borderRadius: 6,
      overflow: 'hidden',
      marginBottom: 10,
    },
    breakdownPrincipal: {
      backgroundColor: '#4CAF50',
    },
    breakdownInterest: {
      backgroundColor: '#F44336',
    },
    breakdownLegend: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 6,
    },
    legendLabel: {
      fontSize: 12,
      color: colors.gray,
    },
    legendValue: {
      fontSize: 12,
      color: colors.white,
      fontWeight: '600',
      marginLeft: 4,
    },
    // Summary
    summarySection: {
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: colors.iconButtonBg,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    summaryLabel: {
      fontSize: 13,
      color: colors.gray,
    },
    summaryValue: {
      fontSize: 15,
      color: colors.white,
      fontWeight: '600',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Loan Calculator</Text>

      {/* Loan Type Selector */}
      <View style={styles.loanTypeRow}>
        {LOAN_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.loanTypeButton,
              loanType === type.value && styles.loanTypeButtonActive,
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
        {/* Loan Amount */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Loan Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.input}
              value={principal}
              onChangeText={setPrincipal}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
          </View>
        </View>

        {/* Interest Rate */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Interest Rate (Annual)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputSuffix}>%</Text>
          </View>
        </View>

        {/* Loan Term */}
        <View style={[styles.inputRow, { marginBottom: 0 }]}>
          <Text style={styles.label}>Loan Term</Text>
          <View style={styles.termRow}>
            <View style={[styles.inputContainer, styles.termInput]}>
              <TextInput
                style={styles.input}
                value={termYears}
                onChangeText={setTermYears}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.gray}
              />
              <Text style={styles.inputSuffix}>years</Text>
            </View>
            <View style={[styles.inputContainer, styles.termInputSmall]}>
              <TextInput
                style={styles.input}
                value={termMonths}
                onChangeText={setTermMonths}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.gray}
              />
              <Text style={styles.inputSuffix}>mo</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsCard}>
        <View style={styles.mainResult}>
          <Text style={styles.mainResultLabel}>Monthly Payment</Text>
          <Text style={styles.mainResultValue}>
            ${formatCurrency(monthlyPayment)}
          </Text>
          <Text style={styles.mainResultUnit}>per month for {totalMonths} months</Text>
        </View>

        {/* Payment Breakdown */}
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
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Principal Amount</Text>
            <Text style={styles.summaryValue}>${formatCurrency(principalNum)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Interest</Text>
            <Text style={[styles.summaryValue, { color: '#F44336' }]}>
              ${formatCurrency(totalInterest)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Payment</Text>
            <Text style={[styles.summaryValue, { color: colors.orange }]}>
              ${formatCurrency(totalPayment)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
