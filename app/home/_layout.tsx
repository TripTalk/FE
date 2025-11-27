import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="destinations" 
        options={{ 
          headerShown: true,
          title: '여행지',
          headerBackTitle: '뒤로',
        }} 
      />
      <Stack.Screen 
        name="accommodation" 
        options={{ 
          headerShown: true,
          title: '항공 & 숙박',
          headerBackTitle: '뒤로',
        }} 
      />
    </Stack>
  );
}
