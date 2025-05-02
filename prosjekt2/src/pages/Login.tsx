import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/context/useUser';
import { LOGIN_USER, SIGNUP_USER } from '@/service/mutations';
import { useMutation } from '@apollo/client';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [login] = useMutation(LOGIN_USER);
  const [signup] = useMutation(SIGNUP_USER);

  const handleDemoLogin = async () => {
    const demoEmail = 'testuser@demo.com';
    const demoPassword = 'password';
    setError('');

    try {
      const { data } = await login({
        variables: { email: demoEmail, password: demoPassword },
      });

      if (data?.login?.token) {
        localStorage.setItem('authToken', data.login.token);
        setUser(data.login.user); // Update UserContext
        navigate('/mytravels');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
      console.error(err);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await login({
        variables: { email, password },
      });

      if (data?.login?.token) {
        localStorage.setItem('authToken', data.login.token);
        setUser(data.login.user);
        navigate('/mytravels');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error(err);
    }
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    address?: string,
    countryId?: number
  ) => {
    try {
      await signup({
        variables: { name, email, password, address, countryId },
      });
      await handleLogin(email, password);
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error(err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Card className="w-full max-w-md bg-card text-card-foreground shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center flex flex-col items-center">
          <MapPin className="w-8 h-8 mb-2 text-primary" />
          TravelTracker
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Log in or sign up to start tracking your travels!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center space-x-2 text-destructive mb-4">
            <span>{error}</span>
          </div>
        )}
        <Tabs defaultValue="login" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="text-primary">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-primary">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm setError={setError} onLogin={handleLogin} />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm setError={setError} onSignup={handleSignup} />
          </TabsContent>
        </Tabs>
        <Button
          onClick={handleDemoLogin}
          className="w-full mt-4 bg-tertiary text-tertiary-foreground hover:bg-tertiary/90"
        >
          Try Demo Account
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={handleGoBack}
          variant="link"
          className="flex items-center justify-center text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </CardFooter>
    </Card>
  );
}
