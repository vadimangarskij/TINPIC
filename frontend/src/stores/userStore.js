import { create } from 'zustand';
import { discoveryAPI, matchesAPI, usersAPI } from '../utils/api';

export const useUserStore = create((set, get) => ({
  // Discovery state
  discoveryCards: [],
  currentCardIndex: 0,
  isLoadingCards: false,
  
  // Matches state
  matches: [],
  receivedLikes: [],
  isLoadingMatches: false,
  
  // User preferences
  preferences: {
    min_age: 18,
    max_age: 100,
    max_distance: 50,
    show_gender: null,
  },

  // Discovery actions
  loadDiscoveryCards: async (limit = 10) => {
    set({ isLoadingCards: true });
    try {
      const response = await discoveryAPI.getCards(limit);
      set({ discoveryCards: response.data, currentCardIndex: 0, isLoadingCards: false });
      return { success: true };
    } catch (error) {
      set({ isLoadingCards: false });
      return { success: false, error: error.response?.data?.detail || 'Failed to load cards' };
    }
  },

  swipeCard: async (swipedUserId, action) => {
    try {
      const response = await discoveryAPI.swipe({ swiped_user_id: swipedUserId, action });
      
      // Move to next card
      const currentIndex = get().currentCardIndex;
      set({ currentCardIndex: currentIndex + 1 });
      
      // Load more cards if running low
      const cards = get().discoveryCards;
      if (cards.length - currentIndex <= 3) {
        get().loadDiscoveryCards();
      }
      
      return { success: true, match: response.data.match, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Swipe failed' };
    }
  },

  undoSwipe: async () => {
    try {
      await discoveryAPI.undoSwipe();
      const currentIndex = get().currentCardIndex;
      if (currentIndex > 0) {
        set({ currentCardIndex: currentIndex - 1 });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Undo failed' };
    }
  },

  // Matches actions
  loadMatches: async () => {
    set({ isLoadingMatches: true });
    try {
      const response = await matchesAPI.getMatches();
      set({ matches: response.data, isLoadingMatches: false });
      return { success: true };
    } catch (error) {
      set({ isLoadingMatches: false });
      return { success: false, error: error.response?.data?.detail || 'Failed to load matches' };
    }
  },

  loadReceivedLikes: async () => {
    try {
      const response = await matchesAPI.getReceivedLikes();
      set({ receivedLikes: response.data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Failed to load likes' };
    }
  },

  // Preferences actions
  updatePreferences: async (newPreferences) => {
    try {
      await usersAPI.updatePreferences(newPreferences);
      set({ preferences: { ...get().preferences, ...newPreferences } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Failed to update preferences' };
    }
  },

  // Get current card
  getCurrentCard: () => {
    const { discoveryCards, currentCardIndex } = get();
    return discoveryCards[currentCardIndex] || null;
  },

  // Reset store
  reset: () => {
    set({
      discoveryCards: [],
      currentCardIndex: 0,
      matches: [],
      receivedLikes: [],
      isLoadingCards: false,
      isLoadingMatches: false,
    });
  },
}));
