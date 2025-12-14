import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetTokenScreen() {
  const router = useRouter();
  const { saveTokens, clearTokens } = useAuth();
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const handleSave = async () => {
    if (!accessToken) {
      Alert.alert('오류', 'accessToken을 입력하세요');
      return;
    }
    await saveTokens({ accessToken, refreshToken: refreshToken || '' });
    Alert.alert('저장됨', '토큰이 저장되었습니다. 화면을 닫습니다.');
    router.back();
  };

  const handleClear = async () => {
    await clearTokens();
    setAccessToken('');
    setRefreshToken('');
    Alert.alert('삭제됨', '토큰이 제거되었습니다.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Dev: 액세스 토큰 설정</Text>

        <TextInput
          placeholder="Access Token"
          style={styles.input}
          value={accessToken}
          onChangeText={setAccessToken}
          autoCapitalize="none"
          multiline
        />

        <TextInput
          placeholder="Refresh Token (선택)"
          style={styles.input}
          value={refreshToken}
          onChangeText={setRefreshToken}
          autoCapitalize="none"
        />

        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave}>
            <Text style={styles.buttonText}>저장</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.clear]} onPress={handleClear}>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    minHeight: 44,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 6 },
  save: { backgroundColor: '#4ECDC4' },
  clear: { backgroundColor: '#F0F0F0' },
  buttonText: { fontWeight: '700', color: '#111' },
});
