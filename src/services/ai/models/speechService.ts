import { SpeechConfig } from '../types';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

// Default speech configuration
const DEFAULT_CONFIG: SpeechConfig = {
  voice: '', // Will use default voice
  rate: 1.0,
  pitch: 1.0
};

/**
 * Service for handling text-to-speech functionality
 */
class SpeechService {
  private config: SpeechConfig;
  private isSpeaking: boolean = false;
  private onSpeakStartCallbacks: (() => void)[] = [];
  private onSpeakEndCallbacks: (() => void)[] = [];
  private isAvailable: boolean = false;

  constructor(config: Partial<SpeechConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize Expo Speech
    if (Platform.OS !== 'web') {
      this.initSpeech().catch(error => {
        console.error('Failed to initialize speech service:', error);
      });
    }
  }

  /**
   * Initialize Expo Speech and check availability
   */
  private async initSpeech(): Promise<void> {
    if (Platform.OS === 'web') {
      this.isAvailable = false;
      return;
    }
    
    try {
      // In newer versions of expo-speech, we just assume it's available
      // if the module loaded successfully
      this.isAvailable = true;
      
      // Try to get voices as a way to test if speech is working
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        if (!voices || voices.length === 0) {
          console.warn('No speech voices available on this device');
        }
      } catch (voiceError) {
        console.warn('Could not retrieve voices, but proceeding:', voiceError);
      }
    } catch (error) {
      console.error('Error initializing speech:', error);
      this.isAvailable = false;
    }
  }

  /**
   * Update speech configuration
   */
  updateConfig(config: Partial<SpeechConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Convert text to speech using Expo Speech
   */
  async speak(text: string): Promise<void> {
    // Check if platform is web or speech isn't available
    if (Platform.OS === 'web' || !this.isAvailable) {
      console.log('Speech not available, simulating speech');
      this.isSpeaking = true;
      this.notifySpeakStart();
      
      // Simulate speech with timeout
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.isSpeaking = false;
          this.notifySpeakEnd();
          resolve();
        }, Math.min(text.length * 90, 5000)); // About 90ms per character, max 5 seconds
      });
    }
    
    if (this.isSpeaking) {
      try {
        await this.stop();
      } catch (error) {
        console.error('Error stopping previous speech:', error);
        // Continue even if stopping fails
      }
    }

    try {
      this.isSpeaking = true;
      this.notifySpeakStart();
      
      return new Promise<void>((resolve, reject) => {
        try {
          const options = {
            rate: this.config.rate,
            pitch: this.config.pitch,
            voice: this.config.voice || undefined,
            onStart: () => {
              console.log('Speech started');
            },
            onDone: () => {
              console.log('Speech finished');
              this.isSpeaking = false;
              this.notifySpeakEnd();
              resolve();
            },
            onStopped: () => {
              console.log('Speech stopped');
              this.isSpeaking = false;
              this.notifySpeakEnd();
              resolve();
            },
            onError: (error: any) => {
              console.error('Speech error:', error);
              this.isSpeaking = false;
              this.notifySpeakEnd();
              reject(error);
            }
          };
          
          Speech.speak(text, options);
        } catch (error) {
          console.error('Error during speech.speak call:', error);
          this.isSpeaking = false;
          this.notifySpeakEnd();
          reject(error);
        }
      });
    } catch (error) {
      console.error('Error during speech synthesis:', error);
      this.isSpeaking = false;
      this.notifySpeakEnd();
      throw error;
    }
  }

  /**
   * Stop current speech
   */
  async stop(): Promise<void> {
    if (!this.isSpeaking || Platform.OS === 'web' || !this.isAvailable) {
      return;
    }
    
    try {
      await Speech.stop();
      this.isSpeaking = false;
      this.notifySpeakEnd();
    } catch (error) {
      console.error('Error stopping speech:', error);
      // Set state to not speaking even if stop fails
      this.isSpeaking = false;
      this.notifySpeakEnd();
      throw error;
    }
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<any[]> {
    if (Platform.OS === 'web' || !this.isAvailable) {
      return [];
    }
    
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  }

  /**
   * Check if speech is in progress
   */
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Register callback for speech start
   */
  onSpeakStart(callback: () => void): () => void {
    this.onSpeakStartCallbacks.push(callback);
    
    // Return function to unregister callback
    return () => {
      this.onSpeakStartCallbacks = this.onSpeakStartCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register callback for speech end
   */
  onSpeakEnd(callback: () => void): () => void {
    this.onSpeakEndCallbacks.push(callback);
    
    // Return function to unregister callback
    return () => {
      this.onSpeakEndCallbacks = this.onSpeakEndCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all registered callbacks that speech started
   */
  private notifySpeakStart(): void {
    try {
      this.onSpeakStartCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in speak start callback:', error);
        }
      });
    } catch (error) {
      console.error('Error notifying speak start:', error);
    }
  }

  /**
   * Notify all registered callbacks that speech ended
   */
  private notifySpeakEnd(): void {
    try {
      this.onSpeakEndCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in speak end callback:', error);
        }
      });
    } catch (error) {
      console.error('Error notifying speak end:', error);
    }
  }
}

export default new SpeechService(); 