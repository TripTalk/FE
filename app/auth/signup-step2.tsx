import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function SignupStep2Screen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordValid = password.length > 0 && password === confirmPassword;

  const handleNext = () => {
    if (isPasswordValid) {
      router.push('/auth/signup-step3' as any);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack}>
          <Text style={styles.backButton}>{'<'}</Text>
        </Pressable>
        <Text style={styles.stepIndicator}>2/3</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>비밀번호를 입력해주세요.</Text>

        {/* Password Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 입력"
            placeholderTextColor="#CCCCCC"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.divider} />
        </View>

        {/* Password Requirements */}
        <View style={styles.requirementsContainer}>
          <View style={styles.requirement}>
            <View style={[styles.checkCircle, password.length >= 10 && styles.checkCircleActive]}>
              {password.length >= 10 && <Text style={styles.checkMark}>●</Text>}
            </View>
            <Text style={styles.requirementText}>10자리 이상</Text>
          </View>
          <View style={styles.requirement}>
            <View style={[styles.checkCircle, /[A-Z]/.test(password) && styles.checkCircleActive]}>
              {/[A-Z]/.test(password) && <Text style={styles.checkMark}>●</Text>}
            </View>
            <Text style={styles.requirementText}>영어 대문자</Text>
          </View>
          <View style={styles.requirement}>
            <View style={[styles.checkCircle, /[a-z]/.test(password) && styles.checkCircleActive]}>
              {/[a-z]/.test(password) && <Text style={styles.checkMark}>●</Text>}
            </View>
            <Text style={styles.requirementText}>영어 소문자</Text>
          </View>
          <View style={styles.requirement}>
            <View style={[styles.checkCircle, /[0-9]/.test(password) && styles.checkCircleActive]}>
              {/[0-9]/.test(password) && <Text style={styles.checkMark}>●</Text>}
            </View>
            <Text style={styles.requirementText}>숫자</Text>
          </View>
          <View style={styles.requirement}>
            <View style={[styles.checkCircle, /[!@#$%^&*]/.test(password) && styles.checkCircleActive]}>
              {/[!@#$%^&*]/.test(password) && <Text style={styles.checkMark}>●</Text>}
            </View>
            <Text style={styles.requirementText}>특수문자</Text>
          </View>
        </View>

        {/* Confirm Password Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 재입력"
            placeholderTextColor="#CCCCCC"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <View style={styles.divider} />
          {confirmPassword.length > 0 && (
            <Text style={[styles.matchText, password === confirmPassword ? styles.matchTextSuccess : styles.matchTextError]}>
              {password === confirmPassword ? '비밀번호가 동일합니다' : '비밀번호가 동일하지 않습니다'}
            </Text>
          )}
        </View>
      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.nextButton, !isPasswordValid && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!isPasswordValid}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </Pressable>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '600',
  },
  stepIndicator: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#1DCBB4',
    marginTop: 8,
  },
  requirementsContainer: {
    marginTop: 4,
    marginBottom: 40,
    gap: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    borderColor: '#1DCBB4',
    backgroundColor: '#1DCBB4',
  },
  checkMark: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  requirementText: {
    fontSize: 12,
    color: '#999999',
  },
  matchText: {
    fontSize: 12,
    marginTop: 8,
  },
  matchTextSuccess: {
    color: '#1DCBB4',
  },
  matchTextError: {
    color: '#FF0000',
  },
  infoText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  nextButton: {
    backgroundColor: '#1DCBB4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
