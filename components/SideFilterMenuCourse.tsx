// components/SideFilterMenuCourse.tsx

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Select,
  useDisclosure,
  Box,
  VStack,
} from '@chakra-ui/react';

import React from 'react';

interface ICourseTerm {
  season: string;
  year: number;
}

interface ICourse {
  course_id: number;
  course_section: string;
  CourseTerm: ICourseTerm;
}

interface SideFilterMenuCourseProps {
  terms: ICourseTerm[];
  sections: ICourse[];
  course: ICourse | null;
  handleTermChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSectionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SideFilterMenuCourse({
  terms,
  sections,
  course,
  handleTermChange,
  handleSectionChange,
}: SideFilterMenuCourseProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Filters
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter Reviews</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch" textColor={'black'}>
              {terms.length > 0 && (
                <Box>
                  <Select
                    placeholder="Select Term"
                    size="md"
                    onChange={handleTermChange}
                    value={course ? `${course.CourseTerm.season}_${course.CourseTerm.year}` : ''}
                  >
                    {terms.map((term) => (
                      <option
                        key={`${term.season}_${term.year}`}
                        value={`${term.season}_${term.year}`}
                      >
                        {term.season} {term.year}
                      </option>
                    ))}
                  </Select>
                </Box>
              )}
              {sections.length > 0 && (
                <Box>
                  <Select
                    placeholder="Select Section"
                    size="md"
                    onChange={handleSectionChange}
                    value={course?.course_id || ''}
                  >
                    {sections.map((section) => (
                      <option key={section.course_id} value={section.course_id}>
                        {section.course_section}
                      </option>
                    ))}
                  </Select>
                </Box>
              )}
              {/* Add any additional filters here */}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
