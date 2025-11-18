import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface PriceItem {
  type: 'flight' | 'accommodation';
  title: string;
  subtitle: string;
  price: number;
  unit?: string;
}

interface PriceInfoProps {
  priceItems: PriceItem[];
}

export function PriceInfo({ priceItems }: PriceInfoProps) {
  const getIcon = (type: 'flight' | 'accommodation') => {
    return type === 'flight' ? '✈️' : '🏨';
  };

  const getBackgroundColor = (type: 'flight' | 'accommodation') => {
    return type === 'flight' ? '#E3F2FD' : '#E8F5E8';
  };

  const formatPrice = (price: number, unit: string = '원') => {
    return `${price.toLocaleString()}${unit}`;
  };

  return (
    <View style={styles.container}>
      {priceItems.map((item, index) => (
        <View 
          key={index} 
          style={[
            styles.priceCard,
            { backgroundColor: getBackgroundColor(item.type) }
          ]}
        >
          <View style={styles.iconContainer}>
            <ThemedText style={styles.icon}>{getIcon(item.type)}</ThemedText>
          </View>
          
          <View style={styles.priceContent}>
            <ThemedText style={styles.priceTitle}>{item.title}</ThemedText>
            <ThemedText style={styles.priceSubtitle}>{item.subtitle}</ThemedText>
          </View>
          
          <View style={styles.priceAmount}>
            <ThemedText style={styles.priceText}>
              {formatPrice(item.price, item.unit)}
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  priceContent: {
    flex: 1,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  priceSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  priceAmount: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
  },
});