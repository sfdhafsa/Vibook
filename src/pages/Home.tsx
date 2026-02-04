import SearchBar from "../components/SearchBar/SearchBar";
import bgSearchBar from "../assets/bg_searchBar.png";

const Home = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div
        className="w-full min-h-[20vh] sm:min-h-[25vh] bg-cover bg-center bg-no-repeat shrink-0"
        style={{ backgroundImage: `url(${bgSearchBar})` }}
      />
      <div className="flex flex-col items-center justify-center w-full shrink-0 pb-20 px-4">
        <SearchBar />
      </div>
    </div>
  );
}

export default Home;