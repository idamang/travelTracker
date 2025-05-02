
import { useUser } from '@/context/useUser';
import { GET_PAST_TRAVELS_FROM_CURRENT_USER } from '@/service/queries';
import { Travel } from '@/service/types';
import { useQuery } from '@apollo/client';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import 'leaflet/dist/leaflet.css';
import { Circle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { GeoJSON, MapContainer } from 'react-leaflet';
import { WeatherDisplay } from '../components/WeatherDisplay';

const Maps: React.FC = () => {
  const { user } = useUser();
  const [geojson, setGeojson] = useState<Feature<
    Geometry,
    GeoJsonProperties
  > | null>(null);

  interface WeatherData {
    location: {
      name: string;
      region: string;
      country: string;
      lat: number;
      lon: number;
    };
    current: {
      temp_c: number;
      condition: {
        text: string;
        icon: string;
      };
    };
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    cca3: string;
  } | null>(null);

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_PAST_TRAVELS_FROM_CURRENT_USER);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}assets/map.json`
        );
        if (!response.ok) throw new Error('Failed to load GeoJSON file');

        const jsonData = await response.json();
        setGeojson(jsonData);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };

    fetchGeoJson();
  }, []);

  const fetchWeather = async (country: string, cca3: string) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=92f88a02d7674fd7aca202753242011&q=${country}`
      );
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const data = await response.json();
      setWeatherData(data);
      setSelectedCountry({ name: country, cca3 });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getColor = (countryCode: string | undefined): string => {
    const active_travel_country =
      userData?.getPastTravelsByCurrentUser?.active_travel?.country?.cca3 ||
      user?.country?.cca3;

    const past_travels =
      userData?.getPastTravelsByCurrentUser?.past_travels || [];
    if (!countryCode || !active_travel_country) return '#FFEDA0';
    if (countryCode === active_travel_country) return '#FF5733';
    if (
      past_travels.some((travel: Travel) => travel.country.cca3 === countryCode)
    )
      return '#33FF57';
    return '#FFEDA0';
  };

  const geojsonStyle = (
    feature: Feature<Geometry, GeoJsonProperties> | undefined
  ) => ({
    fillColor: feature?.properties?.ISO_A3
      ? getColor(feature.properties.ISO_A3)
      : '#FFEDA0',
    weight: 2,
    opacity: 1,
    color: '#4a4a2e',
    dashArray: '3',
    fillOpacity: 0.7,
  });

  const onCountryClick = (event: L.LeafletMouseEvent) => {
    const countryName = event.target.feature.properties.ADMIN;
    const cca3 = event.target.feature.properties.ISO_A3; // Assuming GeoJSON contains ISO_A3
    fetchWeather(countryName, cca3);
  };

  if (userLoading) return <p>Loading map...</p>;
  if (userError) return <p>Error loading user data.</p>;
  if (!user) return <p>You need to be logged in to view this page.</p>;

  return (
    <section className="container mx-auto p-2">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Interactive Map</h1>
        <p className="mt-4 text-lg mb-2 text-primary">
          View and explore travel locations on the interactive map. If you click
          on a country, you can see the current weather report.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Circle
              className="w-6 h-6 text-red-600 fill-red-600"
              aria-label="color red"
            />
            Currently active travel or your home country
          </li>
          <li className="flex items-center gap-2">
            <Circle
              className="w-6 h-6 text-green-600 fill-green-600"
              aria-label="color green"
            />
            Countries visited.
          </li>
        </ul>
      </header>

      <section className="h-[400px] md:h-[500px] lg:h-[500px] flex justify-center items-center rounded-lg shadow-md mt-8 border border-border relative">
        {geojson ? (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom
            style={{ height: '100%', width: '100%', borderRadius: '10px' }}
          >
            <GeoJSON
              data={geojson}
              style={geojsonStyle}
              onEachFeature={(_, layer) => {
                layer.on({ click: onCountryClick });
              }}
            />
          </MapContainer>
        ) : (
          <p className="text-muted-foreground">Loading map...</p>
        )}
        {weatherData && selectedCountry && (
          <WeatherDisplay
            weatherData={weatherData}
            selectedCountryName={selectedCountry.name}
            selectedCountryCca3={selectedCountry.cca3}
          />
        )}
      </section>
    </section>
  );
};

export default Maps;
