import { AccommodationCard } from '@/components/home/AccommodationCard';
import { ThemedText } from '@/components/shared/themed-text';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 더미 데이터
const DUMMY_FLIGHTS = [
  { id: 1, departure: '서울', destination: '제주', price: 89000, imgUrl: 'https://picsum.photos/400/300?random=1' },
  { id: 2, departure: '서울', destination: '부산', price: 52000, imgUrl: 'https://picsum.photos/400/300?random=2' },
  { id: 3, departure: '서울', destination: '오사카', price: 156000, imgUrl: 'https://picsum.photos/400/300?random=3' },
  { id: 4, departure: '서울', destination: '도쿄', price: 189000, imgUrl: 'https://picsum.photos/400/300?random=4' },
];

const DUMMY_ACCOMMODATIONS = [
  { id: 1, name: '제주 호텔', location: '제주시', price: 120000, imgUrl: 'https://picsum.photos/400/300?random=5' },
  { id: 2, name: '부산 리조트', location: '해운대', price: 150000, imgUrl: 'https://picsum.photos/400/300?random=6' },
  { id: 3, name: '서울 게스트하우스', location: '명동', price: 65000, imgUrl: 'https://picsum.photos/400/300?random=7' },
  { id: 4, name: '강릉 펜션', location: '경포대', price: 90000, imgUrl: 'https://picsum.photos/400/300?random=8' },
];

export default function AccommodationScreen() {
  const [activeTab, setActiveTab] = useState<'항공' | '숙박'>('항공');
  const [flights] = useState(DUMMY_FLIGHTS);
  const [accommodations] = useState(DUMMY_ACCOMMODATIONS);
  
  // 슬라이딩 인디케이터 애니메이션
  const indicatorPosition = useSharedValue(0);
  const TAB_WIDTH = (SCREEN_WIDTH - 32 - 8) / 2; // padding과 gap 고려

  const handleTabChange = (tab: '항공' | '숙박') => {
    setActiveTab(tab);
    indicatorPosition.value = withTiming(tab === '항공' ? 0 : 1, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value * TAB_WIDTH }],
    };
  });

  const handleBackPress = () => {
    router.back();
  };

  const renderFlightGrid = (items: typeof DUMMY_FLIGHTS) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      const row = items.slice(i, i + 2);
      rows.push(
        <View key={i} style={styles.accommodationRow}>
          {row.map((item) => (
            <AccommodationCard
              key={item.id}
              title={`${item.departure} → ${item.destination}`}
              tag="항공"
              price={`${item.price.toLocaleString()}원`}
              imageUrl={item.imgUrl}
            />
          ))}
          {row.length === 1 && <View style={styles.emptyCard} />}
        </View>
      );
    }
    return rows;
  };

  const renderAccommodationGrid = (items: typeof DUMMY_ACCOMMODATIONS) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      const row = items.slice(i, i + 2);
      rows.push(
        <View key={i} style={styles.accommodationRow}>
          {row.map((item) => (
            <AccommodationCard
              key={item.id}
              title={item.name}
              tag="숙박"
              price={`${item.price.toLocaleString()}원/박`}
              imageUrl={item.imgUrl}
            />
          ))}
          {row.length === 1 && <View style={styles.emptyCard} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: '숙박·항공',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* 탭 헤더 */}
        <View style={styles.tabContainer}>
          <View style={styles.tabWrapper}>
            {/* 슬라이딩 인디케이터 */}
            <Animated.View style={[styles.tabIndicator, indicatorAnimatedStyle]} />
            
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleTabChange('항공')}
              activeOpacity={0.7}
            >
              <Animated.Text style={[styles.tabText, activeTab === '항공' && styles.activeTabText]}>
                항공
              </Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleTabChange('숙박')}
              activeOpacity={0.7}
            >
              <Animated.Text style={[styles.tabText, activeTab === '숙박' && styles.activeTabText]}>
                숙박
              </Animated.Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* 선택된 탭의 내용 */}
          <View style={styles.contentContainer}>
            {(activeTab === '항공' ? flights.length === 0 : accommodations.length === 0) ? (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  등록된 {activeTab === '항공' ? '항공권이' : '숙박이'} 없습니다.
                </ThemedText>
              </View>
            ) : (
              <Animated.View 
                key={activeTab}
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(100)}
                layout={Layout.duration(200)}
                style={styles.accommodationGrid}
              >
                {activeTab === '항공' ? renderFlightGrid(flights) : renderAccommodationGrid(accommodations)}
              </Animated.View>
            )}
          </View>

          {/* 추천 특가 섹션 제거 - 백엔드 연동 완료 */}
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
  tabContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    padding: 4,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: '50%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#333333',
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  specialOffersContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  accommodationGrid: {
    gap: 4,
  },
  accommodationRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  emptyCard: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999999',
  },
});