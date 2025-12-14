import { TravelCard } from '@/components/repository/TravelCard';
import { ThemedText } from '@/components/shared/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedTripPlans, SavedTripPlan, toggleTravelCompleted } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RepositoryScreen() {
  const { tokens } = useAuth();
  const [tripPlans, setTripPlans] = useState<SavedTripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTripPlans = async () => {
    console.log('=== fetchTripPlans 함수 호출됨 ===');
    try {
      setIsLoading(true);
      const accessToken = tokens?.accessToken;
      
      console.log('=== 저장된 여행 계획 조회 시작 ===');
      console.log('accessToken 존재:', !!accessToken);
      
      const response = await getSavedTripPlans(accessToken);
      
      console.log('API 응답:', JSON.stringify(response, null, 2));
      
      if (response.isSuccess && response.result) {
        setTripPlans(response.result.tripPlanList);
        console.log('조회된 여행 계획:', response.result.tripPlanList.length, '개');
      } else {
        console.log('API 응답 성공하지 않음 또는 result 없음');
        setTripPlans([]);
      }
    } catch (error: any) {
      console.log('여행 계획 목록 조회 실패:', error.message);
      console.log('에러 상세:', error);
      setTripPlans([]);
    } finally {
      setIsLoading(false);
      console.log('=== fetchTripPlans 완료 ===');
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
      console.log('=== 저장소 화면 포커스됨 ===');
      console.log('tokens 존재:', !!tokens);
      fetchTripPlans();
    }, [tokens])
  );

  // 컴포넌트 마운트 시에도 호출
  useEffect(() => {
    console.log('=== 저장소 페이지 마운트됨 ===');
    fetchTripPlans();
  }, []);

  const handleCardPress = (tripPlanId: number) => {
    // TODO: 상세 페이지로 이동
    console.log('Travel plan clicked:', tripPlanId);
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
      
      // 상태 변경 후 목록 새로고침
      await fetchTripPlans();
      
      Alert.alert('완료', '여행 상태가 변경되었습니다.');
    } catch (error: any) {
      console.log('상태 변경 실패:', error);
      Alert.alert('오류', '상태 변경에 실패했습니다.');
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={{ padding: 16, backgroundColor: '#FFF' }}>
          <Button title="강제 새로고침 (디버깅용)" onPress={fetchTripPlans} color="#4ECDC4" />
        </View>
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
                    transportations: plan.transportations,
                    accommodations: plan.accommodations,
                  }}
                  onPress={() => handleCardPress(plan.tripPlanId)}
                  onToggleComplete={() => handleToggleComplete(plan.tripPlanId)}
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
