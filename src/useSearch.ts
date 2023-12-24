import React from 'react';
import Fuse, { FuseResult, IFuseOptions } from 'fuse.js';
import { Action, State, reducer } from './reducer';

type UseSearchType<T> = {
  dataSet: T[];
  keys: string[];
};

type ReducerType<T> = React.Reducer<State<T>, Action<T>>;

const SCORE_THRESHOLD = 0.6;

export function useSearch<T>({ dataSet, keys }: UseSearchType<T>) {
  const [state, dispatch] = React.useReducer<ReducerType<T>>(reducer, {
    value: '',
    isLoading: false,
    noResults: null,
    dataSet: dataSet,
    results: dataSet,
  });

  const { results, value, isLoading, noResults } = state;

  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>();

  const fuse = React.useMemo(() => {
    const options: IFuseOptions<T> = {
      includeScore: true,
      keys,
    };

    return new Fuse<T>(dataSet, options);
  }, [keys, dataSet]);

  const searchByQuery = React.useCallback(async (data: FuseResult<T>[]) => {
    const results = await new Promise<T[]>((resolve) => {
      setTimeout(() => {
        const searchResults = data
          ?.filter((fuseResult) => {
            return fuseResult?.score && fuseResult?.score < SCORE_THRESHOLD;
          })
          .map((fuseResult) => fuseResult.item);

        resolve(searchResults);
      }, 1000);
    });

    return results;
  }, []);

  const onQueryChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      dispatch({
        type: 'START_SEARCH',
        payload: value,
      });

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        if (value.trim().length === 0) {
          dispatch({
            type: 'CLEAN_QUERY',
            payload: null,
          });

          return;
        }

        const searchResults = fuse.search(value);

        const data = await searchByQuery(searchResults);

        const noResults = data?.length === 0;

        dispatch({
          type: 'FINISH_SEARCH',
          payload: {
            data,
            noResults,
          },
        });
      }, 500);
    },
    [dispatch, fuse, searchByQuery]
  );

  return {
    onQueryChange,
    value,
    results,
    isLoading,
    noResults,
  };
}
