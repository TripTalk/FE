import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function StartScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/auth/onboarding1' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Logo and Tagline Section */}
      <View style={styles.logoSection}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/images/triptalk_icon.png')}
            style={styles.iconImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Triptalk</Text>
        </View>
        <Text style={styles.tagline}>여행 준비를 더 쉽게</Text>
      </View>

      {/* Illustration Section */}
      <View style={styles.illustrationSection}>
        <Image
          source={require('../../assets/images/start.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/* Button Section */}
      <View style={styles.buttonSection}>
        <Pressable style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>시작하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 60,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconImage: {
    width: 54,
    height: 54,
    marginRight: 8,
    marginTop: 2,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999999',
    marginTop: 0,
  },
  illustrationSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  illustrationImage: {
    width: width - 40,
    height: height * 0.5,
  },
  buttonSection: {
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  startButton: {
    backgroundColor: '#1DCBB4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
