"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("https://google.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:4000/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      // Always show the JSON response from the backend
      setResult(data);

      // Additionally surface any error message if the HTTP status is not OK
      if (!res.ok) {
        setError(data?.message || "Something went wrong");
      }
    } catch (err) {
      setError("Unable to reach API server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <main className="w-full max-w-xl rounded-2xl bg-white shadow-sm border border-zinc-200 px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">
          URL Status Checker
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          Enter a website URL and this page will call{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">
            POST /check
          </code>{" "}
          on your backend.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-zinc-800"
            >
              URL to check
            </label>
            <div className="flex items-stretch gap-2">
              <div className="flex-1">
                <input
                  id="url"
                  type="url"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-inner outline-none focus:border-zinc-900 focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="mt-1.5 text-xs text-zinc-500">
                  Include the full URL with <span className="font-medium">http://</span> or{" "}
                  <span className="font-medium">https://</span>.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-zinc-700">Result</span>
                {result.website_status && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      result.website_status === "UP"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {result.website_status}
                  </span>
                )}
              </div>
              <pre className="mt-1 overflow-x-auto rounded-md bg-black text-xs text-zinc-100 p-3">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
