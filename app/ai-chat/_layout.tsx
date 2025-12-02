import { Stack } from 'expo-router';

export default function AIChatLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="plan-trip-step1" 
        options={{ 
          headerShown: true,
          title: '여행 계획하기',
          headerBackTitle: '뒤로',
        }} 
      />
      <Stack.Screen 
        name="plan-trip-step2" 
        options={{ 
          headerShown: true,
          title: '여행 계획하기',
          headerBackTitle: '뒤로',
        }} 
      />
      <Stack.Screen 
        name="plan-trip-step3" 
        options={{ 
          headerShown: true,
          title: '여행 계획하기',
          headerBackTitle: '뒤로',
        }} 
      />
      <Stack.Screen 
        name="plan-trip-step4" 
        options={{ 
          headerShown: true,
          title: '여행 계획하기',
          headerBackTitle: '뒤로',
        }} 
      />
      <Stack.Screen 
        name="plan-trip-step5" 
        options={{ 
          headerShown: true,
          title: '여행 계획하기',
          headerBackTitle: '뒤로',
        }} 
      />
      <Stack.Screen 
        name="chat" 
        options={{ 
          headerShown: true,
          title: 'AI 여행 플래너',
          headerBackTitle: '뒤로',
        }} 
      />
    </Stack>
  );
}
