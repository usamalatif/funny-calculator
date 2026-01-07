import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import GaslighterCalculator from './GaslighterCalculator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <GaslighterCalculator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
