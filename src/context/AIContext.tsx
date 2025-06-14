import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AIAction, AIProcessingStatus } from '../services/ai/types';
import aiService from '../services/ai/models/aiService';
import speechService from '../services/ai/models/speechService';
import conversationService from '../services/ai/models/conversationService';
import { sanitizeInput } from '../services/ai/utils/aiUtils';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import debugService from '../services/debug/DebugService';

// Define the context type
interface AIContextType {
  message: string;
  status: AIProcessingStatus;
  isListening: boolean;
  actions: AIAction[];
  sendMessage: (text: string) => Promise<any>;
  speak: (text: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  stopSpeaking: () => Promise<void>;
  clearConversation: () => void;
  addNewPet: () => void;
}

// Create the context
const AIContext = createContext<AIContextType | undefined>(undefined);

// Create the provider component
export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  debugService.info('AIProvider', 'Initializing AIProvider');
  
  const [status, setStatus] = useState<AIProcessingStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [actions, setActions] = useState<AIAction[]>([]);
  
  // Wrap navigation hook in try-catch
  let navigation: any = null;
  try {
    debugService.debug('AIProvider', 'Getting navigation from hook');
    navigation = useNavigation();
    debugService.debug('AIProvider', 'Navigation hook successful');
  } catch (error) {
    debugService.error('AIProvider', 'Error getting navigation', error);
    // Navigation might not be available yet, that's ok
  }

  // Handle speech status changes
  useEffect(() => {
    debugService.info('AIProvider', 'Setting up speech service listeners');
    
    let speakStartUnsubscribe: (() => void) | null = null;
    let speakEndUnsubscribe: (() => void) | null = null;
    
    // Wrap in try-catch to prevent crashes during initialization
    try {
      speakStartUnsubscribe = speechService.onSpeakStart(() => {
        debugService.debug('AIProvider', 'Speech started');
        setStatus('speaking');
      });
      
      speakEndUnsubscribe = speechService.onSpeakEnd(() => {
        debugService.debug('AIProvider', 'Speech ended');
        setStatus('idle');
      });
      
      debugService.info('AIProvider', 'Speech service listeners setup complete');
    } catch (error) {
      debugService.error('AIProvider', 'Error setting up speech service listeners', error);
      console.error('Error setting up speech service listeners:', error);
      setStatus('idle');
    }
    
    return () => {
      debugService.debug('AIProvider', 'Cleaning up speech service listeners');
      try {
        if (speakStartUnsubscribe) speakStartUnsubscribe();
        if (speakEndUnsubscribe) speakEndUnsubscribe();
      } catch (error) {
        debugService.error('AIProvider', 'Error cleaning up speech service listeners', error);
        console.error('Error cleaning up speech service listeners:', error);
      }
    };
  }, []);

  /**
   * Send a message to the AI assistant
   */
  const sendMessage = useCallback(async (userMessage: string) => {
    debugService.info('AIProvider', 'sendMessage called', { userMessage });
    
    try {
      // Sanitize input
      const sanitizedInput = sanitizeInput(userMessage);
      if (!sanitizedInput) {
        debugService.warn('AIProvider', 'Empty message after sanitization');
        return;
      }
      
      // Update status
      setStatus('processing');
      
      // Add user message to conversation
      debugService.debug('AIProvider', 'Adding user message to conversation');
      conversationService.addMessage('user', sanitizedInput);
      
      // Get conversation history
      const messages = conversationService.getActiveConversationMessages();
      debugService.debug('AIProvider', 'Retrieved conversation history', { messageCount: messages.length });
      
      // Generate AI response
      debugService.debug('AIProvider', 'Generating AI response');
      const response = await aiService.generateResponse(messages);
      
      // Add AI response to conversation
      conversationService.addMessage('assistant', response.text);
      
      // Update UI with response
      setMessage(response.text);
      setActions(response.actions || []);
      
      // Speak the response if not on web (to avoid issues)
      if (Platform.OS !== 'web') {
        debugService.debug('AIProvider', 'Speaking response');
        try {
          await speechService.speak(response.text);
        } catch (error) {
          debugService.error('AIProvider', 'Speech error', error);
          console.error('Speech error:', error);
          // Continue even if speech fails
        }
      }
      
      // Execute actions if any
      if (response.actions && response.actions.length > 0) {
        handleActions(response.actions);
      }
      
      debugService.info('AIProvider', 'Message processing complete');
      return response;
    } catch (error) {
      debugService.error('AIProvider', 'Error processing message', error);
      console.error('Error processing message:', error);
      setStatus('error');
      setMessage('Sorry, I encountered an error. Please try again.');
      return null;
    }
  }, []);

