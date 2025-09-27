import React, { useState } from 'react';
import { authService } from '../services/authService';
import { firebaseStatus } from '../services/firebaseConfig';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firebaseReady = firebaseStatus.ready;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseReady) {
      setError('Authentication is unavailable because Firebase credentials are not configured.');
      onError?.(new Error('Firebase not configured'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        await authService.signUp(email, password);
      } else {
        await authService.signIn(email, password);
      }
      onSuccess?.();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!firebaseReady) {
      setError('Authentication is unavailable because Firebase credentials are not configured.');
      onError?.(new Error('Firebase not configured'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.signInWithGoogle();
      onSuccess?.();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </h2>

      {(!firebaseReady || error) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {firebaseReady ? error : 'Firebase credentials are missing. Add them to .env to enable sign-in.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading || !firebaseReady}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading || !firebaseReady}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !firebaseReady}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>

        <div className="relative my-4">
          <hr className="border-gray-300" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || !firebaseReady}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </form>
    </div>
  );
};