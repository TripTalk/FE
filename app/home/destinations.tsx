import { DestinationListCard } from '@/components/home/DestinationListCard';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { getTripPlaces, TripPlace, TripPlaceTheme } from '@/services/api';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// 테마 한글 ↔ 영문 매핑
const themeCategories = ['전체', '자연', '바다', '문화', '힐링', '역사'];
const themeToApiMap: Record<string, TripPlaceTheme | undefined> = {
  '전체': undefined,
  '자연': 'NATURE',
  '바다': 'SEA',
  '문화': 'CULTURE',
  '힐링': 'HEALING',
  '역사': 'HISTORY',
};

const themeToKorean: Record<string, string> = {
  'NATURE': '자연',
  'SEA': '바다',
  'CULTURE': '문화',
  'HEALING': '힐링',
  'HISTORY': '역사',
};

// 테마별 아이콘 이미지
const themeIcons: Record<string, any> = {
  '자연': require('@/assets/images/nature.png'),
  '바다': require('@/assets/images/sea.png'),
  '문화': require('@/assets/images/culture.png'),
  '힐링': require('@/assets/images/healing.png'),
  '역사': require('@/assets/images/history.png'),
};

export default function PopularDestinationsScreen() {
  const { tokens } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<string>('전체');
  const [isThemeSelectionExpanded, setIsThemeSelectionExpanded] = useState(false);
  const [destinations, setDestinations] = useState<TripPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursorId, setNextCursorId] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  
  // 애니메이션 값
  const animationProgress = useSharedValue(0);
  const COLLAPSED_HEIGHT = 0;
  const EXPANDED_HEIGHT = 280;

  // API에서 여행지 데이터 가져오기
  const fetchDestinations = async (theme?: TripPlaceTheme, cursor?: number | null) => {
    setIsLoading(true);
    try {
      const accessToken = tokens?.accessToken;
      const response = await getTripPlaces(theme, cursor, accessToken);
      if (response.isSuccess && response.result) {
        if (cursor) {
          setDestinations(prev => [...prev, ...response.result.tripPlaceList]);
        } else {
          setDestinations(response.result.tripPlaceList);
        }
        setNextCursorId(response.result.nextCursorId);
        setHasNext(response.result.hasNext);
      }
    } catch (error) {
      console.error('여행지 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 테마 변경 시 데이터 다시 로드
  useEffect(() => {
    const apiTheme = themeToApiMap[selectedTheme];
    fetchDestinations(apiTheme, null);
  }, [selectedTheme]);

  const handlePlanPress = (destination: TripPlace) => {
    // AI 여행 계획 페이지로 이동하면서 도착지 정보 전달
    router.push({
      pathname: '/ai-chat/plan-trip-step1',
      params: {
        destination: destination.region,
        destinationId: destination.id.toString(),
      }
    });
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
  };

  const toggleExpanded = () => {
    const newExpanded = !isThemeSelectionExpanded;
    setIsThemeSelectionExpanded(newExpanded);
    animationProgress.value = withTiming(newExpanded ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  };

  // 컨테이너 높이 애니메이션
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT]
    );
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.3, 1],
      [0, 0, 1]
    );
    return {
      height,
      opacity,
      overflow: 'hidden' as const,
    };
  });

  // 화살표 회전 애니메이션 (펼치면 위쪽, 접히면 아래쪽)
  const chevronAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      animationProgress.value,
      [0, 1],
      [180, 0]
    );
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  // 더 보기 (무한스크롤)
  const loadMore = () => {
    if (hasNext && !isLoading && nextCursorId) {
      const apiTheme = themeToApiMap[selectedTheme];
      fetchDestinations(apiTheme, nextCursorId);
    }
  };

  // 스크롤 끝 감지하여 자동으로 데이터 로드
  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20; // 스크롤이 끝에서 20px 전에 트리거
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    
    if (isCloseToBottom) {
      loadMore();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
          {/* 여행 테마별 보기 */}
          <ThemedView style={styles.sectionContainer}>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={toggleExpanded}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.sectionTitle}>여행 테마별 보기</ThemedText>
              <Animated.View style={[styles.chevron, chevronAnimatedStyle]}>
                <ThemedText style={styles.chevronText}>⌃</ThemedText>
              </Animated.View>
            </TouchableOpacity>

            <Animated.View style={containerAnimatedStyle}>
              <View style={styles.themeCardContainer}>
                <View style={styles.themeGrid}>
                  {themeCategories.map((theme) => {
                    const isSelected = selectedTheme === theme;
                    return (
                      <TouchableOpacity 
                        key={theme} 
                        style={styles.themeItem}
                        onPress={() => handleThemeSelect(theme)}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.themeIconContainer,
                          isSelected && styles.themeIconContainerSelected
                        ]}>
                          {theme === '전체' ? (
                            <ThemedText style={[
                              styles.allText,
                              isSelected && styles.allTextSelected
                            ]}>All</ThemedText>
                          ) : (
                            <Image 
                              source={themeIcons[theme]} 
                              style={styles.themeIcon}
                              resizeMode="contain"
                            />
                          )}
                        </View>
                        <ThemedText style={[
                          styles.themeLabel,
                          isSelected && styles.themeLabelSelected
                        ]} numberOfLines={1}>{theme}</ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Animated.View>
          </ThemedView>

          {/* 필터링된 여행지 목록 */}
          <View style={styles.destinationsContainer}>
            {isLoading && destinations.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4ECDC4" />
                <ThemedText style={styles.loadingText}>여행지를 불러오는 중...</ThemedText>
              </View>
            ) : destinations.length === 0 ? (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>등록된 여행지가 없습니다.</ThemedText>
              </View>
            ) : (
              <>
                {destinations.map((destination) => (
                  <DestinationListCard
                    key={destination.id}
                    title={destination.region}
                    subtitle={destination.description}
                    viewCount={`${destination.viewCount.toLocaleString()}회`}
                    tags={destination.themes.map(t => themeToKorean[t] || t)}
                    imageUrl={destination.imgUrl}
                    onPlanPress={() => handlePlanPress(destination)}
                  />
                ))}
                {isLoading && destinations.length > 0 && (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color="#4ECDC4" />
                    <ThemedText style={styles.loadingMoreText}>더 불러오는 중...</ThemedText>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
    </SafeAreaView>
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
  sectionContainer: {
    backgroundColor: '#F8F9FA',
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  chevron: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
  },
  themeCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    marginTop: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 12,
  },
  themeIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeIconContainerSelected: {
    backgroundColor: '#E3F9F6',
    borderColor: '#4ECDC4',
  },
  themeIcon: {
    width: 40,
    height: 40,
  },
  allText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  allTextSelected: {
    color: '#4ECDC4',
    fontWeight: '700',
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    textAlign: 'center',
  },
  themeLabelSelected: {
    color: '#2DBDAD',
    fontWeight: '700',
  },
  destinationsContainer: {
    paddingHorizontal: 16,
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
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999999',
  },
  loadingMoreContainer: {
    marginTop: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 13,
    color: '#666666',
  },
});