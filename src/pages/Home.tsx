import SearchBar from "@/components/SearchBar/SearchBar";
import bgSearchBar from "@/assets/bg_searchBar.png";

const Home = () => {
  return (
    <div className="flex flex-col w-full gap-4 min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div
        className="w-full min-h-[22vh] sm:min-h-[28vh] bg-cover bg-center bg-no-repeat shrink-0 rounded-b-3xl shadow-lg"
        style={{ backgroundImage: `url(${bgSearchBar})` }}
      />
      <div className="flex flex-col items-center justify-center w-full shrink-0 pb-24 px-4 mt-[-3rem]">
        <SearchBar />
      </div>
    </div>
  );
};

export default Home;
