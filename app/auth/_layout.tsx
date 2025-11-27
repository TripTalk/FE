import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="start" options={{ gestureEnabled: false }} />
      <Stack.Screen name="onboarding1" options={{ gestureEnabled: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup-step1" />
      <Stack.Screen name="signup-step2" />
      <Stack.Screen name="signup-step3" />
    </Stack>
  );
}
