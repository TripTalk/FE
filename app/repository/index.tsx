import { TravelCard } from '@/components/repository/TravelCard';
import { ThemedText } from '@/components/shared/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedTripPlans, SavedTripPlan } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RepositoryScreen() {
  const { tokens } = useAuth();
  const [tripPlans, setTripPlans] = useState<SavedTripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTripPlans = async () => {
    try {
      setIsLoading(true);
      const accessToken = tokens?.accessToken;
      
      console.log('=== 저장된 여행 계획 조회 시작 ===');
      
      const response = await getSavedTripPlans(accessToken);
      
      if (response.isSuccess && response.result) {
        setTripPlans(response.result.tripPlanList);
        console.log('조회된 여행 계획:', response.result.tripPlanList.length, '개');
      } else {
        setTripPlans([]);
      }
    } catch (error: any) {
      console.log('여행 계획 목록 조회 실패:', error);
      setTripPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTripPlans();
    setIsRefreshing(false);
  };

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchTripPlans();
    }, [tokens])
  );

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
