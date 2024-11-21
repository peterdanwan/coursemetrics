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

import React, { useEffect, useState } from 'react';

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
  courses: ICourse[];
  selectedTerm: string | null;
  selectedSection: string | null;
  handleTermChange: (term: string | null) => void;
  handleSectionChange: (section: string | null) => void;
}

export default function SideFilterMenuCourse({
  terms,
  courses,
  selectedTerm,
  selectedSection,
  handleTermChange,
  handleSectionChange,
}: SideFilterMenuCourseProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [localSelectedTerm, setLocalSelectedTerm] = useState<string | null>(selectedTerm);
  const [localSelectedSection, setLocalSelectedSection] = useState<string | null>(selectedSection);
  const [availableSections, setAvailableSections] = useState<string[]>([]);

  useEffect(() => {
    setLocalSelectedTerm(selectedTerm);
  }, [selectedTerm]);

  useEffect(() => {
    setLocalSelectedSection(selectedSection);
  }, [selectedSection]);

  useEffect(() => {
    if (localSelectedTerm) {
      const [season, year] = localSelectedTerm.split('_');
      const sectionsForTerm = courses
        .filter(
          (course) =>
            course.CourseTerm.season === season && course.CourseTerm.year.toString() === year
        )
        .map((course) => course.course_section);

      // Remove duplicates
      const uniqueSections = Array.from(new Set(sectionsForTerm));
      setAvailableSections(uniqueSections);
    } else {
      setAvailableSections([]);
    }

    // Reset localSelectedSection when term changes
    setLocalSelectedSection(null);
  }, [localSelectedTerm, courses]);

  const applyChanges = () => {
    handleTermChange(localSelectedTerm);
    handleSectionChange(localSelectedSection);
    onClose();
  };

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Filters
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter Reviews</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Select
                  placeholder="Select Term"
                  size="md"
                  onChange={(e) => setLocalSelectedTerm(e.target.value || null)}
                  value={localSelectedTerm || ''}
                >
                  {terms.length > 0 ? (
                    terms.map((term) => (
                      <option
                        key={`${term.season}_${term.year}`}
                        value={`${term.season}_${term.year}` || ''}
                      >
                        {term.season} {term.year}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No terms available
                    </option>
                  )}
                </Select>
              </Box>

              <Box>
                <Select
                  placeholder="Select Section"
                  size="md"
                  onChange={(e) => setLocalSelectedSection(e.target.value)}
                  value={localSelectedSection || ''}
                  isDisabled={!localSelectedTerm || availableSections.length === 0}
                >
                  {availableSections.length > 0 ? (
                    availableSections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No sections available
                    </option>
                  )}
                </Select>
              </Box>

              {/* Add any additional filters here */}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="teal" onClick={applyChanges}>
              Apply
            </Button>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
