import { Message } from '../types';

/**
 * Utility functions for AI processing
 */

/**
 * Format messages for sending to AI models
 */
export const formatMessagesForAI = (messages: Message[]): any[] => {
  return messages.map(message => ({
    role: message.role,
    content: message.content
  }));
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  // Remove any HTML/script tags for security
  const sanitized = input.replace(/<[^>]*>?/gm, '');
  
  // Trim whitespace
  return sanitized.trim();
};

/**
 * Calculate a smart delay for typing animation
 * Words per minute: ~200 for average reading speed
 */
export const calculateTypingDelay = (text: string): number => {
  const wordCount = text.split(/\s+/).length;
  const averageReadingTimeMs = (wordCount / 200) * 60 * 1000;
  
  // Cap minimum and maximum times
  return Math.min(Math.max(averageReadingTimeMs, 1000), 5000);
};

/**
 * Extract potential action intents from user input
 */
export const extractIntents = (input: string): string[] => {
  const intents: string[] = [];
  
  const intentPatterns = [
    { pattern: /add (a )?pet|new pet|register pet/i, intent: 'ADD_PET' },
    { pattern: /(book|schedule|make)( a)? (vet )?appointment/i, intent: 'SCHEDULE_APPOINTMENT' },
    { pattern: /(check|view|see) (my )?(pet|animal)('s)? (health|record|info)/i, intent: 'VIEW_PET_INFO' },
    { pattern: /(remind|reminder|alert) (me )?(about|for) (medicine|medication|pill|vaccine)/i, intent: 'MEDICATION_REMINDER' }
  ];
  
  for (const { pattern, intent } of intentPatterns) {
    if (pattern.test(input)) {
      intents.push(intent);
    }
  }
  
  return intents;
};

/**
 * Generate a random greeting
 */
export const getRandomGreeting = (): string => {
  const greetings = [
    "How can I help with your pet today?",
    "What would you like to know about your pet's health?",
    "How may I assist you with your pet care needs?",
    "What pet-related questions do you have today?",
    "How can I help you and your furry friend today?"
  ];
  
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};

/**
 * Truncate long text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - 3) + '...';
}; 