import { DestinationListCard } from '@/components/home/DestinationListCard';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const themeIcons = {
  지역: '🗺️',
  바다: '🌊',
  문화: '🎨',
  식당: '🍽️',
  힐링: '❤️',
  역사: '🏛️',
};

const destinationData = [
  {
    id: 'jeju',
    title: '제주도',
    subtitle: '한라산과 에메랄드빛 바다가 아름다운 힐링 여행지',
    viewCount: '12,543회',
    tags: ['#자연', '#바다', '#드라이브'],
    imageUrl: 'https://picsum.photos/400/200?random=1',
    themes: ['지역', '바다', '힐링']
  },
  {
    id: 'busan',
    title: '부산',
    subtitle: '해운대 해변과 감천문화마을의 매력적인 항구도시',
    viewCount: '9,821회',
    tags: ['#해변', '#항구', '#수족관'],
    imageUrl: 'https://picsum.photos/400/200?random=2',
    themes: ['지역', '바다', '문화']
  },
  {
    id: 'gyeongju',
    title: '경주',
    subtitle: '천년 고도의 역사가 문화가 살아 숨쉬는 곳',
    viewCount: '7,234회',
    tags: ['#역사', '#문화', '#유적지'],
    imageUrl: 'https://picsum.photos/400/200?random=3',
    themes: ['지역', '문화', '역사']
  },
  {
    id: 'gangneung',
    title: '강릉',
    subtitle: '동해의 푸른 바다와 커피의 도시',
    viewCount: '6,892회',
    tags: ['#바다', '#커피', '#일출'],
    imageUrl: 'https://picsum.photos/400/200?random=4',
    themes: ['지역', '바다', '힐링']
  }
];

export default function PopularDestinationsScreen() {
  const [selectedTheme, setSelectedTheme] = React.useState<keyof typeof themeIcons | null>(null);
  const [isThemeSelectionExpanded, setIsThemeSelectionExpanded] = React.useState(false);

  const handleTravelPress = (id: string) => {
    router.push(`/travel/${id}`);
  };

  const handleThemeSelect = (theme: keyof typeof themeIcons) => {
    setSelectedTheme(theme);
    setIsThemeSelectionExpanded(false); // 선택 후 접기
  };

  const getFilteredDestinations = () => {
    if (!selectedTheme) {
      return destinationData; // 테마 선택 안 했을 때는 모든 목적지
    }
    return destinationData.filter(destination => 
      destination.themes.includes(selectedTheme)
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
          {/* 여행 테마별 보기 */}
          <ThemedView style={styles.sectionContainer}>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => setIsThemeSelectionExpanded(!isThemeSelectionExpanded)}
            >
              <ThemedText style={styles.sectionTitle}>여행 테마별 보기</ThemedText>
              <View style={styles.chevron}>
                <ThemedText style={styles.chevronText}>
                  {isThemeSelectionExpanded ? '⌄' : '⌃'}
                </ThemedText>
              </View>
            </TouchableOpacity>

            {isThemeSelectionExpanded && (
              <View style={styles.themeGrid}>
                <TouchableOpacity 
                  style={[styles.themeItem, selectedTheme === null && styles.selectedThemeItem]}
                  onPress={() => setSelectedTheme(null)}
                >
                  <View style={[styles.themeIcon, selectedTheme === null && styles.selectedThemeIcon]}>
                    <ThemedText style={styles.themeIconText}>🌍</ThemedText>
                  </View>
                  <ThemedText style={styles.themeText}>전체</ThemedText>
                </TouchableOpacity>
                {Object.entries(themeIcons).map(([theme, icon]) => (
                  <TouchableOpacity 
                    key={theme} 
                    style={[styles.themeItem, selectedTheme === theme && styles.selectedThemeItem]}
                    onPress={() => handleThemeSelect(theme as keyof typeof themeIcons)}
                  >
                    <View style={[styles.themeIcon, selectedTheme === theme && styles.selectedThemeIcon]}>
                      <ThemedText style={styles.themeIconText}>{icon}</ThemedText>
                    </View>
                    <ThemedText style={styles.themeText}>{theme}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ThemedView>

          {/* 필터링된 여행지 목록 */}
          <View style={styles.destinationsContainer}>
            {getFilteredDestinations().map((destination) => (
              <DestinationListCard
                key={destination.id}
                title={destination.title}
                subtitle={destination.subtitle}
                viewCount={destination.viewCount}
                tags={destination.tags}
                imageUrl={destination.imageUrl}
                onPress={() => handleTravelPress(destination.id)}
              />
            ))}
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
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  themeItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 8,
  },
  themeIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#F0F7FF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  themeIconText: {
    fontSize: 24,
  },
  themeText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  destinationsContainer: {
    paddingHorizontal: 16,
  },
  selectedThemeItem: {
    transform: [{ scale: 1.05 }],
  },
  selectedThemeIcon: {
    backgroundColor: '#007AFF',
  },
});