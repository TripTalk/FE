import React, { createContext, ReactNode, useContext, useState } from 'react';

// 여행 계획 데이터 타입
export interface TravelPlanData {
  companions: string;      // step1: 동행자
  departure: string;       // step2: 출발지
  destination: string;     // step2: 여행지
  startDate: string;       // step3: 시작일
  endDate: string;         // step3: 종료일
  duration: string;        // step3: 여행 기간
  style: string[];         // step4: 여행 스타일
  budget: string;          // step5: 예산
}

interface TravelPlanContextType {
  travelPlan: TravelPlanData;
  updateTravelPlan: (data: Partial<TravelPlanData>) => void;
  resetTravelPlan: () => void;
}

const defaultTravelPlan: TravelPlanData = {
  companions: '',
  departure: '',
  destination: '',
  startDate: '',
  endDate: '',
  duration: '',
  style: [],
  budget: '',
};

const TravelPlanContext = createContext<TravelPlanContextType | undefined>(undefined);

export function TravelPlanProvider({ children }: { children: ReactNode }) {
  const [travelPlan, setTravelPlan] = useState<TravelPlanData>(defaultTravelPlan);

  const updateTravelPlan = (data: Partial<TravelPlanData>) => {
    setTravelPlan(prev => ({ ...prev, ...data }));
  };

  const resetTravelPlan = () => {
    setTravelPlan(defaultTravelPlan);
  };

  return (
    <TravelPlanContext.Provider value={{ travelPlan, updateTravelPlan, resetTravelPlan }}>
      {children}
    </TravelPlanContext.Provider>
  );
}

export function useTravelPlan() {
  const context = useContext(TravelPlanContext);
  if (!context) {
    throw new Error('useTravelPlan must be used within a TravelPlanProvider');
  }
  return context;
}
