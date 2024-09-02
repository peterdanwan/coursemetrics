// components/Navbar/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '@/assets/images/CourseMetricsLogo.png';
import profileDefault from '@/assets/images/pin.svg';
import { useUser } from '@auth0/nextjs-auth0/client';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showReviewsSubmenu, setShowReviewsSubmenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    'Select the category... ▼'
  );

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  const { user, error, isLoading }: any = useUser();

  // Get the path after our domain (e.g., with localhost:3000/home/users you would get /home/users)
  const pathname = usePathname();

  // Boilerplate code for useUser (from Auth0)
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  // Applies the base style + an optional black background depending if we are on the corresponding link
  const desktopMenuLinkStyle = (linkPath: string) => {
    const baseStyle =
      'text-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';
    return `${pathname === linkPath && 'bg-gray-600 text-white'} ${baseStyle} `;
  };

  // Styles for mobile menu links
  const mobileMenu = () => {
    const mobileMenuLinkStyles =
      'text-black block rounded-md px-3 py-2 hover:bg-gray-900 hover:text-white font-medium';
    const getMobileMenuLinkStyle = (linkPath: string) => {
      return `${
        pathname === linkPath && 'bg-gray-600 text-white'
      } ${mobileMenuLinkStyles}`;
    };

    return (
      <div id='mobile-menu' className='md:hidden'>
        <div className='space-y-1 px-2 pb-3 pt-2'>
          <Link href='/' className={getMobileMenuLinkStyle('/')}>
            Home
          </Link>
          <Link href='/about' className={getMobileMenuLinkStyle('/about')}>
            About
          </Link>
          <Link href='/contact' className={getMobileMenuLinkStyle('/contact')}>
            Contact Me
          </Link>
          <Link href='/faq' className={getMobileMenuLinkStyle('/faq')}>
            FAQ
          </Link>
          <div className='relative cursor-pointer bg-white text-black py-2 px-3 rounded font-semibold'>
            <div onClick={() => setShowDropdown(!showDropdown)}>
              {selectedCategory}
            </div>
            {showDropdown && (
              <div className='absolute top-full left-0 bg-white text-black min-w-full shadow-lg z-10'>
                <Link
                  href='#'
                  onClick={() => handleSelectCategory('Professor')}
                  className='block px-4 py-2 hover:bg-gray-200'
                >
                  Professor
                </Link>
                <Link
                  href='#'
                  onClick={() => handleSelectCategory('Course')}
                  className='block px-4 py-2 hover:bg-gray-200'
                >
                  Course
                </Link>
                <Link
                  href='#'
                  onClick={() => handleSelectCategory('Skill')}
                  className='block px-4 py-2 hover:bg-gray-200'
                >
                  Skill
                </Link>
                <Link
                  href='#'
                  onClick={() => handleSelectCategory('Program/Category')}
                  className='block px-4 py-2 hover:bg-gray-200'
                >
                  Program/Category
                </Link>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className='flex items-center mt-3'>
            <input
              type='text'
              placeholder='Search...'
              className='p-2 border rounded mr-3 w-full'
            />
            <button className='bg-gray-600 text-white p-2 rounded'>
              Search
            </button>
          </div>
          {!user && (
            <Link href='/api/auth/login' className={mobileMenuLinkStyles}>
              Login
            </Link>
          )}
        </div>
      </div>
    );
  };

  const userMenu = () => {
    const menuLinkStyles = 'block px-4 py-2 text-sm text-gray-700';

    return (
      <div
        id='user-menu'
        className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='user-menu-button'
      >
        <Link
          href='/profile'
          className={menuLinkStyles}
          role='menuitem'
          id='user-menu-item-0'
        >
          Profile
        </Link>
        <div>
          <button
            onClick={() => setShowReviewsSubmenu(!showReviewsSubmenu)}
            className={`${menuLinkStyles} w-full text-left`}
            role='menuitem'
            id='user-menu-item-1'
          >
            Reviews
          </button>
          {showReviewsSubmenu && (
            <div className='absolute right-full top-0 mt-0 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <Link
                href='/reviews/course'
                className={menuLinkStyles}
                role='menuitem'
                id='user-menu-item-1-1'
                aria-orientation='vertical'
              >
                Course
              </Link>
              <Link
                href='/reviews/professor'
                className={menuLinkStyles}
                role='menuitem'
                id='user-menu-item-1-2'
              >
                Professor
              </Link>
              <Link
                href='/reviews/addenda'
                className={menuLinkStyles}
                role='menuitem'
                id='user-menu-item-1-3'
              >
                Addenda
              </Link>
            </div>
          )}
        </div>
        <Link
          href='/properties/saved'
          className={menuLinkStyles}
          role='menuitem'
          id='user-menu-item-1'
        >
          Bookmarks
        </Link>
        <Link
          href='/profile'
          className={menuLinkStyles}
          role='menuitem'
          id='user-menu-item-0'
        >
          Settings & Privacy
        </Link>
        <hr></hr>
        <Link
          href='/api/auth/logout'
          className={menuLinkStyles}
          role='menuitem'
          id='user-menu-item-2'
          onClick={() => {
            setIsProfileMenuOpen(false);
          }}
        >
          🚪Sign Out
        </Link>
      </div>
    );
  };

  const loggedOutMenu = () => {
    return (
      <div className='hidden md:block md:ml-6'>
        <div className='flex items-center text-black'>
          <Link href='/api/auth/login'>
            <button className='bg-[#0B2027] text-white px-4 py-2 rounded hover:bg-gray-600'>
              Log in
            </button>
          </Link>
        </div>
      </div>
    );
  };

  const loggedInMenu = () => {
    return (
      <div className='absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0'>
        {/* <!-- Profile dropdown button --> */}
        <div className='relative ml-3'>
          <div>
            <button
              type='button'
              className='relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
              id='user-menu-button'
              aria-expanded='false'
              aria-haspopup='true'
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            >
              <span className='absolute -inset-1.5'></span>
              <span className='sr-only'>Open user menu</span>
              <Image
                className='h-8 w-8 rounded-full'
                src={user?.picture || profileDefault}
                width={40}
                height={40}
                alt='profile-picture'
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
    <nav className='bg-white border-b border-[#0B2027]-500 sticky top-0 z-50'>
      <div className='mx-auto max-w-8xl px-1 sm:px-2 lg:px-4'>
        <div className='relative flex h-20 items-center justify-start'>
          <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
            <button
              type='button'
              id='mobile-dropdown-button'
              className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded='false'
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className='absolute -inset-0.5'></span>
              <span className='sr-only'>Open main menu</span>
              <svg
                className='block h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          </div>

          {/* Left side of the Navbar*/}
          <div className='flex flex-auto items-center justify-end md:justify-start'>
            <Link className='flex flex-shrink-0 items-center' href='/'>
              <Image className='h-20 w-auto' src={logo} alt='CourseMetrics' />
              <span className='hidden md:block text-black text-2xl font-bold ml-2'>
                CourseMetrics
              </span>
            </Link>

            {/* Desktop Dropdown Menu */}
            <div className='relative cursor-pointer w-52 bg-white text-black py-2 px-3 rounded hidden md:block ml-4'>
              <div onClick={() => setShowDropdown(!showDropdown)}>
                {selectedCategory}
              </div>
              {showDropdown && (
                <div className='absolute top-full left-0 bg-white text-black min-w-full shadow-lg z-10'>
                  <Link
                    href='#'
                    onClick={() => handleSelectCategory('Professor')}
                    className='block px-4 py-2 hover:bg-gray-200'
                  >
                    Professor
                  </Link>
                  <Link
                    href='#'
                    onClick={() => handleSelectCategory('Course')}
                    className='block px-4 py-2 hover:bg-gray-200'
                  >
                    Course
                  </Link>
                  <Link
                    href='#'
                    onClick={() => handleSelectCategory('Skill')}
                    className='block px-4 py-2 hover:bg-gray-200'
                  >
                    Skill
                  </Link>
                  <Link
                    href='#'
                    onClick={() => handleSelectCategory('Program/Category')}
                    className='block px-4 py-2 hover:bg-gray-200'
                  >
                    Program/Category
                  </Link>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className='flex items-center ml-5 hidden md:flex md:flex-nowrap'>
              <input
                type='text'
                placeholder='Search...'
                className='p-2 border rounded mr-3 text-black'
              />
              <button className='bg-[#0B2027] text-white px-4 py-2 rounded'>
                Search
              </button>
            </div>
          </div>

          {/* Right side of the Navbar*/}
          <div className='flex items-center flex-1 justify-end'>
            {/*  Desktop Menu is Hidden below md screens */}
            <div className='hidden md:ml-6 md:block'>
              <div className='flex space-x-2'>
                {/* Links */}
                <Link href='/' className={desktopMenuLinkStyle('/')}>
                  Home
                </Link>
                <Link href='/about' className={desktopMenuLinkStyle('/about')}>
                  About
                </Link>
                <Link
                  href='/contact'
                  className={desktopMenuLinkStyle('/contact')}
                >
                  Contact Me
                </Link>
                <Link href='/faq' className={desktopMenuLinkStyle('/faq')}>
                  FAQ
                </Link>
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
