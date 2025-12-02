import { ThemedText } from '@/components/shared/themed-text';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// 달력 헬퍼 함수들
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export default function PlanTripStep3Screen() {
  const { updateTravelPlan } = useTravelPlan();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // 달력 모달 상태
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingStartDate, setSelectingStartDate] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const handleBackPress = () => {
    router.back();
  };

  const handleNext = () => {
    // Context에 날짜 정보 저장
    updateTravelPlan({
      startDate: startDate ? formatDate(startDate) : '',
      endDate: endDate ? formatDate(endDate) : '',
    });
    // 다음 단계로 이동
    router.push('/ai-chat/plan-trip-step4');
  };

  // 달력 열기
  const openCalendar = (isStart: boolean) => {
    setSelectingStartDate(isStart);
    setShowCalendar(true);
  };

  // 날짜 선택
  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    
    if (selectingStartDate) {
      setStartDate(selectedDate);
      // 시작일을 선택하면 자동으로 종료일 선택으로 전환
      if (!endDate || selectedDate > endDate) {
        setEndDate(null);
      }
      setSelectingStartDate(false);
    } else {
      if (startDate && selectedDate < startDate) {
        // 종료일이 시작일보다 이전이면 시작일로 설정
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
        setShowCalendar(false);
      }
    }
  };

  // 이전 달
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 다음 달
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 달력 날짜 생성
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // 빈 셀 추가
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // 날짜 셀 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const isStartDate = startDate && currentDate.toDateString() === startDate.toDateString();
      const isEndDate = endDate && currentDate.toDateString() === endDate.toDateString();
      const isInRange = startDate && endDate && currentDate > startDate && currentDate < endDate;
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const isPast = currentDate < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isInRange && styles.calendarDayInRange,
            (isStartDate || isEndDate) && styles.calendarDaySelected,
          ]}
          onPress={() => !isPast && handleDateSelect(day)}
          disabled={isPast}
        >
          <ThemedText
            style={[
              styles.calendarDayText,
              isPast && styles.calendarDayTextPast,
              isToday && styles.calendarDayTextToday,
              (isStartDate || isEndDate) && styles.calendarDayTextSelected,
            ]}
          >
            {day}
          </ThemedText>
        </TouchableOpacity>
      );
    }

    return days;
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
            <ThemedText style={styles.sectionLabel}>시작일 - 종료일</ThemedText>
            <View style={styles.dateInputRow}>
              <TouchableOpacity 
                style={[styles.dateInput, startDate && styles.dateInputSelected]} 
                onPress={() => openCalendar(true)}
              >
                {startDate ? (
                  <ThemedText style={styles.dateText}>{formatDate(startDate)}</ThemedText>
                ) : (
                  <ThemedText style={styles.dateIcon}>📅</ThemedText>
                )}
              </TouchableOpacity>
              <ThemedText style={styles.dateSeparator}> ~ </ThemedText>
              <TouchableOpacity 
                style={[styles.dateInput, endDate && styles.dateInputSelected]} 
                onPress={() => openCalendar(false)}
              >
                {endDate ? (
                  <ThemedText style={styles.dateText}>{formatDate(endDate)}</ThemedText>
                ) : (
                  <ThemedText style={styles.dateIcon}>📅</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* 다음 단계 버튼 */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              (startDate && endDate) && styles.nextButtonActive
            ]}
            onPress={handleNext}
            disabled={!(startDate && endDate)}
          >
            <ThemedText style={styles.nextButtonText}>다음 단계</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 달력 모달 */}
        <Modal
          visible={showCalendar}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCalendar(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowCalendar(false)}>
            <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>
              {/* 달력 헤더 */}
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={goToPrevMonth} style={styles.calendarNavButton}>
                  <ThemedText style={styles.calendarNavText}>{'<'}</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.calendarTitle}>
                  {currentYear}년 {MONTHS[currentMonth]}
                </ThemedText>
                <TouchableOpacity onPress={goToNextMonth} style={styles.calendarNavButton}>
                  <ThemedText style={styles.calendarNavText}>{'>'}</ThemedText>
                </TouchableOpacity>
              </View>

              {/* 선택 안내 */}
              <View style={styles.selectionGuide}>
                <ThemedText style={styles.selectionGuideText}>
                  {selectingStartDate ? '출발일을 선택하세요' : '종료일을 선택하세요'}
                </ThemedText>
              </View>

              {/* 요일 헤더 */}
              <View style={styles.weekdayRow}>
                {WEEKDAYS.map((day, index) => (
                  <View key={index} style={styles.weekdayCell}>
                    <ThemedText style={[
                      styles.weekdayText,
                      index === 0 && styles.weekdaySunday,
                      index === 6 && styles.weekdaySaturday,
                    ]}>
                      {day}
                    </ThemedText>
                  </View>
                ))}
              </View>

              {/* 날짜 그리드 */}
              <View style={styles.calendarGrid}>
                {renderCalendarDays()}
              </View>

              {/* 선택된 날짜 표시 */}
              {(startDate || endDate) && (
                <View style={styles.selectedDatesContainer}>
                  <ThemedText style={styles.selectedDatesText}>
                    {startDate ? formatDate(startDate) : '시작일'} ~ {endDate ? formatDate(endDate) : '종료일'}
                  </ThemedText>
                </View>
              )}

              {/* 확인 버튼 */}
              <TouchableOpacity
                style={[styles.confirmButton, (!startDate || !endDate) && styles.confirmButtonDisabled]}
                onPress={() => setShowCalendar(false)}
              >
                <ThemedText style={styles.confirmButtonText}>확인</ThemedText>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
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
    paddingTop: 10,
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
    marginTop: 16,
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
  dateInputSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8F9F8',
  },
  dateIcon: {
    fontSize: 24,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  dateSeparator: {
    fontSize: 14,
    color: '#999999',
    marginHorizontal: 12,
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
  // 달력 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 360,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarNavText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  selectionGuide: {
    alignItems: 'center',
    marginBottom: 12,
  },
  selectionGuideText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  weekdaySunday: {
    color: '#FF6B6B',
  },
  weekdaySaturday: {
    color: '#4ECDC4',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayInRange: {
    backgroundColor: '#E8F9F8',
  },
  calendarDaySelected: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333333',
  },
  calendarDayTextPast: {
    color: '#CCCCCC',
  },
  calendarDayTextToday: {
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedDatesContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  selectedDatesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  confirmButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
