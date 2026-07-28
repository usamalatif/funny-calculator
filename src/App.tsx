import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import analytics from '@react-native-firebase/analytics';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import GaslighterCalculator from './GaslighterCalculator';
import { PremiumProvider } from './iap/PremiumContext';

export default function App() {
  const [surfaceColor, setSurfaceColor] = useState('#0a0a0a');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      // Apple requires this system prompt before SDKs that may track users are used.
      if (Platform.OS === 'ios') {
        const status = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);

        if (status === RESULTS.DENIED) {
          await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        }
      }

      await mobileAds().initialize();
      await analytics().logAppOpen().catch(() => {});
      setIsReady(true);
    };

    prepareApp().catch(() => {
      // Do not leave the app on its launch screen if an SDK is unavailable.
      setIsReady(true);
    });
  }, []);

  // Do not mount ad components until ATT has been handled and AdMob is initialized.
  if (!isReady) return null;

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
