import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import colors from '../utils/colors';

const INTEREST_OPTIONS = [
  'Travel', 'Music', 'Fitness', 'Food', 'Movies', 'Reading',
  'Sports', 'Art', 'Gaming', 'Photography', 'Cooking', 'Dancing',
  'Hiking', 'Yoga', 'Fashion', 'Technology', 'Pets', 'Wine',
];

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Request location permission
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      Alert.alert(
        'Location Permission',
        'ConnectSphere needs your location to show you matches nearby',
        [{ text: 'OK' }]
      );
    }

    // Request media library permission
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  };

  const getLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      await authAPI.updateLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      return true;
    } catch (error) {
      console.error('Location error:', error);
      return false;
    }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      Alert.alert('Limit Reached', 'You can select up to 5 interests');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && photos.length < 6) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (step === 1) {
      // Location step
      setLoading(true);
      const success = await getLocation();
      setLoading(false);
      if (success) {
        setStep(2);
      } else {
        Alert.alert('Error', 'Please enable location services');
      }
    } else if (step === 2) {
      // Interests step
      if (selectedInterests.length === 0) {
        Alert.alert('Select Interests', 'Please select at least one interest');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Bio step
      setStep(4);
    } else if (step === 4) {
      // Photos step
      if (photos.length < 3) {
        Alert.alert('Add Photos', 'Please add at least 3 photos');
        return;
      }
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      // Update profile with onboarding data
      await authAPI.updateProfile({
        bio,
        interests: selectedInterests,
      });

      // In production, upload photos to storage
      // For now, mark onboarding as complete
      await AsyncStorage.setItem('onboarding_complete', 'true');

      navigation.replace('Main');
    } catch (error) {
      console.error('Onboarding error:', error);
      Alert.alert('Error', 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Enable Location</Text>
            <Text style={styles.stepDescription}>
              We need your location to show you matches nearby. Your exact location is never shared.
            </Text>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📍</Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your Interests</Text>
            <Text style={styles.stepDescription}>
              Select up to 5 interests to help us find your perfect match
            </Text>
            <ScrollView style={styles.interestsScroll}>
              <View style={styles.interestsContainer}>
                {INTEREST_OPTIONS.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.interestButton,
                      selectedInterests.includes(interest) && styles.interestButtonActive,
                    ]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text
                      style={[
                        styles.interestButtonText,
                        selectedInterests.includes(interest) && styles.interestButtonTextActive,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.selectedCount}>
              {selectedInterests.length}/5 selected
            </Text>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>About You</Text>
            <Text style={styles.stepDescription}>
              Write a bio that shows your personality
            </Text>
            <TextInput
              style={styles.bioInput}
              placeholder="Tell others about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bio.length}/500</Text>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Add Photos</Text>
            <Text style={styles.stepDescription}>
              Add at least 3 photos. Show your best self!
            </Text>
            <View style={styles.photosGrid}>
              {[...Array(6)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.photoSlot}
                  onPress={() => (photos[index] ? removePhoto(index) : pickImage())}
                >
                  {photos[index] ? (
                    <View style={styles.photoContainer}>
                      <Text style={styles.photoPlaceholder}>🖼️</Text>
                      <Text style={styles.removePhoto}>✖</Text>
                    </View>
                  ) : (
                    <Text style={styles.addPhotoText}>+</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.photoCount}>
              {photos.length}/6 photos added (min. 3)
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map((s) => (
            <View
              key={s}
              style={[
                styles.progressSegment,
                s <= step && styles.progressSegmentActive,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.nextButtonText}>
              {step === 4 ? 'Complete' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.gray600,
    marginBottom: 30,
    lineHeight: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  icon: {
    fontSize: 100,
  },
  interestsScroll: {
    flex: 1,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.gray300,
  },
  interestButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  interestButtonText: {
    fontSize: 14,
    color: colors.gray600,
  },
  interestButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  selectedCount: {
    textAlign: 'center',
    color: colors.gray600,
    marginTop: 15,
  },
  bioInput: {
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 200,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  charCount: {
    textAlign: 'right',
    color: colors.gray600,
    marginTop: 8,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoSlot: {
    width: '31%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.gray100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray200,
    borderStyle: 'dashed',
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    fontSize: 40,
  },
  addPhotoText: {
    fontSize: 40,
    color: colors.gray400,
  },
  removePhoto: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: colors.danger,
    fontSize: 20,
  },
  photoCount: {
    textAlign: 'center',
    color: colors.gray600,
    marginTop: 15,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 20,
    gap: 10,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
