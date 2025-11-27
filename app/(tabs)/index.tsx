import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccommodationCard } from '@/components/home/AccommodationCard';
import { AIBanner } from '@/components/home/AIBanner';
import { DestinationCard } from '@/components/home/DestinationCard';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';

export default function HomeScreen() {
  const handleTravelPress = (id: string) => {
    router.push(`/travel/${id}`);
  };

  const handleDestinationPress = () => {
    router.push('/home/destinations');
  };

  const handleAccommodationPress = () => {
    router.push('/home/accommodation');
  };

  const handlePlanTripPress = () => {
    router.push('/ai-chat/plan-trip');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.appTitle}>Triptalk</ThemedText>
      </ThemedView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Banner */}
        <AIBanner onPress={handlePlanTripPress} />

        {/* 많이 찾는 여행지 Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.sectionHeaderContainer}
            onPress={handleDestinationPress}
          >
            <ThemedText style={styles.sectionTitle}>많이 찾는 여행지</ThemedText>
            <View style={styles.arrow}>
              <ThemedText style={styles.arrowText}>{'>'}</ThemedText>
            </View>
          </TouchableOpacity>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            <DestinationCard
              title="제주도"
              subtitle="한라산과 에메랄드빛 바다가 아름다운 힐링 여행지"
              imageUrl="https://picsum.photos/400/200?random=1"
              onPress={() => handleTravelPress('1')}
            />
            <DestinationCard
              title="부산"
              subtitle="해운대 해변과 감천 마을의 낭만"
              imageUrl="https://picsum.photos/400/200?random=2"
              onPress={() => handleTravelPress('2')}
            />
          </ScrollView>
        </View>

        {/* 숙박·항공 Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.sectionHeaderContainer}
            onPress={handleAccommodationPress}
          >
            <ThemedText style={styles.sectionTitle}>숙박·항공</ThemedText>
            <View style={styles.arrow}>
              <ThemedText style={styles.arrowText}>{'>'}</ThemedText>
            </View>
          </TouchableOpacity>
          
          <View style={styles.accommodationGrid}>
            <View style={styles.accommodationRow}>
              <AccommodationCard
                title="파리 항공권"
                tag="항공"
                price="789,000원"
                originalPrice="850,000원"
                imageUrl="https://picsum.photos/200/100?random=5"
                onPress={() => handleTravelPress('flight-paris')}
              />
              <AccommodationCard
                title="도쿄"
                tag="숙박"
                price="120,000원/박"
                date="2024.12.17 - 12.22"
                imageUrl="https://picsum.photos/200/100?random=6"
                onPress={() => handleTravelPress('hotel-tokyo')}
              />
            </View>
            <View style={styles.accommodationRow}>
              <AccommodationCard
                title="파리 항공권"
                tag="항공"
                price="789,000"
                imageUrl="https://picsum.photos/200/100?random=7"
                onPress={() => handleTravelPress('flight-paris2')}
              />
              <AccommodationCard
                title="파리 항공권"
                tag="항공"
                price="789,000"
                imageUrl="https://picsum.photos/200/100?random=8"
                onPress={() => handleTravelPress('flight-paris3')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  horizontalScrollContainer: {
    paddingRight: 16,
  },
  accommodationGrid: {
    gap: 8,
  },
  accommodationRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingRight: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  arrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: 16,
  },
  arrowText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});