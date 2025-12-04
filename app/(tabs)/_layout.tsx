import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/shared/haptic-tab';
import { IconSymbol } from '@/components/shared/ui/icon-symbol'; // ⭐️ 사용자님의 아이콘 컴포넌트
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint,
        tabBarInactiveTintColor: '#8e8e93',
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          href: '/',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'house.fill' : 'house'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '저장소',
          href: '/explore',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'folder.fill' : 'folder'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Mypage"
        options={{
          title: '마이페이지',
          href: '/Mypage',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'person.fill' : 'person'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}


