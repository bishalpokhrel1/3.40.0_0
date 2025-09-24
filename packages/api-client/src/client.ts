import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      setToken: (token) => {
        if (token) {
          const decoded = jwtDecode<{ userId: string }>(token);
          set({ token, userId: decoded.userId, isAuthenticated: true });
        } else {
          set({ token: null, userId: null, isAuthenticated: false });
        }
      },
      logout: () => {
        set({ token: null, userId: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_API_URL || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});