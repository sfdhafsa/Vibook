// src/components/BookCard/BookCard.tsx
import { Link } from "react-router";

export type BookCardProps = {
  title: string;
  author?: string;
  cover: string | null;
  link: string;
};

function BookCard({ title, author, cover, link }: BookCardProps) {
  return (
    <Link
      to={link}
      className="block rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-2"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] w-full min-h-[120px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <span className="text-sm text-gray-500 flex items-center justify-center w-full h-full">
            No cover
          </span>
        )}
      </div>

      {/* Text info */}
      <div className="flex flex-col justify-between px-2 pt-1 pb-2">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
          {title}
        </h3>
        <p
          className={`text-xs mt-1 line-clamp-1 ${
            author ? "text-gray-600" : "text-gray-400 italic"
          }`}
        >
          {author ? author : "Unknown author"}
        </p>
      </div>
    </Link>
  );
}

export default BookCard;
