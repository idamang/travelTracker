import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

interface TripsCardProps {
  isSwitchOn: boolean;
  onSwitchChange: () => void;
}

export function TripsCard({ isSwitchOn, onSwitchChange }: TripsCardProps) {
  const navigate = useNavigate();
  const handleAddNewTrip = () => {
    navigate('/mytravels/newtrip');
  };

  return (
    <Card className="relative m-2 p-4 bg-card border border-border rounded-lg shadow sm:p-8">
      <h5 className="mb-2 sm:text-4xl font-bold text-primary">My travels</h5>
      <p className="mb-5 text-base text-primary sm:text-lg">
        See your travel history and plan your next adventure.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isSwitchOn}
            onCheckedChange={onSwitchChange}
            className="data-[state=checked]:bg-green-500"
            aria-checked={isSwitchOn}
            aria-label={
              isSwitchOn
                ? 'Showing all upcoming travels'
                : 'Showing past travels'
            }
          />

          <p className="text-primary sm:text-lg">
            {isSwitchOn
              ? 'Showing all upcoming travels'
              : 'Showing past travels'}
          </p>
        </div>

        <div className="flex sm:justify-end">
          <Button
            onClick={handleAddNewTrip}
            className="bg-tertiary text-tertiary-foreground hover:bg-tertiary/90"
          >
            Add New Trip
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default TripsCard;
