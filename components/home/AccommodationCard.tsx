import { ThemedText } from '@/components/shared/themed-text';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface AccommodationCardProps {
  title: string;
  tag: string;
  price: string;
  originalPrice?: string;
  date?: string;
  imageUrl: string;
  onPress: () => void;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ 
  title, 
  tag, 
  price, 
  originalPrice, 
  date, 
  imageUrl, 
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.tag}>{tag}</ThemedText>
        <ThemedText style={styles.price}>{price}</ThemedText>
        {originalPrice && (
          <ThemedText style={styles.originalPrice}>{originalPrice}</ThemedText>
        )}
        {date && (
          <ThemedText style={styles.date}>{date}</ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  tag: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 2,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  date: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
});