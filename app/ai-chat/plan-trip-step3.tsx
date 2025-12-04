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
      const dayOfWeek = currentDate.getDay();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isInRange && styles.calendarDayInRange,
            isStartDate && styles.calendarDayStart,
            isEndDate && styles.calendarDayEnd,
            (isStartDate || isEndDate) && styles.calendarDaySelected,
            isToday && !isStartDate && !isEndDate && styles.calendarDayToday,
          ]}
          onPress={() => !isPast && handleDateSelect(day)}
          disabled={isPast}
          activeOpacity={0.7}
        >
          <View style={[
            styles.calendarDayInner,
            (isStartDate || isEndDate) && styles.calendarDayInnerSelected,
            isToday && !isStartDate && !isEndDate && styles.calendarDayInnerToday,
          ]}>
            <ThemedText
              style={[
                styles.calendarDayText,
                isPast && styles.calendarDayTextPast,
                dayOfWeek === 0 && !isPast && styles.calendarDayTextSunday,
                dayOfWeek === 6 && !isPast && styles.calendarDayTextSaturday,
                (isStartDate || isEndDate) && styles.calendarDayTextSelected,
                isToday && !isStartDate && !isEndDate && styles.calendarDayTextToday,
              ]}
            >
              {day}
            </ThemedText>
          </View>
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
                <ThemedText style={[styles.dateText, !startDate && styles.dateTextPlaceholder]}>
                  {startDate ? formatDate(startDate) : '시작일 선택'}
                </ThemedText>
                <View style={styles.calendarIconContainer}>
                  <ThemedText style={styles.dateIcon}>📅</ThemedText>
                </View>
              </TouchableOpacity>
              <ThemedText style={styles.dateSeparator}>~</ThemedText>
              <TouchableOpacity 
                style={[styles.dateInput, endDate && styles.dateInputSelected]} 
                onPress={() => openCalendar(false)}
              >
                <ThemedText style={[styles.dateText, !endDate && styles.dateTextPlaceholder]}>
                  {endDate ? formatDate(endDate) : '종료일 선택'}
                </ThemedText>
                <View style={styles.calendarIconContainer}>
                  <ThemedText style={styles.dateIcon}>📅</ThemedText>
                </View>
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
              <View style={styles.calendarHeaderContainer}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity onPress={goToPrevMonth} style={styles.calendarNavButton}>
                    <ThemedText style={styles.calendarNavText}>‹</ThemedText>
                  </TouchableOpacity>
                  <View style={styles.calendarTitleContainer}>
                    <ThemedText style={styles.calendarYear}>{currentYear}</ThemedText>
                    <ThemedText style={styles.calendarMonth}>{MONTHS[currentMonth]}</ThemedText>
                  </View>
                  <TouchableOpacity onPress={goToNextMonth} style={styles.calendarNavButton}>
                    <ThemedText style={styles.calendarNavText}>›</ThemedText>
                  </TouchableOpacity>
                </View>

                {/* 선택 안내 */}
                <View style={styles.selectionGuide}>
                  <View style={[styles.selectionDot, selectingStartDate && styles.selectionDotActive]} />
                  <ThemedText style={styles.selectionGuideText}>
                    {selectingStartDate ? '출발일을 선택하세요' : '도착일을 선택하세요'}
                  </ThemedText>
                </View>
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
              <View style={styles.selectedDatesContainer}>
                <View style={styles.selectedDateBox}>
                  <ThemedText style={styles.selectedDateLabel}>출발</ThemedText>
                  <ThemedText style={styles.selectedDateValue}>
                    {startDate ? formatDate(startDate) : '-'}
                  </ThemedText>
                </View>
                <View style={styles.selectedDateArrow}>
                  <ThemedText style={styles.selectedDateArrowText}>→</ThemedText>
                </View>
                <View style={styles.selectedDateBox}>
                  <ThemedText style={styles.selectedDateLabel}>도착</ThemedText>
                  <ThemedText style={styles.selectedDateValue}>
                    {endDate ? formatDate(endDate) : '-'}
                  </ThemedText>
                </View>
              </View>

              {/* 버튼 영역 */}
              <View style={styles.calendarButtonRow}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setSelectingStartDate(true);
                  }}
                >
                  <ThemedText style={styles.resetButtonText}>초기화</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, (!startDate || !endDate) && styles.confirmButtonDisabled]}
                  onPress={() => setShowCalendar(false)}
                  disabled={!startDate || !endDate}
                >
                  <ThemedText style={styles.confirmButtonText}>선택 완료</ThemedText>
                </TouchableOpacity>
              </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },
  dateInputSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8F9F8',
  },
  calendarIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateIcon: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
    flex: 1,
  },
  dateTextPlaceholder: {
    color: '#999999',
    fontWeight: '400',
  },
  dateSeparator: {
    fontSize: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '92%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  calendarHeaderContainer: {
    backgroundColor: '#4ECDC4',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarNavButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
  },
  calendarNavText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  calendarTitleContainer: {
    alignItems: 'center',
  },
  calendarYear: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  calendarMonth: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selectionGuide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  selectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 8,
  },
  selectionDotActive: {
    backgroundColor: '#FFFFFF',
  },
  selectionGuideText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999999',
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
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  calendarDayInner: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  calendarDayInnerSelected: {
    backgroundColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  calendarDayInnerToday: {
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  calendarDayToday: {},
  calendarDayInRange: {
    backgroundColor: '#E8F9F8',
  },
  calendarDayStart: {
    backgroundColor: '#E8F9F8',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  calendarDayEnd: {
    backgroundColor: '#E8F9F8',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  calendarDaySelected: {},
  calendarDayText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  calendarDayTextPast: {
    color: '#D0D0D0',
  },
  calendarDayTextSunday: {
    color: '#FF6B6B',
  },
  calendarDayTextSaturday: {
    color: '#4ECDC4',
  },
  calendarDayTextToday: {
    color: '#4ECDC4',
    fontWeight: '700',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  selectedDatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
  },
  selectedDateBox: {
    flex: 1,
    alignItems: 'center',
  },
  selectedDateLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  selectedDateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  selectedDateArrow: {
    paddingHorizontal: 16,
  },
  selectedDateArrowText: {
    fontSize: 18,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  calendarButtonRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  resetButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#4ECDC4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
