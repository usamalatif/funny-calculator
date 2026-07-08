import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import GaslighterCalculator from './GaslighterCalculator';

export default function App() {
  const [surfaceColor, setSurfaceColor] = useState('#0a0a0a');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: surfaceColor }} edges={['top', 'bottom']}>
        <GaslighterCalculator onSurfaceColorChange={setSurfaceColor} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
