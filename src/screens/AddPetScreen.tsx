import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePets } from '../context/PetContext';
import { useAI } from '../context/SafeAIProvider';

const AddPetScreen = () => {
  const { addPet } = usePets();
  const { speak } = useAI();
  
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petWeight, setPetWeight] = useState('');
  
  const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Other'];
  
  const handleAddPet = () => {
    if (!petName || !petType) {
      speak('Please provide at least a name and type for your pet.');
      return;
    }
    
    const newPet = {
      name: petName,
      type: petType,
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
      age: petAge ? parseInt(petAge) : undefined,
      breed: petBreed || undefined,
      weight: petWeight ? parseFloat(petWeight) : undefined,
    };
    
    addPet(newPet);
    speak(`${petName} has been added to your pets!`);
    
    // Reset form
    setPetName('');
    setPetType('');
    setPetAge('');
    setPetBreed('');
    setPetWeight('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Add a Pet</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageSection}>
          <View style={styles.petImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1' }} 
              style={styles.petImage} 
            />
            <TouchableOpacity style={styles.changeImageButton}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.imageHelpText}>Tap to add a photo</Text>
        </View>
        
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pet Name*</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter pet name"
              placeholderTextColor="#94a3b8"
              value={petName}
              onChangeText={setPetName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pet Type*</Text>
            <View style={styles.petTypesContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
              >
                {petTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.petTypeButton,
                      petType === type && styles.activePetTypeButton
                    ]}
                    onPress={() => setPetType(type)}
                  >
                    <Text 
                      style={[
                        styles.petTypeText,
                        petType === type && styles.activePetTypeText
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age (Years)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter age"
              placeholderTextColor="#94a3b8"
              value={petAge}
              onChangeText={setPetAge}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Breed</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter breed"
              placeholderTextColor="#94a3b8"
              value={petBreed}
              onChangeText={setPetBreed}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter weight"
              placeholderTextColor="#94a3b8"
              value={petWeight}
              onChangeText={setPetWeight}
              keyboardType="numeric"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddPet}
          >
            <Text style={styles.addButtonText}>Add Pet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Manrope-Bold',
    color: '#1e293b',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 150, // Space for AI assistant
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  petImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e2e8f0',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#47b4ea',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  imageHelpText: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: '#64748b',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: '#1e293b',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Manrope-Regular',
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  petTypesContainer: {
    marginLeft: -4,
  },
  petTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activePetTypeButton: {
    backgroundColor: '#47b4ea',
    borderColor: '#47b4ea',
  },
  petTypeText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 14,
    color: '#64748b',
  },
  activePetTypeText: {
    color: 'white',
  },
  addButton: {
    backgroundColor: '#47b4ea',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: 'white',
  },
});

export default AddPetScreen;
