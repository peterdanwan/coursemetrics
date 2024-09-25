import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Container,
  Heading,
  Text,
  Stack,
  List,
  ListItem,
} from '@chakra-ui/react';

export default function Faq() {
  return (
    <Container maxW="2xl" py={10} centerContent>
      <Heading as="h1" size="2xl" textAlign="center" mb={10} color="#F5F5F5">
        Frequently Asked Questions
      </Heading>
      <Accordion allowMultiple width="100%">
        {/* FAQ 1 */}
        <AccordionItem>
          <Heading as="h2" size="md" color="#F5F5F5">
            <AccordionButton _expanded={{ bg: '#1A3036', color: '#A0D8E1' }}>
              <Box flex="1" textAlign="left" color="#F5F5F5">
                What is CourseMetrics?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4} color="#E0E0E0">
            CourseMetrics aims to create a dedicated platform specifically for providing detailed
            information about college and university courses and professors. The platform allows
            students to share their experiences and opinions about the courses and professors they
            have taken. This information can help other students make informed decisions when
            choosing their courses and professors.
          </AccordionPanel>
        </AccordionItem>

        {/* FAQ 2 #B3E5FC */}
        <AccordionItem>
          <Heading as="h2" size="md" color="#F5F5F5">
            <AccordionButton _expanded={{ bg: '#1A3036', color: '#A0D8E1' }}>
              <Box flex="1" textAlign="left" color="#F5F5F5">
                How do you make a review?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4} color="#E0E0E0">
            <Text mb={3}>
              To make a review, you must first create an account. Once you have an account, there
              are two ways to make a review.
            </Text>
            <Stack spacing={4}>
              {/* First Way */}
              <Box>
                <Text fontWeight="bold" mb={2} color="#F5F5F5">
                  First Way:
                </Text>
                <List spacing={2} pl={4}>
                  <ListItem>
                    <Text as="span" color="#E0E0E0" mr={2}>
                      ●
                    </Text>
                    Go to the course or professor page you want to review.
                  </ListItem>
                  <ListItem>
                    <Text as="span" color="#E0E0E0" mr={2}>
                      ●
                    </Text>
                    Click on the &quot;Add&quot; button.
                  </ListItem>
                  <ListItem>
                    <Text as="span" color="#E0E0E0" mr={2}>
                      ●
                    </Text>
                    Fill out the form with the necessary information.
                  </ListItem>
                </List>
              </Box>

              {/* Second Way */}
              <Box>
                <Text fontWeight="bold" mb={2} color="#F5F5F5">
                  Second Way:
                </Text>
                <List spacing={2} pl={4}>
                  <ListItem>
                    <Text as="span" color="#E0E0E0" mr={2}>
                      ●
                    </Text>
                    Go to the &quot;Reviews&quot; menu in your Profile Menu.
                  </ListItem>
                  <ListItem>
                    <Text as="span" color="#E0E0E0" mr={2}>
                      ●
                    </Text>
                    Select the submenu you want to add a review (Courses or Professors).
                  </ListItem>
                  <ListItem>
                    <Text as="span" color="#E0E0E0" mr={2}>
                      ●
                    </Text>
                    Click the &quot;Add&quot; button.
                  </ListItem>
                  <ListItem>
                    <Text as="span" color="#E0E0E0" mr={2}>
                      ●
                    </Text>
                    Fill out the form with the necessary information.
                  </ListItem>
                </List>
              </Box>
            </Stack>
          </AccordionPanel>
        </AccordionItem>

        {/* FAQ 3 */}
        <AccordionItem>
          <Heading as="h2" size="md" color="#F5F5F5">
            <AccordionButton _expanded={{ bg: '#1A3036', color: '#A0D8E1' }}>
              <Box flex="1" textAlign="left" color="#F5F5F5">
                Do I have to create an account to view reviews?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4} color="#E0E0E0">
            No, you can still view the courses and professors reviews without having to create an
            account.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Container>
  );
}
