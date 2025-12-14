import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface TravelData {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  price?: number;
  priceUnit?: string;
  status: 'planned' | 'completed';
  transportations?: Array<{
    origin: string;
    destination: string;
    name: string;
    price: number;
  }>;
  accommodations?: Array<{
    name: string;
    pricePerNight: number;
  }>;
}

interface TravelCardProps {
  travel: TravelData;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

export function TravelCard({ travel, onPress, onToggleComplete }: TravelCardProps) {
  const formatDateRange = (start: string, end: string) => `${start} - ${end}`;
  const formatPrice = (price?: number, unit?: string) => price ? `${price.toLocaleString()}${unit || '원'}` : '';

  // 실제 API 데이터 사용
  const outboundFlight = travel.transportations?.[0];
  const accommodation = travel.accommodations?.[0];

  const isCompleted = travel.status === 'completed';
  return (
    <View style={styles.card}>
      <Image source={{ uri: travel.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{travel.title}</ThemedText>
          <View style={styles.statusBadge}>
            <ThemedText style={styles.statusText}>{isCompleted ? '여행 완료' : '계획 완료'}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.dateText}>
          <Text style={{ marginRight: 4 }}>📅</Text>
          {formatDateRange(travel.startDate, travel.endDate)}
        </ThemedText>
        <View style={styles.infoBox}>
          {outboundFlight && (
            <View style={styles.infoRow}>
              <Text style={styles.icon}>✈️</Text>
              <ThemedText style={styles.infoLabel}>{outboundFlight.name}</ThemedText>
              <ThemedText style={styles.infoValue}>{outboundFlight.price.toLocaleString()}원</ThemedText>
            </View>
          )}
          {accommodation && (
            <View style={styles.infoRow}>
              <Text style={styles.icon}>🏨</Text>
              <ThemedText style={styles.infoLabel}>{accommodation.name}</ThemedText>
              <ThemedText style={styles.infoValueHotel}>{accommodation.pricePerNight.toLocaleString()}원/박</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.detailButton} onPress={onPress}>
            <ThemedText style={styles.detailButtonText}>상세보기</ThemedText>
          </TouchableOpacity>
          {!isCompleted && (
            <TouchableOpacity style={styles.completeButton} onPress={onToggleComplete}>
              <ThemedText style={styles.completeButtonText}>여행 완료</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: '#222',
    marginRight: 8,
    fontWeight: '500',
    minWidth: 90,
  },
  infoValue: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  infoValueHotel: {
    fontSize: 15,
    color: '#22C55E',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#57BDBF',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});