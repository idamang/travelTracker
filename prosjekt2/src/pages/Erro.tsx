import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  message = 'We are sorry, but something went wrong. Please try again later!',
}) => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-center flex flex-col items-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <span className="text-2xl font-bold ">
            Oops! Something went wrong
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[#6C7169] text-center">{message}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleGoBack}
          className="bg-tertiary hover:bg-hoverNav]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ErrorPage;
