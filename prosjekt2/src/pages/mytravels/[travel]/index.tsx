import OtherTrips from '@/components/OtherTrips';
import TripOverview from '@/components/TripOverview';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TripDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-screen-lg py-8">
      {/* Tilbake-knapp */}
      <Button
        onClick={() => navigate('/mytravels')}
        className="mb-6 bg-tertiary text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to your travels
      </Button>

      {/* Flex-oppsett for responsiv layout */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-6">
        {/* Venstre kolonne for hovedinnhold */}
        <div className="w-full lg:w-3/5 mb-6 lg:mb-0">
          <TripOverview />
        </div>

        {/* Høyre kolonne for andre reiser */}
        <div className="w-full lg:w-2/5">
          <OtherTrips />
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
