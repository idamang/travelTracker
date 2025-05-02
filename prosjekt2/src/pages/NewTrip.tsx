import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/useUser';
import { CREATE_TRAVEL } from '@/service/mutations';
import {
  GET_COUNTRIES,
  GET_TRAVELS_FROM_CURRENT_USER,
} from '@/service/queries';
import { Country } from '@/service/types';
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { isAfter } from 'date-fns';
import { Calendar, Save } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewTrip() {
  const { user } = useUser();
  const [startDate, setStartDate] = useState<string>('year-mm-dd');
  const [endDate, setEndDate] = useState<string>('year-mm-dd');
  const [tripDescription, setTripDescription] = useState<string>('');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [countryImage, setCountryImage] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string>('');
  const [debouncedCountryName, setDebouncedCountryName] = useState<string>('');
  const [countryId, setCountryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<Country[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const navigate = useNavigate();

  const [getCountries] = useLazyQuery(GET_COUNTRIES, {
    onCompleted: (data) =>
      setSearchResults(data.getCountriesPaginated.countries),
  });

  const [createTravel] = useMutation(CREATE_TRAVEL);

  // Debounce-effekt
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCountryName(countryName);
    }, 300);

    return () => clearTimeout(timer);
  }, [countryName]);

  useEffect(() => {
    if (debouncedCountryName) {
      getCountries({
        variables: {
          page: 1,
          pageSize: 5,
          orderBy: 'country_name',
          search: debouncedCountryName,
          ascOrDesc: 'asc',
        },
      });
    } else {
      setSearchResults([]);
    }
  }, [debouncedCountryName, getCountries]);

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    // Validate the URL to ensure it's a proper image link
    const imagePattern = /\.(jpeg|jpg|gif|png|webp)$/i;
    if (url && imagePattern.test(url)) {
      setUserImage(url);
    } else {
      setUserImage(null);
    }
  };

  const handleSave = async () => {
    if (loading) return;

    setLoading(true);
    setIsError(false); // Nullstill feiltilstanden
    setConfirmationMessage(null); // Nullstill meldinger

    try {
      if (isAfter(new Date(startDate), new Date(endDate))) {
        setConfirmationMessage('Start date must be before end date');
        setIsError(true);
        setLoading(false);
        return;
      }

      if (!countryId) {
        setConfirmationMessage('Please select a valid country');
        setIsError(true);
        setLoading(false);
        return;
      }

      const isFutureTrip = isAfter(new Date(startDate), new Date());

      await createTravel({
        variables: {
          userId: user?.id ?? '',
          countryId,
          startDate,
          endDate,
          imageUrl: userImage,
          description: tripDescription,
        },
        refetchQueries: [{ query: GET_TRAVELS_FROM_CURRENT_USER }],
      });

      setConfirmationMessage('Your trip is now added to My Travels');
      setIsError(false);

      setTimeout(() => {
        setConfirmationMessage(null);
        navigate('/mytravels', { state: { showUpcoming: isFutureTrip } });
      }, 2000);
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error('Error creating travel:', error.message);
        setConfirmationMessage(`Error saving trip: ${error.message}`);
      } else {
        console.error('Unexpected error:', error);
        setConfirmationMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Sørg for at "loading" alltid nullstilles
    }
  };

  const handleCountryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountryName(value);
    setActiveIndex(-1);
  };

  const handleCountrySelect = (
    countryName: string,
    imageUrl: string,
    countryId: number
  ) => {
    setCountryName(countryName);
    setCountryImage(imageUrl);
    setCountryId(countryId);
    setSearchResults([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length > 0) {
      if (e.key === 'ArrowDown') {
        setActiveIndex((prevIndex) => (prevIndex + 1) % searchResults.length);
      } else if (e.key === 'ArrowUp') {
        setActiveIndex((prevIndex) =>
          prevIndex === 0 ? searchResults.length - 1 : prevIndex - 1
        );
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        const selectedCountry = searchResults[activeIndex];
        handleCountrySelect(
          selectedCountry.country_name,
          selectedCountry.image_url || '',
          selectedCountry.id
        );
        setIsFocused(false);
      }
    }
  };

  const displayedImage = userImage || countryImage;

  return (
    <Card className="w-full sm:w-2/3 lg:w-1/3 mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-card text-card-foreground">
      <CardHeader className="h-40 bg-background m-4 rounded-md mb-4 flex items-center justify-center">
        {displayedImage ? (
          <img
            src={displayedImage}
            alt="Trip Image"
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <span className="text-muted-foreground">Image Placeholder</span>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Register a new trip
        </CardTitle>

        <div className="space-y-2 relative">
          <span>Country:</span>
          <Input
            type="text"
            value={countryName}
            onChange={handleCountryChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
            placeholder="Search for a country"
            className="w-full border-muted"
          />
          {isFocused && searchResults.length > 0 && (
            <ul className="absolute bg-card text-card-foreground border w-full mt-1 max-h-48 overflow-y-auto z-10">
              {searchResults.map((result, index) => (
                <li
                  key={result.id}
                  onClick={() => {
                    handleCountrySelect(
                      result.country_name,
                      result.image_url || '',
                      result.id
                    );
                  }}
                  className={`p-2 cursor-pointer ${
                    activeIndex === index
                      ? 'bg-accent text-accent-foreground'
                      : ''
                  }`}
                >
                  {result.country_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>Start date:</span>
            <Input
              aria-label="Start date, format: YYYY-MM-DD"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-muted"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>End date:</span>
            <Input
              aria-label="End date, format: YYYY-MM-DD"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-muted"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <span>Image URL:</span>
          <Input
            type="text"
            placeholder="Paste an image URL"
            value={userImage || ''}
            onChange={handleImageUrlChange}
            className="w-full border-muted"
          />
        </div>
        <div className="mt-4 space-y-2">
          <span>Describe your trip:</span>
          <Textarea
            placeholder="How was your trip?"
            value={tripDescription}
            onChange={(e) => setTripDescription(e.target.value)}
            className="w-full border-muted"
          />
        </div>

        <Button
          onClick={handleSave}
          className="mt-4 bg-tertiary hover:bg-hoverNav text-tertiary-foreground"
          disabled={loading}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Trip
        </Button>

        {confirmationMessage && (
          <p className={`mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {confirmationMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
