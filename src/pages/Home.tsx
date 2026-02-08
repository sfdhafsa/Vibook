import SearchBar from "@/components/SearchBar/SearchBar";
import bgSearchBar from "@/assets/bg_searchBar.png";
import RecentChanges from "@/components/RecentChanges/RecentChanges";

const Home = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* HERO / HEADER */}
      <div
        className="relative w-full h-28 sm:h-32 md:h-36 rounded-b-3xl shadow-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${bgSearchBar})` }}
      />

      <div className="relative -mt-6 flex justify-center w-full px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-2xl rounded-xl p-4 md:p-6 shadow-md bg-white/90 backdrop-blur">
          <SearchBar />
        </div>
      </div>

      {/* RECENT CHANGES */}
      <section className="w-full mt-10 pb-16 flex justify-center px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl w-full">
          <RecentChanges limit={10} />
        </div>
      </section>
    </div>
  );
};

export default Home;
