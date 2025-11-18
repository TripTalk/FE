import React from 'react';
import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  View,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const handleTravelPress = (id: string) => {
    router.push(`/travel/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.appTitle}>Triptalk</ThemedText>
      </ThemedView>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <ThemedText style={styles.bannerText}>
              여기 어때{'\n'}
              여행 정보를 한눈에보세요
            </ThemedText>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100' }}
              style={styles.bannerIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Featured Travel */}
          <TouchableOpacity 
            style={styles.featuredCard}
            onPress={() => handleTravelPress('1')}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' }}
              style={styles.featuredImage}
              resizeMode="cover"
            />
            <View style={styles.featuredOverlay}>
              <ThemedText style={styles.featuredTitle}>망한 웹툰 여작가</ThemedText>
            </View>
          </TouchableOpacity>

          {/* Side Cards Row */}
          <View style={styles.sideCardsRow}>
            <TouchableOpacity 
              style={styles.sideCard}
              onPress={() => handleTravelPress('2')}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200' }}
                style={styles.sideImage}
                resizeMode="cover"
              />
              <View style={styles.sideOverlay}>
                <ThemedText style={styles.sideTitle}>제주도</ThemedText>
                <ThemedText style={styles.sideSubtitle}>
                  감성적인 여행을 떠나고 싶다면 추천하는{'\n'}
                  섬의 여행지
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sideCard}
              onPress={() => handleTravelPress('3')}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200' }}
                style={styles.sideImage}
                resizeMode="cover"
              />
              <View style={styles.sideOverlay}>
                <ThemedText style={styles.sideTitle}>부산</ThemedText>
              </View>
            </TouchableOpacity>
          </View>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>축복·향공</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeMore}>{'>'}</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Small Cards Row */}
          <View style={styles.smallCardsRow}>
            <TouchableOpacity 
              style={styles.smallCard}
              onPress={() => handleTravelPress('4')}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200' }}
                style={styles.smallImage}
                resizeMode="cover"
              />
              <View style={styles.smallOverlay}>
                <ThemedText style={styles.smallTitle}>파리 골목</ThemedText>
                <ThemedText style={styles.smallPrice}>798,000원</ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.smallCard}
              onPress={() => handleTravelPress('5')}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200' }}
                style={styles.smallImage}
                resizeMode="cover"
              />
              <View style={styles.smallOverlay}>
                <ThemedText style={styles.smallTitle}>뉴욕 도심</ThemedText>
                <ThemedText style={styles.smallPrice}>1,200,000원</ThemedText>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bottom Cards */}
          <View style={styles.bottomCardsRow}>
            <TouchableOpacity 
              style={styles.bottomCard}
              onPress={() => handleTravelPress('6')}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200' }}
                style={styles.bottomImage}
                resizeMode="cover"
              />
              <ThemedText style={styles.bottomTitle}>파리 골목</ThemedText>
              <ThemedText style={styles.bottomPrice}>798,000</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomCard}
              onPress={() => handleTravelPress('1')}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200' }}
                style={styles.bottomImage}
                resizeMode="cover"
              />
              <ThemedText style={styles.bottomTitle}>파리 골목</ThemedText>
              <ThemedText style={styles.bottomPrice}>798,000</ThemedText>
            </TouchableOpacity>
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
  banner: {
    backgroundColor: '#4ECDC4',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  bannerIcon: {
    width: 60,
    height: 60,
  },
  content: {
    padding: 16,
  },
  featuredCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sideCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  sideCard: {
    flex: 1,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  sideImage: {
    width: '100%',
    height: '100%',
  },
  sideOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  sideTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  sideSubtitle: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 14,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeMore: {
    fontSize: 18,
    color: '#666666',
  },
  smallCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  smallCard: {
    flex: 1,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  smallImage: {
    width: '100%',
    height: '100%',
  },
  smallOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  smallTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 2,
  },
  smallPrice: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomImage: {
    width: '100%',
    height: 120,
  },
  bottomTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  bottomPrice: {
    fontSize: 13,
    color: '#4ECDC4',
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});