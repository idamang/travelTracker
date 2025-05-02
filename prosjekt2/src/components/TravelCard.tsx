import { Country } from '@/service/types';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';

interface TravelCardProps {
  country: Country;
  image: string;
  tags: string;
}

export default function TravelCard({ country, image, tags }: TravelCardProps) {
  return (
    <Card className="m-4 w-64 h-80 shadow-md text-primary bg-secondary">
      <figure className="w-full h-40 overflow-hidden">
        <img
          src={image}
          alt={`Scenic view of ${country.country_name}`} //
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          className="rounded-t-lg"
        />
      </figure>
      <CardContent className="p-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold truncate">{`${country.country_name}`}</h2>
          {country.average_rating !== 0 && (
            <label className="flex items-center text-sm gap-1 font-medium text-primary space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              {(country.average_rating ?? 0).toFixed(1)}
            </label>
          )}
        </header>
        <label className="block text-primary text-gray-500 mt-2 truncate">
          {tags}
        </label>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          className="w-full bg-tertiary text-black hover:bg-tertiary/80"
          aria-label={`Explore details about ${country}`}
        >
          Explore
        </Button>
      </CardFooter>
    </Card>
  );
}
