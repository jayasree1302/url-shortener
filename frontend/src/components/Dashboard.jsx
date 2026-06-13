import UrlCard from './UrlCard';

export default function Dashboard({ urls, loading, error, onRefresh }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Your links</h2>
          <p className="mt-1 text-sm text-slate-400">
            Track click counts and recent activity for every short URL.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white disabled:opacity-60"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {loading && urls.length === 0 ? (
          <p className="text-sm text-slate-400">Loading your shortened URLs...</p>
        ) : urls.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-6 py-10 text-center">
            <p className="text-sm text-slate-400">No shortened URLs yet. Create your first link above.</p>
          </div>
        ) : (
          urls.map((url) => <UrlCard key={url.id} url={url} />)
        )}
      </div>
    </section>
  );
}
