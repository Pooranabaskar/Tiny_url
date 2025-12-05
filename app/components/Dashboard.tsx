"use client";

import { useState, useEffect } from "react";
import LinkForm from "./LinkForm";
import LinkTable from "./LinkTable";

interface LinkData {
  code: string;
  target_url: string;
  total_clicks: number;
  last_clicked: string | null;
  created_at: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/links");
      if (!response.ok) {
        throw new Error("Failed to fetch links");
      }
      const data = await response.json();
      setLinks(data);
      setError("");
    } catch (err) {
      setError("Failed to load links. Please refresh the page.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">TinyLink</h1>
          <p className="text-sm text-gray-600">
            Shorten your URLs and track clicks
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Add Link Form */}
          <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create Short Link
            </h2>
            <LinkForm onSuccess={fetchLinks} />
          </section>

          {/* Links Table */}
          <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Links
            </h2>
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <p>Loading links...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <LinkTable links={links} onDelete={fetchLinks} />
            )}
          </section>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            TinyLink - URL Shortener Service
          </p>
        </div>
      </footer>
    </div>
  );
}
