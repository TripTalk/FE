import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TravelPlanProvider } from '@/contexts/TravelPlanContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TravelPlanProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="ai-chat" options={{ headerShown: false }} />
          <Stack.Screen name="destinations" options={{ headerShown: true, title: '많이 찾는 여행지' }} />
          <Stack.Screen name="accommodation" options={{ headerShown: true, title: '숙박·항공' }} />
          <Stack.Screen name="travel/[id]" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TravelPlanProvider>
  );
}
