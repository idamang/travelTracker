import {
  GET_COUNTRIES,
  GET_TRAVELS_FROM_CURRENT_USER,
} from '@/service/queries';
import { useQuery } from '@apollo/client';
import { MapPin } from 'lucide-react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface Country {
  id: number;
  country_name: string;
  cca3: string;
}

interface Travel {
  id: string;
  start_date: string;
  end_date: string;
  country: {
    country_name: string;
  };
}

interface Destination {
  name: string;
  link: string;
  start_date?: string;
  end_date?: string;
}

interface GetCountriesResponse {
  getCountriesPaginated: {
    countries: Country[];
  };
}

interface GetTravelsResponse {
  getTravelsByCurrentUser: Travel[];
}

const OtherTrips: React.FC = () => {
  const location = useLocation();
  const isMyTravels = location.pathname.includes('/mytravels/');

  const {
    data: travelsData,
    loading: travelsLoading,
    error: travelsError,
  } = useQuery<GetTravelsResponse>(GET_TRAVELS_FROM_CURRENT_USER, {
    skip: !isMyTravels,
  });

  const {
    data: countriesData,
    loading: countriesLoading,
    error: countriesError,
  } = useQuery<GetCountriesResponse>(GET_COUNTRIES, {
    variables: {
      page: 1,
      pageSize: 10,
      orderBy: 'tourism',
      search: '',
      ascOrDesc: 'desc',
    },
    skip: isMyTravels,
  });

  if (travelsLoading || countriesLoading) return <p>Loading...</p>;
  if (travelsError || countriesError) return <p>Error loading data</p>;

  const userTravels = travelsData?.getTravelsByCurrentUser || [];
  const randomCountries = countriesData?.getCountriesPaginated.countries || [];

  const destinations: Destination[] = isMyTravels
    ? userTravels.slice(0, 10).map((trip) => ({
        name: trip.country.country_name,
        link: `/project2/mytravels/${trip.id}`,
        start_date: trip.start_date,
        end_date: trip.end_date,
      }))
    : randomCountries.map((country) => ({
        name: country.country_name,
        link: `/project2/${country.cca3.toLowerCase()}`,
      }));

  return (
    <Card className="w-full mx-auto m:max-w-xs border border-border bg-card rounded-lg shadow-md">
      <CardHeader className="p-4">
        <CardTitle className="text-primary">
          {isMyTravels ? 'Your Trips' : 'Explore Other Destinations'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {isMyTravels
            ? 'Select a trip to view details'
            : 'Discover destinations sorted by tourism popularity'}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto p-1 space-y-2">
        <ul>
          {destinations.map((destination) => (
            <li key={destination.name}>
              <a
                href={destination.link}
                className="flex flex-col w-full text-left hover:bg-secondary hover:text-secondary-foreground transition-colors duration-200 rounded-lg p-2"
                aria-label={`View details for ${destination.name}`}
              >
                <div className="flex items-center">
                  <MapPin className="mr-2 w-4 h-4 text-primary" />
                  <span className="font-semibold">{destination.name}</span>
                </div>
                {isMyTravels && (
                  <div className="text-muted-foreground text-sm mt-1">
                    {destination.start_date} - {destination.end_date}
                  </div>
                )}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default OtherTrips;
