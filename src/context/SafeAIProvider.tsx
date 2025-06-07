import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { AIAction, AIProcessingStatus } from '../services/ai/types';
import aiService from '../services/ai/models/aiService';
import speechService from '../services/ai/models/speechService';
import conversationService from '../services/ai/models/conversationService';
import { sanitizeInput } from '../services/ai/utils/aiUtils';
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
  setNavigationRef: (ref: any) => void;
}

// Create the context
const AIContext = createContext<AIContextType | undefined>(undefined);

// Create the provider component
export const SafeAIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  debugService.info('SafeAIProvider', 'Initializing SafeAIProvider (no navigation hook)');
  
  const [status, setStatus] = useState<AIProcessingStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [actions, setActions] = useState<AIAction[]>([]);
  const navigationRef = useRef<any>(null);

  // Function to set navigation ref
  const setNavigationRef = useCallback((ref: any) => {
    debugService.info('SafeAIProvider', 'Setting navigation ref');
    navigationRef.current = ref;
  }, []);

  // Handle speech status changes
  useEffect(() => {
    debugService.info('SafeAIProvider', 'Setting up speech service listeners');
    
    let speakStartUnsubscribe: (() => void) | null = null;
    let speakEndUnsubscribe: (() => void) | null = null;
    
    // Wrap in try-catch to prevent crashes during initialization
    try {
      speakStartUnsubscribe = speechService.onSpeakStart(() => {
        debugService.debug('SafeAIProvider', 'Speech started');
        setStatus('speaking');
      });
      
      speakEndUnsubscribe = speechService.onSpeakEnd(() => {
        debugService.debug('SafeAIProvider', 'Speech ended');
        setStatus('idle');
      });
      
      debugService.info('SafeAIProvider', 'Speech service listeners setup complete');
    } catch (error) {
      debugService.error('SafeAIProvider', 'Error setting up speech service listeners', error);
      console.error('Error setting up speech service listeners:', error);
      setStatus('idle');
    }
    
    return () => {
      debugService.debug('SafeAIProvider', 'Cleaning up speech service listeners');
      try {
        if (speakStartUnsubscribe) speakStartUnsubscribe();
        if (speakEndUnsubscribe) speakEndUnsubscribe();
      } catch (error) {
        debugService.error('SafeAIProvider', 'Error cleaning up speech service listeners', error);
        console.error('Error cleaning up speech service listeners:', error);
      }
    };
  }, []);

  /**
   * Send a message to the AI assistant
   */
  const sendMessage = useCallback(async (userMessage: string) => {
    debugService.info('SafeAIProvider', 'sendMessage called', { userMessage });
    
    try {
      // Sanitize input
      const sanitizedInput = sanitizeInput(userMessage);
      if (!sanitizedInput) {
        debugService.warn('SafeAIProvider', 'Empty message after sanitization');
        return;
      }
      
      // Update status
      setStatus('processing');
      
      // Add user message to conversation
      debugService.debug('SafeAIProvider', 'Adding user message to conversation');
      conversationService.addMessage('user', sanitizedInput);
      
      // Get conversation history
      const messages = conversationService.getActiveConversationMessages();
      debugService.debug('SafeAIProvider', 'Retrieved conversation history', { messageCount: messages.length });
      
      // Generate AI response
      debugService.debug('SafeAIProvider', 'Generating AI response');
      const response = await aiService.generateResponse(messages);
      
      // Add AI response to conversation
      conversationService.addMessage('assistant', response.text);
      
      // Update UI with response
      setMessage(response.text);
      setActions(response.actions || []);
      
      // Speak the response if not on web (to avoid issues)
      if (Platform.OS !== 'web') {
        debugService.debug('SafeAIProvider', 'Speaking response');
        try {
          await speechService.speak(response.text);
        } catch (error) {
          debugService.error('SafeAIProvider', 'Speech error', error);
          console.error('Speech error:', error);
          // Continue even if speech fails
        }
      }
      
      // Execute actions if any
      if (response.actions && response.actions.length > 0) {
        handleActions(response.actions);
      }
      
      debugService.info('SafeAIProvider', 'Message processing complete');
      return response;
    } catch (error) {
      debugService.error('SafeAIProvider', 'Error processing message', error);
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
    debugService.debug('SafeAIProvider', 'Handling AI actions', { actionCount: actionList.length });
    
    try {
      actionList.forEach(action => {
        debugService.debug('SafeAIProvider', 'Processing action', { type: action.type });
        
        const navigation = navigationRef.current;
        
        switch (action.type) {
          case 'NAVIGATE':
            if (navigation && action.payload && action.payload.screen) {
              debugService.debug('SafeAIProvider', 'Navigating', { screen: action.payload.screen });
              navigation.navigate(action.payload.screen, action.payload.params);
            } else {
              debugService.warn('SafeAIProvider', 'Navigation not available or missing screen');
            }
            break;
          case 'ADD_PET':
            if (navigation) {
              debugService.debug('SafeAIProvider', 'Navigating to AddPet');
              navigation.navigate('AddPet', action.payload);
            } else {
              debugService.warn('SafeAIProvider', 'Navigation not available for ADD_PET');
            }
            break;
          case 'SCHEDULE_APPOINTMENT':
            // Handle appointment scheduling
            debugService.debug('SafeAIProvider', 'Schedule appointment action', action.payload);
            console.log('Schedule appointment action:', action.payload);
            break;
          case 'SHOW_PET_INFO':
            // Show pet information
            debugService.debug('SafeAIProvider', 'Show pet info action', action.payload);
            console.log('Show pet info action:', action.payload);
            break;
          case 'SHOW_REMINDER':
            // Show reminder
            debugService.debug('SafeAIProvider', 'Show reminder action', action.payload);
            console.log('Show reminder action:', action.payload);
            break;
          default:
            debugService.warn('SafeAIProvider', 'Unknown action type', { type: action.type });
            console.log('Unknown action type:', action.type);
        }
      });
    } catch (error) {
      debugService.error('SafeAIProvider', 'Error handling actions', error);
      console.error('Error handling actions:', error);
    }
  }, []);

  /**
   * Start voice input
   */
  const startListening = useCallback(() => {
    debugService.debug('SafeAIProvider', 'startListening called');
    
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
      debugService.error('SafeAIProvider', 'Error starting listening', error);
      console.error('Error starting listening:', error);
      setIsListening(false);
      setStatus('idle');
    }
  }, [sendMessage]);

  /**
   * Stop voice input
   */
  const stopListening = useCallback(() => {
    debugService.debug('SafeAIProvider', 'stopListening called');
    
    try {
      // In a real app, this would stop speech recognition
      setIsListening(false);
      setStatus('idle');
    } catch (error) {
      debugService.error('SafeAIProvider', 'Error stopping listening', error);
      console.error('Error stopping listening:', error);
      setStatus('idle');
    }
  }, []);

  /**
   * Speak a message
   */
  const speak = useCallback(async (text: string) => {
    debugService.debug('SafeAIProvider', 'speak called', { text });
    
    try {
      if (Platform.OS === 'web') {
        // Just set the message on web to avoid potential crashes
        setMessage(text);
        return;
      }
      
      setMessage(text);
      await speechService.speak(text);
    } catch (error) {
      debugService.error('SafeAIProvider', 'Error speaking', error);
      console.error('Error speaking:', error);
      // Don't update status on error, as it might already be set by the speech service
    }
  }, []);

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(async () => {
    debugService.debug('SafeAIProvider', 'stopSpeaking called');
    
    try {
      if (Platform.OS !== 'web') {
        await speechService.stop();
      }
    } catch (error) {
      debugService.error('SafeAIProvider', 'Error stopping speech', error);
      console.error('Error stopping speech:', error);
      // Ensure status is reset if stop fails
      setStatus('idle');
    }
  }, []);

  /**
   * Clear conversation
   */
  const clearConversation = useCallback(() => {
    debugService.debug('SafeAIProvider', 'clearConversation called');
    
    try {
      conversationService.clearActiveConversation();
      setMessage('');
      setActions([]);
    } catch (error) {
      debugService.error('SafeAIProvider', 'Error clearing conversation', error);
      console.error('Error clearing conversation:', error);
    }
  }, []);

  /**
   * Shortcut to add a new pet
   */
  const addNewPet = useCallback(() => {
    debugService.debug('SafeAIProvider', 'addNewPet called');
    
    try {
      speak("Let's add a new pet to your family! What type of pet would you like to add?");
      const navigation = navigationRef.current;
      if (navigation) {
        navigation.navigate('AddPet');
      } else {
        debugService.warn('SafeAIProvider', 'Navigation not available for addNewPet');
      }
    } catch (error) {
      debugService.error('SafeAIProvider', 'Error navigating to AddPet', error);
      console.error('Error navigating to AddPet:', error);
    }
  }, [speak]);

  debugService.info('SafeAIProvider', 'Rendering SafeAIProvider');

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
      addNewPet,
      setNavigationRef
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