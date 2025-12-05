import { ThemedText } from '@/components/shared/themed-text';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const COLORS = {
  background: '#F4F4F5',
  white: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#6B7280',
  border: '#E5E5E5',
  badgeBg: '#F0F0F0',
  badgeAcquired: '#4ECDC4',
  iconPlaceholder: '#DDDDDD',
};

type Badge = {
  id: string;
  name: string;
  description: string;
  acquired: boolean;
  acquiredDate?: string;
};

const badges: Badge[] = [
  { id: '1', name: '첫 여행', description: '첫 번째 여행을 완료했습니다', acquired: true, acquiredDate: '2024.11.15' },
  { id: '2', name: '사진 마니아', description: '여행 사진을 100장 업로드했습니다', acquired: true, acquiredDate: '2024.10.20' },
  { id: '3', name: '탐험가', description: '10개 이상의 여행지를 방문했습니다', acquired: true, acquiredDate: '2024.09.05' },
  { id: '4', name: '여행 전문가', description: '50개 이상의 여행을 완료했습니다', acquired: false },
  { id: '5', name: '소셜 마스터', description: '친구 10명을 초대했습니다', acquired: false },
  { id: '6', name: '계획왕', description: '완벽한 여행 계획을 10개 작성했습니다', acquired: false },
];

type BadgeItemProps = { badge: Badge };
const BadgeItem = ({ badge }: BadgeItemProps) => (
  <View style={[styles.badgeCard, !badge.acquired && styles.badgeCardLocked]}>
    <View style={[styles.badgeIconBackground, badge.acquired && styles.badgeIconAcquired]}>
      <View style={styles.iconPlaceholder} />
    </View>
    <View style={styles.badgeInfo}>
      <ThemedText style={styles.badgeName}>{badge.name}</ThemedText>
      <ThemedText style={styles.badgeDescription}>{badge.description}</ThemedText>
      {badge.acquired && badge.acquiredDate && (
        <ThemedText style={styles.acquiredDate}>획득일: {badge.acquiredDate}</ThemedText>
      )}
    </View>
    {!badge.acquired && (
      <View style={styles.lockBadge}>
        <ThemedText style={styles.lockIcon}>🔒</ThemedText>
      </View>
    )}
  </View>
);

export default function BadgesScreen() {
  const acquiredCount = badges.filter(b => b.acquired).length;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>나의 뱃지</ThemedText>
        <View style={styles.headerButton} />
      </View>

      {/* 뱃지 카운트 */}
      <View style={styles.countSection}>
        <ThemedText style={styles.countText}>
          획득한 뱃지: <ThemedText style={styles.countNumber}>{acquiredCount}/{badges.length}</ThemedText>
        </ThemedText>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {badges.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    padding: 8,
    minWidth: 40,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  countSection: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 8,
  },
  countText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  countNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.badgeAcquired,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  badgeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.badgeBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  badgeIconAcquired: {
    backgroundColor: COLORS.badgeAcquired,
  },
  iconPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.iconPlaceholder,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  acquiredDate: {
    fontSize: 12,
    color: COLORS.badgeAcquired,
  },
  lockBadge: {
    marginLeft: 8,
  },
  lockIcon: {
    fontSize: 20,
  },
});
