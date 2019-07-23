const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null
};

const authStart = state => {
  return (
    {
      ...state,
      ...{ loading: true, error: null }
    }
  );
}

const authSuccess = (state, action) => {
  return (
    {
      ...state,
      ...{ token: action.token, user: action.user, error: null, loading: false }
    }
  );
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return authStart(state, action);
    case 'AUTH_SUCCESS':
      return authSuccess(state, action)
    default:
      return state;
  }
};

export default reducer;