import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const hapticKeyPress = () => {
  ReactNativeHapticFeedback.trigger('impactLight', options);
};

export const hapticEquals = () => {
  ReactNativeHapticFeedback.trigger('impactHeavy', options);
};
