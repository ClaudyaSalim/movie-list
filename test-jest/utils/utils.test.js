import { formatDuration } from './utils';

describe('formatDuration', () => {
  test('should format 90 minutes as "1h 30m"', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });

  test('should format 60 minutes as "1h"', () => {
    expect(formatDuration(60)).toBe('1h');
  });

  test('should format 45 minutes as "45m"', () => {
    expect(formatDuration(45)).toBe('45m');
  });

  test('should format 0 minutes as ""', () => {
    expect(formatDuration(0)).toBe('');
  });
});

import { filterAndSortMovies } from './utils';

const sampleMovies = [
  { title: 'The Batman' },
  { title: 'Avengers' },
  { title: 'Superman' },
  { title: 'Avatar' },
];

test('should filter movies by search query', () => {
  const result = filterAndSortMovies(sampleMovies, 'bat', '');
  expect(result).toEqual([{ title: 'The Batman' }]);
});

test('should sort movies by title ascending', () => {
  const result = filterAndSortMovies(sampleMovies, '', 'title-asc');
  expect(result.map(m => m.title)).toEqual(['Avatar', 'Avengers', 'Superman', 'The Batman']);
});

test('should sort movies by title descending', () => {
  const result = filterAndSortMovies(sampleMovies, '', 'title-desc');
  expect(result.map(m => m.title)).toEqual(['The Batman', 'Superman', 'Avengers', 'Avatar']);
});
