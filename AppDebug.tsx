import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import DebugOverlay from './src/components/DebugOverlay';
import DebugTestScreen from './src/screens/DebugTestScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import debugService from './src/services/debug/DebugService';

// Initialize debug service
debugService.info('AppDebug', 'Debug app starting');

export default function AppDebug() {
  debugService.info('AppDebug', 'AppDebug component rendering');

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <DebugTestScreen />
        <DebugOverlay />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
} 