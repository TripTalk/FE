import { AccommodationCard } from '@/components/home/AccommodationCard';
import { ThemedText } from '@/components/shared/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { Accommodation, Flight, getAccommodations, getFlights } from '@/services/api';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
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

// 실제 API 연동 (services/api 사용)
// 샘플 폴백 데이터 (API 호출에 실패할 경우 시뮬레이터에서 보기 위해 사용)
const SAMPLE_FLIGHTS = [
  { id: 1, departure: '김포', destination: '제주', price: 45000, imgUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764b39?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, departure: '김포', destination: '부산', price: 35000, imgUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854adf5?q=80&w=1200&auto=format&fit=crop' },
];
const SAMPLE_ACCOMMODATIONS = [
  { id: 1, name: '나인트리 프리미어 호텔 명동2', location: '서울 중구', price: 130000, imgUrl: 'https://images.unsplash.com/photo-1501117716987-c8e6f2f7b3c7?q=80&w=1200&auto=format&fit=crop' },
];

async function fetchFlights(accessToken?: string | null) {
  try {
    const data = await getFlights(undefined, accessToken || undefined);
    return data?.result?.flightList || SAMPLE_FLIGHTS;
  } catch (err) {
    console.warn('getFlights error, falling back to SAMPLE_FLIGHTS', err);
    return SAMPLE_FLIGHTS;
  }
}

async function fetchAccommodations(accessToken?: string | null) {
  try {
    const data = await getAccommodations(undefined, accessToken || undefined);
    return data?.result?.accommodationList || SAMPLE_ACCOMMODATIONS;
  } catch (err) {
    console.warn('getAccommodations error, falling back to SAMPLE_ACCOMMODATIONS', err);
    return SAMPLE_ACCOMMODATIONS;
  }
}

export default function AccommodationScreen() {
  const [activeTab, setActiveTab] = useState<'항공' | '숙박'>('항공');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(false);
  const [flightsCursor, setFlightsCursor] = useState<number | null>(null);
  const [flightsHasNext, setFlightsHasNext] = useState(false);
  const [accCursor, setAccCursor] = useState<number | null>(null);
  const [accHasNext, setAccHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  // aliases for older references (avoid ReferenceError if partially rolled back builds reference these)
  const loadingMoreFlights = loadingMore;
  const loadingMoreAcc = loadingMore;

  const { tokens } = useAuth();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const fRes = await getFlights(undefined, tokens?.accessToken);
        const aRes = await getAccommodations(undefined, tokens?.accessToken);

        const fList = fRes?.result?.flightList || [];
        const aList = aRes?.result?.accommodationList || [];

        setFlights(fList);
        setFlightsCursor(fRes?.result?.nextCursorId ?? null);
        setFlightsHasNext(!!fRes?.result?.hasNext);

        setAccommodations(aList);
        setAccCursor(aRes?.result?.nextCursorId ?? null);
        setAccHasNext(!!aRes?.result?.hasNext);
      } catch (err) {
        console.warn('initial fetch failed, falling back to sample fetch', err);
        const f = await fetchFlights(tokens?.accessToken);
        const a = await fetchAccommodations(tokens?.accessToken);
        setFlights(f);
        setAccommodations(a);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [tokens]);

  const loadMoreFlights = async () => {
    if (!flightsHasNext || loadingMore) return;
    console.log('loadMoreFlights triggered, cursor:', flightsCursor);
    setLoadingMore(true);
    try {
      const res = await getFlights(flightsCursor ?? undefined, tokens?.accessToken);
      const next = res?.result?.flightList || [];
      setFlights(prev => [...prev, ...next]);
      setFlightsCursor(res?.result?.nextCursorId ?? null);
      setFlightsHasNext(!!res?.result?.hasNext);
    } catch (err) {
      console.warn('loadMoreFlights error', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreAccommodations = async () => {
    if (!accHasNext || loadingMore) return;
    console.log('loadMoreAccommodations triggered, cursor:', accCursor);
    setLoadingMore(true);
    try {
      const res = await getAccommodations(accCursor ?? undefined, tokens?.accessToken);
      const next = res?.result?.accommodationList || [];
      setAccommodations(prev => [...prev, ...next]);
      setAccCursor(res?.result?.nextCursorId ?? null);
      setAccHasNext(!!res?.result?.hasNext);
    } catch (err) {
      console.warn('loadMoreAccommodations error', err);
    } finally {
      setLoadingMore(false);
    }
  };

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

  const renderFlightItem = ({ item }: { item: Flight }) => {
    const priceVal: any = (item as any).price ?? (item as any).pricePerNight ?? null;
    const priceStr = typeof priceVal === 'number' ? `${priceVal.toLocaleString()}원` : (priceVal ? `${priceVal}` : '요금 없음');
    const rawImage = (item as any).imgUrl || (item as any).imageUrl || '';
    const imageUrl = rawImage && rawImage.length > 0 ? rawImage : undefined;
    const origin = (item as any).originName ?? (item as any).departure ?? '';
    const destination = (item as any).destinationName ?? (item as any).destination ?? '';
    const airline = (item as any).airlineName ?? (item as any).airline ?? '항공';
    return (
      <AccommodationCard
        title={`${origin} → ${destination}`}
        tag={airline}
        price={priceStr}
        imageUrl={imageUrl}
      />
    );
  };

  const renderAccommodationItem = ({ item }: { item: Accommodation }) => {
    const priceVal: any = (item as any).price ?? (item as any).pricePerNight ?? null;
    const priceStr = typeof priceVal === 'number' ? `${priceVal.toLocaleString()}원/박` : (priceVal ? `${priceVal}` : '요금 없음');
    const rawImage = (item as any).imgUrl || (item as any).imageUrl || '';
    const imageUrl = rawImage && rawImage.length > 0 ? rawImage : undefined;
    const hotelName = (item as any).hotelName ?? (item as any).name ?? '';
    const cityName = (item as any).cityName ?? (item as any).location ?? '숙박';
    return (
      <AccommodationCard
        title={hotelName}
        tag={cityName}
        price={priceStr}
        imageUrl={imageUrl}
      />
    );
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

        <View style={styles.scrollView}>
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
                {activeTab === '항공' ? (
                  <FlatList
                    data={flights}
                    renderItem={renderFlightItem}
                    keyExtractor={(item) => `${item.id}`}
                    numColumns={2}
                    columnWrapperStyle={styles.accommodationRow}
                    onEndReached={loadMoreFlights}
                    onEndReachedThreshold={0.6}
                    ListFooterComponent={flightsHasNext && loadingMore ? <ActivityIndicator style={{ margin: 12 }} /> : null}
                  />
                ) : (
                  <FlatList
                    data={accommodations}
                    renderItem={renderAccommodationItem}
                    keyExtractor={(item) => `${item.id}`}
                    numColumns={2}
                    columnWrapperStyle={styles.accommodationRow}
                    onEndReached={loadMoreAccommodations}
                    onEndReachedThreshold={0.6}
                    ListFooterComponent={accHasNext && loadingMore ? <ActivityIndicator style={{ margin: 12 }} /> : null}
                  />
                )}
              </Animated.View>
            )}
          </View>

          {/* 추천 특가 섹션 제거 - 백엔드 연동 완료 */}
        </View>
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