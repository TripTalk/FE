import { AccommodationCard } from '@/components/home/AccommodationCard';
import { ThemedText } from '@/components/shared/themed-text';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

// 실제 API 연동
async function fetchFlights() {
  const res = await fetch('/api/flights');
  if (!res.ok) return [];
  return await res.json();
}
async function fetchAccommodations() {
  const res = await fetch('/api/accommodations');
  if (!res.ok) return [];
  return await res.json();
}

export default function AccommodationScreen() {
  const [activeTab, setActiveTab] = useState<'항공' | '숙박'>('항공');
  const [flights, setFlights] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchFlights().then(setFlights).finally(() => setLoading(false));
    fetchAccommodations().then(setAccommodations);
  }, []);

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

  const renderFlightGrid = (items: typeof flights) => {
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

  const renderAccommodationGrid = (items: typeof accommodations) => {
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