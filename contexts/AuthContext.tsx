import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

  return (
    <AuthContext.Provider value={{ 
      signupData, 
      updateSignupData, 
      resetSignupData,
      isLoggedIn,
      tokens,
      saveTokens,
      clearTokens,
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
