import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { refreshToken as refreshTokenApi } from '../services/api';

// 회원가입 데이터 타입
export interface SignupData {
  email: string;
  password: string;
  nickName: string;
}

// 인증 토큰 타입
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
  resetSignupData: () => void;
  // 로그인 관련
  isLoggedIn: boolean;
  tokens: AuthTokens | null;
  saveTokens: (tokens: AuthTokens) => Promise<void>;
  clearTokens: () => Promise<void>;
  // 토큰 재발급
  refreshTokens: () => Promise<boolean>;
  isRefreshing: boolean;
}

const defaultSignupData: SignupData = {
  email: '',
  password: '',
  nickName: '',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signupData, setSignupData] = useState<SignupData>(defaultSignupData);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 앱 시작 시 저장된 토큰 확인
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const storedTokens = await AsyncStorage.getItem('authTokens');
        if (storedTokens) {
          const parsedTokens = JSON.parse(storedTokens);
          setTokens(parsedTokens);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('토큰 로드 실패:', error);
      }
    };
    loadTokens();
  }, []);

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };

  const resetSignupData = () => {
    setSignupData(defaultSignupData);
  };

  // 토큰 저장
  const saveTokens = async (newTokens: AuthTokens) => {
    try {
      await AsyncStorage.setItem('authTokens', JSON.stringify(newTokens));
      setTokens(newTokens);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('토큰 저장 실패:', error);
    }
  };

  // 토큰 삭제 (로그아웃)
  const clearTokens = async () => {
    try {
      await AsyncStorage.removeItem('authTokens');
      setTokens(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('토큰 삭제 실패:', error);
    }
  };

  // 토큰 재발급
  const refreshTokens = async (): Promise<boolean> => {
    if (!tokens?.refreshToken) {
      console.log('Refresh Token이 없습니다.');
      return false;
    }

    if (isRefreshing) {
      console.log('이미 토큰 재발급 중입니다.');
      return false;
    }

    setIsRefreshing(true);
    try {
      console.log('토큰 재발급 요청 중...');
      const response = await refreshTokenApi(tokens.refreshToken);
      
      if (response.isSuccess && response.result) {
        const newTokens: AuthTokens = {
          accessToken: response.result.accessToken,
          refreshToken: response.result.refreshToken,
        };
        await saveTokens(newTokens);
        console.log('토큰 재발급 성공');
        return true;
      } else {
        console.error('토큰 재발급 실패:', response.message);
        // 재발급 실패 시 로그아웃 처리
        await clearTokens();
        return false;
      }
    } catch (error) {
      console.error('토큰 재발급 오류:', error);
      // 재발급 실패 시 로그아웃 처리
      await clearTokens();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      signupData, 
      updateSignupData, 
      resetSignupData,
      isLoggedIn,
      tokens,
      saveTokens,
      clearTokens,
      refreshTokens,
      isRefreshing,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
