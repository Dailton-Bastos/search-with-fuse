export type State<T> = {
  value: string;
  isLoading: boolean;
  noResults: boolean | null;
  dataSet: T[];
  results: T[];
};

export type Action<T> =
  | {
      type: 'START_SEARCH';
      payload: string;
    }
  | {
      type: 'FINISH_SEARCH';
      payload: {
        data: T[];
        noResults: boolean;
      };
    }
  | {
      type: 'CLEAN_QUERY';
      payload: null;
    };

export function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'START_SEARCH':
      return {
        ...state,
        isLoading: true,
        value: action.payload,
      };

    case 'FINISH_SEARCH':
      return {
        ...state,
        isLoading: false,
        results: action.payload.data,
        noResults: action.payload.noResults,
      };

    case 'CLEAN_QUERY':
      return {
        ...state,
        value: '',
        isLoading: false,
        noResults: null,
        results: state.dataSet,
      };

    default:
      return state;
  }
}
