import { ThemedText } from '@/components/shared/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/api';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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
type StatItemProps = { value: string; label: string; color: string; onPress?: () => void };
const StatItem = ({ value, label, color, onPress }: StatItemProps) => (
  <TouchableOpacity style={styles.statItem} onPress={onPress} activeOpacity={0.7}>
    <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
  </TouchableOpacity>
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
type MenuRowProps = { text: string; color?: string; onPress?: () => void };
const MenuRow = ({ text, color = COLORS.textPrimary, onPress }: MenuRowProps) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress}>
    <View style={styles.menuRowLeft}>
      <View style={[styles.iconPlaceholder, { width: 20, height: 20 }]} />
      <ThemedText style={[styles.menuRowText, { color }]}>{text}</ThemedText>
    </View>
    <View style={[styles.iconPlaceholder, { width: 16, height: 16 }]} />
  </TouchableOpacity>
);

export default function MyPageScreen() {
  const { tokens, clearTokens } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // 로그아웃 API 호출
      if (tokens?.accessToken) {
        console.log('로그아웃 API 호출 중...');
        const response = await logout(tokens.accessToken);
        console.log('로그아웃 성공:', response);
      }
      // 토큰 삭제
      await clearTokens();
      setShowLogoutModal(false);
      // 로그인 화면으로 이동
      router.replace('/auth/login');
    } catch (error: any) {
      console.error('로그아웃 오류:', error);
      // API 실패해도 로컬 토큰은 삭제하고 로그인 화면으로 이동
      await clearTokens();
      setShowLogoutModal(false);
      router.replace('/auth/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    router.replace('/auth/start');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.headerTitle}>마이페이지</ThemedText>

        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.profileHeader}
            onPress={() => router.push('/mypage/edit-profile')}
            activeOpacity={0.7}
          >
            <View style={styles.profileImageContainer}>
              <Image 
                source={require('@/assets/images/profile1.png')} 
                style={styles.defaultProfileImage} 
              />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>김여행</ThemedText>
              <ThemedText style={styles.profileBio}>여행을 사랑하는 모험가</ThemedText>
            </View>
            <View style={[styles.iconPlaceholder, { width: 20, height: 20 }]} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.statsContainer}>
            <StatItem 
              value="12" 
              label="완료한 여행" 
              color={COLORS.stat1}
              onPress={() => router.push('/(tabs)/explore?tab=completed')}
            />
            <StatItem 
              value="8" 
              label="계획 중인 여행" 
              color={COLORS.stat2}
              onPress={() => router.push('/(tabs)/explore?tab=planned')}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('/mypage/badges')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>🏆 나의 뱃지</ThemedText>
            <View style={styles.arrowIconContainer}>
              <ThemedText style={styles.arrowIcon}>›</ThemedText>
            </View>
          </View>
          <View style={styles.badgeContainer}>
            <BadgeItem label="첫 여행" />
            <BadgeItem label="사진 마니아" />
            <BadgeItem label="탐험가" />
            <BadgeItem label="미획득" />
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>기타</ThemedText>
          <MenuRow 
            text="이용약관" 
            onPress={() => router.push('/mypage/terms')}
          />
          <MenuRow 
            text="개인정보처리방침" 
            onPress={() => router.push('/mypage/privacy')}
          />
          <MenuRow 
            text="앱 정보" 
            onPress={() => router.push('/mypage/app-info')}
          />
        </View>

        <View style={styles.card}>
          <MenuRow 
            text="로그아웃" 
            color={COLORS.danger} 
            onPress={() => setShowLogoutModal(true)}
          />
          <MenuRow 
            text="회원탈퇴" 
            color={COLORS.danger} 
            onPress={() => setShowDeleteModal(true)}
          />
        </View>
      </ScrollView>

      {/* 로그아웃 확인 모달 */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !isLoggingOut && setShowLogoutModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => !isLoggingOut && setShowLogoutModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <ThemedText style={styles.modalTitle}>로그아웃</ThemedText>
            <ThemedText style={styles.modalMessage}>정말 로그아웃 하시겠습니까?</ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
              >
                <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <ThemedText style={styles.confirmButtonText}>로그아웃</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 회원탈퇴 확인 모달 */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDeleteModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <ThemedText style={styles.modalTitle}>회원탈퇴</ThemedText>
            <ThemedText style={styles.modalMessage}>정말 탈퇴하시겠습니까?{"\n"}모든 데이터가 삭제됩니다.</ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowDeleteModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.dangerButton]} 
                onPress={handleDeleteAccount}
              >
                <ThemedText style={styles.confirmButtonText}>탈퇴하기</ThemedText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconButton: {
    padding: 4,
  },
  arrowIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  profileImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DDF9F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: 72,
    height: 72,
    resizeMode: 'cover',
  },
  defaultProfileImage: {
    width: 72,
    height: 72,
    resizeMode: 'cover',
    top: 11,
  },
  profileInitial: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  profileBio: { fontSize: 14, color: COLORS.textSecondary },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 20,
  },
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
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  confirmButton: {
    backgroundColor: '#4ECDC4',
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});