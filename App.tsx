import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { View, Text } from 'react-native';

import MainNavigator from './src/navigation/MainNavigator';
import { PetProvider } from './src/context/PetContext';
import { VetProvider } from './src/context/VetContext';
import { AIProvider } from './src/context/AIContext';
import AIAssistant from './src/components/AIAssistant';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Manrope-Regular': require('./assets/fonts/Manrope-Regular.ttf'),
          'Manrope-Medium': require('./assets/fonts/Manrope-Regular.ttf'), // Using Regular as fallback
          'Manrope-Bold': require('./assets/fonts/Manrope-Regular.ttf'),   // Using Regular as fallback
          'Manrope-ExtraBold': require('./assets/fonts/Manrope-Regular.ttf') // Using Regular as fallback
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Proceed without custom fonts if there's an error
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PetProvider>
        <VetProvider>
          <AIProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <MainNavigator />
              <AIAssistant />
            </NavigationContainer>
          </AIProvider>
        </VetProvider>
      </PetProvider>
    </SafeAreaProvider>
  );
}
