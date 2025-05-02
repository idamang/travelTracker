import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface LoginFormProps {
  setError: (message: string) => void;
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function LoginForm({ setError, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError(''); // Clear any existing error messages

    try {
      await onLogin(email, password);
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <fieldset className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full mt-6 bg-tertiary text-tertiary-foreground hover:bg-tertiary/90 "
        >
          Sign In
        </Button>
      </fieldset>
    </form>
  );
}
