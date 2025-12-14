import { DaySchedule } from '@/components/repository/DaySchedule';
import { ShareModal } from '@/components/repository/ShareModal';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { getTripPlanDetail, SavedTripPlan } from '@/services/api';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';



export default function TravelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useAuth();
  const [travel, setTravel] = useState<SavedTripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const handleShare = () => setShareModalVisible(true);
  const closeShareModal = () => setShareModalVisible(false);


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
  }, [id, tokens?.accessToken]);


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
        {/* 여행 요약 카드 */}
        <ThemedView style={[styles.cardInfoBox, { padding: 0, overflow: 'hidden' }]}> 
          {/* 대표 이미지 */}
          {travel.imageUrl && (
            <Image
              source={{ uri: travel.imageUrl }}
              style={{ width: '100%', height: 180, resizeMode: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />
          )}
          <ThemedView style={{ padding: 20 }}>
            <ThemedText style={[styles.cardTitle, { fontSize: 24, marginBottom: 12 }]}>{travel.title}</ThemedText>
            <ThemedView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
              <ThemedView style={{ flex: 1 }}>
                <ThemedText style={styles.summaryLabel}>📍 목적지</ThemedText>
                <ThemedText style={styles.summaryValue}>{travel.destination}</ThemedText>
              </ThemedView>
              <ThemedView style={{ flex: 1 }}>
                <ThemedText style={styles.summaryLabel}>📅 기간</ThemedText>
                <ThemedText style={styles.summaryValue}>{travel.startDate} - {travel.endDate}</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
              <ThemedView style={{ flex: 1 }}>
                <ThemedText style={styles.summaryLabel}>👥 인원</ThemedText>
                <ThemedText style={styles.summaryValue}>{travel.companions}</ThemedText>
              </ThemedView>
              <ThemedView style={{ flex: 1 }}>
                <ThemedText style={styles.summaryLabel}>💰 예산</ThemedText>
                <ThemedText style={styles.summaryValue}>{travel.budget ? `${Number(travel.budget).toLocaleString()}원` : '-'}</ThemedText>
              </ThemedView>
            </ThemedView>
            {/* 여행 스타일 태그 - 텍스트/아이콘 제거, 해시태그만 */}
            {travel.travelStyles && travel.travelStyles.length > 0 && (
              <ThemedView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {travel.travelStyles.map((style: string, idx: number) => (
                  <ThemedView key={idx} style={styles.hashtagBox}>
                    <ThemedText style={styles.hashtagText}>{getKoreanStyle(style)}</ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>


        {/* 일정 표시 - 가장 위로 이동 */}
        <View style={styles.scheduleCardWrap}>
          <View style={styles.scheduleCardHeaderRow}>
            <ThemedText style={styles.scheduleCardTitle}>여행 일정</ThemedText>
          </View>
          <>
            <View style={styles.dayTabRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                keyboardShouldPersistTaps="handled"
              >
                {travel.dailySchedules && travel.dailySchedules.length > 0 ? (
                  travel.dailySchedules.map((day, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.dayTab,
                        selectedDayIdx === idx && styles.dayTabActive
                      ]}
                      onPress={() => setSelectedDayIdx(idx)}
                    >
                      <ThemedText style={selectedDayIdx === idx ? styles.dayTabTextActive : styles.dayTabText}>
                        {`Day${day.day || idx + 1}`}
                      </ThemedText>
                    </TouchableOpacity>
                  ))
                ) : null}
              </ScrollView>
            </View>
            {travel.dailySchedules && travel.dailySchedules.length > 0 && travel.dailySchedules[selectedDayIdx] && travel.dailySchedules[selectedDayIdx].schedules ? (
              <DaySchedule
                day={travel.dailySchedules[selectedDayIdx].day || selectedDayIdx + 1}
                date={travel.dailySchedules[selectedDayIdx].date}
                schedules={travel.dailySchedules[selectedDayIdx].schedules}
              />
            ) : (
              <ThemedText style={{ color: '#888', fontSize: 15, marginTop: 16 }}>등록된 일정이 없습니다.</ThemedText>
            )}
          </>

        </View>

        {/* 항공권 카드 - 아래로 이동 */}
        {travel.transportations && travel.transportations.length > 0 && (
          <ThemedView style={styles.cardInfoBox}>
            <ThemedText style={styles.sectionTitle}>항공</ThemedText>
            {travel.transportations.map((transport: any, idx: number) => (
              <ThemedView key={idx} style={styles.flightCard}>
                <ThemedView style={styles.flightIconBox}>
                  <ThemedText style={styles.flightIcon}>✈️</ThemedText>
                </ThemedView>
                <ThemedView style={{ flex: 1 }}>
                  <ThemedText style={styles.flightTitle}>{transport.name}</ThemedText>
                  <ThemedText style={styles.flightSub}>{transport.origin} → {transport.destination}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.flightPrice}>{transport.price.toLocaleString()}원</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* 숙박 카드 - 아래로 이동 */}
        {travel.accommodations && travel.accommodations.length > 0 && (
          <ThemedView style={styles.cardInfoBox}>
            <ThemedText style={styles.sectionTitle}>숙박</ThemedText>
            {travel.accommodations.map((accommodation: any, idx: number) => (
              <ThemedView key={idx} style={styles.accommodationCard}>
                <ThemedView style={styles.accommodationIconBox}>
                  <ThemedText style={styles.accommodationIcon}>🏨</ThemedText>
                </ThemedView>
                <ThemedView style={{ flex: 1 }}>
                  <ThemedText style={styles.accommodationTitle}>{accommodation.name}</ThemedText>
                  <ThemedText style={styles.accommodationSub}>{accommodation.address}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.accommodationPriceGreen}>{accommodation.pricePerNight.toLocaleString()}원/박</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        <ShareModal
          visible={shareModalVisible}
          onClose={closeShareModal}
          travelData={{
            title: travel?.title || '',
            location: travel?.destination || '',
            image: travel?.imageUrl || '',
          }}
        />

        {/* 공유하기 버튼 - 하단 고정 */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <ThemedText style={styles.shareButtonText}>공유하기</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- 일정 카드/탭 관련 ---
  // 중복 제거: 일정 관련 스타일은 아래 한 번만 남깁니다.
  // --- 기존 스타일 ---
  // --- 일정 카드/탭 관련 ---
  // 중복 제거: 일정 관련 스타일은 아래 한 번만 남깁니다.
  // --- 기존 스타일 ---
  // --- 일정 카드/탭 관련 ---
  scheduleCardWrap: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 0,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 32,
  },
  scheduleCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingLeft: 24,
    paddingBottom: 0,
  },
  scheduleCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  dayTabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
    paddingLeft: 24,
    gap: 8,
  },
  dayTab: {
    backgroundColor: '#F2F4F7',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 8,
  },
  dayTabActive: {
    backgroundColor: '#20C997',
  },
  dayTabText: {
    color: '#8A94A6',
    fontSize: 16,
    fontWeight: '500',
  },
  dayTabTextActive: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hashtagBox: {
    backgroundColor: 'rgba(45, 180, 180, 0.10)', // 연한 민트
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hashtagText: {
    color: '#20B2AA', // 민트색
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  flightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F0FA',
  },
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
  summaryLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shareButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  flightIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flightIcon: {
    fontSize: 20,
    color: '#5B9EFF',
  },
  flightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  flightSub: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  flightPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2574FF',
    marginLeft: 12,
  },
  accommodationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FFF8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D3F9D8',
  },
  accommodationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D3F9D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accommodationIcon: {
    fontSize: 20,
    color: '#20C997',
  },
  accommodationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  accommodationSub: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  accommodationPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#20C997',
    marginLeft: 12,
  },
  accommodationPriceGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2DB400', // 네이버 초록
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
});

// 해시태그 한글 변환 함수 (Figma 스타일)
function getKoreanStyle(style: string) {
  switch (style) {
    case 'HEALING': return '#힐링';
    case 'LOCAL_VIBE': return '#로컬감성';
    case 'HOTPLACE': return '#핫플레이스';
    case 'MUST_VISIT': return '#필수코스';
    case 'NATURE': return '#자연과함께';
    case 'CAFE_TOUR': return '#카페투어';
    case 'FOOD_TOUR': return '#맛집탐방';
    default: return `#${style}`;
  }
}