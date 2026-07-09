import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID, SQUARE_AD_UNIT_ID } from './adUnitIds';
import { usePremium } from '../iap/PremiumContext';

interface AdBannerProps {
  size?: 'banner' | 'square';
}

export const AdBanner: React.FC<AdBannerProps> = ({ size = 'banner' }) => {
  const [failed, setFailed] = useState(false);
  const { isPremium } = usePremium();

  if (failed || isPremium) return null;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={size === 'square' ? SQUARE_AD_UNIT_ID : BANNER_AD_UNIT_ID}
        size={size === 'square' ? BannerAdSize.MEDIUM_RECTANGLE : BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
