import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TabSelector } from '@/components/repository/TabSelector';
import { TravelCard } from '@/components/repository/TravelCard';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedTripPlans, SavedTripPlan, toggleTravelCompleted } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function ExploreScreen() {
  const { tokens } = useAuth();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'계획 완료' | '여행 완료'>('계획 완료');
  const [tripPlans, setTripPlans] = useState<SavedTripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTripPlans = async () => {
    console.log('=== explore.tsx: fetchTripPlans 호출 ===');
    console.log('activeTab:', activeTab);
    try {
      setIsLoading(true);
      const accessToken = tokens?.accessToken;
      
      console.log('accessToken 존재:', !!accessToken);
      
      // 탭에 따라 status 결정
      const status = activeTab === '계획 완료' ? 'PLANNED' : 'TRAVELED';
      
      const response = await getSavedTripPlans(accessToken, status);
      
      console.log('API 응답:', JSON.stringify(response, null, 2));
      
      if (response.isSuccess && response.result) {
        console.log('원본 데이터:', JSON.stringify(response.result.tripPlanList, null, 2));
        setTripPlans(response.result.tripPlanList);
        console.log('조회된 여행 계획:', response.result.tripPlanList.length, '개');
      } else {
        console.log('API 응답 성공하지 않음');
        setTripPlans([]);
      }
    } catch (error: any) {
      console.log('여행 계획 목록 조회 실패:', error.message);
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

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    React.useCallback(() => {
      console.log('=== explore 화면 포커스됨 ===');
      fetchTripPlans();
    }, [tokens, activeTab])
  );

  // 초기 로드
  useEffect(() => {
    fetchTripPlans();
  }, []);

  // 탭 변경 시 데이터 새로고침
  useEffect(() => {
    fetchTripPlans();
  }, [activeTab]);

  useEffect(() => {
    if (params.tab === 'completed') {
      setActiveTab('여행 완료');
    } else if (params.tab === 'planned') {
      setActiveTab('계획 완료');
    }
  }, [params.tab]);

  const filteredTravels = tripPlans
    .filter(plan => 
      activeTab === '계획 완료' ? plan.status === 'PLANNED' : plan.status === 'TRAVELED'
    )
    .map(plan => {
      // tripPlanId 또는 id를 사용
      const planId = plan.tripPlanId || plan.id;
      if (!planId) {
        console.warn('여행 계획 ID가 없습니다:', plan);
        return null;
      }
      
      return {
        id: planId.toString(),
        title: plan.title,
        startDate: plan.startDate,
        endDate: plan.endDate,
        image: plan.imageUrl || 'https://via.placeholder.com/400x200',
        price: plan.budget ? parseInt(plan.budget.replace(/[^0-9]/g, '')) : undefined,
        priceUnit: '원',
        status: plan.status === 'PLANNED' ? 'planned' as const : 'completed' as const,
        transportations: plan.transportations,
        accommodations: plan.accommodations,
      };
    })
    .filter(Boolean); // null 제거

  const handleCardPress = (travelId: string) => {
    router.push(`/travel/${travelId}`);
  };

  const handleToggleComplete = async (tripPlanId: number) => {
    const accessToken = tokens?.accessToken;
    if (!accessToken) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    try {
      console.log('여행 완료 상태 변경 시작:', tripPlanId);
      await toggleTravelCompleted(tripPlanId, accessToken);
      
      Alert.alert('완료', '여행 상태가 변경되었습니다.');
      
      // 상태 변경 후 데이터 새로고침
      await fetchTripPlans();
    } catch (error: any) {
      console.log('상태 변경 실패:', error);
      Alert.alert('오류', '상태 변경에 실패했습니다.');
    }
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
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
            <ThemedText style={styles.loadingText}>여행 계획을 불러오는 중...</ThemedText>
          </ThemedView>
        ) : filteredTravels.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              {activeTab === '계획 완료' ? '계획된 여행이 없습니다' : '완료된 여행이 없습니다'}
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              AI와 대화하여 여행 계획을 만들어보세요!
            </ThemedText>
          </ThemedView>
        ) : (
          filteredTravels.map((travel) => (
            <TravelCard
              key={travel.id}
              travel={travel}
              onPress={() => handleCardPress(travel.id)}
              onToggleComplete={() => handleToggleComplete(parseInt(travel.id))}
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});
