import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { discoveryAPI } from '../services/api';
import colors from '../utils/colors';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.7;

export default function DiscoveryScreen() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const response = await discoveryAPI.getCards(10);
      setCards(response.data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Load cards error:', error);
      Alert.alert('Error', 'Failed to load discovery cards');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      const response = await discoveryAPI.swipe({
        swiped_user_id: currentCard.id,
        action: action,
      });

      if (response.data.match) {
        setIsMatch(true);
        setTimeout(() => setIsMatch(false), 3000);
      }

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Load more cards
        await loadCards();
      }
    } catch (error) {
      console.error('Swipe error:', error);
      if (error.response?.status === 429) {
        Alert.alert('Limit Reached', error.response.data.detail);
      }
    }
  };

  const handleUndo = async () => {
    try {
      await discoveryAPI.undoSwipe();
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      Alert.alert('Success', 'Last swipe undone');
    } catch (error) {
      console.error('Undo error:', error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to undo swipe');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (cards.length === 0 || currentIndex >= cards.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>😊</Text>
        <Text style={styles.emptyTitle}>No more profiles</Text>
        <Text style={styles.emptyText}>
          Check back later for new matches!
        </Text>
        <TouchableOpacity style={styles.reloadButton} onPress={loadCards}>
          <Text style={styles.reloadButtonText}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>💕</Text>
        <Text style={styles.appName}>ConnectSphere</Text>
        <TouchableOpacity onPress={handleUndo} style={styles.undoButton}>
          <Text style={styles.undoButtonText}>⟲</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardImagePlaceholder}>
            <Text style={styles.cardImageIcon}>📸</Text>
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <View>
                  <View style={styles.nameRow}>
                    <Text style={styles.cardName}>
                      {currentCard.full_name || currentCard.username}
                    </Text>
                    {currentCard.is_verified && (
                      <Text style={styles.verifiedBadge}>✓</Text>
                    )}
                    {currentCard.is_premium && (
                      <Text style={styles.premiumBadge}>👑</Text>
                    )}
                  </View>
                  <View style={styles.cardDetailsRow}>
                    {currentCard.age && (
                      <Text style={styles.cardDetail}>{currentCard.age}</Text>
                    )}
                    {currentCard.distance && (
                      <Text style={styles.cardDetail}>
                        • {Math.round(currentCard.distance)}km away
                      </Text>
                    )}
                  </View>
                </View>
                {currentCard.compatibility_score && (
                  <View style={styles.compatibilityBadge}>
                    <Text style={styles.compatibilityText}>
                      {currentCard.compatibility_score}%
                    </Text>
                    <Text style={styles.compatibilityLabel}>match</Text>
                  </View>
                )}
              </View>

              {currentCard.bio && (
                <Text style={styles.cardBio} numberOfLines={2}>
                  {currentCard.bio}
                </Text>
              )}

              {currentCard.interests && currentCard.interests.length > 0 && (
                <View style={styles.interestsContainer}>
                  {currentCard.interests.slice(0, 3).map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipe('pass')}
        >
          <Text style={styles.actionIcon}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={() => handleSwipe('super_like')}
        >
          <Text style={styles.actionIcon}>★</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleSwipe('like')}
        >
          <Text style={styles.actionIcon}>♥</Text>
        </TouchableOpacity>
      </View>

      {isMatch && (
        <View style={styles.matchOverlay}>
          <LinearGradient
            colors={['rgba(255,107,107,0.95)', 'rgba(255,160,122,0.95)']}
            style={styles.matchGradient}
          >
            <Text style={styles.matchIcon}>🎉</Text>
            <Text style={styles.matchTitle}>It's a Match!</Text>
            <Text style={styles.matchText}>
              You and {currentCard.full_name || currentCard.username} liked each other
            </Text>
          </LinearGradient>
        </View>
      )}

      <View style={styles.cardsRemaining}>
        <Text style={styles.cardsRemainingText}>
          {cards.length - currentIndex} cards remaining
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  logo: {
    fontSize: 28,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  undoButton: {
    padding: 8,
  },
  undoButtonText: {
    fontSize: 28,
    color: colors.primary,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  card: {
    width: width - 40,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImagePlaceholder: {
    flex: 1,
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageIcon: {
    fontSize: 100,
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
    paddingTop: 60,
  },
  cardInfo: {
    paddingHorizontal: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 8,
  },
  verifiedBadge: {
    fontSize: 20,
    color: colors.success,
  },
  premiumBadge: {
    fontSize: 20,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetail: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginRight: 8,
  },
  compatibilityBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  compatibilityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  compatibilityLabel: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.9,
  },
  cardBio: {
    fontSize: 15,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  interestText: {
    fontSize: 12,
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  passButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  likeButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  superLikeButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.warning,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actionIcon: {
    fontSize: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 30,
  },
  reloadButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  reloadButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  matchIcon: {
    fontSize: 100,
    marginBottom: 20,
  },
  matchTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
  },
  matchText: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
  },
  cardsRemaining: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  cardsRemainingText: {
    color: colors.white,
    fontSize: 12,
  },
});
