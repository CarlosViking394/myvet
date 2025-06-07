import { useState, useCallback, useEffect } from 'react';
import { AIResponse, AIAction, AIProcessingStatus, Message } from '../services/ai/types';
import aiService from '../services/ai/models/aiService';
import speechService from '../services/ai/models/speechService';
import conversationService from '../services/ai/models/conversationService';
import { sanitizeInput, extractIntents } from '../services/ai/utils/aiUtils';
import { useNavigation } from '@react-navigation/native';

/**
 * Custom hook for AI assistant functionality
 */
export const useAIAssistant = () => {
  const [status, setStatus] = useState<AIProcessingStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [actions, setActions] = useState<AIAction[]>([]);
  const navigation = useNavigation();

  // Handle speech status changes
  useEffect(() => {
    const speakStartUnsubscribe = speechService.onSpeakStart(() => {
      setStatus('speaking');
    });
    
    const speakEndUnsubscribe = speechService.onSpeakEnd(() => {
      setStatus('idle');
    });
    
    return () => {
      speakStartUnsubscribe();
      speakEndUnsubscribe();
    };
  }, []);

  /**
   * Send a message to the AI assistant
   */
  const sendMessage = useCallback(async (userMessage: string) => {
    try {
      // Sanitize input
      const sanitizedInput = sanitizeInput(userMessage);
      if (!sanitizedInput) return;
      
      // Update status
      setStatus('processing');
      
      // Add user message to conversation
      conversationService.addMessage('user', sanitizedInput);
      
      // Get conversation history
      const messages = conversationService.getActiveConversationMessages();
      
      // Generate AI response
      const response = await aiService.generateResponse(messages);
      
      // Add AI response to conversation
      conversationService.addMessage('assistant', response.text);
      
      // Update UI with response
      setMessage(response.text);
      setActions(response.actions || []);
      
      // Speak the response
      await speechService.speak(response.text);
      
      // Execute actions if any
      if (response.actions && response.actions.length > 0) {
        handleActions(response.actions);
      }
      
      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      setStatus('error');
      setMessage('Sorry, I encountered an error. Please try again.');
      return null;
    }
  }, [navigation]);

  /**
   * Handle AI actions
   */
  const handleActions = useCallback((actionList: AIAction[]) => {
    actionList.forEach(action => {
      switch (action.type) {
        case 'NAVIGATE':
          if (action.payload && action.payload.screen) {
            navigation.navigate(action.payload.screen, action.payload.params);
          }
          break;
        case 'ADD_PET':
          navigation.navigate('AddPet', action.payload);
          break;
        case 'SCHEDULE_APPOINTMENT':
          // Handle appointment scheduling
          console.log('Schedule appointment action:', action.payload);
          break;
        case 'SHOW_PET_INFO':
          // Show pet information
          console.log('Show pet info action:', action.payload);
          break;
        case 'SHOW_REMINDER':
          // Show reminder
          console.log('Show reminder action:', action.payload);
          break;
        default:
          console.log('Unknown action type:', action.type);
      }
    });
  }, [navigation]);

  /**
   * Start voice input
   */
  const startListening = useCallback(() => {
    // In a real app, this would activate speech recognition
    setIsListening(true);
    setStatus('listening');
    
    // Simulate receiving speech after 2 seconds
    setTimeout(() => {
      setIsListening(false);
      sendMessage('Tell me about pet vaccinations');
    }, 2000);
  }, [sendMessage]);

  /**
   * Stop voice input
   */
  const stopListening = useCallback(() => {
    // In a real app, this would stop speech recognition
    setIsListening(false);
    setStatus('idle');
  }, []);

  /**
   * Speak a message
   */
  const speak = useCallback(async (text: string) => {
    setMessage(text);
    await speechService.speak(text);
  }, []);

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(async () => {
    await speechService.stop();
  }, []);

  /**
   * Clear conversation
   */
  const clearConversation = useCallback(() => {
    conversationService.clearActiveConversation();
    setMessage('');
    setActions([]);
  }, []);

  return {
    status,
    message,
    isListening,
    actions,
    sendMessage,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearConversation
  };
}; 