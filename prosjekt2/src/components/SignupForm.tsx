import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, ChangeEvent } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_COUNTRIES } from '@/service/queries';

interface SignupFormProps {
  setError: (message: string) => void;
  onSignup: (
    name: string,
    email: string,
    password: string,
    address?: string,
    countryId?: number
  ) => Promise<void>;
}

interface Country {
  id: string;
  country_name: string;
}

export default function SignupForm({ setError, onSignup }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [countryName, setCountryName] = useState('');
  const [countryId, setCountryId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<Country[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [getCountries] = useLazyQuery(GET_COUNTRIES, {
    onCompleted: (data) =>
      setSearchResults(data.getCountriesPaginated.countries),
  });

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(''); // Clear error messages

    try {
      await onSignup(name, email, password, address, countryId || undefined);
    } catch (error) {
      setError('Signup failed. Please try again.');
      console.error(error);
    }
  };

  const handleCountryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountryName(value);
    setActiveIndex(-1);
    setIsFocused(true);

    if (value) {
      getCountries({
        variables: {
          page: 1,
          pageSize: 5,
          orderBy: 'country_name',
          search: value,
          ascOrDesc: 'asc',
        },
      });
    } else {
      setSearchResults([]);
    }
  };

  const handleCountrySelect = (countryName: string, countryId: string) => {
    setCountryName(countryName);
    setCountryId(parseInt(countryId, 10)); // Set the selected country's ID
    setSearchResults([]);
    setActiveIndex(-1);
    setIsFocused(false);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      {/* Signup Details */}
      <fieldset>
        <legend className="sr-only">Signup Details</legend>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </fieldset>

      {/* Optional Address Field */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          placeholder="Your Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Country Selection */}
      <div className="space-y-2 relative">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          type="text"
          value={countryName}
          onChange={handleCountryChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          placeholder="Search for a country"
          aria-haspopup="listbox"
          aria-expanded={isFocused}
          aria-owns="country-suggestions"
          aria-autocomplete="list"
        />
        {isFocused && searchResults.length > 0 && (
          <ul
            id="country-suggestions"
            className="absolute bg-white border w-full mt-1 max-h-48 overflow-y-auto z-10"
            role="listbox"
            aria-live="polite"
          >
            {searchResults.map((result, index) => (
              <li
                key={result.id}
                onClick={() =>
                  handleCountrySelect(result.country_name, result.id)
                }
                role="option"
                aria-selected={activeIndex === index}
                className={`p-2 cursor-pointer ${activeIndex === index ? 'bg-gray-200' : ''}`}
              >
                {result.country_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-6 bg-[#A2AEA1] text-white hover:bg-[#8A9589]"
      >
        Create Account
      </Button>
    </form>
  );
}
