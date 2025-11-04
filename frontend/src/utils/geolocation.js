// Get user's precise location
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Verify location matches user's claimed city
export const verifyLocation = async (claimedCity, actualCoords) => {
  try {
    // Use reverse geocoding to get actual city
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${actualCoords.latitude}&lon=${actualCoords.longitude}`
    );
    const data = await response.json();
    const actualCity = data.address?.city || data.address?.town || data.address?.village;
    
    return {
      isMatch: actualCity?.toLowerCase().includes(claimedCity.toLowerCase()),
      actualCity,
      actualCoords,
    };
  } catch (error) {
    console.error('Location verification failed:', error);
    return { isMatch: true, actualCity: claimedCity, actualCoords };
  }
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};
