import { useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

export const useAnimations = () => {
  // Shake animation values
  const shakeX = useRef(new Animated.Value(0)).current;
  const shakeRotate = useRef(new Animated.Value(0)).current;

  // Smash animation value
  const smashScale = useRef(new Animated.Value(1)).current;

  // Glitch animation values
  const glitchX = useRef(new Animated.Value(0)).current;
  const glitchY = useRef(new Animated.Value(0)).current;

  // Display pulse animation
  const displayPulse = useRef(new Animated.Value(1)).current;

  // Roast bubble animation
  const roastOpacity = useRef(new Animated.Value(0)).current;
  const roastTranslateY = useRef(new Animated.Value(-15)).current;
  const roastScale = useRef(new Animated.Value(0.95)).current;

  const shake = useCallback(() => {
    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: -1.5, duration: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(shakeX, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: 1.5, duration: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: -1.5, duration: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(shakeX, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: 1.5, duration: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(shakeX, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: -0.5, duration: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(shakeX, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: 0.5, duration: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(shakeX, { toValue: -3, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(shakeX, { toValue: 3, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(shakeX, { toValue: -1, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(shakeX, { toValue: 0, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]),
    ]);
    sequence.start();
  }, [shakeX, shakeRotate]);

  const smash = useCallback(() => {
    Animated.sequence([
      Animated.timing(smashScale, {
        toValue: 0.92,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(smashScale, {
        toValue: 1.05,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(smashScale, {
        toValue: 0.97,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(smashScale, {
        toValue: 1.02,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(smashScale, {
        toValue: 1,
        duration: 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [smashScale]);

  const glitch = useCallback(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(glitchX, { toValue: -4, duration: 60, useNativeDriver: true }),
        Animated.timing(glitchY, { toValue: 3, duration: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(glitchX, { toValue: 4, duration: 60, useNativeDriver: true }),
        Animated.timing(glitchY, { toValue: -3, duration: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(glitchX, { toValue: -3, duration: 60, useNativeDriver: true }),
        Animated.timing(glitchY, { toValue: -2, duration: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(glitchX, { toValue: 3, duration: 60, useNativeDriver: true }),
        Animated.timing(glitchY, { toValue: 2, duration: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(glitchX, { toValue: -2, duration: 60, useNativeDriver: true }),
        Animated.timing(glitchY, { toValue: 3, duration: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(glitchX, { toValue: 2, duration: 60, useNativeDriver: true }),
        Animated.timing(glitchY, { toValue: -2, duration: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(glitchX, { toValue: 0, duration: 60, useNativeDriver: true }),
        Animated.timing(glitchY, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]),
    ]).start();
  }, [glitchX, glitchY]);

  const triggerDisplayPulse = useCallback(() => {
    Animated.sequence([
      Animated.timing(displayPulse, {
        toValue: 1.03,
        duration: 75,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(displayPulse, {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [displayPulse]);

  const showRoastBubble = useCallback(() => {
    roastOpacity.setValue(0);
    roastTranslateY.setValue(-15);
    roastScale.setValue(0.95);

    Animated.parallel([
      Animated.timing(roastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(roastTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(roastScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [roastOpacity, roastTranslateY, roastScale]);

  const hideRoastBubble = useCallback(() => {
    Animated.parallel([
      Animated.timing(roastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(roastTranslateY, {
        toValue: -15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(roastScale, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [roastOpacity, roastTranslateY, roastScale]);

  // Interpolate rotation for shake
  const shakeRotateInterpolate = shakeRotate.interpolate({
    inputRange: [-2, 0, 2],
    outputRange: ['-2deg', '0deg', '2deg'],
  });

  return {
    // Shake
    shakeX,
    shakeRotate: shakeRotateInterpolate,
    shake,

    // Smash
    smashScale,
    smash,

    // Glitch
    glitchX,
    glitchY,
    glitch,

    // Display pulse
    displayPulse,
    triggerDisplayPulse,

    // Roast bubble
    roastOpacity,
    roastTranslateY,
    roastScale,
    showRoastBubble,
    hideRoastBubble,
  };
};
