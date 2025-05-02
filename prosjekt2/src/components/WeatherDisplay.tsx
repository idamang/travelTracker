import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface WeatherDisplayProps {
  weatherData: {
    current: {
      condition: {
        icon: string;
        text: string;
      };
      temp_c: number;
    };
  };
  selectedCountryName: string;
  selectedCountryCca3: string;
}

export function WeatherDisplay({
  weatherData,
  selectedCountryName,
  selectedCountryCca3,
}: WeatherDisplayProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${selectedCountryCca3.toLowerCase()}`);
  };

  return (
    <Card
      className="absolute top-2 right-2 z-[400] bg-secondary/80 backdrop-blur-sm shadow-lg rounded-md cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2 truncate">
          {selectedCountryName}
        </h2>
        <div className="flex items-center space-x-3">
          <img
            src={weatherData.current.condition.icon}
            alt="Weather Icon"
            className="w-12 h-12"
          />
          <div>
            <p className="text-xl font-bold">{weatherData.current.temp_c}°C</p>
            <p className="text-sm text-muted-foreground truncate">
              {weatherData.current.condition.text}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
