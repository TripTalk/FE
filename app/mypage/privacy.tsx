import { ThemedText } from '@/components/shared/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: '개인정보처리방침',
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
          <ThemedText style={styles.title}>개인정보처리방침</ThemedText>
          <ThemedText style={styles.date}>시행일: 2025년 1월 1일</ThemedText>

          <ThemedText style={styles.intro}>
            TripTalk(이하 "회사")는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을 준수하고 있습니다.
          </ThemedText>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>1. 수집하는 개인정보 항목</ThemedText>
            <ThemedText style={styles.sectionContent}>
              회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다:{'\n\n'}
              <ThemedText style={styles.bold}>필수항목:</ThemedText>{'\n'}
              • 이메일 주소{'\n'}
              • 비밀번호{'\n'}
              • 닉네임{'\n\n'}
              <ThemedText style={styles.bold}>선택항목:</ThemedText>{'\n'}
              • 프로필 사진{'\n'}
              • 여행 선호도 정보{'\n'}
              • 여행 기록
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>2. 개인정보의 수집 및 이용목적</ThemedText>
            <ThemedText style={styles.sectionContent}>
              • 회원 가입 및 관리{'\n'}
              • AI 맞춤형 여행 계획 생성{'\n'}
              • 여행지 추천 서비스 제공{'\n'}
              • 서비스 개선 및 신규 서비스 개발{'\n'}
              • 고객 문의 응대
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>3. 개인정보의 보유 및 이용기간</ThemedText>
            <ThemedText style={styles.sectionContent}>
              회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.{'\n\n'}
              • 회원 탈퇴 시: 즉시 삭제{'\n'}
              • 관련 법령에 따른 보존 필요 시: 해당 기간 동안 보관
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>4. 개인정보의 제3자 제공</ThemedText>
            <ThemedText style={styles.sectionContent}>
              회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다:{'\n\n'}
              • 이용자가 사전에 동의한 경우{'\n'}
              • 법령의 규정에 의한 경우{'\n'}
              • 수사 목적으로 법령에 정해진 절차에 따라 요청이 있는 경우
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>5. 개인정보의 파기절차 및 방법</ThemedText>
            <ThemedText style={styles.sectionContent}>
              <ThemedText style={styles.bold}>파기절차:</ThemedText>{'\n'}
              이용자의 개인정보는 목적 달성 후 별도의 DB로 옮겨져 내부 방침에 따라 일정 기간 저장 후 파기됩니다.{'\n\n'}
              <ThemedText style={styles.bold}>파기방법:</ThemedText>{'\n'}
              • 전자적 파일: 복구 불가능한 방법으로 영구 삭제{'\n'}
              • 종이 문서: 분쇄기로 분쇄 또는 소각
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>6. 이용자의 권리</ThemedText>
            <ThemedText style={styles.sectionContent}>
              이용자는 언제든지 다음의 권리를 행사할 수 있습니다:{'\n\n'}
              • 개인정보 열람 요구{'\n'}
              • 오류 정정 요구{'\n'}
              • 삭제 요구{'\n'}
              • 처리 정지 요구
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>7. 개인정보 보호책임자</ThemedText>
            <ThemedText style={styles.sectionContent}>
              • 담당부서: TripTalk 개인정보보호팀{'\n'}
              • 이메일: privacy@triptalk.com{'\n\n'}
              개인정보 관련 문의사항은 위 연락처로 문의해 주시기 바랍니다.
            </ThemedText>
          </View>

          <ThemedText style={styles.footer}>
            본 방침은 2025년 1월 1일부터 적용됩니다.
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  intro: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  bold: {
    fontWeight: '600',
    color: '#374151',
  },
  footer: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
});
