import React from 'react';
import Footer from '../Footer';
import Navbar from '../Navbar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen text-primary flex flex-col">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow flex items-center justify-center m-4">
        {children}
      </main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
