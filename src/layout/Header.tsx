import NavBar from './NavBar';

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between px-12 py-6 md:px-28 lg:px-48 bg-white shadow-md sticky">
      <span className="font-vibook text-2xl md:text-3xl font-bold text-gray-800 px-10 py-4 tracking-tight">ViBook</span>
      <NavBar />
    </header>
  );
};

export default Header;