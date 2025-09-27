import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Globe2,
  Users,
  RefreshCcw
} from 'lucide-react';
import { AuthForm } from './AuthForm';
import { useAppStore } from '../store/appStore';
import { firebaseStatus } from '../services/firebaseConfig';
import { testFirebaseConnection, type ConnectionTestResult } from '../services/connectionTest';

const features = [
  {
    title: 'Unified workspace',
    description: 'Tasks, notes, reminders, and AI insights live side by side so you never lose the thread.',
    icon: Globe2
  },
  {
    title: 'On-device AI first',
    description: 'Gemini Nano powers instant summaries locally, with smart fallbacks to the cloud only when needed.',
    icon: Sparkles
  },
  {
    title: 'Zero-friction sync',
    description: 'Two-way sync keeps extension, mobile, and backend data aligned with optimistic updates.',
    icon: RefreshCcw
  },
  {
    title: 'Privacy hardened',
    description: 'Granular Firebase rules and clear permission scopes so your data never surprises you.',
    icon: ShieldCheck
  }
];

const personaHighlights = [
  'Capture web research and auto-link notes to their origin.',
  'Plan your day with AI-generated task suggestions.',
  'Switch between laptop and phone without missing a beat.',
  'Invite collaborators with scoped sharing (coming soon).' 
];

function formatConnection(result: ConnectionTestResult | null) {
  if (!result) return null;
  return {
    auth: result.auth,
    firestore: result.firestore,
    timestamp: new Date(result.timestamp).toLocaleTimeString()
  };
}

