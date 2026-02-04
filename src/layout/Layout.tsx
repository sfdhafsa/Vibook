import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 bg-gray-50 p-4 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
