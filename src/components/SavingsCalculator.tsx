import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface SavingsCalculatorProps {
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

type CompoundFrequency = 'daily' | 'monthly' | 'quarterly' | 'annually';

const FREQUENCIES: { label: string; value: CompoundFrequency; periods: number }[] = [
  { label: 'Daily', value: 'daily', periods: 365 },
  { label: 'Monthly', value: 'monthly', periods: 12 },
  { label: 'Quarterly', value: 'quarterly', periods: 4 },
  { label: 'Annually', value: 'annually', periods: 1 },
];

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ colors, onTaskComplete }) => {
  const [initialDeposit, setInitialDeposit] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [interestRate, setInterestRate] = useState('5');
  const [years, setYears] = useState('10');
  const [compoundFrequency, setCompoundFrequency] = useState<CompoundFrequency>('monthly');

  const handleInputChange = (setter: (val: string) => void) => (text: string) => {
    setter(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

  const initial = parseFloat(initialDeposit) || 0;
  const monthly = parseFloat(monthlyContribution) || 0;
  const rate = parseFloat(interestRate) || 0;
  const time = parseFloat(years) || 0;
  const frequency = FREQUENCIES.find(f => f.value === compoundFrequency)!;

  // Calculate future value with compound interest and regular contributions
  const calculateSavings = () => {
    const r = rate / 100; // Annual rate as decimal
    const n = frequency.periods; // Compounding periods per year
    const t = time; // Time in years
    const P = initial; // Initial principal
    const PMT = monthly; // Monthly contribution

    if (r === 0) {
      // No interest - simple calculation
      const totalContributions = P + (PMT * 12 * t);
      return {
        futureValue: totalContributions,
        totalContributions: P + (PMT * 12 * t),
        totalInterest: 0,
        initialDeposit: P,
        monthlyTotal: PMT * 12 * t,
      };
    }

    // Future value of initial deposit with compound interest
    // FV = P(1 + r/n)^(nt)
    const fvInitial = P * Math.pow(1 + r / n, n * t);

    // Future value of periodic contributions (monthly)
    // FV = PMT × (((1 + r/n)^(nt) - 1) / (r/n)) × (1 + r/n)
    // Adjusted for monthly contributions vs compounding frequency
    const monthlyRate = r / 12;
    const totalMonths = t * 12;
    const fvContributions = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    const futureValue = fvInitial + fvContributions;
    const totalContributed = P + (PMT * 12 * t);
    const totalInterest = futureValue - totalContributed;

    return {
      futureValue,
      totalContributions: totalContributed,
      totalInterest,
      initialDeposit: P,
      monthlyTotal: PMT * 12 * t,
    };
  };

  const results = calculateSavings();

  // Calculate breakdown percentages for visualization
  const getBreakdown = () => {
    const total = results.futureValue;
    if (total === 0) return { initialPercent: 0, contributionsPercent: 0, interestPercent: 0 };

    const initialPercent = (results.initialDeposit / total) * 100;
    const contributionsPercent = (results.monthlyTotal / total) * 100;
    const interestPercent = (results.totalInterest / total) * 100;

    return { initialPercent, contributionsPercent, interestPercent };
  };

  const breakdown = getBreakdown();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculate year-by-year growth for chart
  const getYearlyGrowth = () => {
    const growth = [];
    const r = (rate / 100) / 12;
    let balance = initial;

    for (let year = 1; year <= Math.min(time, 30); year++) {
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + r) + monthly;
      }
      growth.push({
        year,
        balance: balance,
      });
    }
    return growth;
  };

  const yearlyGrowth = getYearlyGrowth();
  const maxBalance = yearlyGrowth.length > 0 ? yearlyGrowth[yearlyGrowth.length - 1].balance : 0;

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
    // Frequency selector
    frequencyRow: {
      flexDirection: 'row',
      marginTop: 8,
    },
    frequencyButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 2,
      backgroundColor: colors.iconButtonBg,
    },
    frequencyButtonActive: {
      backgroundColor: colors.orange,
    },
    frequencyButtonText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.gray,
    },
    frequencyButtonTextActive: {
      color: '#ffffff',
    },
    // Results
    resultsCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
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
      fontSize: 34,
      fontWeight: '700',
      color: colors.orange,
      marginTop: 4,
    },
    interestText: {
      fontSize: 14,
      color: '#4CAF50',
      marginTop: 6,
      fontWeight: '600',
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
      height: 14,
      borderRadius: 7,
      overflow: 'hidden',
      marginBottom: 12,
    },
    breakdownInitial: {
      backgroundColor: '#2196F3',
    },
    breakdownContributions: {
      backgroundColor: '#4CAF50',
    },
    breakdownInterest: {
      backgroundColor: colors.orange,
    },
    legendRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      width: '48%',
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 6,
    },
    legendLabel: {
      fontSize: 11,
      color: colors.gray,
      flex: 1,
    },
    legendValue: {
      fontSize: 12,
      color: colors.white,
      fontWeight: '600',
    },
    // Chart
    chartSection: {
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: colors.iconButtonBg,
      marginTop: 14,
    },
    chartTitle: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    chartContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 80,
    },
    chartBar: {
      flex: 1,
      marginHorizontal: 1,
      borderRadius: 2,
      minHeight: 4,
    },
    chartLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    chartLabel: {
      fontSize: 9,
      color: colors.gray,
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
      fontSize: 14,
      color: colors.white,
      fontWeight: '600',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Savings Calculator</Text>

      {/* Inputs */}
      <View style={styles.card}>
        {/* Initial Deposit */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Initial Deposit</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.input}
              value={initialDeposit}
              onChangeText={handleInputChange(setInitialDeposit)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
          </View>
        </View>

        {/* Monthly Contribution */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Monthly Contribution</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.input}
              value={monthlyContribution}
              onChangeText={handleInputChange(setMonthlyContribution)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
          </View>
        </View>

        {/* Interest Rate */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Annual Interest Rate</Text>
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

        {/* Time Period */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Time Period</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={years}
              onChangeText={handleInputChange(setYears)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.inputSuffix}>years</Text>
          </View>
        </View>

        {/* Compound Frequency */}
        <View style={[styles.inputRow, { marginBottom: 0 }]}>
          <Text style={styles.label}>Compound Frequency</Text>
          <View style={styles.frequencyRow}>
            {FREQUENCIES.map((freq) => (
              <TouchableOpacity
                key={freq.value}
                style={[
                  styles.frequencyButton,
                  compoundFrequency === freq.value && styles.frequencyButtonActive,
                ]}
                onPress={() => setCompoundFrequency(freq.value)}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    compoundFrequency === freq.value && styles.frequencyButtonTextActive,
                  ]}
                >
                  {freq.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsCard}>
        <View style={styles.mainResult}>
          <Text style={styles.mainResultLabel}>Future Value</Text>
          <Text style={styles.mainResultValue}>
            ${formatCurrency(results.futureValue)}
          </Text>
          {results.totalInterest > 0 && (
            <Text style={styles.interestText}>
              +${formatCurrency(results.totalInterest)} in interest
            </Text>
          )}
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Savings Breakdown</Text>
          <View style={styles.breakdownBar}>
            <View
              style={[
                styles.breakdownInitial,
                { flex: breakdown.initialPercent || 0.1 },
              ]}
            />
            <View
              style={[
                styles.breakdownContributions,
                { flex: breakdown.contributionsPercent || 0.1 },
              ]}
            />
            <View
              style={[
                styles.breakdownInterest,
                { flex: breakdown.interestPercent || 0.1 },
              ]}
            />
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.legendLabel}>Initial</Text>
              <Text style={styles.legendValue}>${formatCurrency(results.initialDeposit)}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendLabel}>Contributions</Text>
              <Text style={styles.legendValue}>${formatCurrency(results.monthlyTotal)}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.orange }]} />
              <Text style={styles.legendLabel}>Interest</Text>
              <Text style={styles.legendValue}>${formatCurrency(results.totalInterest)}</Text>
            </View>
          </View>
        </View>

        {/* Growth Chart */}
        {yearlyGrowth.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Growth Over Time</Text>
            <View style={styles.chartContainer}>
              {yearlyGrowth.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.chartBar,
                    {
                      height: maxBalance > 0 ? (item.balance / maxBalance) * 70 + 10 : 10,
                      backgroundColor: colors.orange,
                      opacity: 0.4 + (index / yearlyGrowth.length) * 0.6,
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Year 1</Text>
              <Text style={styles.chartLabel}>Year {Math.min(time, 30)}</Text>
            </View>
          </View>
        )}

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Contributions</Text>
            <Text style={styles.summaryValue}>${formatCurrency(results.totalContributions)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Interest Earned</Text>
            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
              ${formatCurrency(results.totalInterest)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Final Balance</Text>
            <Text style={[styles.summaryValue, { color: colors.orange }]}>
              ${formatCurrency(results.futureValue)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
