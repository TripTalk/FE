import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

interface DayScheduleProps {
  day: number;
  date: string;
  schedules: ScheduleItem[];
  isActive?: boolean;
}

export function DaySchedule({ day, date, schedules }: DayScheduleProps) {
  return (
    <View style={styles.container}>
      {/* Day 헤더 */}
      <View style={styles.dayHeaderRow}>
        <View style={styles.dayCircle}><ThemedText style={styles.dayCircleText}>{day}</ThemedText></View>
        <View style={{ marginLeft: 12 }}>
          <ThemedText style={styles.dayTitle}>{`${day}일차`}</ThemedText>
          <ThemedText style={styles.dayDate}>{date}</ThemedText>
        </View>
      </View>

      {/* 일정 리스트 */}
      <View style={styles.timelineColumn}>
        {/* 세로선 */}
        <View style={styles.timelineLine} />
        <View style={styles.timelineContent}>
          {schedules.map((schedule, index) => {
            // format time to HH:MM (drop seconds) — supports 'HH:MM:SS' or ISO-like strings
            let formattedTime = schedule.time || '';
            try {
              if (formattedTime.includes('T')) {
                const d = new Date(formattedTime);
                const hh = String(d.getHours()).padStart(2, '0');
                const mm = String(d.getMinutes()).padStart(2, '0');
                formattedTime = `${hh}:${mm}`;
              } else if (formattedTime.includes(':')) {
                const parts = formattedTime.split(':');
                if (parts.length >= 2) formattedTime = `${parts[0]}:${parts[1]}`;
              }
            } catch (e) {
              // fallback to original string on parse error
            }

            return (
              <View key={index} style={styles.scheduleCardRow}>
                <View style={styles.timelineDot} />
                <View style={styles.scheduleCard}>
                  <View style={styles.scheduleCardHeader}>
                    <ThemedText style={styles.scheduleTime}>{formattedTime}</ThemedText>
                    {schedule.description && (
                      <ThemedText style={styles.scheduleLocation}>{schedule.description}</ThemedText>
                    )}
                  </View>
                  <ThemedText style={styles.scheduleTitle}>{schedule.title}</ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 36,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#20C997',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  dayDate: {
    fontSize: 15,
    color: '#8A94A6',
    fontWeight: '400',
  },
  timelineColumn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 20,
    bottom: 0,
    width: 2,
    backgroundColor: '#E6F0F3',
    zIndex: 0,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 24,
  },
  scheduleCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    position: 'relative',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#20C997',
    marginTop: 8,
    marginRight: 12,
    zIndex: 1,
  },
  scheduleCard: {
    flex: 1,
    backgroundColor: '#F7FAFA',
    borderRadius: 16,
    padding: 18,
    marginBottom: 0,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  scheduleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scheduleTime: {
    color: '#20C997',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scheduleLocation: {
    color: '#8A94A6',
    fontSize: 15,
    fontWeight: '500',
  },
  scheduleTitle: {
    color: '#222',
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 0,
  },
});