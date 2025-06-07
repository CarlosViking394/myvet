import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVets } from '../context/VetContext';
import { useAI } from '../context/AIContext';

const SearchScreen = () => {
  const { vets, findVetsBySpecialization } = useVets();
  const { speak } = useAI();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Dogs', 'Cats', 'Birds', 'Exotic'];
  
  const filteredVets = activeFilter === 'All' 
    ? vets 
    : findVetsBySpecialization(activeFilter);
  
  const renderVetItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.vetCard}
      onPress={() => speak(`Dr. ${item.name} specializes in ${item.specialization.join(', ')}. Located at ${item.location}, ${item.distance} miles away.`)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.vetImage} 
      />
      
      <View style={styles.vetInfo}>
        <Text style={styles.vetName}>{item.name}</Text>
        <Text style={styles.vetSpecialty}>{item.specialization.join(', ')}</Text>
        
        <View style={styles.vetDetails}>
          <View style={styles.vetDetailItem}>
            <Ionicons name="location-outline" size={14} color="#64748b" />
            <Text style={styles.vetDetailText}>{item.distance} miles</Text>
          </View>
          
          <View style={styles.vetDetailItem}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={styles.vetDetailText}>{item.rating}</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.contactButton}>
        <Ionicons name="call-outline" size={20} color="#47b4ea" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Find a Vet</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location"
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filtersContainer}>
          <FlatList
            data={filters}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === item && styles.activeFilterButton
                ]}
                onPress={() => setActiveFilter(item)}
              >
                <Text 
                  style={[
                    styles.filterText,
                    activeFilter === item && styles.activeFilterText
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
          />
        </View>
      </View>
      
      <FlatList
        data={filteredVets}
        renderItem={renderVetItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.vetsList}
        showsVerticalScrollIndicator={false}
      />
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontFamily: 'Manrope-Regular',
    color: '#1e293b',
  },
  filtersContainer: {
    marginLeft: -4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f1f5f9',
  },
  activeFilterButton: {
    backgroundColor: '#47b4ea',
  },
  filterText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 14,
    color: '#64748b',
  },
  activeFilterText: {
    color: 'white',
  },
  vetsList: {
    padding: 16,
    paddingBottom: 150, // Space for AI assistant
  },
  vetCard: {
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
  vetImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  vetInfo: {
    flex: 1,
  },
  vetName: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  vetSpecialty: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: '#64748b',
    marginBottom: 8,
  },
  vetDetails: {
    flexDirection: 'row',
  },
  vetDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  vetDetailText: {
    fontSize: 12,
    fontFamily: 'Manrope-Medium',
    color: '#64748b',
    marginLeft: 4,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default SearchScreen;
