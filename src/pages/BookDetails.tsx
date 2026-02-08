import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  getWorkByKey,
  getAuthorByKey,
  getCoverUrlById,
  normalizeTextField,
} from "@/api/openLibrary";
import { getWikipediaSummary } from "@/api/wikipedia";
import type { WikipediaPageInfo } from "@/api/wikipedia";

import type {
  OpenLibraryWorkDetails,
  OpenLibraryAuthorDetails,
} from "@/api/openLibrary";
import Loader from "@/components/Loader/Loader";

const BookDetails = () => {
  const { id } = useParams();
  const [work, setWork] = useState<OpenLibraryWorkDetails | null>(null);
  const [author, setAuthor] = useState<OpenLibraryAuthorDetails | null>(null);
  const [bookWiki, setBookWiki] = useState<WikipediaPageInfo | null>(null);
  const [authorWiki, setAuthorWiki] = useState<WikipediaPageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const workKey = `/works/${id}`;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const w = await getWorkByKey(workKey);
        setWork(w);

        // Author details
        const authorKey = w.authors?.[0]?.author?.key;
        let authorData: OpenLibraryAuthorDetails | null = null;
        if (authorKey) {
          try {
            authorData = await getAuthorByKey(authorKey);
            setAuthor(authorData);
          } catch {
            authorData = null;
          }
        }

        // Wikipedia summary for book
        const wikiBook = await getWikipediaSummary(w.title);
        setBookWiki(wikiBook);

        // Wikipedia summary for author
        if (authorData?.name) {
          const wikiAuthor = await getWikipediaSummary(authorData.name);
          setAuthorWiki(wikiAuthor);
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Failed to load book details";
        setError(msg);
        setWork(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-red-600">No book selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-white px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {loading && (
          <div className="flex justify-center mt-12">
            <Loader />
          </div>
        )}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {work && (
          <article className="rounded-[28px] border border-gray-200 bg-white/85 backdrop-blur shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 items-start">
                {/* COVER */}
                <div className="w-full md:w-40">
                  <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-lg ring-1 ring-gray-200">
                    {work.covers?.length ? (
                      <img
                        src={getCoverUrlById(work.covers[0], "M") ?? undefined}
                        alt={work.title}
                        className="w-full h-auto md:h-[240px] object-cover object-center"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gray-100 flex items-center justify-center">
                        <span className="text-sm text-gray-500">No cover</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata under cover */}
                  <div className="mt-5 space-y-2">
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs text-gray-500">Covers</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {work.covers?.length ?? 0}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs text-gray-500">First published</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {work.first_publish_date ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="min-w-0">
                  <header className="pb-7 border-b border-gray-200">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                      {work.title}
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-gray-600">
                      By{" "}
                      <span className="font-semibold text-gray-900">
                        {author?.name ?? "Unknown author"}
                      </span>
                    </p>
                  </header>

                  {/* Description */}
                  <section className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Description
                    </h3>
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {normalizeTextField(work.description) ??
                          "No description available."}
                      </p>
                    </div>
                  </section>

                  {/* Wikipedia / Critical Analysis */}
                  {bookWiki && (
                    <section className="mt-8">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Critical Analysis / Wikipedia
                      </h3>
                      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm flex gap-4">
                        {bookWiki.thumbnail && (
                          <img
                            src={bookWiki.thumbnail}
                            alt={bookWiki.title}
                            className="w-24 h-32 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                          <p>{bookWiki.extract}</p>
                          <a
                            href={bookWiki.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline mt-2 block"
                          >
                            Read more on Wikipedia
                          </a>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Author Wikipedia */}
                  {authorWiki && (
                    <section className="mt-8">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        About the Author
                      </h3>
                      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm flex gap-4">
                        {authorWiki.thumbnail && (
                          <img
                            src={authorWiki.thumbnail}
                            alt={authorWiki.title}
                            className="w-24 h-24 object-cover rounded-full"
                          />
                        )}
                        <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                          <p>{authorWiki.extract}</p>
                          <a
                            href={authorWiki.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline mt-2 block"
                          >
                            Read more on Wikipedia
                          </a>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Subjects */}
                  {work.subjects && work.subjects.length > 0 && (
                    <section className="mt-9">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Subjects
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {(work.subjects ?? []).slice(0, 14).map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3.5 py-1.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
