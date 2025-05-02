import defaultImg from '@/assets/images/image_not_found.jpg';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar/SearchBar';
import TravelCard from '@/components/TravelCard';
import { GET_COUNTRIES } from '@/service/queries';
import { Country } from '@/service/types';
import { useQuery } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
;

const MAX_CACHE_SIZE = 5;
const DEBOUNCE_DELAY = 300;
const PAGE_SIZE = 12;

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cache = useRef<
    Map<
      string,
      { getCountriesPaginated: { countries: Country[]; totalPages: number } }
    >
  >(new Map());

  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem('currentPage') || '1')
  );
  const [searchTerm, setSearchTerm] = useState(
    sessionStorage.getItem('searchTerm') || ''
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [orderBy, setOrderBy] = useState(
    sessionStorage.getItem('orderBy') || 'tourism'
  );
  const [ascOrDesc, setAscOrDesc] = useState(
    sessionStorage.getItem('ascOrDesc') || 'desc'
  );
  const [cachedData, setCachedData] = useState<{
    getCountriesPaginated: { countries: Country[]; totalPages: number };
  } | null>(null);

  const cacheKey = `${debouncedSearchTerm}_${orderBy}_${ascOrDesc}_${currentPage}`;

  const { loading, error, data, refetch } = useQuery(GET_COUNTRIES, {
    skip: false, // Always allow fetching when needed
    variables: {
      page: currentPage,
      pageSize: PAGE_SIZE,
      orderBy,
      search: debouncedSearchTerm,
      ascOrDesc,
    },
    onCompleted: (fetchedData) => {
      if (orderBy === 'average_rating') {
        sessionStorage.setItem('ratingsChanged', 'false');
      }
      addToCache(cacheKey, fetchedData); // Add to cache
      setCachedData(fetchedData);
    },
  });

  useEffect(() => {
    const ratingsChanged =
      sessionStorage.getItem('ratingsChanged') === 'true' || false;
    if (ratingsChanged && orderBy === 'average_rating') {
      Array.from(cache.current.keys()).forEach((key) => {
        if (key.includes('average_rating')) {
          cache.current.delete(key);
        }
      });
      refetch();
    }
  }, [orderBy, refetch]);

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler); // Clear timeout if search term changes
    };
  }, [searchTerm]);

  // Handle navigation back
  useEffect(() => {
    if (location.state?.fromCountryPage) {
      refetch(); // Always refetch when navigating back
    }
  }, [location.state, refetch]);

  // Sync state with sessionStorage
  useEffect(() => {
    sessionStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    sessionStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('orderBy', orderBy);
  }, [orderBy]);

  useEffect(() => {
    sessionStorage.setItem('ascOrDesc', ascOrDesc);
  }, [ascOrDesc]);

  // Add data to cache
  const addToCache = (
    key: string,
    value: {
      getCountriesPaginated: { countries: Country[]; totalPages: number };
    }
  ) => {
    if (cache.current.has(key)) {
      cache.current.delete(key);
    }
    cache.current.set(key, value);

    if (cache.current.size > MAX_CACHE_SIZE) {
      const oldestKey = cache.current.keys().next().value;
      if (oldestKey) {
        cache.current.delete(oldestKey);
      }
    }
  };

  // Retrieve data from cache
  const getFromCache = (key: string) => {
    return cache.current.get(key) || null;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      setCachedData(cachedResult);
    } else {
      refetch();
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term); // Update raw search term
    setCurrentPage(1); // Reset to the first page
  };

  const handleSortChange = (newOrderBy: string) => {
    setOrderBy(newOrderBy);
    setCurrentPage(1);
    refetch(); // Always fetch on sort change
  };

  const handleSortOrderChange = (newAscOrDesc: string) => {
    setAscOrDesc(newAscOrDesc);
    setCurrentPage(1);
    refetch(); // Always fetch on sort order change
  };

  const handleCountryClick = (cca3: string) => {
    navigate(`/${cca3.split(' ')[0].toLowerCase()}`, {
      state: { fromCountryPage: true },
    });
  };

  const countries =
    cachedData?.getCountriesPaginated.countries ||
    data?.getCountriesPaginated.countries ||
    [];
  const totalPages =
    cachedData?.getCountriesPaginated.totalPages ||
    data?.getCountriesPaginated.totalPages ||
    1;

  if (error) return <p>Error loading countries!</p>;

  return (
    <section className="container overflow-x-hidden">
      <SearchBar
        searchTerm={searchTerm}
        orderBy={orderBy}
        ascOrDesc={ascOrDesc}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
      />
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 justify-items-center min-h-[410px]">
        {loading && !cachedData ? (
          <p>Loading...</p>
        ) : countries.length === 0 ? (
          <p>No countries found.</p>
        ) : (
          countries.map((country: Country) => (
            <article
              key={country.id}
              onClick={() => handleCountryClick(country.cca3)}
              className="cursor-pointer"
            >
              <TravelCard
                country={country}
                image={country.image_url || defaultImg}
                tags="Tourism, Culture, Adventure"
              />
            </article>
          ))
        )}
      </section>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isSmallScreen={window.innerWidth < 640}
        />
      )}
    </section>
  );
};

export default Explore;
