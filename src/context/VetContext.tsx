import React, { createContext, useContext, useState } from 'react';

// Define the Vet type
interface Vet {
  id: string;
  name: string;
  specialization: string[];
  image: string;
  rating: number;
  location: string;
  distance: number;
  availability: string[];
  contact: {
    phone: string;
    email: string;
  };
}

// Define the context type
interface VetContextType {
  vets: Vet[];
  findVetsBySpecialization: (specialization: string) => Vet[];
  findVetsByLocation: (location: string) => Vet[];
  findVetById: (id: string) => Vet | undefined;
}

// Create the context
const VetContext = createContext<VetContextType | undefined>(undefined);

// Sample vet data
const initialVets: Vet[] = [
  {
    id: 'v1',
    name: 'Dr. Sarah Wilson',
    specialization: ['General', 'Dogs', 'Cats'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
    rating: 4.8,
    location: 'Downtown Pet Clinic',
    distance: 1.2,
    availability: ['Monday', 'Wednesday', 'Friday'],
    contact: {
      phone: '555-123-4567',
      email: 'dr.wilson@petclinic.com'
    }
  },
  {
    id: 'v2',
    name: 'Dr. Michael Chen',
    specialization: ['Cats', 'Exotic Pets', 'Surgery'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
    rating: 4.9,
    location: 'Eastside Animal Hospital',
    distance: 2.5,
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    contact: {
      phone: '555-987-6543',
      email: 'dr.chen@animalhospital.com'
    }
  },
  {
    id: 'v3',
    name: 'Dr. Emily Rodriguez',
    specialization: ['Dogs', 'Dermatology', 'Cardiology'],
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f',
    rating: 4.7,
    location: 'Westside Veterinary Clinic',
    distance: 3.1,
    availability: ['Monday', 'Tuesday', 'Thursday'],
    contact: {
      phone: '555-456-7890',
      email: 'dr.rodriguez@vetclinic.com'
    }
  },
  {
    id: 'v4',
    name: 'Dr. James Thompson',
    specialization: ['Birds', 'Exotic Pets', 'Neurology'],
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7',
    rating: 4.6,
    location: 'Exotic Animal Care Center',
    distance: 4.8,
    availability: ['Wednesday', 'Friday', 'Saturday'],
    contact: {
      phone: '555-789-0123',
      email: 'dr.thompson@exoticanimal.com'
    }
  },
  {
    id: 'v5',
    name: 'Dr. Lisa Patel',
    specialization: ['General', 'Surgery', 'Dogs'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
    rating: 4.9,
    location: 'North Pet Hospital',
    distance: 2.0,
    availability: ['Monday', 'Wednesday', 'Friday'],
    contact: {
      phone: '555-234-5678',
      email: 'dr.patel@pethospital.com'
    }
  }
];

// Create the provider component
export const VetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vets] = useState<Vet[]>(initialVets);

  const findVetsBySpecialization = (specialization: string) => {
    if (!specialization) return vets;
    return vets.filter(vet => 
      vet.specialization.some(spec => 
        spec.toLowerCase() === specialization.toLowerCase()
      )
    );
  };

  const findVetsByLocation = (location: string) => {
    if (!location) return vets;
    return vets.filter(vet => 
      vet.location.toLowerCase().includes(location.toLowerCase())
    );
  };

  const findVetById = (id: string) => {
    return vets.find(vet => vet.id === id);
  };

  return (
    <VetContext.Provider value={{ 
      vets, 
      findVetsBySpecialization, 
      findVetsByLocation, 
      findVetById 
    }}>
      {children}
    </VetContext.Provider>
  );
};

// Create a custom hook to use the vet context
export const useVets = () => {
  const context = useContext(VetContext);
  if (context === undefined) {
    throw new Error('useVets must be used within a VetProvider');
  }
  return context;
};
