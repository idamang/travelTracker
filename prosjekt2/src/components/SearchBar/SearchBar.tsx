import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowDownUp, SearchIcon } from 'lucide-react';
import React from 'react';
const SearchBar = React.memo(
  ({
    searchTerm,
    orderBy,
    ascOrDesc,
    onSearch,
    onSortChange,
    onSortOrderChange,
  }: {
    searchTerm: string;
    orderBy: string;
    ascOrDesc: string;
    onSearch: (searchTerm: string) => void;
    onSortChange: (orderBy: string) => void;
    onSortOrderChange: (ascOrDesc: string) => void;
    className?: string;
  }) => {
    return (
      <Card className="p-4 bg-secondary text-secondary-foreground border border-border rounded-lg shadow sm:p-8">
        <h5 className="mb-2 text-2xl font-bold text-primary sm:text-4xl">
          Find your next adventure
        </h5>
        <p className="mb-5 text-base text-primary sm:text-lg">
          Search for a destination or browse through categories
        </p>
        <div className="flex flex-col items-start space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
          {/* Input field */}
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Find your next adventure"
              aria-label="Search for a country"
              className="pl-4 pr-12 rounded-full bg-card text-foreground border border-border shadow-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-foreground"
              aria-label="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Sort options */}
          <div className="flex space-x-2">
            <Select value={orderBy} onValueChange={onSortChange}>
              <SelectTrigger
                className="min-w-[10rem] px-3 py-1 rounded-full bg-tertiary text-black border border-border shadow-sm"
                aria-label="Sort by category"
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tourism">Tourism</SelectItem>
                <SelectItem value="average_rating">Average Rating</SelectItem>
                <SelectItem value="country_name">Country Name</SelectItem>
                <SelectItem value="cca3">Country Code</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ascOrDesc} onValueChange={onSortOrderChange}>
              <SelectTrigger
                className="w-15 px-3 py-1 rounded-full bg-tertiary text-tertiary-foreground border border-border hover:bg-hoverNav shadow-sm"
                aria-label=" Order by"
              >
                <ArrowDownUp className="w-5 h-5 text-black" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    );
  }
);

export default SearchBar;
