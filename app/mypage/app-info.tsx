import { ThemedText } from '@/components/shared/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppInfoScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: '앱 정보',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#4ECDC4" />
              <ThemedText style={styles.backButtonText}>뒤로</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* 앱 로고 및 이름 */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/triptalk_icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <ThemedText style={styles.appName}>TripTalk</ThemedText>
            <ThemedText style={styles.appSlogan}>AI와 함께하는 스마트한 여행 계획</ThemedText>
          </View>

          {/* 앱 정보 */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>버전</ThemedText>
              <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>빌드</ThemedText>
              <ThemedText style={styles.infoValue}>2025.12.05</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>플랫폼</ThemedText>
              <ThemedText style={styles.infoValue}>iOS / Android</ThemedText>
            </View>
          </View>

          {/* 앱 소개 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>TripTalk 소개</ThemedText>
            <ThemedText style={styles.sectionContent}>
              TripTalk은 AI 기술을 활용하여 사용자 맞춤형 여행 계획을 생성해주는 스마트 여행 플래너입니다.
            </ThemedText>
          </View>

          {/* 주요 기능 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>주요 기능</ThemedText>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={styles.featureTextContainer}>
                  <ThemedText style={styles.featureTitle}>AI 여행 플래너</ThemedText>
                  <ThemedText style={styles.featureDesc}>인공지능이 당신만의 맞춤 여행 일정을 생성합니다</ThemedText>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureTextContainer}>
                  <ThemedText style={styles.featureTitle}>여행지 추천</ThemedText>
                  <ThemedText style={styles.featureDesc}>테마별, 지역별 인기 여행지를 추천받으세요</ThemedText>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureTextContainer}>
                  <ThemedText style={styles.featureTitle}>여행 저장소</ThemedText>
                  <ThemedText style={styles.featureDesc}>생성한 여행 계획을 저장하고 관리하세요</ThemedText>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureTextContainer}>
                  <ThemedText style={styles.featureTitle}>대화형 수정</ThemedText>
                  <ThemedText style={styles.featureDesc}>채팅으로 일정을 쉽게 수정할 수 있습니다</ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* 개발팀 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>개발팀</ThemedText>
            <ThemedText style={styles.sectionContent}>
              TripTalk은 여행을 사랑하는 개발자들이 모여 만들었습니다.{'\n'}
              더 나은 여행 경험을 위해 항상 노력하겠습니다.
            </ThemedText>
          </View>

          {/* 문의 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>문의하기</ThemedText>
            <ThemedText style={styles.sectionContent}>
              서비스 이용 중 궁금한 점이나 건의사항이 있으시면{'\n'}
              아래 이메일로 연락해 주세요.{'\n\n'}
              <ThemedText style={styles.email}>support@triptalk.com</ThemedText>
            </ThemedText>
          </View>

          {/* 저작권 */}
          <ThemedText style={styles.copyright}>
            © 2025 TripTalk. All rights reserved.
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 17,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  appSlogan: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  email: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  copyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
});
