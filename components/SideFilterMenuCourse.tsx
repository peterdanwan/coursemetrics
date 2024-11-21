// components/SideFilterMenuCourse.tsx

import { logger } from '@/utils';
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

import React, { useState } from 'react';

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
  handleTermChange: (term: string) => void;
  handleSectionChange: (section: string) => void;
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
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const applyChanges = () => {
    if (selectedTerm) handleTermChange(selectedTerm);
    if (selectedSection) handleSectionChange(selectedSection);
    onClose();
  };

  React.useEffect(() => {
    if (selectedTerm) {
      handleTermChange(selectedTerm);
    }
  }, [handleTermChange, selectedTerm]);

  React.useEffect(() => {
    if (!selectedTerm) {
      setSelectedSection(null);
    }
  }, [selectedTerm]);

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
              {terms.length > 0 && (
                <Box>
                  <Select
                    placeholder="Select Term"
                    size="md"
                    onChange={(e) => setSelectedTerm(e.target.value || null)}
                    value={selectedTerm || ''}
                  >
                    {terms.map((term) => (
                      <option
                        key={`${term.season}_${term.year}`}
                        value={`${term.season}_${term.year}` || ''}
                      >
                        {term.season} {term.year}
                      </option>
                    ))}
                  </Select>
                </Box>
              )}
              {selectedTerm && sections.length > 0 && (
                <Box>
                  <Select
                    placeholder="Select Section"
                    size="md"
                    onChange={(e) => setSelectedSection(e.target.value)}
                    value={selectedSection?.toString() || ''}
                  >
                    {sections.map((section) => (
                      <option key={section.course_id} value={section.course_section}>
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
