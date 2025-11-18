import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DaySchedule } from '@/components/repository/DaySchedule';
import { PriceInfo } from '@/components/repository/PriceInfo';
import { ShareModal } from '@/components/repository/ShareModal';
import { TravelDetailHeader } from '@/components/repository/TravelDetailHeader';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';

// 샘플 여행 데이터
const travelData: Record<string, any> = {
  '1': {
    id: '1',
    title: '제주도 3박 4일 힐링 여행',
    location: '제주도',
    startDate: '2024.03.15',
    endDate: '2024.03.18',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    price: '50만-100만원',
    description: '아름다운 제주도에서 힐링하는 완벽한 여행',
    schedules: [
      {
        day: 1,
        date: '3월 15일 (금)',
        items: [
          { time: '10:00', title: '도착 및 렌터카 픽업', location: '제주공항' },
          { time: '12:00', title: '올레국수', location: '제주시' },
          { time: '14:00', title: '성산일출봉', location: '성산읍' },
          { time: '17:00', title: '숙소 체크인', location: '카마 제주리조트' },
          { time: '19:00', title: '올레시장 식사', location: '올레시장' },
        ]
      }
    ],
    prices: [
      { type: 'flight' as const, title: '제주항공', subtitle: '김포 → 제주', price: 89000 },
      { type: 'accommodation' as const, title: '대명리조트', subtitle: '제주 → 김포', price: 125000 },
      { type: 'accommodation' as const, title: '제주 오션뷰 리조트', subtitle: '서귀포시', price: 120000, unit: '원/박' },
      { type: 'accommodation' as const, title: '제주 힐링 펜션', subtitle: '제주시', price: 85000, unit: '원/박' },
    ]
  },
  '2': {
    id: '2',
    title: '부산 맛집 투어 여행',
    location: '부산',
    startDate: '2024.04.20',
    endDate: '2024.04.22',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
    price: '30만-60만원',
    description: '부산의 대표 맛집들을 둘러보는 미식 여행',
    schedules: [
      {
        day: 1,
        date: '4월 20일 (토)',
        items: [
          { time: '09:00', title: '부산역 도착', location: '부산역' },
          { time: '10:30', title: '자갈치시장', location: '남구' },
          { time: '12:00', title: '밀면 맛집', location: '서면' },
          { time: '15:00', title: '해운대 해수욕장', location: '해운대구' },
          { time: '18:00', title: '광안리 회센터', location: '수영구' },
        ]
      }
    ],
    prices: [
      { type: 'flight' as const, title: 'KTX', subtitle: '서울 → 부산', price: 59800 },
      { type: 'accommodation' as const, title: '부산 시티호텔', subtitle: '서면역', price: 95000, unit: '원/박' },
    ]
  },
  '3': {
    id: '3',
    title: '강릉 바다여행 1박 2일',
    location: '강릉',
    startDate: '2025.01.05',
    endDate: '2025.01.06',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    price: '25만-30만원',
    description: '동해안의 아름다운 바다와 함께하는 힐링 여행',
    schedules: [
      {
        day: 1,
        date: '1월 5일 (일)',
        items: [
          { time: '08:00', title: 'KTX 출발', location: '서울역' },
          { time: '10:30', title: '강릉역 도착', location: '강릉역' },
          { time: '12:00', title: '강릉 중앙시장 맛집', location: '강릉시' },
          { time: '14:00', title: '경포대 해수욕장', location: '경포대' },
          { time: '17:00', title: '숙소 체크인', location: '강릉 씨마크호텔' },
        ]
      }
    ],
    prices: [
      { type: 'flight' as const, title: 'KTX', subtitle: '서울 → 강릉', price: 28900 },
      { type: 'accommodation' as const, title: '강릉 씨마크호텔', subtitle: '경포대', price: 180000, unit: '원/박' },
    ]
  },
  '4': {
    id: '4',
    title: '부산 맛집 투어 여행',
    location: '부산',
    startDate: '2024.10.20',
    endDate: '2024.10.22',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
    price: '30만-35만원',
    description: '부산의 유명한 맛집들을 둘러보는 미식 여행 (완료)',
    schedules: [
      {
        day: 1,
        date: '10월 20일 (일)',
        items: [
          { time: '09:00', title: '부산역 도착', location: '부산역' },
          { time: '10:30', title: '자갈치시장', location: '남구' },
          { time: '12:00', title: '밀면 맛집', location: '서면' },
          { time: '15:00', title: '해운대 해수욕장', location: '해운대구' },
          { time: '18:00', title: '광안리 회센터', location: '수영구' },
        ]
      }
    ],
    prices: [
      { type: 'flight' as const, title: 'KTX', subtitle: '서울 → 부산', price: 59800 },
      { type: 'accommodation' as const, title: '부산 시티호텔', subtitle: '서면역', price: 95000, unit: '원/박' },
    ]
  },
  '5': {
    id: '5',
    title: '경주 역사탐방 2박 3일',
    location: '경주',
    startDate: '2024.09.15',
    endDate: '2024.09.17',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    price: '35만-40만원',
    description: '천년 고도 경주의 역사와 문화를 체험하는 여행 (완료)',
    schedules: [
      {
        day: 1,
        date: '9월 15일 (일)',
        items: [
          { time: '10:00', title: '불국사 관람', location: '불국사' },
          { time: '12:30', title: '경주 전통한식', location: '황리단길' },
          { time: '14:00', title: '석굴암', location: '석굴암' },
          { time: '16:00', title: '첨성대', location: '첨성대' },
          { time: '18:00', title: '숙소 체크인', location: '경주 힐튼호텔' },
        ]
      }
    ],
    prices: [
      { type: 'accommodation' as const, title: '경주 힐튼호텔', subtitle: '경주시', price: 150000, unit: '원/박' },
      { type: 'flight' as const, title: '입장료', subtitle: '불국사+석굴암', price: 8000 },
    ]
  },
  '6': {
    id: '6',
    title: '전주 한옥마을 당일치기',
    location: '전주',
    startDate: '2024.08.12',
    endDate: '2024.08.12',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    price: '10만-20만원',
    description: '전주 한옥마을의 전통 문화와 맛집 탐방 당일 여행 (완료)',
    schedules: [
      {
        day: 1,
        date: '8월 12일 (월)',
        items: [
          { time: '08:00', title: 'KTX 출발', location: '용산역' },
          { time: '10:00', title: '전주역 도착', location: '전주역' },
          { time: '11:00', title: '한옥마을 도보 관광', location: '전주 한옥마을' },
          { time: '12:30', title: '전주 비빔밥', location: '한옥마을' },
          { time: '15:00', title: '경기전', location: '경기전' },
          { time: '17:00', title: '귀가', location: '전주역' },
        ]
      }
    ],
    prices: [
      { type: 'flight' as const, title: 'KTX 왕복', subtitle: '용산 → 전주', price: 89600 },
      { type: 'accommodation' as const, title: '식사비', subtitle: '비빔밥+간식', price: 45000 },
    ]
  }
};

