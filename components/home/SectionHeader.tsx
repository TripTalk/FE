import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  onSeeMorePress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeMorePress }) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {onSeeMorePress && (
        <TouchableOpacity onPress={onSeeMorePress}>
          <ThemedText style={styles.seeMore}>{'>'}</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeMore: {
    fontSize: 14,
    color: '#666666',
  },
});