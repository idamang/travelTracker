import defaultImg from '@/assets/images/image_not_found.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UPDATE_TRAVEL } from '@/service/mutations';
import { GET_TRAVEL_BY_ID } from '@/service/queries';
import { useMutation, useQuery } from '@apollo/client';
import { isAfter } from 'date-fns';
import { Calendar, Edit, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Badge } from './ui/badge';

interface TravelData {
  id: string;
  start_date: string;
  end_date: string;
  image_url: string | null;
  description: string | null;
  country: {
    country_name: string;
    image_url: string | null;
  };
}

export default function TripOverview() {
  const location = useLocation();
  const travelId = location.pathname.split('/').pop(); // Hent den siste delen av URL-en som ID

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [tripDescription, setTripDescription] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [isError, setIsError] = useState<boolean>(false);

  // Apollo mutation for updating travel
  const [updateTravel] = useMutation(UPDATE_TRAVEL, {
    onCompleted: () => {
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating travel:', error);
      alert('Could not update travel');
    },
  });

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  // Fetch travel data using GET_TRAVEL_BY_ID query with travelId
  const { loading, error, data } = useQuery<{ getTravelById: TravelData }>(
    GET_TRAVEL_BY_ID,
    {
      variables: { id: travelId },
    }
  );

  useEffect(() => {
    if (data && data.getTravelById) {
      const travel = data.getTravelById;
      setStartDate(travel.start_date);
      setEndDate(travel.end_date);
      setTripDescription(travel.description || '');
      setImage(travel.image_url || travel.country.image_url || defaultImg);
      setCountryName(travel.country.country_name);
    }
  }, [data]);

  if (loading) return <p>Loading trip details...</p>;
  if (error) return <p>Error loading trip details: {error.message}</p>;

  // Beregn om turen er "Upcoming" eller "Past"
  const currentDate = new Date();
  const tripEndDate = new Date(endDate);
  const tripStatus = tripEndDate > currentDate ? 'Upcoming' : 'Past';

  const handleSave = () => {
    if (isAfter(new Date(startDate), new Date(endDate))) {
      setConfirmationMessage('Start date must be before end date');
      setIsError(true);
      return;
    } else {
      setConfirmationMessage('Your trip has been saved successfully.');
      setIsError(false);
    }

    updateTravel({
      variables: {
        id: travelId,
        startDate,
        endDate,
        imageUrl: image || null,
        description: tripDescription,
      },
      refetchQueries: [
        { query: GET_TRAVEL_BY_ID, variables: { id: travelId } },
      ],
    });
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="h-auto rounded-md mb-4 flex justify-center items-center">
        {image ? (
          <img
            src={image}
            alt="Trip Image"
            className="h-full w-full rounded-md"
          />
        ) : (
          <span className="text-gray-500">Image Placeholder</span>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold" id="countryName">
            {countryName || 'Unknown Destination'}
          </CardTitle>
          {isEditing ? (
            <Button onClick={handleSave} className="ml-4">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          ) : (
            <Button onClick={toggleEditing} className="mt-2 sm:mt-0 sm:ml-4">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form className="space-y-2">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <label className="flex items-center space-x-2">Start date:</label>
              <Input
                aria-label="Start date, format: YYYY-MM-DD"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <label>End date:</label>
              <Input
                aria-label="End date, format: YYYY-MM-DD"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mt-4">
              <span>Image URL:</span>
              <Input
                type="text"
                value={image || ''}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL"
                className="w-full"
              />
            </div>
            <section className="mt-4">
              <label>Describe your trip:</label>
              <Textarea
                placeholder="How was your trip?"
                value={tripDescription}
                onChange={(e) => setTripDescription(e.target.value)}
                className="w-full"
              />
            </section>
          </form>
        ) : (
          <section className="space-y-2">
            <article className="flex items-center space-x-2 " id="startDate">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>Start date: {startDate}</span>
            </article>
            <article className="flex items-center space-x-2" id="endDate">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>End date: {endDate}</span>
            </article>
            {tripDescription && (
              <article className="mt-4" id="description">
                <span className="font-semibold">Trip description:</span>
                <p className="break-words overflow-hidden line-clamp-3">
                  {tripDescription}
                </p>
              </article>
            )}
          </section>
        )}
        {confirmationMessage && (
          <p className={`mt-2 ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {confirmationMessage}
          </p>
        )}

        <Badge
          className={`bg-${tripStatus === 'Upcoming' ? 'purple' : 'gray'}-100 text-${tripStatus === 'Upcoming' ? 'purple' : 'gray'}-700`}
        >
          {tripStatus}
        </Badge>
      </CardContent>
    </Card>
  );
}
