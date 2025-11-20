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
    console.log('=== Back button pressed ===');
    console.log('onBack exists:', !!onBack);
    console.log('router.canGoBack():', router.canGoBack());
    
    if (onBack) {
      console.log('Executing onBack callback...');
      try {
        onBack();
        console.log('onBack callback executed successfully');
      } catch (error) {
        console.error('Error executing onBack:', error);
      }
      return;
    }
    
    if (router.canGoBack()) {
      console.log('Using router.back()...');
      router.back();
    } else {
      console.log('Cannot go back with router');
    }
  };



  return (
    <View style={styles.container}>
      {canGoBack && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <IconSymbol name="chevron.left" size={28} color="#333333" />
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
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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