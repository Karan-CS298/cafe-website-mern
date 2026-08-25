import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error('VITE_API_URL is not configured.');
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

let csrf = '';

export async function ensureCsrf() {
  if (csrf) return csrf;
  const { data } = await api.get('/admin/csrf');
  csrf = data.csrfToken;
  return csrf;
}

api.interceptors.request.use(async (config) => {
  if (config.url?.includes('/admin/csrf') || config.method?.toLowerCase() === 'get') {
    return config;
  }

  config.headers = config.headers || {};
  config.headers['x-csrf-token'] = await ensureCsrf();
  return config;
});

export function clearCsrf() {
  csrf = '';
}
