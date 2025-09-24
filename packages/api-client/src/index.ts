import { useMutation, useQuery } from '@apollo/client';
import * as queries from './queries';
import { apolloClient, useAuthStore } from './client';
import type { AIService } from '@my-extension/ai';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apolloClient.mutate({
    mutation: queries.LOGIN,
    variables: { email, password },
  });
  
  const { token, user } = response.data.login;
  useAuthStore.getState().setToken(token);
  return { token, user };
}

export async function signup(email: string, password: string, name?: string): Promise<AuthResponse> {
  const response = await apolloClient.mutate({
    mutation: queries.SIGNUP,
    variables: { email, password, name },
  });
  
  const { token, user } = response.data.signup;
  useAuthStore.getState().setToken(token);
  return { token, user };
}

export function useMe() {
  return useQuery(queries.GET_ME);
}

export function useWorkspace() {
  return useQuery(queries.GET_WORKSPACE);
}

export function useCreateWorkspaceItem() {
  return useMutation(queries.CREATE_WORKSPACE_ITEM);
}

export function useUpdatePreferences() {
  return useMutation(queries.UPDATE_PREFERENCES);
}

export function useConnectGoogle() {
  return useMutation(queries.CONNECT_GOOGLE);
}

export function useAISuggestions(context: string) {
  return useQuery(queries.GET_AI_SUGGESTIONS, {
    variables: { context },
  });
}

export * from './client';
export { queries };