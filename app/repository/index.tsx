import { TravelCard } from '@/components/repository/TravelCard';
import { ThemedText } from '@/components/shared/themed-text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 더미 데이터
const DUMMY_TRIP_PLANS = [
  {
    tripPlanId: 1,
    title: '제주도 힐링 여행',
    destination: '제주도',
    departure: '서울',
    startDate: '2024-12-20',
    endDate: '2024-12-23',
    companions: '친구',
    budget: '50만원',
    travelStyles: ['힐링', '자연'],
    imageUrl: 'https://picsum.photos/400/300?random=1',
  },
  {
    tripPlanId: 2,
    title: '부산 맛집 탐방',
    destination: '부산',
    departure: '서울',
    startDate: '2024-12-15',
    endDate: '2024-12-17',
    companions: '가족',
    budget: '70만원',
    travelStyles: ['맛집', '관광'],
    imageUrl: 'https://picsum.photos/400/300?random=2',
  },
];

export default function RepositoryScreen() {
  const [tripPlans] = useState(DUMMY_TRIP_PLANS);
  const [isLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 새로고침 시뮬레이션
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCardPress = (tripPlanId: number) => {
    // TODO: 상세 페이지로 이동
    console.log('Travel plan clicked:', tripPlanId);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: '보관함',
          headerShown: true,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <ThemedText style={styles.loadingText}>여행 계획을 불러오는 중...</ThemedText>
            </View>
          ) : tripPlans.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>저장된 여행 계획이 없습니다.</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                AI와 대화하여 여행 계획을 만들어보세요!
              </ThemedText>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {tripPlans.map((plan) => (
                <TravelCard
                  key={plan.tripPlanId}
                  travel={{
                    id: plan.tripPlanId.toString(),
                    title: plan.title,
                    startDate: plan.startDate,
                    endDate: plan.endDate,
                    image: plan.imageUrl || 'https://via.placeholder.com/400x200',
                    price: plan.budget ? parseInt(plan.budget.replace(/[^0-9]/g, '')) : undefined,
                    priceUnit: '만원',
                    status: 'planned',
                  }}
                  onPress={() => handleCardPress(plan.tripPlanId)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    paddingVertical: 80,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 20,
  },
});
