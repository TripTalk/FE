import { Stack } from 'expo-router';

export default function MypageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: '뒤로',
        headerTintColor: '#4ECDC4',
      }}
    >
      {/* 마이페이지 관련 화면들을 여기에 추가 */}
    </Stack>
  );
}
