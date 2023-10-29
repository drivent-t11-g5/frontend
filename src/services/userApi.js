import api from './api';

export async function signUp(email, password) {
  const response = await api.post('/users', { email, password });
  return response.data;
}

export async function loginWithGitHub(code) {
  const response = await api.post('/users/github', { code });
  return response.data;
}
