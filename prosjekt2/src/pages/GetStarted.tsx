import { useNavigate } from 'react-router-dom';
import { MapPinIcon, Map, Globe, User, LucideIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CardSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  route: string;
}

function CardSection({
  title,
  description,
  icon: Icon,
  buttonText,
  route,
}: CardSectionProps) {
  const navigate = useNavigate();

  return (
    <Card className="w-full bg-card text-card-foreground border border-border">
      <CardHeader className="flex items-center gap-2">
        <CardTitle className="text-xl flex gap-2 font-semibold">
          <Icon className="text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
        <Button
          className="w-full mt-4 bg-tertiary text-tertiary-foreground hover:bg-tertiary/90"
          onClick={() => navigate(route)} // Naviger til riktig side
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">
          Welcome to TravelTracker
        </h1>
        <p className="text-lg text-secondary-foreground mt-2">
          Your personal travel companion for planning, tracking, and remembering
          your adventures.
        </p>
      </section>

      <Card className="w-full max-w-3xl mb-8 bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            Get started with TravelTracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-muted-foreground mb-4">
            TravelTracker helps you keep track of all your journeys, discover
            new destinations, and share your experiences. Here's how to get
            started:
          </CardDescription>
          <ol className="list-decimal list-inside space-y-2 text-foreground">
            <li>Create your profile and add past trips</li>
            <li>Explore the world map to discover new destinations</li>
            <li>Plan your next journey with our tools</li>
            <li>Share your travel experiences with friends and family</li>
          </ol>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-4 w-full max-w-3xl">
        <CardSection
          title="My travels"
          description="Keep track of your past, present, and future trips. Add photos, notes, and memories for each destination."
          icon={MapPinIcon}
          buttonText="Go to My Travels"
          route="/mytravels"
        />
        <CardSection
          title="Map"
          description="Visualize your travels on an interactive world map. Discover new destinations and plan your future adventures."
          icon={Map}
          buttonText="Go to Map"
          route="/maps"
        />
        <CardSection
          title="Explore"
          description="Discover exciting travel destinations and get inspiration for your next adventure."
          icon={Globe}
          buttonText="Go to Explore"
          route="/"
        />
        <CardSection
          title="Profile"
          description="Manage your profile, travel preferences, and personal settings."
          icon={User}
          buttonText="Go to Profile"
          route="/profile"
        />
      </section>
    </div>
  );
}
