import { ThemedText } from '@/components/shared/themed-text';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlanTripStep5Screen() {
  const { updateTravelPlan } = useTravelPlan();
  const [budget, setBudget] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const handleComplete = () => {
    // Context에 예산 정보 저장
    updateTravelPlan({ budget: `${budget}만원` });
    // AI 채팅 화면으로 이동
    router.push('/ai-chat/chat');
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
            <ThemedText style={styles.progressText}>단계 5/5</ThemedText>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
          </View>

          {/* 질문 */}
          <View style={styles.questionContainer}>
            <ThemedText style={styles.question}>여행 예산은 얼마인가요?</ThemedText>
            <ThemedText style={styles.questionSubtitle}>대략적인 여행 예산을 입력해주세요</ThemedText>
          </View>

          {/* 예산 입력 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="예: 50, 70, 100.."
                placeholderTextColor="#999999"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />
              <ThemedText style={styles.unit}>만원</ThemedText>
            </View>
          </View>
        </ScrollView>

        {/* 완료 버튼 */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              budget.trim() && styles.completeButtonActive
            ]}
            onPress={handleComplete}
            disabled={!budget.trim()}
          >
            <ThemedText style={styles.completeButtonText}>AI와 대화 시작하기 🤖</ThemedText>
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
  inputContainer: {
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 18,
    color: '#333333',
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginLeft: 8,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  completeButton: {
    backgroundColor: '#B0B0B0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
