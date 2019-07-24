const authStart = () => ({
  type: 'AUTH_START',
});

const authSuccess = (token, user) => ({
  type: 'AUTH_SUCCESS',
  token,
  user,
});

export const auth = (email, password) => (dispatch) => {
  dispatch(authStart());

  // axios avec la data (email, password)
  // then authSuccess  user[] + token 
  const token = '123456';
  const user = { name: 'abc', login: 'miclaude' };

  setTimeout(() => {
    dispatch(authSuccess(token, user));
  }, 2000)
  // catch authFail
}