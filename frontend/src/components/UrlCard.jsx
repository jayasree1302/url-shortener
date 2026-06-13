import { useState } from 'react';

function formatDate(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function UrlCard({ url }) {
  const [copied, setCopied] = useState(false);
  const recentClicks = url.clickHistory?.slice(-5).reverse() || [];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white" title={url.originalUrl}>
            {url.originalUrl}
          </p>
          <a
            href={url.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            {url.shortUrl}
          </a>
          <p className="mt-2 text-xs text-slate-500">Created {formatDate(url.createdAt)}</p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white"
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-800 pt-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-950/80 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total clicks</p>
          <p className="mt-1 text-3xl font-bold text-white">{url.clicks}</p>
        </div>

        <div className="rounded-xl bg-slate-950/80 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Recent activity</p>
          {recentClicks.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No clicks yet</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {recentClicks.map((entry, index) => (
                <li key={`${entry.clickedAt}-${index}`} className="text-sm text-slate-300">
                  {formatDate(entry.clickedAt)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
