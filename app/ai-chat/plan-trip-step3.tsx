import { ThemedText } from '@/components/shared/themed-text';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const tripDurations = ['당일치기', '1박 2일', '2박 3일', '3박 4일', '4박 5일', '5박 6일'];

export default function PlanTripStep3Screen() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [customInput, setCustomInput] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
    setCustomInput('');
  };

  const handleNext = () => {
    // 다음 단계로 이동
    router.push('/ai-chat/plan-trip-step4');
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
            <ThemedText style={styles.progressText}>단계 3/5</ThemedText>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
          </View>

          {/* 질문 */}
          <View style={styles.questionContainer}>
            <ThemedText style={styles.question}>언제 여행을 가시나요?</ThemedText>
            <ThemedText style={styles.questionSubtitle}>여행 날짜나 기간을 선택해주세요</ThemedText>
          </View>

          {/* 날짜 선택 */}
          <View style={styles.dateContainer}>
            <ThemedText style={styles.sectionLabel}>출발일 - 도착일</ThemedText>
            <View style={styles.dateInputRow}>
              <TouchableOpacity style={styles.dateInput}>
                <ThemedText style={styles.dateIcon}>📅</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.dateSeparator}>또는</ThemedText>
              <TouchableOpacity style={styles.dateInput}>
                <ThemedText style={styles.dateIcon}>📅</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 여행 일수 */}
          <View style={styles.durationContainer}>
            <ThemedText style={styles.sectionLabel}>여행 일수</ThemedText>
            <View style={styles.durationGrid}>
              {tripDurations.map((duration, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.durationButton,
                    selectedDuration === duration && styles.durationButtonSelected
                  ]}
                  onPress={() => handleDurationSelect(duration)}
                >
                  <ThemedText
                    style={[
                      styles.durationText,
                      selectedDuration === duration && styles.durationTextSelected
                    ]}
                  >
                    {duration}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 직접 입력 */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.sectionLabel}>직접 입력</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="예: 7일, 10일, 2주.."
              placeholderTextColor="#999999"
              value={customInput}
              onChangeText={(text) => {
                setCustomInput(text);
                setSelectedDuration('');
              }}
            />
          </View>
        </ScrollView>

        {/* 다음 단계 버튼 */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              (selectedDuration || customInput.trim()) && styles.nextButtonActive
            ]}
            onPress={handleNext}
            disabled={!selectedDuration && !customInput.trim()}
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
    marginBottom: 24,
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
  dateContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateIcon: {
    fontSize: 24,
  },
  dateSeparator: {
    fontSize: 14,
    color: '#999999',
    marginHorizontal: 12,
  },
  durationContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  durationButtonSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8F9F8',
  },
  durationText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666666',
  },
  durationTextSelected: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FAFAFA',
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
