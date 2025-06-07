import { AIResponse, Message, AIConfig } from '../types';

// Default configuration for the AI model
const DEFAULT_CONFIG: AIConfig = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt: `You are a helpful veterinary assistant named VetBuddy. 
Your role is to help pet owners with basic pet care information, 
schedule appointments, and provide general advice about pet health. 
You should always be friendly, empathetic, and concise. 
When medical questions are beyond your scope, recommend consulting with a veterinarian.`
};

/**
 * Service for interacting with AI language models
 */
class AIService {
  private config: AIConfig;

  constructor(config: Partial<AIConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Update the AI configuration
   */
  updateConfig(config: Partial<AIConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate a response from the AI model
   */
  async generateResponse(messages: Message[]): Promise<AIResponse> {
    try {
      // In a real implementation, you would make an API call to a language model here
      // For now, we'll simulate a response
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const lastMessage = messages[messages.length - 1];
      
      // Simple response logic for demonstration
      let responseText = '';
      let actions = [];
      
      if (lastMessage.content.toLowerCase().includes('appointment')) {
        responseText = "I can help you schedule an appointment. When would you like to visit the veterinarian?";
        actions.push({
          type: 'SCHEDULE_APPOINTMENT',
          payload: { suggested: true }
        });
      } 
      else if (lastMessage.content.toLowerCase().includes('new pet') || 
               lastMessage.content.toLowerCase().includes('add pet')) {
        responseText = "That's exciting! Let's add your new pet to your profile. What type of pet do you have?";
        actions.push({
          type: 'ADD_PET',
          payload: { step: 'species' }
        });
      }
      else if (lastMessage.content.toLowerCase().includes('medication')) {
        responseText = "It's important to follow your vet's instructions for any medication. Would you like me to set a reminder for your pet's medication?";
        actions.push({
          type: 'SHOW_REMINDER',
          payload: { type: 'medication' }
        });
      }
      else {
        responseText = "I'm here to help with any questions about your pets. Would you like information about pet care, scheduling an appointment, or something else?";
      }
      
      return {
        text: responseText,
        isError: false,
        actions
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        text: 'I apologize, but I encountered an error processing your request. Please try again.',
        isError: true
      };
    }
  }

  /**
   * Extract pet-related entities from text
   */
  extractEntities(text: string): Record<string, any> {
    // In a real implementation, this would use NLP to extract entities
    // For now, we'll use simple regex patterns
    
    const entities: Record<string, any> = {};
    
    // Extract pet species
    const speciesMatch = text.match(/(?:dog|cat|bird|fish|hamster|rabbit|turtle|snake)/gi);
    if (speciesMatch) {
      entities.species = speciesMatch[0].toLowerCase();
    }
    
    // Extract pet breeds
    const dogBreeds = ['labrador', 'poodle', 'bulldog', 'shepherd', 'beagle', 'terrier'];
    const catBreeds = ['siamese', 'persian', 'maine coon', 'bengal', 'ragdoll'];
    
    for (const breed of [...dogBreeds, ...catBreeds]) {
      if (text.toLowerCase().includes(breed)) {
        entities.breed = breed;
        break;
      }
    }
    
    return entities;
  }

  /**
   * Get the system prompt
   */
  getSystemPrompt(): string {
    return this.config.systemPrompt;
  }
}

export default new AIService();

 