import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';
import React from 'react';
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  travelData: {
    title: string;
    location: string;
    image: string;
  };
}

export function ShareModal({ visible, onClose, travelData }: ShareModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>일정 공유하기</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* 공유 내용 */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <ThemedText style={styles.subtitle}>일정을 공유해보세요</ThemedText>
            <ThemedText style={styles.description}>
              친구들과 함께 여행 계획을 공유할 수 있습니다
            </ThemedText>

          {/* 여행 미리보기 카드 */}
          <ThemedView style={styles.previewCard}>
            <Image 
              source={{ uri: travelData.image }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.previewContent}>
              <ThemedText style={styles.previewTitle}>
                제주도 3박 4일 힐링 여행
              </ThemedText>
              <View style={styles.previewDetails}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailIcon}>📍</ThemedText>
                  <ThemedText style={styles.detailText}>제주도</ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailIcon}>📅</ThemedText>
                  <ThemedText style={styles.detailText}>2024.03.15 - 2024.03.18</ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailIcon}>💰</ThemedText>
                  <ThemedText style={styles.detailText}>50만-100만원</ThemedText>
                </View>
              </View>

              {/* 일정 하이라이트 */}
              <View style={styles.highlightSection}>
                <ThemedText style={styles.highlightTitle}>여행 하이라이트</ThemedText>
                <View style={styles.highlightList}>
                  <ThemedText style={styles.highlightItem}>• 성산일출봉 일출 감상</ThemedText>
                  <ThemedText style={styles.highlightItem}>• 올레길 트래킹</ThemedText>
                  <ThemedText style={styles.highlightItem}>• 카마 제주리조트 휴양</ThemedText>
                  <ThemedText style={styles.highlightItem}>• 올레시장 맛집 투어</ThemedText>
                </View>
              </View>
            </View>
          </ThemedView>

          {/* 공유 버튼들 */}
          <View style={styles.shareButtons}>
            <TouchableOpacity style={[styles.shareButton, styles.messageButton]}>
              <View style={styles.shareButtonIconContainer}>
                <ThemedText style={styles.shareButtonIcon}>📩</ThemedText>
              </View>
              <ThemedText style={[styles.shareButtonText, styles.messageButtonText]}>메시지로 공유하기</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.shareButton, styles.linkButton]}>
              <View style={styles.shareButtonIconContainer}>
                <ThemedText style={styles.shareButtonIcon}>🔗</ThemedText>
              </View>
              <ThemedText style={[styles.shareButtonText, styles.linkButtonText]}>링크 공유하기</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.shareButton, styles.cameraButton]}>
              <View style={styles.shareButtonIconContainer}>
                <ThemedText style={styles.shareButtonIcon}>📷</ThemedText>
              </View>
              <ThemedText style={[styles.shareButtonText, styles.cameraButtonText]}>카카오톡으로 공유</ThemedText>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
    marginLeft: -4,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  previewContent: {
    padding: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  previewDetails: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
  },
  highlightSection: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  highlightList: {
    gap: 6,
  },
  highlightItem: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  shareButtons: {
    gap: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageButton: {
    backgroundColor: '#8B5CF6',
  },
  linkButton: {
    backgroundColor: '#3B82F6',
  },
  cameraButton: {
    backgroundColor: '#F59E0B',
  },
  shareButtonIconContainer: {
    marginRight: 12,
  },
  shareButtonIcon: {
    fontSize: 20,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  messageButtonText: {
    color: '#FFFFFF',
  },
  linkButtonText: {
    color: '#FFFFFF',
  },
  cameraButtonText: {
    color: '#FFFFFF',
  },
});