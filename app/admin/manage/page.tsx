'use client';
import { Select, Input, Box, FormControl, FormLabel, Stack } from '@chakra-ui/react';
import { useState } from 'react';

export default function Manage() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <Box p={4}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel htmlFor="options">Select an option</FormLabel>
          <Select
            id="options"
            placeholder="Select option"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="search">Search</FormLabel>
          <Input
            id="search"
            placeholder="Search"
            size="md"
            type="search"
            value={searchValue}
            onChange={handleInputChange}
          />
        </FormControl>
      </Stack>
    </Box>
  );
}
