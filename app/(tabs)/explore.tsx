import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TabSelector } from '@/components/repository/TabSelector';
import { TravelCard, TravelData } from '@/components/repository/TravelCard';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';

// 샘플 데이터
const sampleTravels: TravelData[] = [
  // 계획 완료 (예정된 여행들)
  {
    id: '1',
    title: '제주도 3박 4일 힐링 여행',
    startDate: '2024.12.15',
    endDate: '2024.12.18',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    price: 450000,
    priceUnit: '원',
    status: 'planned'
  },
  {
    id: '2',
    title: '일본 도쿄 2박 3일',
    startDate: '2024.12.22',
    endDate: '2024.12.25',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    price: 680000,
    priceUnit: '원',
    status: 'planned'
  },
  {
    id: '3',
    title: '강릉 바다여행 1박 2일',
    startDate: '2025.01.05',
    endDate: '2025.01.06',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    price: 280000,
    priceUnit: '원',
    status: 'planned'
  },
  // 여행 완료 (완료된 여행들)
  {
    id: '4',
    title: '부산 맛집 투어 여행',
    startDate: '2024.10.20',
    endDate: '2024.10.22',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    price: 320000,
    priceUnit: '원',
    status: 'planned'
  },
  {
    id: '5',
    title: '경주 역사탐방 2박 3일',
    startDate: '2024.09.15',
    endDate: '2024.09.17',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    price: 380000,
    priceUnit: '원',
    status: 'completed'
  },
  {
    id: '6',
    title: '전주 한옥마을 당일치기',
    startDate: '2024.08.12',
    endDate: '2024.08.12',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    price: 150000,
    priceUnit: '원',
    status: 'completed'
  },
];

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'계획 완료' | '여행 완료'>('계획 완료');

  useEffect(() => {
    if (params.tab === 'completed') {
      setActiveTab('여행 완료');
    } else if (params.tab === 'planned') {
      setActiveTab('계획 완료');
    }
  }, [params.tab]);

  const filteredTravels = sampleTravels.filter(travel => 
    activeTab === '계획 완료' ? travel.status === 'planned' : travel.status === 'completed'
  );

  const handleCardPress = (travelId: string) => {
    router.push(`/travel/${travelId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>저장소</ThemedText>
      </ThemedView>
      
      <TabSelector activeTab={activeTab} onTabPress={setActiveTab} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTravels.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              {activeTab === '계획 완료' ? '계획된 여행이 없습니다' : '완료된 여행이 없습니다'}
            </ThemedText>
          </ThemedView>
        ) : (
          filteredTravels.map((travel) => (
            <TravelCard
              key={travel.id}
              travel={travel}
              onPress={() => handleCardPress(travel.id)}
            />
          ))
        )}
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
