import analytics from '@react-native-firebase/analytics';

export const logCalculatorEquals = (operator: string) => {
  analytics().logEvent('calculator_equals', { operator }).catch(() => {});
};

export const logModeSwitch = (mode: string) => {
  analytics().logEvent('calculator_mode_switch', { mode }).catch(() => {});
};

export const logModeLocked = (mode: string) => {
  analytics().logEvent('calculator_mode_locked_tap', { mode }).catch(() => {});
};

export const logRewardedAdEarned = (mode: string) => {
  analytics().logEvent('rewarded_ad_earned', { mode }).catch(() => {});
};

export const logPremiumPurchase = (productId: string) => {
  analytics().logEvent('premium_purchase', { product_id: productId }).catch(() => {});
};

export const logThemeChange = (isDarkTheme: boolean) => {
  analytics().logEvent('theme_change', { theme: isDarkTheme ? 'dark' : 'light' }).catch(() => {});
};
