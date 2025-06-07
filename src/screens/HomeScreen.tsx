import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StatusBar,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePets } from '../context/PetContext';
import { useVets } from '../context/VetContext';
import { useAI } from '../context/SafeAIProvider';
import TabHeader from '../components/TabHeader';
import AIAssistantTest from '../components/AIAssistantTest';
import { useNavigation } from '@react-navigation/native';
import debugService from '../services/debug/DebugService';

const HomeScreen = () => {
  debugService.info('HomeScreen', 'Rendering HomeScreen');
  
  const { pets } = usePets();
  const { vets } = useVets();
  const { speak, addNewPet, setNavigationRef } = useAI();
  const [activeTab, setActiveTab] = useState('My Pets');
  const [showAITest, setShowAITest] = useState(false);
  const navigation = useNavigation();
  
  // Set navigation ref for AI context
  useEffect(() => {
    debugService.debug('HomeScreen', 'Setting navigation ref in AI context');
    setNavigationRef(navigation);
  }, [navigation, setNavigationRef]);
  
  useEffect(() => {
    debugService.debug('HomeScreen', 'Speaking welcome message');
    speak('Welcome to MyVet! Here you can manage your pets and find veterinarians.');
  }, []);

  const renderPetItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.petCard}
      onPress={() => speak(`${item.name} is a ${item.type}. ${item.age ? `${item.age} years old.` : ''} ${item.breed ? `Breed: ${item.breed}.` : ''}`)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.petImage} 
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petType}>{item.type}</Text>
        {item.age && <Text style={styles.petDetail}>{item.age} years old</Text>}
        {item.breed && <Text style={styles.petDetail}>{item.breed}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderUpcomingAppointment = () => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentTitle}>Upcoming Appointment</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.appointmentContent}>
        <View style={styles.appointmentLeft}>
          <Text style={styles.appointmentDate}>May 15, 2023</Text>
          <Text style={styles.appointmentTime}>10:30 AM</Text>
          <View style={styles.appointmentTypeContainer}>
            <Text style={styles.appointmentType}>Check-up</Text>
          </View>
        </View>
        
        <View style={styles.appointmentDivider} />
        
        <View style={styles.appointmentRight}>
          <Text style={styles.vetName}>Dr. Sarah Wilson</Text>
          <Text style={styles.vetSpecialty}>General Veterinarian</Text>
          <Text style={styles.petAppointment}>For: Max</Text>
        </View>
      </View>
      
      <View style={styles.appointmentActions}>
        <TouchableOpacity 
          style={[styles.appointmentButton, styles.rescheduleButton]}
          onPress={() => speak('This would open the reschedule screen.')}
        >
          <Ionicons name="calendar-outline" size={16} color="#64748b" />
          <Text style={styles.rescheduleText}>Reschedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.appointmentButton, styles.cancelButton]}
          onPress={() => speak('This would cancel the appointment.')}
        >
          <Ionicons name="close-outline" size={16} color="#ef4444" />
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecommendedVets = () => (
    <View style={styles.recommendedSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended Vets</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendedVetsContainer}
      >
        {vets.slice(0, 5).map((vet) => (
          <TouchableOpacity 
            key={vet.id}
            style={styles.recommendedVetCard}
            onPress={() => speak(`Dr. ${vet.name} specializes in ${vet.specialization.join(', ')}.`)}
          >
            <Image 
              source={{ uri: vet.image }} 
              style={styles.recommendedVetImage} 
            />
            <Text style={styles.recommendedVetName}>{vet.name}</Text>
            <Text style={styles.recommendedVetSpecialty}>
              {vet.specialization[0]}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={styles.ratingText}>{vet.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderEmptyPetState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="paw-outline" size={60} color="#cbd5e1" />
      <Text style={styles.emptyStateText}>No pets added yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Add your pets to keep track of their health and appointments
      </Text>
      <TouchableOpacity 
        style={styles.addPetButton}
        onPress={addNewPet}
      >
        <Text style={styles.addPetButtonText}>Add a Pet</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <TabHeader 
        title="MyVet" 
        activeTab={activeTab}
        tabs={['My Pets', 'Reminders']}
        onTabChange={setActiveTab}
      />
      
      {showAITest ? (
        <View style={styles.aiTestContainer}>
          <View style={styles.aiTestHeader}>
            <Text style={styles.aiTestTitle}>AI Assistant Test</Text>
            <TouchableOpacity onPress={() => setShowAITest(false)}>
              <Ionicons name="close-circle" size={24} color="#47b4ea" />
            </TouchableOpacity>
          </View>
          <AIAssistantTest />
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'My Pets' ? (
            <>
              <View style={styles.petsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>My Pets</Text>
                  <TouchableOpacity onPress={addNewPet}>
                    <Ionicons name="add-circle" size={24} color="#47b4ea" />
                  </TouchableOpacity>
                </View>
                
                {pets.length > 0 ? (
                  <FlatList
                    data={pets}
                    renderItem={renderPetItem}
                    keyExtractor={(item, index) => `pet-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.petsContainer}
                    style={styles.petsList}
                  />
                ) : (
                  renderEmptyPetState()
                )}
              </View>
              
              {pets.length > 0 && (
                <>
                  {renderUpcomingAppointment()}
                  {renderRecommendedVets()}
                </>
              )}
            </>
          ) : (
            <View style={styles.remindersContainer}>
              <View style={styles.reminderCard}>
                <View style={styles.reminderIconContainer}>
                  <Ionicons name="medkit-outline" size={24} color="#47b4ea" />
                </View>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTitle}>Medication Reminder</Text>
                  <Text style={styles.reminderDescription}>
                    Max's heartworm medication is due tomorrow
                  </Text>
                  <Text style={styles.reminderTime}>May 12, 2023</Text>
                </View>
              </View>
              
              <View style={styles.reminderCard}>
                <View style={styles.reminderIconContainer}>
                  <Ionicons name="calendar-outline" size={24} color="#47b4ea" />
                </View>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTitle}>Upcoming Appointment</Text>
                  <Text style={styles.reminderDescription}>
                    Bella's annual check-up with Dr. Wilson
                  </Text>
                  <Text style={styles.reminderTime}>May 15, 2023 at 10:30 AM</Text>
                </View>
              </View>
              
              <View style={styles.reminderCard}>
                <View style={styles.reminderIconContainer}>
                  <Ionicons name="fitness-outline" size={24} color="#47b4ea" />
                </View>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTitle}>Vaccination Due</Text>
                  <Text style={styles.reminderDescription}>
                    Charlie's rabies vaccination is due next week
                  </Text>
                  <Text style={styles.reminderTime}>May 20, 2023</Text>
                </View>
              </View>
            </View>
          )}
          
          {/* AI Test Button */}
          <TouchableOpacity 
            style={styles.aiTestButton}
            onPress={() => setShowAITest(true)}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="white" />
            <Text style={styles.aiTestButtonText}>Test AI Assistant</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 150, // Space for AI assistant
  },
  petsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: '#47b4ea',
  },
  petsList: {
    marginLeft: -8,
    marginRight: -8,
  },
  petsContainer: {
    paddingHorizontal: 8,
  },
  petCard: {
    width: 150,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  petInfo: {
    alignItems: 'center',
  },
  petName: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  petType: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: '#64748b',
    marginBottom: 4,
  },
  petDetail: {
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
    color: '#94a3b8',
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#1e293b',
  },
  appointmentContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  appointmentLeft: {
    flex: 1,
    paddingRight: 16,
  },
  appointmentDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  appointmentRight: {
    flex: 1,
    paddingLeft: 16,
  },
  appointmentDate: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: '#64748b',
    marginBottom: 8,
  },
  appointmentTypeContainer: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  appointmentType: {
    fontSize: 12,
    fontFamily: 'Manrope-Medium',
    color: '#0284c7',
  },
  vetName: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  vetSpecialty: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: '#64748b',
    marginBottom: 8,
  },
  petAppointment: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: '#64748b',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
  },
  rescheduleButton: {
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButton: {
    backgroundColor: '#fef2f2',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  rescheduleText: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: '#64748b',
    marginLeft: 6,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: '#ef4444',
    marginLeft: 6,
  },
  recommendedSection: {
    marginBottom: 24,
  },
  recommendedVetsContainer: {
    paddingRight: 16,
  },
  recommendedVetCard: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  recommendedVetImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  recommendedVetName: {
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
    color: '#1e293b',
    marginBottom: 2,
    textAlign: 'center',
  },
  recommendedVetSpecialty: {
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
    color: '#64748b',
    marginBottom: 4,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Manrope-Medium',
    color: '#64748b',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#94a3b8',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  addPetButton: {
    backgroundColor: '#47b4ea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addPetButtonText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: 'white',
  },
  remindersContainer: {
    marginTop: 8,
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reminderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: '#64748b',
    marginBottom: 8,
  },
  reminderTime: {
    fontSize: 12,
    fontFamily: 'Manrope-Medium',
    color: '#94a3b8',
  },
  aiTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#47b4ea',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  aiTestButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  aiTestContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  aiTestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  aiTestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
});

export default HomeScreen;
