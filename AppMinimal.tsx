import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppMinimal() {
  console.log('AppMinimal: Rendering');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Minimal App - If you see this, basic React Native works!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
}); 