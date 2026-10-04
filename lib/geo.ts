import prisma from './prisma';

// Restaurant coordinates in Thagarapuvalasa, Andhra Pradesh
export const RESTAURANT_COORDINATES = {
  lat: 17.9288,
  lng: 83.4350,
  address: 'NH16 National Highway, Opposite Sangivalasa Bus Stop, Thagarapuvalasa, AP 531162',
};

// Haversine formula to calculate great-circle distance in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

export interface ServiceabilityResult {
  isServiceable: boolean;
  distanceKm: number;
  deliveryFee: number;
  estimatedDeliveryMin: number;
  zoneName: string;
  reason?: string;
  freeDeliveryThreshold: number;
}

export async function checkDeliveryServiceability(
  destLat: number,
  destLng: number,
  orderSubtotal: number = 0
): Promise<ServiceabilityResult> {
  const restaurant = await prisma.restaurant.findFirst();
  const restLat = restaurant?.latitude ?? RESTAURANT_COORDINATES.lat;
  const restLng = restaurant?.longitude ?? RESTAURANT_COORDINATES.lng;
  const maxRadiusKm = restaurant?.deliveryRadiusKm ?? 15.0;
  const freeThreshold = restaurant?.freeDeliveryThreshold ?? 599.0;
  const basePrepMin = restaurant?.estimatedPrepTimeMin ?? 25;

  const distanceKm = calculateDistanceKm(restLat, restLng, destLat, destLng);

  if (distanceKm > maxRadiusKm) {
    return {
      isServiceable: false,
      distanceKm,
      deliveryFee: 0,
      estimatedDeliveryMin: 0,
      zoneName: 'Out of Delivery Range',
      reason: `Sorry, Arabian Mandi currently delivers within a ${maxRadiusKm} km radius of Thagarapuvalasa. Your location is ${distanceKm} km away.`,
      freeDeliveryThreshold: freeThreshold,
    };
  }

  // Fetch active zones sorted by min distance
  const zones = await prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { minDistanceKm: 'asc' },
  });

  let matchedZone = zones.find(
    (z) => distanceKm >= z.minDistanceKm && distanceKm <= z.maxDistanceKm
  );

  let deliveryFee = matchedZone ? matchedZone.deliveryFee : 40.0;
  let transitMin = matchedZone ? matchedZone.estimatedTimeMin : Math.ceil(distanceKm * 3.5) + 15;
  const zoneName = matchedZone ? matchedZone.name : `Within ${maxRadiusKm} km`;

  // Free delivery check
  if (orderSubtotal >= freeThreshold) {
    deliveryFee = 0;
  }

  return {
    isServiceable: true,
    distanceKm,
    deliveryFee,
    estimatedDeliveryMin: basePrepMin + transitMin,
    zoneName,
    freeDeliveryThreshold: freeThreshold,
  };
}
