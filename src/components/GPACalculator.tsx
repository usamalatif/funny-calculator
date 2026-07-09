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

interface GPACalculatorProps {
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

interface Course {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

const GRADES: { label: string; value: number }[] = [
  { label: 'A+', value: 4.0 },
  { label: 'A', value: 4.0 },
  { label: 'A-', value: 3.7 },
  { label: 'B+', value: 3.3 },
  { label: 'B', value: 3.0 },
  { label: 'B-', value: 2.7 },
  { label: 'C+', value: 2.3 },
  { label: 'C', value: 2.0 },
  { label: 'C-', value: 1.7 },
  { label: 'D+', value: 1.3 },
  { label: 'D', value: 1.0 },
  { label: 'F', value: 0.0 },
];

export const GPACalculator: React.FC<GPACalculatorProps> = ({ colors, onTaskComplete }) => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', credits: '3', grade: 'A' },
  ]);
  const [showGradePicker, setShowGradePicker] = useState<number | null>(null);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now(), name: '', credits: '3', grade: 'A' },
    ]);
    onTaskComplete?.();
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const credits = parseFloat(course.credits) || 0;
      const gradeObj = GRADES.find((g) => g.label === course.grade);
      const gradeValue = gradeObj ? gradeObj.value : 0;

      totalPoints += credits * gradeValue;
      totalCredits += credits;
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const getTotalCredits = () => {
    return courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);
  };

  const gpa = calculateGPA();

  const getGPAColor = () => {
    if (gpa >= 3.5) return '#4CAF50';
    if (gpa >= 3.0) return colors.orange;
    if (gpa >= 2.0) return '#FFC107';
    return '#F44336';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 14,
      marginTop: 24,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    creditsText: {
      fontSize: 13,
      color: colors.gray,
    },
    // Hero GPA
    heroRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 18,
    },
    gpaValue: {
      fontSize: 64,
      fontWeight: '700',
      lineHeight: 66,
    },
    heroMeta: {
      marginLeft: 12,
      paddingBottom: 6,
    },
    gpaLabel: {
      fontSize: 12,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 2,
    },
    // Courses Card
    coursesCard: {
      backgroundColor: colors.panelBg,
      borderRadius: 20,
      paddingTop: 14,
      paddingBottom: 6,
      paddingHorizontal: 12,
      flex: 1,
    },
    coursesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      paddingHorizontal: 4,
    },
    coursesTitle: {
      fontSize: 13,
      color: colors.lightGray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    addButton: {
      backgroundColor: colors.orange,
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: 16,
      color: '#ffffff',
      fontWeight: '700',
      lineHeight: 18,
    },
    // Course Row
    coursesList: {
      flex: 1,
    },
    courseRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconButtonBg,
      borderRadius: 12,
      marginBottom: 8,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    courseIndex: {
      width: 22,
      height: 22,
      borderRadius: 6,
      backgroundColor: colors.orange,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    courseIndexText: {
      fontSize: 11,
      color: '#ffffff',
      fontWeight: '600',
    },
    courseInputs: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    creditsInput: {
      width: 42,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 6,
      fontSize: 14,
      color: colors.white,
      fontWeight: '600',
      textAlign: 'center',
    },
    gradeButton: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      minWidth: 46,
      alignItems: 'center',
    },
    gradeButtonText: {
      fontSize: 14,
      color: colors.orange,
      fontWeight: '600',
    },
    removeButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(255,100,100,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 6,
    },
    removeButtonText: {
      fontSize: 14,
      color: '#ff6b6b',
      fontWeight: '400',
    },
    // Grade Picker
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.iconButtonBg,
    },
    pickerItemSelected: {
      backgroundColor: 'rgba(245,166,35,0.15)',
    },
    pickerItemLabel: {
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
    },
    pickerItemValue: {
      fontSize: 14,
      color: colors.gray,
    },
    inputLabel: {
      fontSize: 9,
      color: colors.gray,
      textAlign: 'center',
      marginTop: 2,
    },
  });

  const GradePicker = () => {
    if (showGradePicker === null) return null;
    const course = courses.find((c) => c.id === showGradePicker);
    if (!course) return null;

    return (
      <TouchableOpacity
        style={styles.pickerOverlay}
        activeOpacity={1}
        onPress={() => setShowGradePicker(null)}
      >
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Grade</Text>
          </View>
          <ScrollView style={styles.pickerList}>
            {GRADES.map((grade) => (
              <TouchableOpacity
                key={grade.label}
                style={[
                  styles.pickerItem,
                  course.grade === grade.label && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  updateCourse(showGradePicker, 'grade', grade.label);
                  setShowGradePicker(null);
                }}
              >
                <Text style={styles.pickerItemLabel}>{grade.label}</Text>
                <Text style={styles.pickerItemValue}>{grade.value.toFixed(1)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>GPA Calculator</Text>
        <Text style={styles.creditsText}>{getTotalCredits()} credits</Text>
      </View>

      {/* Hero GPA */}
      <View style={styles.heroRow}>
        <Text style={[styles.gpaValue, { color: getGPAColor() }]}>
          {gpa.toFixed(2)}
        </Text>
        <View style={styles.heroMeta}>
          <Text style={styles.gpaLabel}>Your GPA</Text>
        </View>
      </View>

      {/* Courses */}
      <View style={styles.coursesCard}>
        <View style={styles.coursesHeader}>
          <Text style={styles.coursesTitle}>Courses</Text>
          <TouchableOpacity style={styles.addButton} onPress={addCourse}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.coursesList} showsVerticalScrollIndicator={false}>
          {courses.map((course, index) => (
            <View key={course.id} style={styles.courseRow}>
              <View style={styles.courseIndex}>
                <Text style={styles.courseIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.courseInputs}>
                <View>
                  <TextInput
                    style={styles.creditsInput}
                    value={course.credits}
                    onChangeText={(val) => updateCourse(course.id, 'credits', val)}
                    keyboardType="numeric"
                    placeholder="3"
                    placeholderTextColor={colors.gray}
                  />
                  <Text style={styles.inputLabel}>Credits</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.gradeButton}
                    onPress={() => setShowGradePicker(course.id)}
                  >
                    <Text style={styles.gradeButtonText}>{course.grade}</Text>
                  </TouchableOpacity>
                  <Text style={styles.inputLabel}>Grade</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeCourse(course.id)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <GradePicker />

      <View style={{ marginTop: 16 }}>
        <AdBanner size="banner" />
      </View>
    </View>
  );
};
