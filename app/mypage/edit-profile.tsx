import { ThemedText } from '@/components/shared/themed-text';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  background: '#F4F4F5',
  white: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#6B7280',
  primary: '#4ECDC4',
  border: '#E5E5E5',
  profileBg: '#20B2AA',
  iconPlaceholder: '#DDDDDD',
};

export default function EditProfileScreen() {
  const [nickname, setNickname] = useState('김여행');
  const [bio, setBio] = useState('여행을 사랑하는 모험가');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleSave = () => {
    // TODO: 실제 저장 로직 구현
    Alert.alert('저장 완료', '프로필이 업데이트되었습니다.', [
      { text: '확인', onPress: () => router.back() },
    ]);
  };

  const handleImagePick = async () => {
    // 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    // 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>프로필 편집</ThemedText>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <ThemedText style={styles.saveText}>저장</ThemedText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* 프로필 이미지 */}
          <View style={styles.imageSection}>
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onPress={() => setShowImageModal(true)}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Image 
                  source={require('@/assets/images/profile1.png')} 
                  style={styles.defaultProfileImage} 
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImagePick} activeOpacity={0.7}>
              <ThemedText style={styles.imageHint}>프로필 사진 변경</ThemedText>
            </TouchableOpacity>
          </View>

          {/* 닉네임 입력 */}
          <View style={styles.inputSection}>
            <ThemedText style={styles.label}>닉네임</ThemedText>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={20}
            />
            <ThemedText style={styles.charCount}>{nickname.length}/20</ThemedText>
          </View>

          {/* 소개 입력 */}
          <View style={styles.inputSection}>
            <ThemedText style={styles.label}>소개</ThemedText>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="자신을 소개해주세요"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={30}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <ThemedText style={styles.charCount}>{bio.length}/30</ThemedText>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 프로필 이미지 확대 모달 */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowImageModal(false)}
        >
          <View style={styles.modalImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.modalImage} />
            ) : (
              <Image 
                source={require('@/assets/images/profile1.png')} 
                style={styles.modalDefaultImage} 
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DDF9F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    top: 15,
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  cameraIcon: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  imageHint: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bioInput: {
    minHeight: 100,
    paddingTop: 16,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: 'hidden',
    backgroundColor: '#DDF9F6',
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  modalDefaultImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    top: 45,
  },
});
