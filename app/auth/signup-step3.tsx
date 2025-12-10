import { useAuth } from '@/contexts/AuthContext';
import { signup } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function SignupStep4Screen() {
  const router = useRouter();
  const { signupData, updateSignupData, resetSignupData } = useAuth();
  const [nickname, setNickname] = useState('');
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    terms: false,
    privacy: false,
  });

  const handleNext = () => {
    if (nickname.trim()) {
      setShowAgreementModal(true);
    }
  };

  useEffect(() => {
    if (showAgreementModal) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [showAgreementModal]);

  const handleBack = () => {
    router.back();
  };

  const handleAllAgree = () => {
    const newValue = !agreements.all;
    setAgreements({
      all: newValue,
      age: newValue,
      terms: newValue,
      privacy: newValue,
    });
  };

  const handleSingleAgree = (key: 'age' | 'terms' | 'privacy') => {
    const newAgreements = { ...agreements, [key]: !agreements[key] };
    newAgreements.all = newAgreements.age && newAgreements.terms && newAgreements.privacy;
    setAgreements(newAgreements);
  };

  const allRequiredChecked = agreements.age && agreements.terms && agreements.privacy;

  const handleAgreementConfirm = async () => {
    if (!allRequiredChecked || isLoading) return;

    setIsLoading(true);
    try {
      // 회원가입 API 호출
      const response = await signup({
        email: signupData.email,
        password: signupData.password,
        nickName: nickname,
      });

      console.log('회원가입 성공:', response);

      if (response.isSuccess) {
        // 회원가입 데이터 초기화
        resetSignupData();
        setShowAgreementModal(false);
        // 회원가입 성공 알림 후 로그인 화면으로 이동
        Alert.alert(
          '회원가입 완료',
          '회원가입이 완료되었습니다.\n로그인해주세요.',
          [
            {
              text: '확인',
              onPress: () => router.replace('/auth/login' as any),
            },
          ]
        );
      } else {
        Alert.alert('회원가입 실패', response.message || '다시 시도해주세요.');
      }
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      
      // 에러 메시지 기반으로 중복 체크
      const errorMessage = error.message || '';
      const errorCode = error.code || '';
      
      if (errorMessage.includes('이메일') || errorCode.includes('EMAIL')) {
        Alert.alert('회원가입 실패', '이미 사용 중인 이메일입니다.\n다른 이메일을 입력해주세요.');
      } else if (errorMessage.includes('닉네임') || errorCode.includes('NICKNAME')) {
        Alert.alert('회원가입 실패', '이미 사용 중인 닉네임입니다.\n다른 닉네임을 입력해주세요.');
      } else {
        Alert.alert('오류', errorMessage || '서버 연결에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack}>
            <Text style={styles.backButton}>{'<'}</Text>
          </Pressable>
          <Text style={styles.stepIndicator}>3/3</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>닉네임을 입력해주세요.</Text>
          <Text style={styles.label}>닉네임</Text>

          {/* Nickname Input */}
          <TextInput
            style={styles.input}
            placeholder="닉네임 입력"
            placeholderTextColor="#CCCCCC"
            value={nickname}
            onChangeText={setNickname}
            autoCapitalize="none"
          />

          {/* Divider line */}
          <View style={styles.divider} />
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.nextButton, !nickname.trim() && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!nickname.trim()}
          >
            <Text style={styles.nextButtonText}>다음</Text>
          </Pressable>
        </View>
      </ScrollView>
      </SafeAreaView>

      {/* Agreement Modal */}
      <Modal
        visible={showAgreementModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowAgreementModal(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Semi-transparent background */}
          <Pressable
            style={styles.overlayBackground}
            onPress={() => setShowAgreementModal(false)}
          />

          {/* Bottom Sheet */}
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [500, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Handle Bar */}
            <View style={styles.handleBar} />

            {/* Title */}
            <Text style={styles.modalTitle}>전체 동의</Text>

            {/* Option Items */}
            <View style={styles.optionsContainer}>
              <Pressable style={styles.allAgreeItem} onPress={handleAllAgree}>
                <View style={styles.radioButton}>
                  {agreements.all && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.allAgreeText}>전체 동의</Text>
              </Pressable>

              <View style={styles.dividerLine} />

              <Pressable style={styles.optionItem} onPress={() => handleSingleAgree('age')}>
                <View style={styles.radioButton}>
                  {agreements.age && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.optionText}>(필수) 만 14세 이상입니다.</Text>
              </Pressable>

              <Pressable style={styles.optionItem} onPress={() => handleSingleAgree('terms')}>
                <View style={styles.radioButton}>
                  {agreements.terms && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.optionText}>(필수) 서비스 이용 약관에 동의</Text>
              </Pressable>

              <Pressable style={styles.optionItem} onPress={() => handleSingleAgree('privacy')}>
                <View style={styles.radioButton}>
                  {agreements.privacy && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.optionText}>(필수) 개인정보 수집 이용에 동의</Text>
              </Pressable>
            </View>

            {/* Confirm Button */}
            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.confirmButton, (!allRequiredChecked || isLoading) && styles.buttonDisabled]}
                onPress={handleAgreementConfirm}
                disabled={!allRequiredChecked || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>다음</Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    minHeight: 400,
    zIndex: 1000,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#CCCCCC',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  allAgreeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  allAgreeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1DCBB4',
  },
  optionText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  modalFooter: {
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#1DCBB4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
