import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    image: require('../../assets/images/onboarding1.png'),
    title: '복잡한 여행 계획\nAI와 채팅으로 간단하게',
  },
  {
    image: require('../../assets/images/onboarding2.png'),
    title: '숙박과 항공까지\n필요한 정보를 한 번에',
  },
  {
    image: require('../../assets/images/onboarding3.png'),
    title: '여행 일정 저장부터\n수정, 공유까지 편하게',
  },
];

// 무한 스크롤을 위한 데이터 확장
const extendedData = [...onboardingData, ...onboardingData, ...onboardingData];
const ITEM_COUNT = onboardingData.length;

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(ITEM_COUNT); // 중간부터 시작
  const flatListRef = useRef<FlatList>(null);
  const isAutoScrolling = useRef(false);

  useEffect(() => {
    // 초기 위치를 중간 세트로 설정
    setTimeout(() => {
      const targetIndex = ITEM_COUNT;
      if (targetIndex < extendedData.length && flatListRef.current) {
        try {
          flatListRef.current.scrollToIndex({ index: targetIndex, animated: false });
        } catch (error) {
          console.log('Initial scroll error:', error);
        }
      }
    }, 300);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAutoScrolling.current) {
        isAutoScrolling.current = true;
        setCurrentPage((prev) => {
          const nextPage = prev + 1;
          // 범위 체크
          if (nextPage < extendedData.length && flatListRef.current) {
            try {
              flatListRef.current.scrollToIndex({ index: nextPage, animated: true });
            } catch (error) {
              console.log('Auto scroll error:', error);
            }
          }
          return nextPage;
        });
        setTimeout(() => {
          isAutoScrolling.current = false;
        }, 500);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && !isAutoScrolling.current) {
      const index = viewableItems[0].index || 0;
      setCurrentPage(index);
      
      // 무한 루프를 위한 위치 재조정
      if (index >= ITEM_COUNT * 2) {
        setTimeout(() => {
          const targetIndex = ITEM_COUNT;
          if (targetIndex < extendedData.length) {
            flatListRef.current?.scrollToIndex({ index: targetIndex, animated: false });
            setCurrentPage(targetIndex);
          }
        }, 100);
      } else if (index < ITEM_COUNT) {
        setTimeout(() => {
          const targetIndex = ITEM_COUNT * 2 - 1;
          if (targetIndex < extendedData.length) {
            flatListRef.current?.scrollToIndex({ index: targetIndex, animated: false });
            setCurrentPage(targetIndex);
          }
        }, 100);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.push('/auth/signup-step1' as any);
    }
  };

  const handleLogin = () => {
    router.push('/auth/login' as any);
  };

  const handleSignup = () => {
    router.push('/auth/signup-step1' as any);
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={styles.slide}>
      <Image
        source={item.image}
        style={styles.illustrationImage}
        resizeMode="contain"
      />
      <View style={styles.textSection}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Skip button */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={extendedData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          style={styles.flatList}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            console.log('ScrollToIndex failed:', info);
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              if (flatListRef.current && info.index < extendedData.length) {
                flatListRef.current.scrollToIndex({ index: info.index, animated: false });
              }
            });
          }}
        />

        {/* Pagination dots */}
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, (currentPage % ITEM_COUNT) === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      {/* Footer buttons */}
      <View style={styles.footer}>
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>회원가입</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  placeholder: {
    height: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flexGrow: 0,
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationImage: {
    width: width - 40,
    height: 280,
    marginBottom: 60,
  },
  textSection: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  activeDot: {
    backgroundColor: '#1DCBB4',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#1DCBB4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
