import { Stack, router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: '',
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.6}
          >
            <View style={styles.arrow}>
              <Text style={styles.arrowText}>{'<'}</Text>
            </View>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="destinations" 
        options={{ 
          headerShown: true,
          title: '많이 찾는 여행지',
        }} 
      />
      <Stack.Screen 
        name="accommodation" 
        options={{ 
          headerShown: true,
          title: '숙박·항공',
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 12,
  },
  arrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 16,
  },
  arrowText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
