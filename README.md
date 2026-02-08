# Library Web App

This project is a frontend web application for a town library, built using **React**, **TypeScript**, and **Vite**. It connects to the [Open Library API](https://openlibrary.org/developers/api) and optionally fetches additional information from **Wikipedia** to enrich book details.

---

## Technologies Used

- **React** – for building interactive UI components
- **TypeScript** – for type safety and better developer experience
- **Vite** – fast build tool with HMR
- **Tailwind CSS** – utility-first CSS framework for styling
- **Playwright** – for end-to-end testing
- **React Router** – for client-side routing
- **ESLint & Prettier** – for code quality and formatting
- **Open Library API** – for book data and recent changes
- **Wikipedia API** – for author information, descriptions, and critical analyses

---

## Project Structure

- `src/components` – reusable components such as `SearchBar`, `BookCard`, `RecentChanges`, `Pagination`, and `Loader`
- `src/pages` – main pages of the application:
  - **Home** – displays hero banner, search bar, and recent changes
  - **Search** – advanced search with filters (author, subject, year, language) and suggestions
  - **BookDetails** – detailed view of a selected book including author info and Wikipedia data
- `src/hooks` – custom hooks, e.g., `useHandleSearch` and `useSearchSuggestions`
- `src/api` – API wrapper functions for Open Library and Wikipedia

---

## Features

1. **Quick Search**
   - Search visible on all pages
   - Shows book titles matching the query
   - Includes real-time suggestions

2. **Advanced Search**
   - Filter by author, subject, year, and language
   - Works with the same search infrastructure
   - Pagination supported

3. **Recent Changes**
   - Displays recent activity from Open Library
   - Color-coded badges for type of change (edit, new, merge, delete)
   - Shows author and timestamp

4. **Book Details Page**
   - Covers, title, author, publication date, and subjects
   - Wikipedia data for author and critical analyses
   - Clean, responsive design

5. **Testing**
   - End-to-end tests using **Playwright**
   - Mocked API calls for reliable test results

---

## Installation

```bash
# Clone repository
git clone <repository_url>
cd <project_folder>

# Install dependencies
npm install

# Run the development server
npm run dev
