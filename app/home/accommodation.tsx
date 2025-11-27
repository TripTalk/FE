import { AccommodationCard } from '@/components/home/AccommodationCard';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';
import { router, Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const accommodationData = {
  항공: [
    {
      id: 'flight-paris-1',
      title: '파리 항공권',
      tag: '항공',
      price: '789,000원',
      originalPrice: '850,000원',
      imageUrl: 'https://picsum.photos/200/100?random=5',
      discount: '7%',
    },
    {
      id: 'flight-london-1',
      title: '런던 항공권',
      tag: '항공',
      price: '920,000원',
      originalPrice: '1,100,000원',
      imageUrl: 'https://picsum.photos/200/100?random=6',
      discount: '16%',
    },
    {
      id: 'flight-tokyo-1',
      title: '도쿄 항공권',
      tag: '항공',
      price: '450,000원',
      imageUrl: 'https://picsum.photos/200/100?random=7',
    },
    {
      id: 'flight-newyork-1',
      title: '뉴욕 항공권',
      tag: '항공',
      price: '1,200,000원',
      imageUrl: 'https://picsum.photos/200/100?random=8',
    },
  ],
  숙박: [
    {
      id: 'hotel-tokyo-1',
      title: '도쿄',
      tag: '숙박',
      price: '120,000원/박',
      date: '2024.12.17 - 12.22',
      imageUrl: 'https://picsum.photos/200/100?random=9',
    },
    {
      id: 'hotel-paris-1',
      title: '파리',
      tag: '숙박',
      price: '180,000원/박',
      date: '2024.12.20 - 12.25',
      imageUrl: 'https://picsum.photos/200/100?random=10',
    },
    {
      id: 'hotel-jeju-1',
      title: '제주도',
      tag: '숙박',
      price: '85,000원/박',
      date: '2024.12.15 - 12.18',
      imageUrl: 'https://picsum.photos/200/100?random=11',
    },
    {
      id: 'hotel-busan-1',
      title: '부산',
      tag: '숙박',
      price: '95,000원/박',
      date: '2024.12.23 - 12.26',
      imageUrl: 'https://picsum.photos/200/100?random=12',
    },
  ],
  패키지: [
    {
      id: 'package-europe-1',
      title: '유럽 패키지',
      tag: '패키지',
      price: '2,400,000원',
      date: '7박 8일',
      imageUrl: 'https://picsum.photos/200/100?random=13',
    },
    {
      id: 'package-asia-1',
      title: '동남아 패키지',
      tag: '패키지',
      price: '890,000원',
      date: '4박 5일',
      imageUrl: 'https://picsum.photos/200/100?random=14',
    },
  ],
};

export default function AccommodationScreen() {
  const [activeTab, setActiveTab] = React.useState<'항공' | '숙박'>('항공');

  const handleItemPress = (id: string) => {
    router.push(`/travel/${id}`);
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderAccommodationGrid = (items: any[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      const row = items.slice(i, i + 2);
      rows.push(
        <View key={i} style={styles.accommodationRow}>
          {row.map((item) => (
            <AccommodationCard
              key={item.id}
              title={item.title}
              tag={item.tag}
              price={item.price}
              originalPrice={item.originalPrice}
              date={item.date}
              discount={item.discount}
              imageUrl={item.imageUrl}
              onPress={() => handleItemPress(item.id)}
            />
          ))}
          {/* 홀수 개인 경우 빈 공간 채우기 */}
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
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ThemedText style={styles.backButtonText}>{'<'}</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* 탭 헤더 */}
        <View style={styles.tabContainer}>
          <View style={styles.tabWrapper}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === '항공' && styles.activeTabButton]}
              onPress={() => setActiveTab('항공')}
            >
              <ThemedText style={[styles.tabText, activeTab === '항공' && styles.activeTabText]}>
                항공
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === '숙박' && styles.activeTabButton]}
              onPress={() => setActiveTab('숙박')}
            >
              <ThemedText style={[styles.tabText, activeTab === '숙박' && styles.activeTabText]}>
                숙박
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* 선택된 탭의 내용 */}
          <View style={styles.contentContainer}>
            {accommodationData[activeTab] && (
              <View style={styles.accommodationGrid}>
                {renderAccommodationGrid(accommodationData[activeTab])}
              </View>
            )}
          </View>

          {/* 추천 특가 섹션 */}
          <ThemedView style={styles.specialOffersContainer}>
            <ThemedText style={styles.sectionTitle}>🔥 이번 주 특가</ThemedText>
            <View style={styles.accommodationGrid}>
              <View style={styles.accommodationRow}>
                <AccommodationCard
                  title="제주도 리조트"
                  tag="특가"
                  price="65,000원/박"
                  originalPrice="120,000원/박"
                  discount="46%"
                  date="한정 특가"
                  imageUrl="https://picsum.photos/200/100?random=15"
                  onPress={() => handleItemPress('special-jeju')}
                />
                <AccommodationCard
                  title="부산 호텔"
                  tag="특가"
                  price="55,000원/박"
                  originalPrice="95,000원/박"
                  discount="42%"
                  date="주말 특가"
                  imageUrl="https://picsum.photos/200/100?random=16"
                  onPress={() => handleItemPress('special-busan')}
                />
              </View>
            </View>
          </ThemedView>
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
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
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
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
});