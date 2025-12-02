import { ThemedText } from '@/components/shared/themed-text';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { createTravelPlan, sendFeedback } from '@/services/api';
import { router, Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
}

// 텍스트가 5줄을 초과하는지 확인하는 함수
const isLongText = (text: string): boolean => {
  const lines = text.split('\n');
  return lines.length > 5 || text.length > 300;
};

// 텍스트를 5줄로 자르는 함수
const truncateText = (text: string): string => {
  const lines = text.split('\n');
  if (lines.length > 5) {
    return lines.slice(0, 5).join('\n') + '...';
  }
  if (text.length > 300) {
    return text.slice(0, 300) + '...';
  }
  return text;
};

export default function AIChatScreen() {
  const { travelPlan } = useTravelPlan();
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
    router.back();
  };

  // 메시지 펼치기/접기 토글
  const toggleMessageExpand = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isExpanded: !msg.isExpanded } : msg
    ));
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
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={0}
        >
          {/* 여행지 정보 */}
          <View style={styles.infoBar}>
            <ThemedText style={styles.infoTitle}>{travelPlan.destination || '제주도'}</ThemedText>
            <TouchableOpacity style={styles.detailButton}>
              <ThemedText style={styles.detailButtonText}>전체보기</ThemedText>
              <ThemedText style={styles.arrow}>{'>'}</ThemedText>
            </TouchableOpacity>
          </View>

          {/* 채팅 메시지 영역 */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => {
              const showTruncated = !message.isUser && isLongText(message.text) && !message.isExpanded;
              const displayText = showTruncated ? truncateText(message.text) : message.text;
              
              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.isUser ? styles.userBubble : styles.aiBubble
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.messageText,
                      message.isUser ? styles.userText : styles.aiText
                    ]}
                  >
                    {displayText}
                  </ThemedText>
                  {/* AI 메시지가 길 경우 전체보기/접기 버튼 */}
                  {!message.isUser && isLongText(message.text) && (
                    <TouchableOpacity 
                      style={styles.expandButton}
                      onPress={() => toggleMessageExpand(message.id)}
                    >
                      <ThemedText style={styles.expandButtonText}>
                        {message.isExpanded ? '접기' : '전체보기'} {message.isExpanded ? '▲' : '▼'}
                      </ThemedText>
                    </TouchableOpacity>
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
              <TouchableOpacity style={styles.plusButton}>
                <ThemedText style={styles.plusIcon}>+</ThemedText>
              </TouchableOpacity>
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
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  infoBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  arrow: {
    fontSize: 14,
    color: '#666666',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#4ECDC4',
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
    lineHeight: 20,
  },
  userText: {
    color: '#333333',
  },
  aiText: {
    color: '#FFFFFF',
  },
  expandButton: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  expandButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
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
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  plusIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
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
});
