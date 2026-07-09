import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { AdBanner } from '../ads/AdBanner';

interface OvulationCalculatorProps {
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CYCLE_LENGTHS = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];

export const OvulationCalculator: React.FC<OvulationCalculatorProps> = ({ colors, onTaskComplete }) => {
  const today = new Date();
  const [lastPeriodDay, setLastPeriodDay] = useState(String(today.getDate()));
  const [lastPeriodMonth, setLastPeriodMonth] = useState(today.getMonth());
  const [lastPeriodYear, setLastPeriodYear] = useState(String(today.getFullYear()));
  const [cycleLength, setCycleLength] = useState(28);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showCyclePicker, setShowCyclePicker] = useState(false);

  const handleInputChange = (setter: (val: string) => void) => (text: string) => {
    setter(text);
    if (text && parseFloat(text) > 0) {
      onTaskComplete?.();
    }
  };

  // Calculate dates
  const calculateDates = () => {
    const day = parseInt(lastPeriodDay) || 1;
    const year = parseInt(lastPeriodYear) || today.getFullYear();

    const lastPeriod = new Date(year, lastPeriodMonth, day);

    // Ovulation typically occurs 14 days before the next period
    const ovulationDay = new Date(lastPeriod);
    ovulationDay.setDate(lastPeriod.getDate() + cycleLength - 14);

    // Fertile window is typically 5 days before ovulation + ovulation day
    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(ovulationDay.getDate() - 5);

    const fertileEnd = new Date(ovulationDay);
    fertileEnd.setDate(ovulationDay.getDate() + 1);

    // Next period
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + cycleLength);

    // Safe days (after fertile window)
    const safeStart = new Date(fertileEnd);
    safeStart.setDate(fertileEnd.getDate() + 1);

    return {
      lastPeriod,
      ovulationDay,
      fertileStart,
      fertileEnd,
      nextPeriod,
      safeStart,
    };
  };

  const dates = calculateDates();

  const formatDate = (date: Date) => {
    return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatDateShort = (date: Date) => {
    return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
  };

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const ovulationDaysUntil = getDaysUntil(dates.ovulationDay);
  const fertileStartDays = getDaysUntil(dates.fertileStart);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 14,
      marginTop: 24,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerIconBadge: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.iconButtonBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.white,
      textAlign: 'left',
    },
    // Hero
    heroCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      paddingVertical: 22,
      paddingHorizontal: 18,
      marginBottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },
    heroIconWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.iconButtonBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    ovulationIcon: {
      fontSize: 28,
    },
    heroTextBlock: {
      flex: 1,
    },
    mainResultLabel: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    mainResultDate: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.orange,
      marginTop: 2,
    },
    mainResultDays: {
      fontSize: 13,
      color: colors.gray,
      marginTop: 3,
    },
    // Card
    card: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 11,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    twoUp: {
      flexDirection: 'row',
      gap: 10,
    },
    twoUpItem: {
      flex: 1,
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
    dateRow: {
      flexDirection: 'row',
      gap: 8,
    },
    dateInput: {
      flex: 1,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
      paddingVertical: 12,
      paddingHorizontal: 12,
      textAlign: 'center',
    },
    pickerButton: {
      flex: 1,
      backgroundColor: colors.iconButtonBg,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pickerButtonText: {
      fontSize: 13,
      color: colors.white,
      fontWeight: '500',
    },
    // Cycle selector
    cycleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cycleButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.iconButtonBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cycleButtonText: {
      fontSize: 18,
      color: colors.orange,
      fontWeight: '300',
    },
    cycleValue: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    cycleValueText: {
      fontSize: 26,
      color: colors.white,
      fontWeight: '700',
    },
    cycleValueLabel: {
      fontSize: 12,
      color: colors.gray,
      marginLeft: 4,
    },
    // Results
    resultsCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },
    // Timeline
    timelineSection: {
      gap: 8,
    },
    timelineItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: colors.iconButtonBg,
    },
    timelineItemLast: {
      marginBottom: 0,
    },
    timelineIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    timelineEmoji: {
      fontSize: 16,
    },
    timelineContent: {
      flex: 1,
    },
    timelineLabel: {
      fontSize: 12,
      color: colors.gray,
    },
    timelineDate: {
      fontSize: 14,
      color: colors.white,
      fontWeight: '600',
      marginTop: 1,
    },
    timelineBadge: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    timelineBadgeText: {
      fontSize: 11,
      fontWeight: '600',
    },
    // Disclaimer
    disclaimer: {
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 4,
    },
    disclaimerText: {
      fontSize: 11,
      color: colors.gray,
      textAlign: 'left',
      lineHeight: 16,
    },
    sourceLink: {
      color: colors.orange,
      textDecorationLine: 'underline',
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
      width: '75%',
      maxHeight: 350,
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
      maxHeight: 280,
    },
    pickerItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    pickerItemSelected: {
      backgroundColor: 'rgba(245,166,35,0.15)',
    },
    pickerItemText: {
      fontSize: 15,
      color: colors.white,
      textAlign: 'center',
    },
  });

  const MonthPicker = () => {
    if (!showMonthPicker) return null;
    return (
      <TouchableOpacity
        style={styles.pickerOverlay}
        activeOpacity={1}
        onPress={() => setShowMonthPicker(false)}
      >
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Month</Text>
          </View>
          <ScrollView style={styles.pickerList}>
            {MONTHS.map((month, index) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.pickerItem,
                  lastPeriodMonth === index && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setLastPeriodMonth(index);
                  setShowMonthPicker(false);
                }}
              >
                <Text style={styles.pickerItemText}>{month}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View style={styles.headerIconBadge}>
          <Text style={{ fontSize: 16 }}>🥚</Text>
        </View>
        <Text style={styles.title}>Ovulation Calculator</Text>
      </View>

      {/* Hero result */}
      <View style={styles.heroCard}>
        <View style={styles.heroIconWrap}>
          <Text style={styles.ovulationIcon}>🥚</Text>
        </View>
        <View style={styles.heroTextBlock}>
          <Text style={styles.mainResultLabel}>Estimated Ovulation Day</Text>
          <Text style={styles.mainResultDate}>{formatDate(dates.ovulationDay)}</Text>
          <Text style={styles.mainResultDays}>
            {ovulationDaysUntil > 0
              ? `in ${ovulationDaysUntil} days`
              : ovulationDaysUntil === 0
              ? 'Today!'
              : `${Math.abs(ovulationDaysUntil)} days ago`}
          </Text>
        </View>
      </View>

      {/* Inputs grouped in one card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>First Day of Last Period</Text>
        <View style={styles.dateRow}>
          <View style={[styles.dateInput, { flex: 0.8 }]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={lastPeriodDay}
                onChangeText={handleInputChange(setLastPeriodDay)}
                keyboardType="numeric"
                placeholder="DD"
                placeholderTextColor={colors.gray}
                maxLength={2}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.pickerButton, { flex: 1.5 }]}
            onPress={() => setShowMonthPicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              {MONTHS[lastPeriodMonth]}
            </Text>
          </TouchableOpacity>
          <View style={[styles.dateInput, { flex: 1 }]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={lastPeriodYear}
                onChangeText={handleInputChange(setLastPeriodYear)}
                keyboardType="numeric"
                placeholder="YYYY"
                placeholderTextColor={colors.gray}
                maxLength={4}
              />
            </View>
          </View>
        </View>

        <View style={{ height: 14 }} />

        <Text style={styles.cardTitle}>Average Cycle Length</Text>
        <View style={styles.cycleRow}>
          <TouchableOpacity
            style={styles.cycleButton}
            onPress={() => setCycleLength(Math.max(21, cycleLength - 1))}
          >
            <Text style={styles.cycleButtonText}>−</Text>
          </TouchableOpacity>
          <View style={styles.cycleValue}>
            <Text style={styles.cycleValueText}>{cycleLength}</Text>
            <Text style={styles.cycleValueLabel}>days</Text>
          </View>
          <TouchableOpacity
            style={styles.cycleButton}
            onPress={() => setCycleLength(Math.min(35, cycleLength + 1))}
          >
            <Text style={styles.cycleButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.resultsCard}>
        <Text style={styles.cardTitle}>Cycle Timeline</Text>
        <View style={styles.timelineSection}>
          {/* Fertile Window */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIcon, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
              <Text style={styles.timelineEmoji}>💚</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Fertile Window</Text>
              <Text style={styles.timelineDate}>
                {formatDateShort(dates.fertileStart)} - {formatDateShort(dates.fertileEnd)}
              </Text>
            </View>
            <View style={[styles.timelineBadge, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
              <Text style={[styles.timelineBadgeText, { color: '#4CAF50' }]}>
                {fertileStartDays > 0 ? `${fertileStartDays}d` : 'Now'}
              </Text>
            </View>
          </View>

          {/* Next Period */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIcon, { backgroundColor: 'rgba(244, 67, 54, 0.2)' }]}>
              <Text style={styles.timelineEmoji}>🔴</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Next Period</Text>
              <Text style={styles.timelineDate}>{formatDate(dates.nextPeriod)}</Text>
            </View>
            <View style={[styles.timelineBadge, { backgroundColor: 'rgba(244, 67, 54, 0.2)' }]}>
              <Text style={[styles.timelineBadgeText, { color: '#F44336' }]}>
                {getDaysUntil(dates.nextPeriod)}d
              </Text>
            </View>
          </View>

          {/* Safe Days */}
          <View style={[styles.timelineItem, styles.timelineItemLast]}>
            <View style={[styles.timelineIcon, { backgroundColor: 'rgba(33, 150, 243, 0.2)' }]}>
              <Text style={styles.timelineEmoji}>💙</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Less Fertile Days Start</Text>
              <Text style={styles.timelineDate}>{formatDate(dates.safeStart)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          This calculator provides estimates only using the standard calendar method
          (ovulation ≈ 14 days before the next period). Results may vary based on individual
          cycles. Consult a healthcare provider for medical advice.{' '}
          <Text
            style={styles.sourceLink}
            onPress={() => Linking.openURL('https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning')}
          >
            Source: ACOG
          </Text>
        </Text>
      </View>

      <MonthPicker />

      <View style={{ marginTop: 16 }}>
        <AdBanner size="banner" />
      </View>
    </ScrollView>
  );
};