  /**
   * Handle AI actions
   */
  const handleActions = useCallback((actionList: AIAction[]) => {
    debugService.debug('AIProvider', 'Handling AI actions', { actionCount: actionList.length });
    
    try {
      actionList.forEach(action => {
        debugService.debug('AIProvider', 'Processing action', { type: action.type });
        
        switch (action.type) {
          case 'NAVIGATE':
            if (navigation && action.payload && action.payload.screen) {
              debugService.debug('AIProvider', 'Navigating', { screen: action.payload.screen });
              navigation.navigate(action.payload.screen, action.payload.params);
            } else {
              debugService.warn('AIProvider', 'Navigation not available or missing screen');
            }
            break;
          case 'ADD_PET':
            if (navigation) {
              debugService.debug('AIProvider', 'Navigating to AddPet');
              navigation.navigate('AddPet', action.payload);
            } else {
              debugService.warn('AIProvider', 'Navigation not available for ADD_PET');
            }
            break;
          case 'SCHEDULE_APPOINTMENT':
            // Handle appointment scheduling
            debugService.debug('AIProvider', 'Schedule appointment action', action.payload);
            console.log('Schedule appointment action:', action.payload);
            break;
          case 'SHOW_PET_INFO':
            // Show pet information
            debugService.debug('AIProvider', 'Show pet info action', action.payload);
            console.log('Show pet info action:', action.payload);
            break;
          case 'SHOW_REMINDER':
            // Show reminder
            debugService.debug('AIProvider', 'Show reminder action', action.payload);
            console.log('Show reminder action:', action.payload);
            break;
          default:
            debugService.warn('AIProvider', 'Unknown action type', { type: action.type });
            console.log('Unknown action type:', action.type);
        }
      });
    } catch (error) {
      debugService.error('AIProvider', 'Error handling actions', error);
      console.error('Error handling actions:', error);
    }
  }, [navigation]);

  /**
   * Start voice input
   */
  const startListening = useCallback(() => {
    debugService.debug('AIProvider', 'startListening called');
    
    try {
      // In a real app, this would activate speech recognition
      setIsListening(true);
      setStatus('listening');
      
      // Simulate receiving speech after 2 seconds
      setTimeout(() => {
        setIsListening(false);
        sendMessage('Tell me about pet vaccinations');
      }, 2000);
    } catch (error) {
      debugService.error('AIProvider', 'Error starting listening', error);
      console.error('Error starting listening:', error);
      setIsListening(false);
      setStatus('idle');
    }
  }, [sendMessage]);

  /**
   * Stop voice input
   */
  const stopListening = useCallback(() => {
    debugService.debug('AIProvider', 'stopListening called');
    
    try {
      // In a real app, this would stop speech recognition
      setIsListening(false);
      setStatus('idle');
    } catch (error) {
      debugService.error('AIProvider', 'Error stopping listening', error);
      console.error('Error stopping listening:', error);
      setStatus('idle');
    }
  }, []);

  /**
   * Speak a message
   */
  const speak = useCallback(async (text: string) => {
    debugService.debug('AIProvider', 'speak called', { text });
    
    try {
      if (Platform.OS === 'web') {
        // Just set the message on web to avoid potential crashes
        setMessage(text);
        return;
      }
      
      setMessage(text);
      await speechService.speak(text);
    } catch (error) {
      debugService.error('AIProvider', 'Error speaking', error);
      console.error('Error speaking:', error);
      // Don't update status on error, as it might already be set by the speech service
    }
  }, []);

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(async () => {
    debugService.debug('AIProvider', 'stopSpeaking called');
    
    try {
      if (Platform.OS !== 'web') {
        await speechService.stop();
      }
    } catch (error) {
      debugService.error('AIProvider', 'Error stopping speech', error);
      console.error('Error stopping speech:', error);
      // Ensure status is reset if stop fails
      setStatus('idle');
    }
  }, []);

  /**
   * Clear conversation
   */
  const clearConversation = useCallback(() => {
    debugService.debug('AIProvider', 'clearConversation called');
    
    try {
      conversationService.clearActiveConversation();
      setMessage('');
      setActions([]);
    } catch (error) {
      debugService.error('AIProvider', 'Error clearing conversation', error);
      console.error('Error clearing conversation:', error);
    }
  }, []);

  /**
   * Shortcut to add a new pet
   */
  const addNewPet = useCallback(() => {
    debugService.debug('AIProvider', 'addNewPet called');
    
    try {
      speak("Let's add a new pet to your family! What type of pet would you like to add?");
      if (navigation) {
        navigation.navigate('AddPet');
      } else {
        debugService.warn('AIProvider', 'Navigation not available for addNewPet');
      }
    } catch (error) {
      debugService.error('AIProvider', 'Error navigating to AddPet', error);
      console.error('Error navigating to AddPet:', error);
    }
  }, [navigation, speak]);

  debugService.info('AIProvider', 'Rendering AIProvider');

  return (
    <AIContext.Provider value={{ 
      message, 
      status, 
      isListening,
      actions,
      sendMessage,
      speak,
      startListening,
      stopListening,
      stopSpeaking,
      clearConversation,
      addNewPet
    }}>
      {children}
    </AIContext.Provider>
  );
};

// Create a custom hook to use the AI context
export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

// Export the context
export default AIContext;
