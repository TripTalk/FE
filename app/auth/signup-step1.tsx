import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function SignupStep1Screen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleNext = () => {
    if (email.trim()) {
      router.push('/auth/signup-step2' as any);
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
        <Text style={styles.stepIndicator}>1/3</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>이메일을 입력해주세요.</Text>
        <Text style={styles.label}>이메일</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="abc123456@XXXXX.com"
          placeholderTextColor="#CCCCCC"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Divider line */}
        <View style={styles.divider} />
      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.nextButton, !email.trim() && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!email.trim()}
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
