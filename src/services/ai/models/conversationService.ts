import { Conversation, Message } from '../types';
import { v4 as uuidv4 } from 'uuid'; // Note: You'd need to install this package

/**
 * Service for managing conversations with the AI
 */
class ConversationService {
  private conversations: Conversation[] = [];
  private activeConversationId: string | null = null;

  constructor() {
    // Initialize with a default conversation
    this.createNewConversation();
  }

  /**
   * Create a new conversation
   */
  createNewConversation(title?: string): string {
    const now = new Date();
    const conversationId = uuidv4();
    
    const conversation: Conversation = {
      id: conversationId,
      messages: [],
      title: title || `Conversation ${this.conversations.length + 1}`,
      createdAt: now,
      updatedAt: now
    };
    
    this.conversations.push(conversation);
    this.activeConversationId = conversationId;
    
    return conversationId;
  }

  /**
   * Add a message to the active conversation
   */
  addMessage(role: 'user' | 'assistant' | 'system', content: string): Message {
    if (!this.activeConversationId) {
      this.createNewConversation();
    }
    
    const message: Message = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date()
    };
    
    const conversation = this.getActiveConversation();
    if (conversation) {
      conversation.messages.push(message);
      conversation.updatedAt = new Date();
    }
    
    return message;
  }

  /**
   * Get all messages from the active conversation
   */
  getActiveConversationMessages(): Message[] {
    const conversation = this.getActiveConversation();
    return conversation ? conversation.messages : [];
  }

  /**
   * Get the active conversation
   */
  getActiveConversation(): Conversation | null {
    if (!this.activeConversationId) return null;
    
    return this.conversations.find(
      conversation => conversation.id === this.activeConversationId
    ) || null;
  }

  /**
   * Set the active conversation
   */
  setActiveConversation(conversationId: string): boolean {
    const exists = this.conversations.some(
      conversation => conversation.id === conversationId
    );
    
    if (exists) {
      this.activeConversationId = conversationId;
      return true;
    }
    
    return false;
  }

  /**
   * Get all conversations
   */
  getAllConversations(): Conversation[] {
    return [...this.conversations];
  }

  /**
   * Delete a conversation
   */
  deleteConversation(conversationId: string): boolean {
    const initialLength = this.conversations.length;
    
    this.conversations = this.conversations.filter(
      conversation => conversation.id !== conversationId
    );
    
    if (this.activeConversationId === conversationId) {
      this.activeConversationId = this.conversations.length > 0 
        ? this.conversations[0].id 
        : null;
    }
    
    return this.conversations.length < initialLength;
  }

  /**
   * Clear all messages from the active conversation
   */
  clearActiveConversation(): void {
    const conversation = this.getActiveConversation();
    if (conversation) {
      conversation.messages = [];
      conversation.updatedAt = new Date();
    }
  }
}

export default new ConversationService(); 