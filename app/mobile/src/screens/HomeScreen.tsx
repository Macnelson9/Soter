import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Soter</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Powered by Stellar</Text>
          </View>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Transparent aid, directly delivered.</Text>
          <Text style={styles.description}>
            Soter utilizes the Stellar network and Soroban smart contracts to ensure aid reaches those in need with 100% transparency. Our automated escrow system guarantees that every donation is tracked and verified on-chain.
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Health')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Check Backend Health</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => { }} // Future: Navigate to Aid Status
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>View Aid Status (Coming Soon)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },
  badge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
  },
  heroSection: {
    marginBottom: 48,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  actionContainer: {
    gap: 16,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
});
