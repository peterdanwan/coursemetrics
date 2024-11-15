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
  MenuGroup,
  MenuDivider,
  Divider,
  Text,
  useToast,
  PopoverBody,
  PopoverCloseButton,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import useFetchUser from '../useFetchUser';

import Image from 'next/image';
import logo from '@/assets/images/CourseMetricsLogo.png';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useFlexStyle } from '@/styles/styles';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { apiFetcher } from '@/utils';
import { CiLight } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';

interface ICourseTerm {
  course_term_id: number;
  season: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

interface ICourseDetail {
  course_name: string;
  course_description: string;
}

interface ICourse {
  course_id: number;
  course_code: string;
  CourseDetail: ICourseDetail;
  course_term_id: number;
  course_section: string;
  course_delivery_format_id: number;
  createdAt: string;
  updatedAt: string;
  CourseTerm: ICourseTerm;
}

function getURL(page: string | null, limit: string | null) {
  let url: string;

  if (page && limit) {
    url = `/api/courses?page=${page}&limit=${limit}`;
  } else if (page) {
    url = `/api/courses?page=${page}`;
  } else if (limit) {
    url = `/api/courses?limit=${limit}`;
  } else {
    url = `/api/courses`;
  }

  return url;
}

export default function MainNav(props: { user: any }) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const { user, loading: userLoading, error: userError } = useFetchUser();
  const router = useRouter();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const searchParams = useSearchParams();
  const [allCourses, setAllCourses] = useState<ICourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);
  const [query, setQuery] = useState<string>('');
  const limit = 15;

  const page = searchParams.get('page') || null;
  const coursesURL = getURL(page, limit.toString());

  const { data: coursesResponse, error } = useSWR(coursesURL, apiFetcher);

  useEffect(() => {
    if (coursesResponse && coursesResponse.data) {
      setAllCourses(coursesResponse.data.courses);
    } else if (error) {
      console.error('Error fetching courses:', error);
    }
  }, [coursesResponse, error]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        const regex = new RegExp(`\\b${query}\\b`, 'i');
        const filtered = allCourses.filter(
          (course) =>
            regex.test(course.CourseDetail.course_name) ||
            course.course_code.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCourses(filtered);
      } else {
        setFilteredCourses([]);
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query, allCourses]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredCourses([]);
    const searchQuery = e.target.value;
    setQuery(searchQuery);
  };

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
    registerUserInDB();
  }, [user, userLoading, userError]);

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
        router.push(`/courses/${searchQuery}`);
        category = 'courses';
      } else if (category == 'Professor Reviews') {
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

  const getButtonText = (category: string) => {
    switch (category) {
      case 'Course Reviews':
        return 'View Courses';
      case 'Professor Reviews':
        return 'View Professors';
      default:
        return 'Search';
    }
  };

  return (
    <Box className="sticky z-50 top-0">
      <Flex
        bg={flexStyle.bgColor}
        color={flexStyle.color}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 2, sm: 3, md: 4 }}
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
          <Link href="/">
            <Image src={logo} priority alt="Course Metrics Logo" width={50} height={50} />
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav
              position="left"
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleSearch={handleSearch}
              handleSearchChange={handleSearchChange}
              filteredCourses={filteredCourses}
              getButtonText={getButtonText}
            />
          </Flex>

          <Flex display={{ base: 'none', md: 'flex' }} ml="auto">
            <DesktopNav
              position="right"
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleSearch={handleSearch}
              handleSearchChange={handleSearchChange}
              filteredCourses={filteredCourses}
              getButtonText={getButtonText}
            />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={{ base: 2, md: 4, lg: 6 }}
          align={'center'}
        >
          <Divider
            orientation="vertical"
            height="30px"
            mx={3}
            display={{ base: 'none', md: 'block' }}
            borderColor={flexStyle.dividerColor}
          />

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
              {user ? (
                <>
                  <MenuGroup sx={{ textAlign: 'center' }} title={`Hello ${props.user.name}!`}>
                    <MenuItem as="a" href="/profile">
                      Profile
                    </MenuItem>
                    {user?.role_id === 1 ? (
                      <>
                        <MenuItem>
                          <Popover trigger="click" placement="right-start" closeOnBlur>
                            {({ isOpen }) => (
                              <>
                                <PopoverTrigger>
                                  <Box
                                    as="div"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    width="100%"
                                    cursor="pointer"
                                    bg={isOpen ? 'gray.100' : 'transparent'}
                                    _hover={{ bg: 'gray.100' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <Text fontWeight={isOpen ? 'bold' : 'normal'}>Manage</Text>
                                    <ChevronRightIcon />
                                  </Box>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <Stack spacing={0}>
                                    {' '}
                                    <MenuItem
                                      as="a"
                                      href="/admin/manage?option=courses"
                                      _hover={{ bg: 'gray.100' }}
                                    >
                                      Course Management
                                    </MenuItem>
                                    <MenuItem
                                      as="a"
                                      href="/admin/manage?option=professors"
                                      _hover={{ bg: 'gray.100' }}
                                    >
                                      Professor Management
                                    </MenuItem>
                                    <MenuItem
                                      as="a"
                                      href="/admin/manage?option=reviews"
                                      _hover={{ bg: 'gray.100' }}
                                    >
                                      Review Management
                                    </MenuItem>
                                  </Stack>
                                </PopoverContent>
                              </>
                            )}
                          </Popover>
                        </MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem>
                          <Popover trigger="click" placement="right-start" closeOnBlur>
                            {({ isOpen }) => (
                              <>
                                <PopoverTrigger>
                                  <Box
                                    as="div"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    width="100%"
                                    cursor="pointer"
                                    bg={isOpen ? 'gray.100' : 'transparent'}
                                    _hover={{ bg: 'gray.100' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <Text fontWeight={isOpen ? 'bold' : 'normal'}>Reviews</Text>
                                    <ChevronRightIcon />
                                  </Box>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <Stack spacing={0}>
                                    {' '}
                                    <MenuItem
                                      as="a"
                                      href="/user/reviews/courses"
                                      _hover={{ bg: 'gray.100' }}
                                    >
                                      Courses
                                    </MenuItem>
                                    <MenuItem
                                      as="a"
                                      href="/user/reviews/professors"
                                      _hover={{ bg: 'gray.100' }}
                                    >
                                      Professors
                                    </MenuItem>
                                  </Stack>
                                </PopoverContent>
                              </>
                            )}
                          </Popover>
                        </MenuItem>
                        <MenuItem as="a" href="/user/bookmark">
                          Bookmark
                        </MenuItem>
                      </>
                    )}
                    {/* End of ELSE Logic */}
                  </MenuGroup>
                  <MenuDivider />
                  <MenuItem as="a" href="/api/auth/logout">
                    <Icon as={FiLogOut} mr={2} /> Sign out
                  </MenuItem>
                </>
              ) : (
                <MenuItem as="a" href="/api/auth/login">
                  <Icon as={FiLogIn} mr={2} /> Sign In
                </MenuItem>
              )}
            </MenuList>
          </Menu>
          <Button onClick={toggleColorMode} display={{ base: 'none', md: 'flex' }}>
            {colorMode === 'light' ? <CiLight /> : <MdDarkMode />}
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleSearch={handleSearch}
          handleSearchChange={handleSearchChange}
          filteredCourses={filteredCourses}
          onCloseMenu={onClose}
          getButtonText={getButtonText}
          toggleColorMode={toggleColorMode}
          colorMode={colorMode}
        />
      </Collapse>
    </Box>
  );
}

// -----------------------------
const DesktopNav = ({
  position,
  selectedCategory,
  setSelectedCategory,
  handleSearch,
  handleSearchChange,
  filteredCourses,
  getButtonText,
}: {
  position: string;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (searchQuery: string, category: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredCourses: ICourse[];
  getButtonText: (category: string) => string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  // console.log('Pathname:', pathname);
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const linkHoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const linkBorderRadius = 'lg';
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (filteredCourses.length > 0) {
      onOpen();
    } else {
      onClose();
    }
  }, [filteredCourses, onOpen, onClose]);

  const handlePopoverClose = () => {
    setSearchQuery('');
    handleSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    onClose();
  };

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
              <Popover isOpen={filteredCourses.length > 0} placement="bottom-start">
                <PopoverTrigger>
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearchChange(e);
                    }}
                    w={{ base: 40, md: 32, lg: 72 }}
                  />
                </PopoverTrigger>
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}
                >
                  <PopoverBody>
                    {filteredCourses.map((course: ICourse) => (
                      <Box
                        key={course.course_id}
                        p={2}
                        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                        onClick={() => router.push(`/courses/${course.course_code}`)}
                      >
                        <Text fontWeight="bold">{course.CourseDetail.course_name}</Text>
                        <Text fontSize="sm">{course.course_code}</Text>
                      </Box>
                    ))}
                  </PopoverBody>
                  <PopoverCloseButton onClick={() => handlePopoverClose()} />
                </PopoverContent>
              </Popover>

              <Button
                onClick={() => {
                  handleSearch(searchQuery, selectedCategory);
                  handlePopoverClose();
                }}
                ml={2}
                p={2}
                size={{ base: 'sm', md: 'sm', lg: 'md' }}
                _hover={{ cursor: 'pointer' }}
              >
                {getButtonText(selectedCategory)}
              </Button>
            </Flex>
          );
        }

        return (
          <Box key={navItem.label} className="px-2 whitespace-nowrap">
            <Popover trigger={'click'} placement={'bottom-start'}>
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

// -----------------------------

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
  handleSearchChange,
  filteredCourses,
  onCloseMenu,
  getButtonText,
  toggleColorMode,
  colorMode,
}: {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (searchQuery: string, category: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredCourses: ICourse[];
  onCloseMenu: () => void;
  getButtonText: (category: string) => string;
  toggleColorMode: () => void;
  colorMode: string;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (filteredCourses.length > 0) {
      onOpen();
    } else {
      onClose();
    }
  }, [filteredCourses, onOpen, onClose]);

  const handlePopoverClose = () => {
    setSearchQuery('');
    handleSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    onClose();
  };

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ base: 'block', md: 'none' }}
    >
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
              <Popover isOpen={isOpen} onClose={handlePopoverClose} placement="bottom-start">
                <PopoverTrigger>
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearchChange(e);
                    }}
                    w="100%"
                    textColor="black"
                  />
                </PopoverTrigger>
                <PopoverContent
                  border={1}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}
                  textColor="black"
                >
                  <PopoverBody p={2}>
                    {filteredCourses.map((course: ICourse) => (
                      <Box
                        key={course.course_id}
                        p={3}
                        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                        onClick={() => {
                          router.push(`/courses/${course.course_code}`);
                          handlePopoverClose();
                          onCloseMenu();
                        }}
                      >
                        <Text fontWeight="bold">{course.CourseDetail.course_name}</Text>
                        <Text fontSize="sm">{course.course_code}</Text>
                      </Box>
                    ))}
                  </PopoverBody>
                  <PopoverCloseButton onClick={handlePopoverClose} />
                </PopoverContent>
              </Popover>
              <Button
                onClick={() => {
                  handleSearch(searchQuery, selectedCategory);
                  handlePopoverClose();
                  onCloseMenu();
                }}
                ml={2}
                size={'sm'}
                p={5}
                _hover={{ cursor: 'pointer' }}
              >
                {getButtonText(selectedCategory)}
              </Button>
            </Flex>
          )}
        </React.Fragment>
      ))}
      <Button
        onClick={toggleColorMode}
        leftIcon={colorMode === 'light' ? <CiLight /> : <MdDarkMode />}
      >
        {colorMode === 'light' ? 'Light' : 'Dark'} Mode
      </Button>
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
                _hover={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
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
