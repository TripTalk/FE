import { ThemedText } from '@/components/shared/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: '이용약관',
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
          <ThemedText style={styles.title}>TripTalk 서비스 이용약관</ThemedText>
          <ThemedText style={styles.date}>시행일: 2025년 1월 1일</ThemedText>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>제1조 (목적)</ThemedText>
            <ThemedText style={styles.sectionContent}>
              본 약관은 TripTalk(이하 "회사")가 제공하는 AI 기반 여행 계획 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>제2조 (정의)</ThemedText>
            <ThemedText style={styles.sectionContent}>
              1. "서비스"란 회사가 제공하는 AI 여행 플래너, 여행지 추천, 일정 관리 등의 여행 관련 서비스를 말합니다.{'\n\n'}
              2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.{'\n\n'}
              3. "회원"이란 회사와 서비스 이용계약을 체결하고 이용자 아이디를 부여받은 자를 말합니다.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>제3조 (서비스의 제공)</ThemedText>
            <ThemedText style={styles.sectionContent}>
              회사는 다음과 같은 서비스를 제공합니다:{'\n\n'}
              1. AI 기반 맞춤형 여행 일정 생성{'\n'}
              2. 여행지 정보 및 추천 서비스{'\n'}
              3. 여행 계획 저장 및 관리{'\n'}
              4. 여행 스타일 분석 및 맞춤 추천{'\n'}
              5. 기타 회사가 정하는 서비스
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>제4조 (이용자의 의무)</ThemedText>
            <ThemedText style={styles.sectionContent}>
              1. 이용자는 서비스 이용 시 관련 법령, 본 약관의 규정 등을 준수하여야 합니다.{'\n\n'}
              2. 이용자는 타인의 개인정보를 침해하거나 서비스를 부정하게 이용해서는 안 됩니다.{'\n\n'}
              3. 이용자는 자신의 계정 정보를 안전하게 관리할 책임이 있습니다.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>제5조 (면책조항)</ThemedText>
            <ThemedText style={styles.sectionContent}>
              1. 회사는 AI가 생성한 여행 계획의 정확성을 보장하지 않으며, 실제 여행 시 이용자의 판단이 필요합니다.{'\n\n'}
              2. 회사는 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다.{'\n\n'}
              3. 이용자가 서비스를 통해 얻은 정보로 인한 손해에 대해 회사는 책임지지 않습니다.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>제6조 (약관의 변경)</ThemedText>
            <ThemedText style={styles.sectionContent}>
              회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다. 이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
            </ThemedText>
          </View>

          <ThemedText style={styles.footer}>
            본 약관은 2025년 1월 1일부터 적용됩니다.
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
  footer: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
});
