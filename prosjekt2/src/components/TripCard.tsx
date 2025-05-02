import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';

interface TripProps {
  country: string;
  image: string;
  date: string;
}

export default function Trip({ country, image, date }: TripProps) {
  return (
    <Card className="m-4 w-64 h-80 shadow-md text-primary bg-secondary">
      <figure className="w-full h-40 overflow-hidden rounded-t-3xl">
        <img
          src={image}
          alt={`Picture of trip or of ${country}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          className="p-2 rounded-3xl"
        />
      </figure>
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-1 truncate">{`${country}`}</h2>
        <p className="text-sm text-primary truncate">{`Visited: ${date}`}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button className="w-full bg-tertiary text-primary hover:bg-hoverNav">
          See trip
        </Button>
      </CardFooter>
    </Card>
  );
}
