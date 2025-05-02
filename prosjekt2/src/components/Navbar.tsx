import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toggle } from '@radix-ui/react-toggle';
import { Globe, Map, MapPin, Menu, Moon, Sun, User } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation for current path detection
import { ThemeContext } from '../ThemeContext'; // Importer ThemeContext for Dark Mode

type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
};

const navItems: NavItem[] = [
  { name: 'My travels', icon: MapPin, href: '/mytravels' },
  { name: 'Map', icon: Map, href: '/maps' },
  { name: 'Explore', icon: Globe, href: '/' },
  { name: 'Profile', icon: User, href: '/profile' },
];

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext); // Hent Dark Mode-informasjon fra konteksten
  const [activePage, setActivePage] = useState(location.pathname);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavigation = (href: string) => {
    setActivePage(href);
    navigate(href);
  };

  const NavItems = React.memo(() => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.name}
          variant={activePage === item.href ? 'secondary' : 'ghost'}
          className={` text-lg py-6 ${
            activePage === item.href ? 'bg-background' : ''
          }`}
          onClick={() => handleNavigation(item.href)}
        >
          <item.icon className="mr-2 h-5 w-5" />
          {item.name}
        </Button>
      ))}
    </>
  ));

  return (
    <header className="bg-tertiary p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo on the left */}
        <a
          href="/"
          aria-label="Navigate to TravelTracker homepage"
          className=" text-3xl font-bold"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation('/');
          }}
        >
          TravelTracker
        </a>

        <div className="flex items-center space-x-4">
          {/* Navigation Links */}
          {isMobile ? (
            <>
              <Toggle
                pressed={theme === 'dark'}
                onPressedChange={toggleTheme}
                className="rounded-md transition-all duration-300 ease-in-out"
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-primary animate-spin-once" />
                ) : (
                  <Sun className="h-5 w-5 text-primary animate-spin-once" />
                )}
              </Toggle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className=" ml-auto ">
                    <Menu className="h-[1.4rem] w-[1.4rem]" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Button
                        variant={
                          activePage === item.href ? 'secondary' : 'ghost'
                        }
                        className={`w-full justify-start text-lg ${
                          activePage === item.href
                            ? 'bg-[#b8c1a6] text-[#4a4a2e]'
                            : ''
                        }`}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <nav className="flex items-center space-x-2 ml-auto mr-0">
                <NavItems />
              </nav>

              <Toggle
                pressed={theme === 'dark'}
                onPressedChange={toggleTheme}
                className="rounded-md transition-all duration-300 ease-in-out"
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-primary animate-spin-once" />
                ) : (
                  <Sun className="h-5 w-5 text-primary animate-spin-once" />
                )}
              </Toggle>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
