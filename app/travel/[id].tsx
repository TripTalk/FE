import { DaySchedule } from '@/components/repository/DaySchedule';
import { PriceInfo } from '@/components/repository/PriceInfo';
import { ShareModal } from '@/components/repository/ShareModal';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { getTripPlanDetail, SavedTripPlan } from '@/services/api';

export default function TravelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useAuth();
  const [travel, setTravel] = useState<SavedTripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    if (!id || !tokens?.accessToken) return;

    const fetchTravelDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const accessToken = tokens.accessToken;
        const response = await getTripPlanDetail(parseInt(id), accessToken);
        if (response.isSuccess && response.result) {
          setTravel(response.result);
        } else {
          throw new Error(response.message || '여행 정보를 불러올 수 없습니다.');
        }
      } catch (error: any) {
        setError(error.message || '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelDetail();
  }, [id]);

  const handleShare = () => setShareModalVisible(true);
  const closeShareModal = () => setShareModalVisible(false);

  // 가격 정보 변환
  const priceItems = [];
  if (travel?.transportations && travel.transportations.length > 0) {
    travel.transportations.forEach(transport => {
      priceItems.push({
        type: 'flight' as const,
        title: transport.name,
        subtitle: `${transport.origin} → ${transport.destination}`,
        price: transport.price,
      });
    });
  }
  if (travel?.accommodations && travel.accommodations.length > 0) {
    travel.accommodations.forEach(accommodation => {
      priceItems.push({
        type: 'accommodation' as const,
        title: accommodation.name,
        subtitle: accommodation.address,
        price: accommodation.pricePerNight,
        unit: '원/박',
      });
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView>
        <ThemedView>
          <ThemedText>로딩 중...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView>
        <ThemedView>
          <ThemedText>오류: {error}</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!travel) {
    return (
      <SafeAreaView>
        <ThemedView>
          <ThemedText>여행 정보를 찾을 수 없습니다.</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView style={styles.cardInfoBox}>
          <ThemedText style={styles.cardTitle}>{travel.title}</ThemedText>
          <ThemedText style={styles.cardValue}>{travel.destination}</ThemedText>
        </ThemedView>
        {/* DaySchedule 하위 컴포넌트 복원 */}
        {travel.dailySchedules && travel.dailySchedules.length > 0 && (
          <ThemedView style={styles.cardInfoBox}>
            <ThemedText style={styles.cardTitle}>여행 일정</ThemedText>
            {travel.dailySchedules.map((schedule, idx) => (
              <DaySchedule
                key={idx}
                day={schedule.day}
                date={schedule.date}
                schedules={schedule.schedules
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map(s => ({
                    time: s.time.substring(0, 5),
                    title: s.title,
                    location: s.description,
                  }))}
                isActive={idx === 0}
              />
            ))}
          </ThemedView>
        )}
        {/* PriceInfo 하위 컴포넌트 복원 */}
        {priceItems.length > 0 && (
          <ThemedView style={styles.cardInfoBox}>
            <ThemedText style={styles.cardTitle}>가격 정보</ThemedText>
            <PriceInfo priceItems={priceItems} />
          </ThemedView>
        )}
        {/* 공유하기 버튼 및 모달 복원 */}
        <ThemedView style={styles.cardInfoBox}>
          <ThemedText style={styles.cardTitle}>공유</ThemedText>
          <ThemedText style={styles.cardValue} onPress={handleShare}>🔗 공유하기</ThemedText>
        </ThemedView>
        <ShareModal
          visible={shareModalVisible}
          onClose={closeShareModal}
          travelData={{
            title: travel.title,
            location: travel.destination,
            image: travel.imageUrl || '',
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 16,
    color: '#333',
  },
});