export default function TravelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const travel = travelData[id || '1'];
  const [shareModalVisible, setShareModalVisible] = React.useState(false);

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const closeShareModal = () => {
    setShareModalVisible(false);
  };

  if (!travel) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TravelDetailHeader title="여행 정보를 찾을 수 없습니다" />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TravelDetailHeader title="여행 일정" />
      </SafeAreaView>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 여행 이미지 및 기본 정보 */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: travel.image }} style={styles.image} />
        </View>
        
        <View style={styles.content}>
          {/* 여행 제목 및 기본 정보 */}
          <ThemedView style={styles.basicInfo}>
            <ThemedText style={styles.title}>{travel.title}</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>📍 목적지</ThemedText>
              <ThemedText style={styles.value}>{travel.location}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>📅 일정</ThemedText>
              <ThemedText style={styles.value}>
                {travel.startDate} - {travel.endDate}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>👥 인원</ThemedText>
              <ThemedText style={styles.value}>{travel.price}</ThemedText>
            </View>
            {travel.description && (
              <View style={styles.descriptionContainer}>
                <ThemedText style={styles.label}>✏️ 여행 소개</ThemedText>
                <ThemedText style={styles.description}>{travel.description}</ThemedText>
              </View>
            )}
          </ThemedView>

          {/* 여행 일정 */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>📋 여행 일정</ThemedText>
            {travel.schedules?.map((schedule: any, index: number) => (
              <DaySchedule
                key={index}
                day={schedule.day}
                date={schedule.date}
                schedules={schedule.items}
                isActive={index === 0}
              />
            ))}
          </ThemedView>

          {/* 가격 정보 */}
          {travel.prices && (
            <ThemedView style={styles.section}>
              <PriceInfo priceItems={travel.prices} />
            </ThemedView>
          )}

          {/* 공유하기 버튼 */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <ThemedText style={styles.shareButtonText}>🔗 공유하기</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 공유 모달 */}
      <ShareModal
        visible={shareModalVisible}
        onClose={closeShareModal}
        travelData={{
          title: travel?.title || '',
          location: travel?.location || '',
          image: travel?.image || '',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  imageContainer: {
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  basicInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    width: 80,
    marginRight: 12,
  },
  value: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
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
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});