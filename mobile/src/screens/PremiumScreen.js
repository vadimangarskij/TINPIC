import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../utils/colors';

const PREMIUM_FEATURES = [
  { icon: '♥️', title: 'Unlimited Likes', description: 'Like as many profiles as you want' },
  { icon: '⭐', title: 'Unlimited Super Likes', description: 'Stand out from the crowd' },
  { icon: '👀', title: 'See Who Likes You', description: 'View all your admirers' },
  { icon: '⏪', title: 'Rewind', description: 'Undo your last swipe' },
  { icon: '🚀', title: 'Profile Boost', description: 'Be the top profile in your area' },
  { icon: '🎨', title: 'Customization', description: 'Themes, badges & frames' },
];

export default function PremiumScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={colors.premiumGradient}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.crownIcon}>👑</Text>
        <Text style={styles.headerTitle}>Upgrade to Premium</Text>
        <Text style={styles.headerSubtitle}>
          Get the most out of ConnectSphere
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.featuresContainer}>
          {PREMIUM_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.plansContainer}>
          <TouchableOpacity style={styles.planCard}>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>Best Value</Text>
            </View>
            <Text style={styles.planDuration}>1 Year</Text>
            <Text style={styles.planPrice}>2999 ₽</Text>
            <Text style={styles.planPriceMonth}>~250 ₽/month</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.planCard}>
            <Text style={styles.planDuration}>1 Month</Text>
            <Text style={styles.planPrice}>499 ₽</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          Subscription auto-renews unless cancelled. Cancel anytime.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.white,
  },
  crownIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.gray600,
  },
  plansContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  planCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  planDuration: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  planPriceMonth: {
    fontSize: 12,
    color: colors.gray600,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 18,
  },
});
