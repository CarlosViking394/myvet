import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { useAI } from '../context/SafeAIProvider';

/**
 * Test component for AI services
 */
const AIAssistantTest = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { sendMessage, message, status, speak } = useAI();

  // Clear any errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (input.trim()) {
      try {
        setError(null);
        await sendMessage(input);
        setInput('');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Error sending message: ${errorMessage}`);
        console.error('Error in handleSubmit:', err);
      }
    }
  };

  const handleTestVoice = async () => {
    try {
      setError(null);
      await speak('This is a test of the speech service with Expo SDK 53.0.0.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error testing voice: ${errorMessage}`);
      console.error('Error in handleTestVoice:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        {status === 'processing' && (
          <ActivityIndicator size="small" color="#47b4ea" style={styles.indicator} />
        )}
        <Text style={styles.messageText}>{message || 'Ask me something about pet care!'}</Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="#a1a1aa"
        />
        <Button title="Send" onPress={handleSubmit} disabled={status === 'processing'} />
      </View>

      <View style={styles.testButtonContainer}>
        <Button 
          title="Test Voice" 
          onPress={handleTestVoice} 
          disabled={status === 'speaking' || status === 'processing'} 
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Status: {status}</Text>
        <Text style={styles.infoText}>Platform: {Platform.OS}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  messageContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginBottom: 16,
    position: 'relative',
  },
  messageText: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },
  indicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    color: '#1e293b',
  },
  testButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  infoContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoText: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 4,
  },
});

export default AIAssistantTest; 