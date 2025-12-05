import { Stack } from 'expo-router';

export default function MypageLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="edit-profile" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="badges" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="terms" 
        options={{ 
          headerShown: true,
          headerTitle: '이용약관',
          headerBackTitle: '뒤로',
          headerTintColor: '#4ECDC4',
        }} 
      />
      <Stack.Screen 
        name="privacy" 
        options={{ 
          headerShown: true,
          headerTitle: '개인정보처리방침',
          headerBackTitle: '뒤로',
          headerTintColor: '#4ECDC4',
        }} 
      />
      <Stack.Screen 
        name="app-info" 
        options={{ 
          headerShown: true,
          headerTitle: '앱 정보',
          headerBackTitle: '뒤로',
          headerTintColor: '#4ECDC4',
        }} 
      />
    </Stack>
  );
}
