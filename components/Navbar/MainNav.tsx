// components/Navbar/MainNav.tsx
'use client';
import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Input,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Divider,
  Text,
  Toast,
  useToast,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

import Image from 'next/image';
import logo from '@/assets/images/CourseMetricsLogo.png';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFlexStyle } from '@/styles/styles';
import { useRouter } from 'next/navigation';

export default function MainNav(props: { user: any }) {
  const { isOpen, onToggle } = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const router = useRouter();
  const toast = useToast();

  const registerUserInDB = async () => {
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // If the user is not stored in the database, store all details
  useEffect(() => {
    if (props.user) {
      registerUserInDB();
    }
  }, [props.user]);

  const flexStyle = useFlexStyle();
  const handleSearch = (searchQuery: string, category: string) => {
    if (searchQuery === '') {
      if (category === 'Select Category') {
        toast({
          title: 'Invalid Search',
          description: 'Please select a category before searching',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      } else if (category == 'Course Reviews') {
        router.push('/courses');
      } else if (category == 'Professor Reviews') {
        router.push('/professors');
      }
    } else {
      if (category == 'Course Reviews') {
        // go to course page
        router.push(`/courses/${searchQuery}`);
        category = 'courses';
      } else if (category == 'Professor Reviews') {
        // go to professor page
        router.push(`/professors/${searchQuery}`);
        category = 'professors';
      } else if (category == 'Select Category') {
        toast({
          title: 'Invalid Search',
          description: 'Please select a category before searching',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
  };

  return (
    <Box className="sticky z-50 top-0">
      <Flex
        bg={flexStyle.bgColor}
        color={flexStyle.color}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={flexStyle.borderColor}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <Link href="/">
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Link>
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Image src={logo} alt="Course Metrics Logo" width={50} height={50} />

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav
              position="left"
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleSearch={handleSearch}
            />
          </Flex>

          <Flex display={{ base: 'none', md: 'flex' }} ml="auto">
            <DesktopNav
              position="right"
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleSearch={handleSearch}
            />
          </Flex>
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
          <Divider orientation="vertical" height="30px" mx={3} />
          <Menu>
            <MenuButton
              as={IconButton}
              // icon={<Avatar size={"sm"} />}
              icon={<Avatar size={'sm'} src={props.user?.picture} />}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            />
            <MenuList>
              {props.user ? (
                <MenuItem as="a" href="/api/auth/logout">
                  Sign out
                </MenuItem>
              ) : (
                <MenuItem as="a" href="/api/auth/login">
                  Sign In
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleSearch={handleSearch}
        />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({
  position,
  selectedCategory,
  setSelectedCategory,
  handleSearch,
}: {
  position: string;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (searchQuery: string, category: string) => void;
}) => {
  const pathname = usePathname();
  console.log('Pathname:', pathname);
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const linkHoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const linkBorderRadius = 'lg';
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Stack direction={'row'} spacing={{ md: 1, lg: 2 }} alignItems="center">
      {NAV_ITEMS.filter((navItem) => {
        if (position === 'left') {
          return !navItem.isRightAligned;
        } else {
          return navItem.isRightAligned;
        }
      }).map((navItem) => {
        const label = navItem.label === 'Select Category' ? selectedCategory : navItem.label;
        if (navItem.isSearch) {
          return (
            <Flex key={navItem.label} align="center">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                w={{ base: 40, md: 32, lg: 72 }}
              />
              <Button onClick={() => handleSearch(searchQuery, selectedCategory)} ml={2}>
                Search
              </Button>
            </Flex>
          );
        }

        return (
          <Box key={navItem.label} className="px-2 whitespace-nowrap">
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link href={navItem.href ?? '#'}>
                  <Text
                    fontSize={'md'}
                    fontWeight={500}
                    color={linkColor}
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                      bg: linkHoverBgColor,
                      borderRadius: linkBorderRadius,
                    }}
                  >
                    {label}
                  </Text>
                </Link>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav
                        key={child.label}
                        {...child}
                        setSelectedCategory={setSelectedCategory}
                        isClearOption={child.isClearOption}
                      />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        );
      })}
    </Stack>
  );
};

const DesktopSubNav = ({
  label,
  href,
  subLabel,
  setSelectedCategory,
  isClearOption,
}: NavItem & { setSelectedCategory?: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <Box
      as="a"
      href={href}
      onClick={() => {
        if (setSelectedCategory) {
          if (isClearOption) {
            setSelectedCategory('Select Category');
          } else {
            setSelectedCategory(label);
          }
        }
      }}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
      color={isClearOption ? 'red.500' : 'inherit'}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text transition={'all .3s ease'} _groupHover={{ color: 'pink.400' }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = ({
  selectedCategory,
  setSelectedCategory,
  handleSearch,
}: {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (searchQuery: string, category: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem, index) => (
        <React.Fragment key={navItem.label}>
          <MobileNavItem
            {...navItem}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isClearOption={navItem.isClearOption}
          />
          {/* Insert search bar after "Select Category" */}
          {index === 0 && (
            <Flex align="center" mt={2} mb={4}>
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                width="full"
                color={'black'}
              />
              <Button onClick={() => handleSearch(searchQuery, selectedCategory)} ml={2}>
                Search
              </Button>
            </Flex>
          )}
        </React.Fragment>
      ))}
    </Stack>
  );
};

const MobileNavItem = ({
  label,
  children,
  href,
  selectedCategory,
  setSelectedCategory,
  isClearOption,
}: NavItem & {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
          {label === 'Select Category' ? selectedCategory : label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Box
                as="a"
                key={child.label}
                py={2}
                href={child.href}
                onClick={() => {
                  if (child.isClearOption) {
                    setSelectedCategory('Select Category');
                  } else {
                    setSelectedCategory(child.label);
                  }
                }}
                _hover={{ textDecoration: 'none' }}
              >
                <Text color={child.isClearOption ? 'red.500' : 'gray.600'} fontWeight={500}>
                  {child.label}
                </Text>
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  isSearch?: boolean;
  isRightAligned?: boolean;
  isClearOption?: boolean;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Select Category',
    children: [
      {
        label: 'Course Reviews',
        subLabel: 'Browse Course Reviews',
      },
      {
        label: 'Professor Reviews',
        subLabel: 'Browse Professor Reviews',
      },
      {
        label: 'Clear',
        isClearOption: true,
      },
    ],
  },
  {
    label: 'Search',
    isSearch: true,
  },
  {
    label: 'Home',
    href: '/',
    isRightAligned: true,
  },
  {
    label: 'About',
    href: '/about',
    isRightAligned: true,
  },
  {
    label: 'Contact Us',
    href: '/contact',
    isRightAligned: true,
  },
  {
    label: 'FAQ',
    href: '/faq',
    isRightAligned: true,
  },
];
