import { useCallback, useEffect, useState } from 'react';
import { fetchAllUrls } from './api/client';
import UrlForm from './components/UrlForm';
import Dashboard from './components/Dashboard';

export default function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUrls = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchAllUrls();
      setUrls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUrls();
  }, [loadUrls]);

  function handleUrlCreated(created) {
    setUrls((current) => [created, ...current.filter((item) => item.id !== created.id)]);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_45%)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6.5h3.75a2.25 2.25 0 0 1 0 4.5H14m-4.5 0H6.75a2.25 2.25 0 0 1 0-4.5H9m1.5 0 5.25-5.25L9 9m6-3 1.5 1.5M9 15l-1.5 1.5M15 15l1.5 1.5M9 15h6"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">URL Shortener</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Shorten links, use custom aliases, and monitor click analytics from one clean dashboard.
          </p>
        </header>

        <div className="space-y-8">
          <UrlForm onUrlCreated={handleUrlCreated} />
          <Dashboard urls={urls} loading={loading} error={error} onRefresh={loadUrls} />
        </div>
      </div>
    </div>
  );
}
