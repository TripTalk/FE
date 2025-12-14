import { ThemedText } from '@/components/shared/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { createTravelPlan, saveTravelPlan, sendFeedback } from '@/services/api';
import { router, Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isExpanded?: boolean;
  isSaveable?: boolean;
  isSaved?: boolean;
  hasRepositoryLink?: boolean;
}

// 텍스트가 긴지 확인하는 함수
const isLongText = (text: string): boolean => {
  const lines = text.split('\n');
  return lines.length > 8 || text.length > 400;
};

// 텍스트를 미리보기로 자르는 함수
const truncateText = (text: string): string => {
  const lines = text.split('\n');
  if (lines.length > 8) {
    return lines.slice(0, 8).join('\n') + '\n...';
  }
  if (text.length > 400) {
    return text.slice(0, 400) + '...';
  }
  return text;
};

export default function AIChatScreen() {
  const { travelPlan } = useTravelPlan();
  const { tokens } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '여행 일정을 생성하고 있어요! 잠시만 기다려주세요...',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlanCreated, setIsPlanCreated] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [currentTravelId, setCurrentTravelId] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  // 날짜 형식 변환 (YYYY-MM-DD -> YYYY.MM.DD)
  const formatDateForAPI = (dateStr: string): string => {
    if (!dateStr) return '';
    // YYYY-MM-DD 형식을 YYYY.MM.DD로 변환 (FastAPI 형식에 맞춤)
    return dateStr.replace(/-/g, '.');
  };

  // 화면 진입 시 여행 계획 자동 생성
  useEffect(() => {
    const generateInitialPlan = async () => {
      setIsLoading(true);
      try {
        // Context에서 사용자가 선택한 데이터 사용
        const travelData = {
          companions: travelPlan.companions || '친구',
          departure: travelPlan.departure || '서울',
          destination: travelPlan.destination || '제주도',
          start_date: formatDateForAPI(travelPlan.startDate) || '2025.12.10',
          end_date: formatDateForAPI(travelPlan.endDate) || '2025.12.12',
          style: travelPlan.style.length > 0 ? travelPlan.style : ['맛집', '관광'],
          budget: travelPlan.budget || '50만원',
        };

        console.log('=== 여행 계획 API 요청 ===');
        console.log('Context 데이터:', JSON.stringify(travelPlan, null, 2));
        console.log('API 요청 데이터:', JSON.stringify(travelData, null, 2));
        const response = await createTravelPlan(travelData);
        console.log('여행 계획 생성 응답:', response);

        const planText = response.plan || JSON.stringify(response);
        const travelId = response.travel_id || '';
        setCurrentTravelId(travelId);
        console.log('저장된 travel_id:', travelId);
        
        setMessages([
          {
            id: '1',
            text: `${travelData.destination} 여행 일정을 만들었어요! 🎉`,
            isUser: false,
            timestamp: new Date(),
          },
          {
            id: '2',
            text: planText,
            isUser: false,
            timestamp: new Date(),
            isSaveable: true,
          },
          {
            id: '3',
            text: '일정을 수정하고 싶으시면 말씀해주세요!',
            isUser: false,
            timestamp: new Date(),
          }
        ]);
        setIsPlanCreated(true);
      } catch (error) {
        console.error('여행 계획 생성 오류:', error);
        setMessages([
          {
            id: '1',
            text: '여행 일정 생성에 실패했습니다. 다시 시도해주세요.',
            isUser: false,
            timestamp: new Date(),
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    generateInitialPlan();
  }, [travelPlan]);

  const handleBackPress = () => {
    setShowExitModal(true);
  };

  const handleHomePress = () => {
    setShowHomeModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.back();
  };

  const handleConfirmHome = () => {
    setShowHomeModal(false);
    router.replace('/(tabs)');
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleCancelHome = () => {
    setShowHomeModal(false);
  };

  // 메시지 펼치기/접기 토글
  const toggleMessageExpand = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isExpanded: !msg.isExpanded } : msg
    ));
  };

  // 여행 계획 저장 핸들러
  const handleSavePlan = async (messageId: string) => {
    if (!currentTravelId) {
      console.log('저장할 여행 계획 ID가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      console.log('=== 여행 계획 저장 시작 ===');
      console.log('travel_id:', currentTravelId);
      
      const accessToken = tokens?.accessToken;
      await saveTravelPlan(currentTravelId, accessToken);

      // 저장 완료 표시
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isSaved: true } : msg
      ));

      // 저장 완료 메시지 추가
      const savedMessage: Message = {
        id: Date.now().toString(),
        text: '여행 계획이 저장되었습니다! 💾\n보관함에서 확인하실 수 있습니다.',
        isUser: false,
        timestamp: new Date(),
        hasRepositoryLink: true,
      };
      setMessages(prev => [...prev, savedMessage]);
    } catch (error: any) {
      console.log('저장 실패:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: '저장에 실패했습니다. 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // FastAPI /feedback 엔드포인트 호출
      const response = await sendFeedback(inputText);
      console.log('API 응답:', JSON.stringify(response));
      
      // 다양한 응답 형식 처리 (reply, response, message, text 등)
      const replyText = response.reply || response.response || response.message || response.text || JSON.stringify(response);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        isUser: false,
        timestamp: new Date(),
        isSaveable: true,
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      // 에러 시 사용자에게 알림
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '서버 연결에 실패했습니다. FastAPI 서버가 실행 중인지 확인해주세요.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('API 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 새 메시지가 추가되면 스크롤을 하단으로
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'AI 여행 플래너',
          headerBackTitle: '뒤로',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
              <ThemedText style={styles.headerButtonText}>‹ 뒤로</ThemedText>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleHomePress} style={styles.headerButton}>
              <ThemedText style={styles.headerButtonText}>홈으로</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={0}
        >
          {/* 채팅 메시지 영역 */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => {
              // 전체보기 상태가 아니고 긴 텍스트일 때만 자름
              const isExpanded = message.isExpanded === true;
              
              // 전체보기 상태면 무조건 전체 텍스트 표시
              let displayText = message.text;
              if (!message.isUser && !isExpanded && isLongText(message.text)) {
                displayText = truncateText(message.text);
              }
              
              return (
                <View 
                  key={message.id} 
                  style={[
                    styles.messageWrapper,
                    message.isUser && styles.userMessageWrapper
                  ]}
                >
                  {/* 메시지 버블 */}
                  <View
                    style={[
                      styles.messageBubble,
                      message.isUser ? styles.userBubble : styles.aiBubble,
                    ]}
                  >
                    {message.isUser ? (
                      <ThemedText style={[styles.messageText, styles.userText]}>
                        {message.text}
                      </ThemedText>
                    ) : (
                      <ThemedText style={[styles.messageText, styles.aiText]}>
                        {displayText}
                      </ThemedText>
                    )}
                  </View>
                  
                  {/* AI 메시지 버튼들 - 버블 밖에 배치 */}
                  {!message.isUser && (
                    <View style={styles.aiButtonsContainer}>
                      {/* 전체보기/접기 버튼 */}
                      {isLongText(message.text) && (
                        <TouchableOpacity 
                          style={styles.expandButton}
                          onPress={() => toggleMessageExpand(message.id)}
                        >
                          <ThemedText style={styles.expandButtonText}>
                            {isExpanded ? '접기 ▲' : '전체보기 ▼'}
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                      
                      {/* 저장하기 버튼 - 전체보기 상태이거나 짧은 텍스트일 때만 표시 */}
                      {message.isSaveable && (!isLongText(message.text) || isExpanded) && (
                        <TouchableOpacity 
                          style={[
                            styles.saveButton,
                            message.isSaved && styles.saveButtonSaved
                          ]}
                          onPress={() => handleSavePlan(message.id)}
                          disabled={message.isSaved}
                        >
                          <ThemedText style={styles.saveButtonText}>
                            {message.isSaved ? '저장 완료 ✓' : '저장하기'}
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                      
                      {/* 저장소로 바로가기 버튼 */}
                      {message.hasRepositoryLink && (
                        <TouchableOpacity 
                          style={styles.repositoryButton}
                          onPress={() => router.push('/(tabs)/explore')}
                        >
                          <ThemedText style={styles.repositoryButtonText}>
                            저장소로 바로가기 ›
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
            {isLoading && (
              <View style={[styles.messageBubble, styles.aiBubble, styles.loadingBubble]}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <ThemedText style={styles.loadingText}>AI 응답 중...</ThemedText>
              </View>
            )}
          </ScrollView>

          {/* 입력 영역 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="어떤 계획이 더 필요하세요..."
                placeholderTextColor="#999999"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  inputText.trim() && !isLoading && styles.sendButtonActive
                ]}
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
              >
                <ThemedText style={styles.sendIcon}>➤</ThemedText>
              </TouchableOpacity>
            </View>
        </View>
      </KeyboardAvoidingView>

      {/* 뒤로가기 확인 모달 */}
      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelExit}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCancelExit}>
          <Pressable style={styles.exitModal} onPress={(e) => e.stopPropagation()}>
            <ThemedText style={styles.exitModalTitle}>대화 종료</ThemedText>
            <ThemedText style={styles.exitModalMessage}>
              AI 대화 기록이 초기화됩니다.{"\n"}정말 나가시겠습니까?
            </ThemedText>
            <View style={styles.exitModalButtons}>
              <TouchableOpacity 
                style={[styles.exitModalButton, styles.cancelButton]} 
                onPress={handleCancelExit}
              >
                <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.exitModalButton, styles.confirmButton]} 
                onPress={handleConfirmExit}
              >
                <ThemedText style={styles.confirmButtonText}>확인</ThemedText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 홈으로 확인 모달 */}
      <Modal
        visible={showHomeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelHome}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCancelHome}>
          <Pressable style={styles.exitModal} onPress={(e) => e.stopPropagation()}>
            <ThemedText style={styles.exitModalTitle}>홈으로 이동</ThemedText>
            <ThemedText style={styles.exitModalMessage}>
              AI 대화 기록이 초기화됩니다.{"\n"}홈으로 이동하시겠습니까?
            </ThemedText>
            <View style={styles.exitModalButtons}>
              <TouchableOpacity 
                style={[styles.exitModalButton, styles.cancelButton]} 
                onPress={handleCancelHome}
              >
                <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.exitModalButton, styles.confirmButton]} 
                onPress={handleConfirmHome}
              >
                <ThemedText style={styles.confirmButtonText}>확인</ThemedText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerButtonText: {
    fontSize: 17,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  messageWrapper: {
    maxWidth: '95%',
    alignSelf: 'flex-start',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  messageBubble: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  aiButtonsContainer: {
    marginTop: 8,
    gap: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  aiBubble: {
    backgroundColor: '#4ECDC4',
  },
  expandButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#3DBDB5',
    borderRadius: 12,
    alignItems: 'center',
  },
  expandButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
  },
  userText: {
    color: '#333333',
  },
  aiText: {
    color: '#FFFFFF',
    lineHeight: 24,
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  saveButtonSaved: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(78, 205, 196, 0.5)',
  },
  saveButtonText: {
    color: '#4ECDC4',
    fontSize: 15,
    fontWeight: '700',
  },
  saveButtonTextSaved: {
    color: '#FFFFFF',
  },
  repositoryButton: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  repositoryButtonText: {
    color: '#4ECDC4',
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  sendIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  // 종료 확인 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
  },
  exitModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  exitModalMessage: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  exitModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  exitModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButton: {
    backgroundColor: '#4ECDC4',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// 마크다운 스타일
const markdownStyles = StyleSheet.create({
  body: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  heading1: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    paddingBottom: 4,
  },
  heading3: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  strong: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  em: {
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  bullet_list: {
    marginLeft: 8,
    marginBottom: 8,
  },
  ordered_list: {
    marginLeft: 8,
    marginBottom: 8,
  },
  list_item: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  bullet_list_icon: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 8,
  },
  ordered_list_icon: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 8,
  },
  code_inline: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: '#E0E0E0',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  fence: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: '#E0E0E0',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  blockquote: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  hr: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 1,
    marginVertical: 16,
  },
  link: {
    color: '#A0E7E5',
    textDecorationLine: 'underline',
  },
  table: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  th: {
    color: '#FFFFFF',
    fontWeight: '700',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  td: {
    color: '#FFFFFF',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
});