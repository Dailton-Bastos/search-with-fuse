import data from './data.json';

import './app.css';
import { useSearch } from './useSearch';

type DataType = {
  name: string;
  capital?: string;
  region: string;
  subregion: string;
};

export const App = () => {
  const { results, value, onQueryChange, isLoading, noResults } =
    useSearch<DataType>({
      dataSet: data,
      keys: ['name', 'capital', 'region', 'subregion'],
    });

  return (
    <div className="container">
      <h1>Search with Fuse.js</h1>

      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={onQueryChange}
      />

      {isLoading && <p>Wait...</p>}

      {noResults && !isLoading && <p>No results found!</p>}

      <ul>
        {results?.map((country) => {
          return (
            <li key={country?.name}>
              <p>
                <strong>Name:</strong> {country?.name}
              </p>
              <p>
                <strong>Capital:</strong> {country?.capital}
              </p>
              <p>
                <strong>Region:</strong> {country?.region}
              </p>
              <p>
                <strong>Subregion:</strong> {country?.subregion}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