export function LandingPage() {
  const {
    isAuthenticated,
    user,
    signOut,
    hasCompletedOnboarding,
    completeOnboarding
  } = useAppStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    signOut: state.signOut,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    completeOnboarding: state.completeOnboarding
  }));

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [connectionState, setConnectionState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [connectionResult, setConnectionResult] = useState<ConnectionTestResult | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const firebaseMessage = firebaseStatus.ready
    ? 'Firebase is ready — authentication and sync features are enabled.'
    : firebaseStatus.missingConfig
      ? 'Firebase credentials are missing. Add them to .env when you are ready to enable sign-in and sync.'
      : firebaseStatus.error?.message ?? 'Firebase initialisation failed. Check console logs for details.';

  const formattedConnection = useMemo(() => formatConnection(connectionResult), [connectionResult]);

  useEffect(() => {
    if (isAuthenticated && !hasCompletedOnboarding) {
      completeOnboarding();
    }
  }, [isAuthenticated, hasCompletedOnboarding, completeOnboarding]);

  const handleConnectionCheck = async () => {
    setConnectionState('loading');
    setConnectionError(null);

    try {
      const result = await testFirebaseConnection();
      setConnectionResult(result);
      setConnectionState('done');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to test connection.';
      setConnectionError(message);
      setConnectionState('done');
    }
  };

  const handleAuthSuccess = () => {
    completeOnboarding();
  };

  const handleExplore = () => {
    completeOnboarding();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  return (
    <div className="landing gradient-bg min-h-screen text-white overflow-y-auto">
      <header className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/80 flex items-center justify-center font-semibold">
              MP
            </div>
            <div>
              <p className="text-lg font-semibold">Manage Productivity</p>
              <p className="text-sm text-white/60">Chrome + Mobile + GraphQL backend</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-white/80 hidden sm:block">
                  {user?.email ?? 'Signed in'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                >
                  Sign out
                </button>
                <button
                  onClick={handleExplore}
                  className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-indigo-400 hover:bg-indigo-500 text-sm font-medium"
                >
                  Go to dashboard
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span>Ready to dive in?</span>
                <button
                  onClick={() => setAuthMode('signin')}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  Sign in
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className="px-4 py-2 rounded-lg bg-indigo-400 hover:bg-indigo-500 font-medium"
                >
                  Create account
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white">Your all-in-one workspace for</span>
              <span className="block text-indigo-200">tasks, notes & AI insights.</span>
            </motion.h1>
            <motion.p
              className="text-lg text-white/80 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Capture ideas from any page, plan your day with generative assistance, and sync effortlessly across
              the extension, mobile companion, and backend GraphQL services.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button
                onClick={() => setAuthMode('signup')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-400 hover:bg-indigo-500 font-semibold shadow-lg"
              >
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={handleExplore}
                className="px-6 py-3 rounded-lg border border-white/30 hover:bg-white/10"
              >
                Explore dashboard preview
              </button>
            </motion.div>

            <ul className="mt-12 space-y-3 text-white/70">
              {personaHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-200 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-panel rounded-3xl shadow-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create your account</h2>
              <div className="flex gap-2 text-sm bg-white/10 px-3 py-1 rounded-full">
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`transition-colors ${authMode === 'signin' ? 'text-white' : 'text-white/60'}`}
                >
                  Sign in
                </button>
                <span className="text-white/30">•</span>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`transition-colors ${authMode === 'signup' ? 'text-white' : 'text-white/60'}`}
                >
                  Sign up
                </button>
              </div>
            </div>
            <AuthForm mode={authMode} onSuccess={handleAuthSuccess} />
            <p className="mt-6 text-sm text-indigo-100/80">
              {firebaseMessage}
            </p>
          </motion.div>
        </section>

        {/* Feature grid */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map(({ title, description, icon: Icon }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-indigo-200" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <p className="text-white/70 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Connection diagnostics */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Connectivity diagnostics</h2>
                <p className="text-white/70 max-w-2xl">
                  Run the built-in health check to confirm Firebase Auth and Firestore are reachable before rolling out to
                  your team.
                </p>
              </div>
              <button
                onClick={handleConnectionCheck}
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium flex items-center gap-2"
                disabled={connectionState === 'loading'}
              >
                {connectionState === 'loading' ? 'Checking…' : 'Run health check'}
                <Users className="h-4 w-4" />
              </button>
            </div>

            {connectionError && (
              <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {connectionError}
              </div>
            )}

            {formattedConnection && (
              <div className="grid gap-4 md:grid-cols-3 mt-4 text-sm">
                <div className={`rounded-lg p-4 border ${formattedConnection.auth.status === 'connected' ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-yellow-400/40 bg-yellow-500/10'}`}>
                  <p className="uppercase text-xs tracking-wider text-white/60 mb-1">Auth</p>
                  <p className="text-white font-semibold">{formattedConnection.auth.status}</p>
                  <p className="text-white/70 mt-1">
                    {formattedConnection.auth.error ?? `User state: ${formattedConnection.auth.user ?? 'unknown'}`}
                  </p>
                </div>
                <div className={`rounded-lg p-4 border ${formattedConnection.firestore.status === 'connected' ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-yellow-400/40 bg-yellow-500/10'}`}>
                  <p className="uppercase text-xs tracking-wider text-white/60 mb-1">Firestore</p>
                  <p className="text-white font-semibold">{formattedConnection.firestore.status}</p>
                  <p className="text-white/70 mt-1">
                    {formattedConnection.firestore.error ?? 'Sample collection read successful.'}
                  </p>
                </div>
                <div className="rounded-lg p-4 border border-white/10 bg-white/5">
                  <p className="uppercase text-xs tracking-wider text-white/60 mb-1">Last checked</p>
                  <p className="text-white font-semibold">{formattedConnection.timestamp}</p>
                  <p className="text-white/70 mt-1">Re-run after updating credentials or security rules.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-12 backdrop-blur-xl shadow-2xl">
            <h2 className="text-3xl font-semibold mb-4">Step into your unified workspace</h2>
            <p className="text-white/70 mb-8">
              Install the extension, connect Firebase, and roll out Gemini-powered productivity to your entire team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!hasCompletedOnboarding && (
                <button
                  onClick={handleExplore}
                  className="px-6 py-3 rounded-lg bg-indigo-400 hover:bg-indigo-500 font-semibold"
                >
                  Continue to dashboard preview
                </button>
              )}
              <button
                onClick={() => setAuthMode('signup')}
                className="px-6 py-3 rounded-lg border border-white/30 hover:bg-white/10"
              >
                Create an account now
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
