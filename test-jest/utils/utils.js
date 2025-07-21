// utils.js
export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours}h` : ''}${hours > 0 && mins > 0 ? ' ' : ''}${mins > 0 ? `${mins}m` : ''}`;
}

export function filterAndSortMovies(movies, searchQuery, sortOrder) {
  let result = [...movies];
  if (searchQuery) {
    result = result.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (sortOrder === "title-asc") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOrder === "title-desc") {
    result.sort((a, b) => b.title.localeCompare(a.title));
  }
  return result;
}
