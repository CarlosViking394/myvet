import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import debugService from './src/services/debug/DebugService';

// Test stages
const STAGES = {
  MINIMAL: 'minimal',
  SAFE_AREA: 'safeArea',
  DEBUG_SERVICE: 'debugService',
  FONT_LOADING: 'fontLoading',
  PROVIDERS: 'providers',
  NAVIGATION: 'navigation',
  FULL: 'full'
};

export default function AppProgressive() {
  const [stage, setStage] = useState(STAGES.MINIMAL);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(`AppProgressive: Current stage - ${stage}`);

  // Test font loading
  const testFontLoading = async () => {
    try {
      await Font.loadAsync({
        'Manrope-Regular': require('./assets/fonts/Manrope-Regular.ttf'),
      });
      setFontLoaded(true);
      console.log('Fonts loaded successfully');
    } catch (err) {
      setError(`Font loading error: ${err}`);
      console.error('Font loading error:', err);
    }
  };

  // Render based on stage
  const renderContent = () => {
    switch (stage) {
      case STAGES.MINIMAL:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Stage 1: Minimal</Text>
            <Text>Basic React Native works!</Text>
            <Button title="Next: Test SafeArea" onPress={() => setStage(STAGES.SAFE_AREA)} />
          </View>
        );

      case STAGES.SAFE_AREA:
        return (
          <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
              <Text style={styles.title}>Stage 2: SafeArea</Text>
              <Text>SafeAreaProvider works!</Text>
              <Button title="Next: Test Debug Service" onPress={() => setStage(STAGES.DEBUG_SERVICE)} />
            </SafeAreaView>
          </SafeAreaProvider>
        );

      case STAGES.DEBUG_SERVICE:
        debugService.info('AppProgressive', 'Testing debug service');
        return (
          <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
              <Text style={styles.title}>Stage 3: Debug Service</Text>
              <Text>Debug service initialized!</Text>
              <Button title="Test Debug Log" onPress={() => debugService.info('Test', 'Button pressed')} />
              <Button title="Next: Test Font Loading" onPress={() => setStage(STAGES.FONT_LOADING)} />
            </SafeAreaView>
          </SafeAreaProvider>
        );

      case STAGES.FONT_LOADING:
        return (
          <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
              <Text style={styles.title}>Stage 4: Font Loading</Text>
              <Text>Font loaded: {fontLoaded ? 'Yes' : 'No'}</Text>
              {!fontLoaded && <Button title="Load Fonts" onPress={testFontLoading} />}
              <Button title="Next: Test Providers" onPress={() => setStage(STAGES.PROVIDERS)} />
            </SafeAreaView>
          </SafeAreaProvider>
        );

      case STAGES.PROVIDERS:
        // Import providers dynamically to test them
        const TestProviders = () => {
          try {
            const { PetProvider } = require('./src/context/PetContext');
            const { VetProvider } = require('./src/context/VetContext');
            
            return (
              <PetProvider>
                <VetProvider>
                  <View style={styles.container}>
                    <Text style={styles.title}>Stage 5: Providers</Text>
                    <Text>Context providers work!</Text>
                    <Button title="Next: Test Navigation" onPress={() => setStage(STAGES.NAVIGATION)} />
                  </View>
                </VetProvider>
              </PetProvider>
            );
          } catch (err) {
            return (
              <View style={styles.container}>
                <Text style={styles.title}>Provider Error</Text>
                <Text style={styles.error}>{String(err)}</Text>
              </View>
            );
          }
        };
        
        return (
          <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
              <TestProviders />
            </SafeAreaView>
          </SafeAreaProvider>
        );

      case STAGES.NAVIGATION:
        // Test navigation container
        try {
          const { NavigationContainer } = require('@react-navigation/native');
          return (
            <SafeAreaProvider>
              <NavigationContainer>
                <SafeAreaView style={styles.container}>
                  <Text style={styles.title}>Stage 6: Navigation</Text>
                  <Text>Navigation container works!</Text>
                  <Button title="Next: Full App" onPress={() => setStage(STAGES.FULL)} />
                </SafeAreaView>
              </NavigationContainer>
            </SafeAreaProvider>
          );
        } catch (err) {
          return (
            <SafeAreaProvider>
              <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Navigation Error</Text>
                <Text style={styles.error}>{String(err)}</Text>
              </SafeAreaView>
            </SafeAreaProvider>
          );
        }

      default:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Test Complete</Text>
            <Text>All components tested successfully!</Text>
            <Button title="Reset" onPress={() => setStage(STAGES.MINIMAL)} />
          </View>
        );
    }
  };

  return (
    <View style={styles.wrapper}>
      {error && (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  errorBar: {
    backgroundColor: '#ffcccc',
    padding: 10,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  errorText: {
    color: '#cc0000',
    textAlign: 'center',
  },
}); 