import { CalendarDays, Earth, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface StatusCardProps {
  user: {
    num_countries_visited: number;
    num_travels: number;
    travel_days: number;
  };
}

const StatusCard: React.FC<StatusCardProps> = ({ user }) => {
  const stats = [
    {
      label: 'Countries Visited',
      value: user.num_countries_visited,
      icon: <Earth className="w-8 h-8 text-tertiary" />,
    },
    {
      label: 'Total Trips',
      value: user.num_travels,
      icon: <MapPin className="w-8 h-8 text-tertiary" />,
    },
    {
      label: 'Travel Days',
      value: user.travel_days,
      icon: <CalendarDays className="w-8 h-8 text-tertiary" />,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-auto max-w-2xl mt-1">
      {stats.map((stat, idx) => (
        <Card
          key={idx}
          className="rounded-lg shadow-lg bg-card text-card-foreground"
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <figure className="mb-4">{stat.icon}</figure>
            <h2 className="text-lg font-semibold text-primary">{stat.label}</h2>
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default StatusCard;
