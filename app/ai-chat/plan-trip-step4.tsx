import { ThemedText } from '@/components/shared/themed-text';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const travelStyles = [
  { left: '체험·액티비티', right: 'SNS 핫플레이스' },
  { left: '자연과 함께', right: '유명 관광지는 필수' },
  { left: '여유롭게 힐링', right: '문화·예술·역사' },
  { left: '여행지 느낌 물씬', right: '소핑은 열정적으로' },
  { left: '관광보다 먹방', right: '' },
];

export default function PlanTripStep4Screen() {
  const { updateTravelPlan } = useTravelPlan();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const handleBackPress = () => {
    router.back();
  };

  const toggleStyle = (style: string) => {
    if (!style) return;
    
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleNext = () => {
    // Context에 여행 스타일 정보 저장
    updateTravelPlan({ style: selectedStyles });
    // 다음 단계로 이동
    router.push('/ai-chat/plan-trip-step5');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: '여행 계획 설정',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ThemedText style={styles.backButtonText}>{'<'}</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 진행 단계 */}
          <View style={styles.progressContainer}>
            <ThemedText style={styles.progressText}>단계 4/5</ThemedText>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
          </View>

          {/* 질문 */}
          <View style={styles.questionContainer}>
            <ThemedText style={styles.question}>어떤 여행을 선호하시나요?</ThemedText>
            <ThemedText style={styles.questionSubtitle}>원하는 여행 스타일을 모두 선택해주세요</ThemedText>
          </View>

          {/* 여행 스타일 선택 */}
          <View style={styles.stylesContainer}>
            {travelStyles.map((row, index) => (
              <View key={index} style={styles.styleRow}>
                <TouchableOpacity
                  style={[
                    styles.styleButton,
                    styles.leftButton,
                    selectedStyles.includes(row.left) && styles.styleButtonSelected
                  ]}
                  onPress={() => toggleStyle(row.left)}
                >
                  <ThemedText
                    style={[
                      styles.styleText,
                      selectedStyles.includes(row.left) && styles.styleTextSelected
                    ]}
                  >
                    {row.left}
                  </ThemedText>
                </TouchableOpacity>

                {row.right ? (
                  <TouchableOpacity
                    style={[
                      styles.styleButton,
                      styles.rightButton,
                      selectedStyles.includes(row.right) && styles.styleButtonSelected
                    ]}
                    onPress={() => toggleStyle(row.right)}
                  >
                    <ThemedText
                      style={[
                        styles.styleText,
                        selectedStyles.includes(row.right) && styles.styleTextSelected
                      ]}
                    >
                      {row.right}
                    </ThemedText>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.emptyButton} />
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* 다음 단계 버튼 */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedStyles.length > 0 && styles.nextButtonActive
            ]}
            onPress={handleNext}
            disabled={selectedStyles.length === 0}
          >
            <ThemedText style={styles.nextButtonText}>다음 단계</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  scrollContent: {
    paddingBottom: 20,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 2,
  },
  questionContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  stylesContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  styleRow: {
    flexDirection: 'row',
    gap: 16,
  },
  styleButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  leftButton: {
    // 왼쪽 버튼 스타일
  },
  rightButton: {
    // 오른쪽 버튼 스타일
  },
  styleButtonSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8F9F8',
  },
  styleText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
  },
  styleTextSelected: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  emptyButton: {
    flex: 1,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    backgroundColor: '#B0B0B0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
