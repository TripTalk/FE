import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface DestinationListCardProps {
  title: string;
  subtitle: string;
  viewCount: string;
  tags: string[];
  imageUrl: string;
  onPress: () => void;
}

export function DestinationListCard({
  title,
  subtitle,
  viewCount,
  tags,
  imageUrl,
  onPress,
}: DestinationListCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.viewCount}>조회량 {viewCount}</ThemedText>
        </View>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <ThemedText style={styles.tagText}>#{tag}</ThemedText>
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.detailButton}>
          <ThemedText style={styles.detailButtonText}>여행 계획 세우기</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  viewCount: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  detailButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});