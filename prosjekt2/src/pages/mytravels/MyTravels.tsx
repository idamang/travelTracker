import defaultImg from '@/assets/images/image_not_found.jpg';
import TripsCard from '@/components/MyTripsCard';
import Pagination from '@/components/Pagination';
import Trip from '@/components/TripCard';
import { GET_TRAVELS_FROM_CURRENT_USER } from '@/service/queries';
import { Travel } from '@/service/types';
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
;

const MyTravels: React.FC = () => {
  const location = useLocation();
  const initialSwitchState = location.state?.showUpcoming || false;
  const [isSwitchOn, setIsSwitchOn] = useState(initialSwitchState);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedTrips, setDisplayedTrips] = useState<Travel[]>([]);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<{
    getTravelsByCurrentUser: Travel[];
  }>(GET_TRAVELS_FROM_CURRENT_USER, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data) {
      const trips = data.getTravelsByCurrentUser || [];
      const currentDate = new Date();

      const filteredTrips = isSwitchOn
        ? trips.filter((trip) => new Date(trip.start_date) > currentDate)
        : trips.filter((trip) => new Date(trip.end_date) < currentDate);

      const sortedTrips = filteredTrips.sort((a, b) => {
        if (isSwitchOn) {
          return (
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          );
        } else {
          return (
            new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
          );
        }
      });

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setDisplayedTrips(sortedTrips.slice(startIndex, endIndex));
    }
  }, [data, isSwitchOn, currentPage]);

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>Error loading trips: {error.message}</p>;

  const trips = data?.getTravelsByCurrentUser || [];
  const currentDate = new Date();

  const filteredTrips = isSwitchOn
    ? trips.filter((trip) => new Date(trip.start_date) > currentDate)
    : trips.filter((trip) => new Date(trip.end_date) < currentDate);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

  const handleSwitchChange = () => {
    const newSwitchState = !isSwitchOn;
    setIsSwitchOn(newSwitchState);
    setCurrentPage(1);

    navigate(location.pathname, {
      state: { showUpcoming: newSwitchState },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTripClick = (id: number) => {
    navigate(`/mytravels/${id}`);
  };

  return (
    <div className="container mx-auto self-start">
      {/* Filter by Upcoming or Past Trips */}
      <TripsCard isSwitchOn={isSwitchOn} onSwitchChange={handleSwitchChange} />
      {displayedTrips.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 justify-items-center">
          {displayedTrips.map((trip) => (
            <article
              key={trip.id}
              onClick={() => handleTripClick(trip.id)}
              className="cursor-pointer"
            >
              <Trip
                country={trip.country.country_name}
                image={trip.country.image_url || defaultImg}
                date={`${trip.start_date} - ${trip.end_date}`}
              />
            </article>
          ))}
        </section>
      ) : (
        <p className="m-4">You don't seem to have any logged travels.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isSmallScreen={window.innerWidth < 640}
        />
      )}
    </div>
  );
};

export default MyTravels;
