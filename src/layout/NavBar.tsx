import { NavLink } from 'react-router';

const NavBar = () => {
  return (
    <nav className="flex items-center gap-3">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center justify-center p-2 rounded transition ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`
        }
      >
        <img src="/home.png" alt="Home" className="w-9 h-9 object-contain" />
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex items-center justify-center p-2 rounded transition ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`
        }
      >
        <img src="/searchBook.jpg" alt="Search" className="w-6 h-6 object-contain" />
      </NavLink>
    </nav>
  );
};

export default NavBar;
