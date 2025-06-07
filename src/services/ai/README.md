# MyVet AI Architecture

This document provides an overview of the MyVet AI agent architecture.

## Overview

The MyVet AI agent is designed to help pet owners manage their pets' health and care. It provides a conversational interface that can:

- Answer questions about pet care
- Help schedule veterinary appointments
- Manage pet records
- Provide reminders for medications and vaccinations
- Offer general advice about pet health

## Architecture Components

The AI system is organized into several key components:

### Core Services

1. **AI Service** (`aiService.ts`) - Handles interactions with language models, processes user queries, and generates appropriate responses.

2. **Speech Service** (`speechService.ts`) - Manages text-to-speech functionality for the assistant's voice output.

3. **Conversation Service** (`conversationService.ts`) - Maintains conversation history and context for ongoing interactions.

### Utilities and Helpers

- **AI Utilities** (`aiUtils.ts`) - Provides helper functions for processing text, extracting intents, and formatting messages.

### Types and Interfaces

- **AI Types** (`types/index.ts`) - Defines TypeScript interfaces and types for the AI system.

### React Integration

- **AI Context** (`AIContext.tsx`) - Provides a React context for accessing AI functionality throughout the app.
- **AI Assistant Hook** (`useAIAssistant.ts`) - Custom React hook for using the AI assistant in components.
- **AI Assistant Component** (`AIAssistant.tsx`) - Visual component for interacting with the AI assistant.

## Data Flow

1. User input (text or voice) is captured via the UI
2. Input is processed by the AI service
3. AI generates a response based on the input and conversation history
4. Response is displayed in the UI and spoken via the speech service
5. Any actions requested by the user are executed

## Key Features

- **Context-Aware Conversations**: The system maintains conversation history to provide more relevant responses.
- **Intent Recognition**: The system can identify user intents (e.g., scheduling an appointment) from natural language.
- **Action Execution**: The AI can trigger specific actions in the app based on user requests.
- **Voice Interface**: Users can interact with the assistant using voice commands.

## Extension Points

The architecture is designed to be extensible:

- **Add New Intents**: Extend the intent recognition system to handle more user requests.
- **Integrate Real AI Models**: Replace the simulated AI with connections to real language models like OpenAI's GPT or other APIs.
- **Add Speech Recognition**: Implement real speech recognition for the voice interface.
- **Expand Domain Knowledge**: Add more pet-specific knowledge and responses.

## Usage Example

```typescript
// Using the AI assistant in a component
import { useAI } from '../context/AIContext';

const MyComponent = () => {
  const { sendMessage, message, status } = useAI();
  
  const handleSubmit = () => {
    sendMessage("I need to schedule a vaccination for my dog");
  };
  
  return (
    <View>
      <Text>{message}</Text>
      <Button onPress={handleSubmit} title="Ask" />
    </View>
  );
};
``` 