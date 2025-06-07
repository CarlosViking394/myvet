import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { View, Text, LogBox } from 'react-native';

import MainNavigator from './src/navigation/MainNavigator';
import { PetProvider } from './src/context/PetContext';
import { VetProvider } from './src/context/VetContext';
import { SafeAIProvider } from './src/context/SafeAIProvider';
import AIAssistant from './src/components/AIAssistant';
import ErrorBoundary from './src/components/ErrorBoundary';
import DebugOverlay from './src/components/DebugOverlay';
import debugService from './src/services/debug/DebugService';

// Initialize debug service first
debugService.info('App', 'Application starting');

// Ignore specific warnings that might be coming from dependencies
LogBox.ignoreLogs([
  'Require cycle:',
  'ViewPropTypes will be removed',
  'Non-serializable values were found in the navigation state',
]);

// Add a global error handler for promise rejections
if (__DEV__) {
  debugService.info('App', 'Setting up development error handlers');
  
  // In development, show the error
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Check if this is a React Native error
    if (
      typeof args[0] === 'string' && 
      (args[0].startsWith('Warning:') || args[0].includes('RCTBridge'))
    ) {
      // Log but don't crash
      return originalConsoleError(...args);
    }
    return originalConsoleError(...args);
  };
} else {
  // In production, just log the error
  console.error = (...args) => {
    console.log('Error in production:', ...args);
  };
}

export default function App() {
  debugService.info('App', 'App component rendering');
  
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    debugService.info('App', 'App component mounted, starting font loading');
    
    async function loadFonts() {
      try {
        debugService.debug('App', 'Loading fonts...');
        
        await Font.loadAsync({
          'Manrope-Regular': require('./assets/fonts/Manrope-Regular.ttf'),
          'Manrope-Medium': require('./assets/fonts/Manrope-Regular.ttf'), // Using Regular as fallback
          'Manrope-Bold': require('./assets/fonts/Manrope-Regular.ttf'),   // Using Regular as fallback
          'Manrope-ExtraBold': require('./assets/fonts/Manrope-Regular.ttf') // Using Regular as fallback
        });
        
        debugService.info('App', 'Fonts loaded successfully');
        setFontsLoaded(true);
      } catch (error) {
        debugService.error('App', 'Error loading fonts', error);
        console.error('Error loading fonts:', error);
        // Proceed without custom fonts if there's an error
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    debugService.debug('App', 'Waiting for fonts to load');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
        <DebugOverlay />
      </View>
    );
  }

  debugService.info('App', 'Fonts loaded, rendering main app');
  
  // Log provider hierarchy
  debugService.debug('App', 'Starting provider hierarchy');

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PetProvider>
          <VetProvider>
            <SafeAIProvider>
              <NavigationContainer>
                <StatusBar style="dark" />
                <MainNavigator />
                <AIAssistant />
              </NavigationContainer>
            </SafeAIProvider>
          </VetProvider>
        </PetProvider>
        <DebugOverlay />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
