import { ThemedText } from '@/components/shared/themed-text';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const destinations = ['제주도', '부산', '강릉', '도쿄', '오사카'];
const popularDestinations = ['제주도', '부산', '강릉', '도쿄', '오사카'];

export default function PlanTripStep2Screen() {
  const [whereInput, setWhereInput] = useState('');
  const [destination, setDestination] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const handleNext = () => {
    // TODO: 다음 단계로 이동
    console.log('Where:', whereInput);
    console.log('Destination:', destination);
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
            <ThemedText style={styles.progressText}>단계 2/5</ThemedText>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
          </View>

          {/* 첫 번째 질문 */}
          <View style={styles.questionContainer}>
            <ThemedText style={styles.question}>어디에서 출발하시나요?</ThemedText>
            <ThemedText style={styles.questionSubtitle}>출발지를 입력해주세요</ThemedText>
          </View>

          {/* 출발지 입력 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="예: 서울, 부산, 대구, 대전..."
              placeholderTextColor="#999999"
              value={whereInput}
              onChangeText={setWhereInput}
            />
          </View>

          {/* 두 번째 질문 */}
          <View style={styles.questionContainer}>
            <ThemedText style={styles.question}>어디로 여행을 가시나요?</ThemedText>
            <ThemedText style={styles.questionSubtitle}>여행지나 혹은 도시나 지역을 입력해주세요</ThemedText>
          </View>

          {/* 목적지 입력 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="예: 제주도, 부산, 파리, 도쿄..."
              placeholderTextColor="#999999"
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          {/* 추천 여행지 */}
          <View style={styles.recommendContainer}>
            <ThemedText style={styles.recommendTitle}>추천 여행지</ThemedText>
            <View style={styles.chipsContainer}>
              {popularDestinations.map((place, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.chip,
                    destination === place && styles.chipSelected
                  ]}
                  onPress={() => setDestination(place)}
                >
                  <ThemedText
                    style={[
                      styles.chipText,
                      destination === place && styles.chipTextSelected
                    ]}
                  >
                    {place}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* 다음 단계 버튼 */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              (whereInput.trim() && destination.trim()) && styles.nextButtonActive
            ]}
            onPress={handleNext}
            disabled={!whereInput.trim() || !destination.trim()}
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
    marginBottom: 16,
    marginTop: 8,
  },
  question: {
    fontSize: 20,
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
    marginBottom: 32,
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
  recommendContainer: {
    paddingHorizontal: 16,
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E8F4FF',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  chipTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
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
