import axios from 'axios';

/**
 * NASA POWER API Service
 * Endpoint: Climatology (long-term averages)
 * Community: RE (Renewable Energy)
 */
const NASA_BASE_URL = 'https://power.larc.nasa.gov/api/temporal/climatology/point';
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Fetch solar climatology data from NASA
 */
export const fetchNasaSolarData = async (lat, lon) => {
  try {
    const response = await axios.get(NASA_BASE_URL, {
      params: {
        parameters: 'ALLSKY_SFC_SW_DWN,T2M,WS2M',
        community: 'RE',
        longitude: lon,
        latitude: lat,
        format: 'JSON',
      },
    });

    const data = response.data?.properties?.parameter;
    
    if (!data) throw new Error('Invalid data format from NASA API');

    const ghi = data['ALLSKY_SFC_SW_DWN']?.ANN || 0;
    const temp = data['T2M']?.ANN || 0;
    const wind = data['WS2M']?.ANN || 0;

    return {
      ghi: Number(ghi.toFixed(2)),
      temp: Number(temp.toFixed(1)),
      wind: Number((wind * 3.6).toFixed(1)), // m/s to km/h
      lat,
      lon
    };
  } catch (error) {
    console.error('NASA POWER API Error:', error);
    throw error;
  }
};

/**
 * Reverse Geocode coordinates to Address (City, State)
 */
export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(NOMINATIM_BASE_URL, {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1,
        'accept-language': 'en'
      },
      headers: {
        'User-Agent': 'SolarVista/1.0'
      }
    });

    const address = response.data?.address;
    if (!address) return { city: 'Unknown Location', state: '' };

    const city = address.city || address.town || address.village || address.suburb || address.district || 'Unknown City';
    const state = address.state || '';

    return { city, state };
  } catch (error) {
    console.error('Geocoding Error:', error);
    return { city: 'Unknown Location', state: '' };
  }
};
