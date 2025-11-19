import { ThemedText } from '@/components/shared/themed-text';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CollapsibleThemeProps {
  title: string;
  children: React.ReactNode;
  isInitiallyExpanded?: boolean;
}

export function CollapsibleTheme({ 
  title, 
  children, 
  isInitiallyExpanded = false 
}: CollapsibleThemeProps) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        <View style={styles.chevron}>
          <ThemedText style={styles.chevronText}>
            {isExpanded ? '⌄' : '⌃'}
          </ThemedText>
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  chevron: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
});