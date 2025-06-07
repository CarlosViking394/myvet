import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the context type
interface AIContextType {
  message: string;
  isSpeaking: boolean;
  speak: (text: string) => void;
  addNewPet: () => void;
}

// Create the context
const AIContext = createContext<AIContextType | undefined>(undefined);

// Create the provider component
export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const speak = (text: string) => {
    setMessage(text);
    setIsSpeaking(true);
    
    // Simulate speaking duration based on text length
    const duration = Math.max(2000, text.length * 50);
    
    setTimeout(() => {
      setIsSpeaking(false);
    }, duration);
  };

  const addNewPet = () => {
    speak("Let's add a new pet to your family! What type of pet would you like to add?");
    // In a real app, this would navigate to the AddPetScreen
  };

  return (
    <AIContext.Provider value={{ 
      message, 
      isSpeaking, 
      speak,
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
