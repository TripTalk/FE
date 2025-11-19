import { ThemedText } from '@/components/shared/themed-text';
import { IconSymbol } from '@/components/shared/ui/icon-symbol';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface TravelDetailHeaderProps {
  title: string;
  canGoBack?: boolean;
  onBack?: () => void; // 외부에서 커스텀 뒤로가기 처리 (모달 등)
}

export function TravelDetailHeader({ title, canGoBack = true, onBack }: TravelDetailHeaderProps) {
  const handleBackPress = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {canGoBack && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <IconSymbol name="chevron.left" size={24} color="#333333" />
        </TouchableOpacity>
      )}
      <ThemedText style={styles.title}>{title}</ThemedText>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 60,
  },
  backButton: {
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40, // backButton과 같은 너비로 중앙 정렬 유지
  },
});