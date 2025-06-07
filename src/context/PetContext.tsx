import React, { createContext, useContext, useState } from 'react';

// Define the Pet type
interface Pet {
  name: string;
  type: string;
  image: string;
  age?: number;
  breed?: string;
  weight?: number;
  medicalHistory?: Array<{
    date: string;
    description: string;
    vet: string;
  }>;
}

// Define the context type
interface PetContextType {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  removePet: (index: number) => void;
  updatePet: (index: number, updatedPet: Pet) => void;
}

// Create the context
const PetContext = createContext<PetContextType | undefined>(undefined);

// Sample pet data
const initialPets: Pet[] = [
  {
    name: 'Max',
    type: 'Dog',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    age: 3,
    breed: 'Golden Retriever',
    weight: 32,
    medicalHistory: [
      {
        date: '2023-03-15',
        description: 'Annual check-up and vaccinations',
        vet: 'Dr. Sarah Wilson'
      }
    ]
  },
  {
    name: 'Bella',
    type: 'Cat',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
    age: 2,
    breed: 'Siamese',
    weight: 4.5,
    medicalHistory: [
      {
        date: '2023-04-10',
        description: 'Dental cleaning',
        vet: 'Dr. Michael Chen'
      }
    ]
  }
];

// Create the provider component
export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>(initialPets);

  const addPet = (pet: Pet) => {
    setPets([...pets, pet]);
  };

  const removePet = (index: number) => {
    const updatedPets = [...pets];
    updatedPets.splice(index, 1);
    setPets(updatedPets);
  };

  const updatePet = (index: number, updatedPet: Pet) => {
    const updatedPets = [...pets];
    updatedPets[index] = updatedPet;
    setPets(updatedPets);
  };

  return (
    <PetContext.Provider value={{ pets, addPet, removePet, updatePet }}>
      {children}
    </PetContext.Provider>
  );
};

// Create a custom hook to use the pet context
export const usePets = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};
