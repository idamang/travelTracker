import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Country, User } from '@/service/types';
import { Star } from 'lucide-react';
import defaultImg from '../assets/images/image_not_found.jpg';
import StarRating from '@/components/StarRating';

export default function ExploreOverview({
  country,
  user,
}: {
  country: Country;
  user?: User;
}) {
  console.log('User:', user);
  return (
    <Card className="w-full mx-auto bg-card text-card-foreground border border-border shadow-md rounded-lg">
      <CardHeader className="overflow-hidden rounded-t-lg">
        <img
          src={country?.image_url || defaultImg}
          alt={country?.country_name || 'Country'}
          className="h-48 w-full object-cover"
        />
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="flex flex-row flex-wrap items-center gap-2">
          <div className="flex flex-row items-center gap-2">
            <CardTitle className="text-2xl font-bold text-primary">
              {country?.country_name || 'Unknown Country'}
            </CardTitle>
            {country?.average_rating !== 0 && (
              <div
                className="flex items-center text-sm text-muted-foreground gap-1 font-medium"
                aria-label={`Rating: ${country?.average_rating?.toFixed(1)}`}
              >
                <Star
                  className="w-4 h-4 fill-yellow-500 text-yellow-500"
                  aria-hidden="true"
                />
                <p>{country?.average_rating?.toFixed(1)}</p>
              </div>
            )}
          </div>

          <div className="ml-auto w-full max-w-full flex-row justify-end gap-2 sm:flex sm:w-auto">
            {user && <StarRating country={country} />}
          </div>
        </div>

        <CardDescription className="text-muted-foreground leading-relaxed">
          <span className="font-bold text-foreground">Continent:</span>{' '}
          {country?.continent || 'Unknown Continent'} <br />
          <span className="font-bold text-foreground">Languages:</span>{' '}
          {country?.official_language || 'Unknown Language'} <br />
          <span className="font-bold text-foreground">Population:</span>{' '}
          {country?.population || 'Unknown'} <br />
          <span className="font-bold text-foreground">Currency:</span>{' '}
          {country?.currency || 'Unknown'}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
