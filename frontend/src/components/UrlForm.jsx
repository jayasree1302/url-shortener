import { useState } from 'react';
import { createShortUrl } from '../api/client';

export default function UrlForm({ onUrlCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const created = await createShortUrl(originalUrl, customAlias);
      setSuccess(`Short URL created: ${created.shortUrl}`);
      setOriginalUrl('');
      setCustomAlias('');
      onUrlCreated(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Shorten a URL</h2>
      <p className="mt-1 text-sm text-slate-400">
        Paste any link and optionally choose a custom alias.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="originalUrl" className="mb-1.5 block text-sm font-medium text-slate-300">
            Long URL
          </label>
          <input
            id="originalUrl"
            type="url"
            required
            placeholder="https://example.com/very/long/url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div>
          <label htmlFor="customAlias" className="mb-1.5 block text-sm font-medium text-slate-300">
            Custom alias <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30">
            <span className="pl-4 text-sm text-slate-500">/</span>
            <input
              id="customAlias"
              type="text"
              placeholder="my-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full bg-transparent px-2 py-3 text-sm text-white outline-none"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            3-32 characters: letters, numbers, hyphens, underscores.
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Shortening...' : 'Create short link'}
        </button>
      </form>
    </section>
  );
}
