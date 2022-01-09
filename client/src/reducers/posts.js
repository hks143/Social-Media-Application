
export default (state = { isLoading: true, posts: [] }, action) => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, isLoading: true };
    case 'END_LOADING':
      return { ...state, isLoading: false };
    case 'FETCH_ALL':
      return {
        ...state,
        posts: action.payload
      };
    case 'FETCH_BY_ID':
      return { ...state, post: action.payload, isLoading: false };
    case 'LIKE':
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
    case 'CREATE':
      return { ...state, posts: [...state.posts, action.payload] };
    case 'UPDATE':
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
    case 'DELETE':
      return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
    case 'COMMENT':
      return {
        ...state,

        cement: state.posts.map((pot) => {
          if (pot._id === action.payload._id) {
            return [action.payload.comments];
          }

        }),
      };
    default:
      return state;
  }
};

