import SearchBar from '../../src/components/SearchBar/SearchBar';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';

describe('SearchBar Component', () => {
  const mockOnSearch = vi.fn();
  const mockOnSortChange = vi.fn();
  const mockOnSortOrderChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all elements correctly', () => {
    render(
      <SearchBar
        searchTerm=""
        orderBy="tourism"
        ascOrDesc="asc"
        onSearch={mockOnSearch}
        onSortChange={mockOnSortChange}
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(
      /find your next adventure/i
    );
    expect(searchInput).toBeInTheDocument();

    const sortTrigger = screen.getByLabelText(/sort by category/i);
    expect(sortTrigger).toBeInTheDocument();

    const orderTrigger = screen.getByLabelText(/order by/i);
    expect(orderTrigger).toBeInTheDocument();

    expect(screen.getByText(/find your next adventure/i)).toBeInTheDocument();
  });

  it('calls onSearch when typing in the input field', () => {
    render(
      <SearchBar
        searchTerm=""
        orderBy="tourism"
        ascOrDesc="asc"
        onSearch={mockOnSearch}
        onSortChange={mockOnSortChange}
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(
      /find your next adventure/i
    );

    fireEvent.change(searchInput, { target: { value: 'Norway' } });

    expect(mockOnSearch).toHaveBeenCalledWith('Norway');
  });

  it('calls onSortChange when a sort category is selected', () => {
    render(
      <SearchBar
        searchTerm=""
        orderBy="tourism"
        ascOrDesc="asc"
        onSearch={mockOnSearch}
        onSortChange={mockOnSortChange}
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    const sortTrigger = screen.getByLabelText(/sort by category/i);

    fireEvent.click(sortTrigger);
    fireEvent.click(screen.getByText(/average rating/i));

    expect(mockOnSortChange).toHaveBeenCalledWith('average_rating');
  });

  it('calls onSortOrderChange when sort order is changed', () => {
    render(
      <SearchBar
        searchTerm=""
        orderBy="tourism"
        ascOrDesc="asc"
        onSearch={mockOnSearch}
        onSortChange={mockOnSortChange}
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    const orderTrigger = screen.getByLabelText(/order by/i);

    fireEvent.click(orderTrigger);
    fireEvent.click(screen.getByText(/descending/i));

    expect(mockOnSortOrderChange).toHaveBeenCalledWith('desc');
  });
});
