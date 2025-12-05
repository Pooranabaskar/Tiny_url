import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import CopyButton from "./CopyButton";

async function getLink(code: string) {
  try {
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link || link.deleted) {
      return null;
    }

    return link;
  } catch (error) {
    console.error("Error fetching link:", error);
    return null;
  }
}

export default async function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const link = await getLink(code);

  if (!link) {
    notFound();
  }

  const shortUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/${link.code}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TinyLink</h1>
              <p className="text-sm text-gray-600">Link Statistics</p>
            </div>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Link Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Code
                </label>
                <div className="flex items-center gap-2">
                  <code className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-blue-600">
                    {shortUrl}
                  </code>
                  <CopyButton text={shortUrl} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target URL
                </label>
                <div className="flex items-center gap-2">
                  <a
                    href={link.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {link.target_url}
                  </a>
                  <a
                    href={link.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Clicks
                  </label>
                  <p className="text-2xl font-bold text-gray-900">
                    {link.total_clicks}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Clicked
                  </label>
                  <p className="text-lg text-gray-900">
                    {link.last_clicked
                      ? new Date(link.last_clicked).toLocaleString()
                      : "Never"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-lg text-gray-900">
                    {new Date(link.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
