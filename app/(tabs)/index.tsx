import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccommodationCard } from '@/components/home/AccommodationCard';
import { AIBanner } from '@/components/home/AIBanner';
import { DestinationCard } from '@/components/home/DestinationCard';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { Accommodation, Flight, getAccommodations, getFlights, getTripPlaces, TripPlace } from '@/services/api';

export default function HomeScreen() {
  const { tokens } = useAuth();
  const [popularDestinations, setPopularDestinations] = React.useState<TripPlace[]>([]);
  const [isLoadingDest, setIsLoadingDest] = React.useState(false);
  const [previewFlights, setPreviewFlights] = React.useState<Flight[]>([]);
  const [previewAccommodations, setPreviewAccommodations] = React.useState<Accommodation[]>([]);

  React.useEffect(() => {
    const fetchPopular = async () => {
      setIsLoadingDest(true);
      try {
        const accessToken = tokens?.accessToken;
        const response = await getTripPlaces(undefined, null, accessToken);
        if (response.isSuccess && response.result) {
          setPopularDestinations(response.result.tripPlaceList.slice(0, 10)); // 최대 10개만
        }
      } catch (e) {
        setPopularDestinations([]);
      } finally {
        setIsLoadingDest(false);
      }
    };
    fetchPopular();
  }, [tokens]);

  // preview flights & accommodations for home cards
  React.useEffect(() => {
    const fetchPreviews = async () => {
      try {
        const accessToken = tokens?.accessToken;
        const flightsRes = await getFlights(undefined, accessToken);
        const accRes = await getAccommodations(undefined, accessToken);
        const flights = flightsRes?.result?.flightList || [];
        const accs = accRes?.result?.accommodationList || [];
        setPreviewFlights(flights.slice(0, 2));
        setPreviewAccommodations(accs.slice(0, 2));
      } catch (err) {
        setPreviewFlights([]);
        setPreviewAccommodations([]);
      }
    };
    fetchPreviews();
  }, [tokens]);

  const handleTravelPress = (id: string) => {
    router.push(`/travel/${id}`);
  };

  const handleDestinationPress = () => {
    router.push('/home/destinations');
  };

  const handleAccommodationPress = () => {
    router.push('/home/accommodation');
  };

  const handlePlanTripPress = () => {
    router.push('/ai-chat/plan-trip-step1');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.appTitle}>Triptalk</ThemedText>
      </ThemedView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Banner */}
        <AIBanner onPress={handlePlanTripPress} />

        {/* 많이 찾는 여행지 Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.sectionHeaderContainer}
            onPress={handleDestinationPress}
          >
            <ThemedText style={styles.sectionTitle}>많이 찾는 여행지</ThemedText>
            <View style={styles.arrow}>
              <ThemedText style={styles.arrowText}>{'>'}</ThemedText>
            </View>
          </TouchableOpacity>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {isLoadingDest ? (
              <View style={{ padding: 24 }}><ThemedText>로딩 중...</ThemedText></View>
            ) : (
              popularDestinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  title={dest.region}
                  subtitle={dest.description}
                  imageUrl={dest.imgUrl}
                  onPress={() => handleTravelPress(dest.id.toString())}
                />
              ))
            )}
          </ScrollView>
        </View>

        {/* 숙박·항공 Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.sectionHeaderContainer}
            onPress={handleAccommodationPress}
          >
            <ThemedText style={styles.sectionTitle}>숙박·항공</ThemedText>
            <View style={styles.arrow}>
              <ThemedText style={styles.arrowText}>{'>'}</ThemedText>
            </View>
          </TouchableOpacity>
          
          <View style={styles.accommodationGrid}>
            <View style={styles.accommodationRow}>
              {previewAccommodations[0] ? (
                <AccommodationCard
                  title={previewAccommodations[0].hotelName ?? previewAccommodations[0].name}
                  tag={previewAccommodations[0].cityName ?? previewAccommodations[0].location ?? '숙박'}
                  price={previewAccommodations[0].pricePerNight ? `${previewAccommodations[0].pricePerNight.toLocaleString()}원/박` : `${previewAccommodations[0].price?.toLocaleString() ?? '요금 없음'}`}
                  imageUrl={previewAccommodations[0].imgUrl || previewAccommodations[0].imageUrl || ''}
                  onPress={handleAccommodationPress}
                />
              ) : (
                <AccommodationCard title="" tag="" price="" imageUrl="" />
              )}

              {previewFlights[0] ? (
                <AccommodationCard
                  title={`${previewFlights[0].originName ?? previewFlights[0].departure} → ${previewFlights[0].destinationName ?? previewFlights[0].destination}`}
                  tag={previewFlights[0].airlineName ?? previewFlights[0].airline ?? '항공'}
                  price={previewFlights[0].price ? `${previewFlights[0].price.toLocaleString()}원` : '요금 없음'}
                  imageUrl={previewFlights[0].imgUrl || previewFlights[0].imageUrl || ''}
                  onPress={handleAccommodationPress}
                />
              ) : (
                <AccommodationCard title="" tag="" price="" imageUrl="" />
              )}
            </View>
            <View style={styles.accommodationRow}>
              {previewAccommodations[1] ? (
                <AccommodationCard
                  title={previewAccommodations[1].hotelName ?? previewAccommodations[1].name}
                  tag={previewAccommodations[1].cityName ?? previewAccommodations[1].location ?? '숙박'}
                  price={previewAccommodations[1].pricePerNight ? `${previewAccommodations[1].pricePerNight.toLocaleString()}원/박` : `${previewAccommodations[1].price?.toLocaleString() ?? '요금 없음'}`}
                  imageUrl={previewAccommodations[1].imgUrl || previewAccommodations[1].imageUrl || ''}
                  onPress={handleAccommodationPress}
                />
              ) : (
                <AccommodationCard title="" tag="" price="" imageUrl="" />
              )}

              {previewFlights[1] ? (
                <AccommodationCard
                  title={`${previewFlights[1].originName ?? previewFlights[1].departure} → ${previewFlights[1].destinationName ?? previewFlights[1].destination}`}
                  tag={previewFlights[1].airlineName ?? previewFlights[1].airline ?? '항공'}
                  price={previewFlights[1].price ? `${previewFlights[1].price.toLocaleString()}원` : '요금 없음'}
                  imageUrl={previewFlights[1].imgUrl || previewFlights[1].imageUrl || ''}
                  onPress={handleAccommodationPress}
                />
              ) : (
                <AccommodationCard title="" tag="" price="" imageUrl="" />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#F8F9FA', // 홈화면 배경색과 동일하게
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  horizontalScrollContainer: {
    paddingRight: 16,
  },
  accommodationGrid: {
    gap: 8,
  },
  accommodationRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingRight: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  arrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: 16,
  },
  arrowText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});