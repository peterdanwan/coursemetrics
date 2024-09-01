// components/Navbar/Navbar.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/images/pin.svg";
import profileDefault from "@/assets/images/pin.svg";
import { useUser } from "@auth0/nextjs-auth0/client";

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, error, isLoading }: any = useUser();

  // Get the path after our domain (e.g., with localhost:3000/home/users you would get /home/users)
  const pathname = usePathname();

  // Boilerplate code for useUser (from Auth0)
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  // return (
  //   <div>
  //     <Button>
  //       <Link href="/api/auth/login">Login</Link>
  //     </Button>
  //     <Button>
  //       <Link href="/api/auth/logout">Logout</Link>
  //     </Button>
  //     {user && (
  //       <div>
  //         <Image src={user.picture} alt={user.name} width={300} height={300} />
  //         <h2>{user.name}</h2>
  //         <p>{user.email}</p>
  //       </div>
  //     )}
  //   </div>
  // );

  // Applies the base style + an optional black background depending if we are on the corresponding link
  const desktopMenuLinkStyle = (linkPath: string) => {
    const baseStyle =
      "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";
    return `${pathname === linkPath && "bg-black"} ${baseStyle}`;
  };

  // Styles for mobile menu links
  const mobileMenu = () => {
    const mobileMenuLinkStyles =
      "text-white block rounded-md px-3 py-2 text-base font-medium";
    const getMobileMenuLinkStyle = (linkPath: string) => {
      return `${pathname === linkPath && "bg-black"} ${mobileMenuLinkStyles}`;
    };

    return (
      <div id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link href="/" className={getMobileMenuLinkStyle("/")}>
            Home
          </Link>
          <Link
            href="/properties"
            className={getMobileMenuLinkStyle("/properties")}
          >
            Properties
          </Link>

          {user && (
            <Link
              href="/properties/add"
              className={getMobileMenuLinkStyle("/properties/add")}
            >
              Add Property
            </Link>
          )}

          {!user && (
            <button className="flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 my-4">
              <Link href="/api/auth/login">Login</Link>
            </button>
          )}
        </div>
      </div>
    );
  };

  const userMenu = () => {
    const menuLinkStyles = "block px-4 py-2 text-sm text-gray-700";

    return (
      <div
        id="user-menu"
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
      >
        <Link
          href="/profile"
          className={menuLinkStyles}
          role="menuitem"
          id="user-menu-item-0"
        >
          Your Profile
        </Link>
        <Link
          href="/properties/saved"
          className={menuLinkStyles}
          role="menuitem"
          id="user-menu-item-1"
        >
          Saved Properties
        </Link>
        <button
          className={menuLinkStyles}
          role="menuitem"
          id="user-menu-item-2"
          onClick={() => {
            setIsProfileMenuOpen(false);
            // signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    );
  };

  const loggedOutMenu = () => {
    return (
      <div className="hidden md:block md:ml-6">
        <div className="flex items-center">
          <Link href="/api/auth/login">Log In</Link>
        </div>
      </div>
    );
  };

  const loggedInMenu = () => {
    return (
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
        <Link href="/messages" className="relative group">
          <button
            type="button"
            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span className="absolute -inset-1.5"></span>
            <span className="sr-only">View notifications</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </button>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            2{/* <!-- Replace with the actual number of notifications --> */}
          </span>
        </Link>
        {/* <!-- Profile dropdown button --> */}
        <div className="relative ml-3">
          <div>
            <button
              type="button"
              className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">Open user menu</span>
              <Image
                className="h-8 w-8 rounded-full"
                src={user?.picture || profileDefault}
                width={40}
                height={40}
                alt="profile-picture"
              />
            </button>
          </div>

          {/* <!-- Profile dropdown --> */}
          {isProfileMenuOpen && userMenu()}
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-blue-700 border-b border-blue-500 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              id="mobile-dropdown-button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* <!-- Logo --> */}
            <Link className="flex flex-shrink-0 items-center" href="/">
              <Image className="h-10 w-auto" src={logo} alt="PropertyPulse" />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                PropertyPulse
              </span>
            </Link>
            {/* <!-- Desktop Menu is Hidden below md screens --> */}
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-2">
                <Link href="/" className={desktopMenuLinkStyle("/")}>
                  Home
                </Link>
                <Link
                  href="/properties"
                  className={desktopMenuLinkStyle("/properties")}
                >
                  Properties
                </Link>
                {user && (
                  <Link
                    href="/properties/add"
                    className={desktopMenuLinkStyle("/properties/add")}
                  >
                    Add Property
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* <!-- Right Side Menu (Logged Out) --> */}
          {!user && loggedOutMenu()}

          {/* <!-- Right Side Menu (Logged In) --> */}
          {user && loggedInMenu()}
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      {isMobileMenuOpen && mobileMenu()}
    </nav>
  );
};

export default NavBar;
