import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// --- 피그마 디자인 값 (필요 시 constants로 승격 가능) ---
const COLORS = {
  background: '#F4F4F5',
  white: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#6B7280',
  danger: '#FF3B30',
  stat1: '#20B2AA',
  stat2: '#8A2BE2',
  stat3: '#FF69B4',
  badgeBg: '#F0F0F0',
  iconPlaceholder: '#DDDDDD',
};

// 통계 아이템
type StatItemProps = { value: string; label: string; color: string };
const StatItem = ({ value, label, color }: StatItemProps) => (
  <View style={styles.statItem}>
    <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
  </View>
);

// 뱃지 아이템
type BadgeItemProps = { label: string };
const BadgeItem = ({ label }: BadgeItemProps) => (
  <View style={styles.badgeItem}>
    <View style={styles.badgeIconBackground}>
      <View style={styles.iconPlaceholder} />
    </View>
    <ThemedText style={styles.badgeLabel}>{label}</ThemedText>
  </View>
);

// 메뉴 로우
type MenuRowProps = { text: string; color?: string };
const MenuRow = ({ text, color = COLORS.textPrimary }: MenuRowProps) => (
  <TouchableOpacity style={styles.menuRow}>
    <View style={styles.menuRowLeft}>
      <View style={[styles.iconPlaceholder, { width: 20, height: 20 }]} />
      <ThemedText style={[styles.menuRowText, { color }]}>{text}</ThemedText>
    </View>
    <View style={[styles.iconPlaceholder, { width: 16, height: 16 }]} />
  </TouchableOpacity>
);

export default function MyPageScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.headerTitle}>마이페이지</ThemedText>

        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <ThemedText style={styles.profileInitial}>김</ThemedText>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>김여행</ThemedText>
              <ThemedText style={styles.profileBio}>여행을 사랑하는 모험가</ThemedText>
            </View>
            <TouchableOpacity>
              <View style={[styles.iconPlaceholder, { width: 20, height: 20 }]} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <StatItem value="12" label="완료한 여행" color={COLORS.stat1} />
            <StatItem value="8" label="계획 중인 여행" color={COLORS.stat2} />
            <StatItem value="156" label="여행 포인트" color={COLORS.stat3} />
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>🏆 나의 뱃지</ThemedText>
          <View style={styles.badgeContainer}>
            <BadgeItem label="첫 여행" />
            <BadgeItem label="사진 마니아" />
            <BadgeItem label="탐험가" />
            <BadgeItem label="미획득" />
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>계정 설정</ThemedText>
          <MenuRow text="프로필 수정" />
          <MenuRow text="비밀번호 변경" />
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>기타</ThemedText>
          <MenuRow text="이용약관" />
          <MenuRow text="개인정보처리방침" />
          <MenuRow text="앱 정보" />
        </View>

        <View style={styles.card}>
          <MenuRow text="로그아웃" color={COLORS.danger} />
          <MenuRow text="회원탈퇴" color={COLORS.danger} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  contentContainer: { padding: 16 },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  profileImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.stat1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  profileBio: { fontSize: 14, color: COLORS.textSecondary },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 13, color: COLORS.textSecondary },
  badgeContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  badgeItem: { alignItems: 'center', flex: 1 },
  badgeIconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.badgeBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeLabel: { fontSize: 13, color: COLORS.textSecondary },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  menuRowLeft: { flexDirection: 'row', alignItems: 'center' },
  menuRowText: { fontSize: 16, marginLeft: 12 },
  iconPlaceholder: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.iconPlaceholder },
});