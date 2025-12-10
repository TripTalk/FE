import { useAuth } from '@/contexts/AuthContext';
import { login } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { saveTokens } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await login({ email: email.trim(), password });
      console.log('로그인 성공:', response);

      if (response.isSuccess) {
        // 토큰 저장
        await saveTokens({
          accessToken: response.result.accessToken,
          refreshToken: response.result.refreshToken,
        });
        // 홈 화면으로 이동
        router.replace('/(tabs)' as any);
      } else {
        Alert.alert('로그인 실패', response.message || '이메일 또는 비밀번호를 확인해주세요.');
      }
    } catch (error: any) {
      console.error('로그인 오류:', error);
      Alert.alert('오류', error.message || '서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.replace('/auth/start' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack}>
            <Text style={styles.backButton}>{'<'}</Text>
          </Pressable>
        </View>

        {/* Background Images */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/landmark.png')}
            style={[styles.landmarkImage, { opacity: 0.75 }]}
            resizeMode="cover"
          />
          <Image
            source={require('../../assets/images/person1.png')}
            style={styles.personImage}
            resizeMode="contain"
          />
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          <Text style={styles.title}>Triptalk</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor="#CCCCCC"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor="#CCCCCC"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <Pressable
            style={[styles.loginButton, (!email.trim() || !password.trim() || isLoading) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!email.trim() || !password.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>로그인</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECFCFA',
  },
  container: {
    flex: 1,
    backgroundColor: '#ECFCFA',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 60,
  },
  landmarkImage: {
    width: width,
    height: height * 0.5,
    position: 'absolute',
    top: 0,
  },
  personImage: {
    width: 240,
    height: 360,
    position: 'absolute',
    bottom: height * -0.1,
    left: '30%',
    marginLeft: -120,
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 50,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: 'center',
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    color: '#000000',
  },
  loginButton: {
    backgroundColor: '#1DCBB4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
