import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface AIBannerProps {
  onPress?: () => void;
}

export const AIBanner: React.FC<AIBannerProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <ThemedText style={styles.title}>AI와 함께</ThemedText>
          <ThemedText style={styles.subtitle}>여행 일정을 만들어보세요</ThemedText>
          <TouchableOpacity style={styles.button}>
            <ThemedText style={styles.buttonText}>여행 계획하러 가기</ThemedText>
            <ThemedText style={styles.arrow}>→</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.rightSection}>
          <ThemedText style={styles.emoji}>👩‍💻</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4ECDC4',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 12,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 40,
  },
});