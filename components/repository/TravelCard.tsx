import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export interface TravelData {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  price?: number;
  priceUnit?: string;
  status: 'planned' | 'completed';
}

interface TravelCardProps {
  travel: TravelData;
  onPress?: () => void;
}

export function TravelCard({ travel, onPress }: TravelCardProps) {
  const formatDateRange = (start: string, end: string) => {
    // 간단한 날짜 포맷팅 (YYYY.MM.DD 형식)
    return `${start} - ${end}`;
  };

  const formatPrice = (price?: number, unit?: string) => {
    if (!price) return null;
    return `${price.toLocaleString()}${unit || '원'}`;
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: travel.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{travel.title}</ThemedText>
          <View style={styles.statusBadge}>
            <ThemedText style={styles.statusText}>여행 완료</ThemedText>
          </View>
        </View>
        
        <ThemedText style={styles.dateText}>
          📅 {formatDateRange(travel.startDate, travel.endDate)}
        </ThemedText>
        
        {travel.price && (
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceLabel}>💰 제주항공</ThemedText>
            <ThemedText style={styles.priceValue}>
              {formatPrice(travel.price, travel.priceUnit)}
            </ThemedText>
          </View>
        )}
        
        <TouchableOpacity style={styles.detailButton} onPress={onPress}>
          <ThemedText style={styles.detailButtonText}>상세보기</ThemedText>
        </TouchableOpacity>
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
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  detailButton: {
    backgroundColor: '#4DD0E1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});