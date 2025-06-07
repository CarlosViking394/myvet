import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import debugService from '../services/debug/DebugService';
import { SafeAreaView } from 'react-native-safe-area-context';

const DebugTestScreen = () => {
  debugService.info('DebugTestScreen', 'Rendering DebugTestScreen');

  const runTests = () => {
    debugService.info('DebugTestScreen', 'Running tests...');

    // Test 1: Basic functionality
    debugService.debug('Test', 'Test 1: Basic debug logging works');

    // Test 2: Error logging
    try {
      throw new Error('Test error - this is intentional');
    } catch (error) {
      debugService.error('Test', 'Test 2: Error logging works', error);
    }

    // Test 3: Warning
    debugService.warn('Test', 'Test 3: Warning logging works');

    // Test 4: Multiple logs
    for (let i = 0; i < 5; i++) {
      debugService.debug('Test', `Test 4: Multiple logs - ${i}`);
    }

    debugService.info('DebugTestScreen', 'All tests completed');
  };

  const testSpeech = async () => {
    debugService.info('DebugTestScreen', 'Testing speech service...');
    
    try {
      const { default: speechService } = await import('../services/ai/models/speechService');
      await speechService.speak('This is a test of the speech service');
      debugService.info('DebugTestScreen', 'Speech test completed');
    } catch (error) {
      debugService.error('DebugTestScreen', 'Speech test failed', error);
    }
  };

  const testAIService = async () => {
    debugService.info('DebugTestScreen', 'Testing AI service...');
    
    try {
      const { default: aiService } = await import('../services/ai/models/aiService');
      const response = await aiService.generateResponse([
        { id: '1', role: 'user', content: 'Hello', timestamp: new Date() }
      ]);
      debugService.info('DebugTestScreen', 'AI test completed', response);
    } catch (error) {
      debugService.error('DebugTestScreen', 'AI test failed', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Debug Test Screen</Text>
        <Text style={styles.subtitle}>Use this screen to test components</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Debug Service Tests</Text>
          <Button title="Run Debug Tests" onPress={runTests} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speech Service Test</Text>
          <Button title="Test Speech" onPress={testSpeech} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Service Test</Text>
          <Button title="Test AI" onPress={testAIService} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Info</Text>
          <Text style={styles.info}>{JSON.stringify(debugService.getSystemInfo(), null, 2)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  info: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#475569',
  },
});

export default DebugTestScreen; 