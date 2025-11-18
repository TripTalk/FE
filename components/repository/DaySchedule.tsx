import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface ScheduleItem {
  time: string;
  title: string;
  location?: string;
}

interface DayScheduleProps {
  day: number;
  date: string;
  schedules: ScheduleItem[];
  isActive?: boolean;
}

export function DaySchedule({ day, date, schedules, isActive = false }: DayScheduleProps) {
  return (
    <View style={styles.container}>
      {/* Day 헤더 */}
      <View style={styles.dayHeader}>
        <View style={[styles.dayBadge, isActive && styles.activeDayBadge]}>
          <ThemedText style={[styles.dayText, isActive && styles.activeDayText]}>
            Day{day}
          </ThemedText>
        </View>
        <ThemedText style={styles.dateText}>{date}</ThemedText>
      </View>

      {/* 일정 리스트 */}
      <View style={styles.scheduleList}>
        {schedules.map((schedule, index) => (
          <View key={index} style={styles.scheduleItem}>
            <View style={styles.timelineDot} />
            <View style={styles.scheduleContent}>
              <ThemedText style={styles.timeText}>{schedule.time}</ThemedText>
              <ThemedText style={styles.titleText}>{schedule.title}</ThemedText>
              {schedule.location && (
                <ThemedText style={styles.locationText}>{schedule.location}</ThemedText>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  activeDayBadge: {
    backgroundColor: '#4CAF50',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  activeDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  scheduleList: {
    paddingLeft: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4DD0E1',
    marginTop: 6,
    marginRight: 16,
  },
  scheduleContent: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#888888',
  },
});