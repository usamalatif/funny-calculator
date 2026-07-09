import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';
import GaslighterCalculator from './GaslighterCalculator';
import { PremiumProvider } from './iap/PremiumContext';

export default function App() {
  const [surfaceColor, setSurfaceColor] = useState('#0a0a0a');

  useEffect(() => {
    mobileAds().initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <PremiumProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: surfaceColor }} edges={['top', 'bottom']}>
          <GaslighterCalculator onSurfaceColorChange={setSurfaceColor} />
        </SafeAreaView>
      </PremiumProvider>
    </SafeAreaProvider>
  );
}
