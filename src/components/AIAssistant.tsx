import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Easing,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAI } from '../context/SafeAIProvider';

const AIAssistant = () => {
  const { message, status, isListening, startListening, stopListening } = useAI();
  const mouthAnimation = useRef(new Animated.Value(0)).current;
  const listeningAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (status === 'speaking') {
      // Start mouth animation when speaking
      Animated.loop(
        Animated.sequence([
          Animated.timing(mouthAnimation, {
            toValue: 1,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(mouthAnimation, {
            toValue: 0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      // Stop animation when not speaking
      mouthAnimation.stopAnimation();
      mouthAnimation.setValue(0);
    }
  }, [status]);
  
  useEffect(() => {
    if (isListening) {
      // Start listening animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(listeningAnimation, {
            toValue: 1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(listeningAnimation, {
            toValue: 0,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      // Stop animation when not listening
      listeningAnimation.stopAnimation();
      listeningAnimation.setValue(0);
    }
  }, [isListening]);
  
  // Interpolate mouth height based on animation value
  const mouthHeight = mouthAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 15],
  });
  
  // Interpolate mic button background color based on animation value
  const micBackgroundColor = listeningAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#47b4ea', '#f87171'],
  });

  // Handle mic button press
  const handleMicPress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Render loading indicator if processing
  const renderStatusIndicator = () => {
    if (status === 'processing') {
      return <ActivityIndicator size="small" color="#47b4ea" style={styles.statusIndicator} />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        {renderStatusIndicator()}
        <Text style={styles.messageText}>{message}</Text>
      </View>
      
      <View style={styles.assistantContainer}>
        <View style={styles.faceContainer}>
          {/* Eyes */}
          <View style={styles.eyesContainer}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          
          {/* Animated Mouth */}
          <Animated.View 
            style={[
              styles.mouth,
              { height: mouthHeight }
            ]} 
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.micButton,
            isListening && styles.micButtonActive
          ]} 
          onPress={handleMicPress}
        >
          <Animated.View 
            style={[
              styles.micButtonBackground,
              { backgroundColor: micBackgroundColor }
            ]}
          />
          <Ionicons name="mic" size={24} color="white" style={styles.micIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#e2e8f0',
    paddingBottom: 20, // For safe area
  },
  messageContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 70,
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: '#1e293b',
    textAlign: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  assistantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  faceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  eye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e293b',
    marginHorizontal: 8,
  },
  mouth: {
    width: 30,
    height: 5,
    backgroundColor: '#1e293b',
    borderRadius: 3,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  micButtonBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#47b4ea',
  },
  micButtonActive: {
    shadowColor: '#f87171',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  micIcon: {
    zIndex: 1,
  },
});

export default AIAssistant;
