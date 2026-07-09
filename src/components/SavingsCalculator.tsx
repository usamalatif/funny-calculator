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
      paddingHorizontal: 14,
      marginTop: 24,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    headerBadge: {
      fontSize: 11,
      color: colors.gray,
    },
    // Hero result
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
    },
    heroLabel: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    heroValue: {
      fontSize: 40,
      fontWeight: '800',
      color: colors.orange,
    },
    interestPill: {
      backgroundColor: colors.iconButtonBg,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignItems: 'flex-end',
    },
    interestText: {
      fontSize: 13,
      color: '#4CAF50',
      fontWeight: '700',
    },
    interestSubtext: {
      fontSize: 9,
      color: colors.gray,
      marginTop: 2,
    },
    breakdownBar: {
      flexDirection: 'row',
      height: 10,
      borderRadius: 5,
      overflow: 'hidden',
      marginTop: 16,
      marginBottom: 10,
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
    },
    legendItem: {
      alignItems: 'flex-start',
    },
    legendDotRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 5,
    },
    legendLabel: {
      fontSize: 10,
      color: colors.gray,
    },
    legendValue: {
      fontSize: 12,
      color: colors.white,
      fontWeight: '700',
      marginTop: 2,
    },
    // Inputs grid card
    inputsCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      padding: 16,
      marginBottom: 10,
    },
    sectionLabel: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    inputGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    inputCell: {
      width: '48%',
      marginBottom: 12,
    },
    label: {
      fontSize: 10,
      color: colors.lightGray,
      marginBottom: 6,
    },
    inputContainer: {
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
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 9,
      paddingHorizontal: 8,
    },
    inputSuffix: {
      fontSize: 12,
      color: colors.orange,
      paddingRight: 12,
      fontWeight: '500',
    },
    // Frequency selector
    frequencyRow: {
      flexDirection: 'row',
      marginTop: 2,
    },
    frequencyButton: {
      flex: 1,
      paddingVertical: 9,
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
    // Chart card
    chartCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      padding: 16,
      marginBottom: 10,
    },
    chartHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    chartContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 70,
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
    // Summary strip
    summaryCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      padding: 14,
      marginBottom: 20,
      flexDirection: 'row',
    },
    summaryCell: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 4,
    },
    summaryDivider: {
      width: 1,
      backgroundColor: colors.iconButtonBg,
      marginVertical: 4,
    },
    summaryLabel: {
      fontSize: 9,
      color: colors.gray,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
      marginBottom: 4,
      textAlign: 'center',
    },
    summaryValue: {
      fontSize: 13,
      color: colors.white,
      fontWeight: '700',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Savings Calculator</Text>
        <Text style={styles.headerBadge}>{frequency.label} compounding</Text>
      </View>

      {/* Hero result */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroLabel}>Future Value</Text>
            <Text style={styles.heroValue}>${formatCurrency(results.futureValue)}</Text>
          </View>
          {results.totalInterest > 0 && (
            <View style={styles.interestPill}>
              <Text style={styles.interestText}>+${formatCurrency(results.totalInterest)}</Text>
              <Text style={styles.interestSubtext}>interest earned</Text>
            </View>
          )}
        </View>

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
            <View style={styles.legendDotRow}>
              <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.legendLabel}>Initial</Text>
            </View>
            <Text style={styles.legendValue}>${formatCurrency(results.initialDeposit)}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendDotRow}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendLabel}>Contributions</Text>
            </View>
            <Text style={styles.legendValue}>${formatCurrency(results.monthlyTotal)}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendDotRow}>
              <View style={[styles.legendDot, { backgroundColor: colors.orange }]} />
              <Text style={styles.legendLabel}>Interest</Text>
            </View>
            <Text style={styles.legendValue}>${formatCurrency(results.totalInterest)}</Text>
          </View>
        </View>
      </View>

      {/* Inputs grid */}
      <View style={styles.inputsCard}>
        <Text style={styles.sectionLabel}>Your Plan</Text>
        <View style={styles.inputGrid}>
          <View style={styles.inputCell}>
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

          <View style={styles.inputCell}>
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

          <View style={styles.inputCell}>
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

          <View style={styles.inputCell}>
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
        </View>

        <Text style={[styles.label, { marginTop: 2 }]}>Compound Frequency</Text>
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

      {/* Growth Chart */}
      {yearlyGrowth.length > 0 && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.sectionLabel}>Growth Over Time</Text>
            <Text style={styles.headerBadge}>
              Yr 1 – Yr {Math.min(time, 30)}
            </Text>
          </View>
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
        </View>
      )}

      {/* Summary strip */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>Contributions</Text>
          <Text style={styles.summaryValue}>${formatCurrency(results.totalContributions)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>Interest Earned</Text>
          <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
            ${formatCurrency(results.totalInterest)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>Final Balance</Text>
          <Text style={[styles.summaryValue, { color: colors.orange }]}>
            ${formatCurrency(results.futureValue)}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <AdBanner size="banner" />
      </View>
    </ScrollView>
  );
};
