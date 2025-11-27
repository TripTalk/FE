import { ThemedText } from '@/components/shared/themed-text';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const companions = ['본인', '친구', '연인', '가족', '아이', '부모님'];

export default function PlanTripScreen() {
  const [selectedCompanions, setSelectedCompanions] = useState<string[]>([]);
  const [directInput, setDirectInput] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const toggleCompanion = (companion: string) => {
    if (selectedCompanions.includes(companion)) {
      setSelectedCompanions(selectedCompanions.filter(c => c !== companion));
    } else {
      setSelectedCompanions([...selectedCompanions, companion]);
    }
  };

  const handleNext = () => {
    // 다음 단계로 이동
    router.push('/ai-chat/plan-trip-step2');
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
            <ThemedText style={styles.progressText}>단계 1/5</ThemedText>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '20%' }]} />
            </View>
          </View>

          {/* 질문 */}
          <View style={styles.questionContainer}>
            <ThemedText style={styles.question}>누구와 함께 여행하시나요?</ThemedText>
            <ThemedText style={styles.questionSubtitle}>여행 인원을 선택해주세요</ThemedText>
          </View>

          {/* 선택 옵션 */}
          <View style={styles.optionsContainer}>
            {companions.map((companion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedCompanions.includes(companion) && styles.optionButtonSelected
                ]}
                onPress={() => toggleCompanion(companion)}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    selectedCompanions.includes(companion) && styles.optionTextSelected
                  ]}
                >
                  {companion}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* 직접 입력 */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>직접 입력</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="예: 친구 3명, 가족 4명"
              placeholderTextColor="#999999"
              value={directInput}
              onChangeText={setDirectInput}
            />
          </View>
        </ScrollView>

        {/* 다음 단계 버튼 */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              (selectedCompanions.length > 0 || directInput.trim()) && styles.nextButtonActive
            ]}
            onPress={handleNext}
            disabled={selectedCompanions.length === 0 && !directInput.trim()}
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
  optionsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8F9F8',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  optionTextSelected: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
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
