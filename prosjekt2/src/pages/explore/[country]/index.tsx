import CommentThread from '@/components/Comments';
import ExploreOverview from '@/components/ExploreOverview';
import OtherTrips from '@/components/OtherTrips';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/useUser';
import { GET_COUNTRY_BY_CCA3 } from '@/service/queries';
import { Country } from '@/service/types';
import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';

const CountryPage = () => {
  const { city } = useParams<{ city: string }>();
  const { user } = useUser();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_COUNTRY_BY_CCA3, {
    variables: { cca3: city },
  });

  if (loading) return <p>Loading...</p>;
  if (error)
    return <p>Error loading city: {error.message || 'Unknown error'}</p>;

  if (!data || !data.getCountryByCca3) {
    return <p>City not found</p>;
  }

  const country: Country = data.getCountryByCca3;

  return (
    <div className="container mx-auto max-w-screen-lg py-8">
      <Button
        onClick={() => navigate('/')}
        className="mb-6 bg-tertiary text-black px-4 py-2 rounded hover:bg-tertiary/80 transition-colors"
      >
        ← Back to Explore
      </Button>

      <div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-6">
        <div className="w-full lg:w-3/5 mb-6 lg:mb-0">
          <ExploreOverview country={country} user={user ?? undefined} />

          <CommentThread countryId={country.id} user={user ?? undefined} />
        </div>

        <div className="w-full lg:w-2/5">
          <OtherTrips />
        </div>
      </div>
    </div>
  );
};

export default CountryPage;
