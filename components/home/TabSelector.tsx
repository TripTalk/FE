import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface TabSelectorProps {
  onDestinationPress: () => void;
  onAccommodationPress: () => void;
}

export function TabSelector({ onDestinationPress, onAccommodationPress }: TabSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.sectionCard}
        onPress={onDestinationPress}
      >
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>많이 찾는 여행지</ThemedText>
          <View style={styles.arrow}>
            <ThemedText style={styles.arrowText}>{'>'}</ThemedText>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sectionCard}
        onPress={onAccommodationPress}
      >
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>숙박·항공</ThemedText>
          <View style={styles.arrow}>
            <ThemedText style={styles.arrowText}>{'>'}</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  arrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: 'bold',
  },
});