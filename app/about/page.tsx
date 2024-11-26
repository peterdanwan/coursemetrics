// app/about/page.tsx
'use client';

import { ReactNode, ReactElement, useRef } from 'react';
import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
  Icon,
  Flex,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { useFlexStyle } from '@/styles/styles';
import { SiChakraui } from 'react-icons/si';
import { BiLogoPostgresql, BiSupport } from 'react-icons/bi';
import { FaDatabase, FaCode, FaGithub } from 'react-icons/fa';

interface FeatureProps {
  title: string;
  text: string;
  icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  const flexStyle = useFlexStyle();
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={flexStyle.color}
        rounded={'full'}
        bg={flexStyle.bgColor}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={flexStyle.color}>{text}</Text>
    </Stack>
  );
};

export default function About() {
  const teamSectionRef = useRef<HTMLDivElement>(null);

  const scrollToTeamSection = () => {
    if (teamSectionRef.current) {
      teamSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const flexStyle = useFlexStyle();

  return (
    <>
      <Container minWidth={'95vw'} alignContent={'center'} justifyContent={'center'}>
        <Box bg={flexStyle.bgColor} height={{ base: '80%', sm: '80%', lg: '100%' }} p={10} mt={5}>
          <Container maxW={'4xl'} zIndex={10} position={'relative'} height={'95%'}>
            <Stack direction={{ base: 'column', lg: 'column' }} height={'100%'}>
              <Stack
                flex={1}
                color={flexStyle.color}
                justify={{ lg: 'center' }}
                py={{ base: 4, md: 20, xl: 60 }}
              >
                <Box mb={{ base: 8, md: 20 }}>
                  <Text
                    fontFamily={'heading'}
                    fontWeight={700}
                    textTransform={'uppercase'}
                    mb={3}
                    // fontSize={"xl"}
                    fontSize={{ base: 'lg', md: 'xl' }}
                    color={flexStyle.color}
                  >
                    ABOUT US
                  </Text>
                  <Heading color={flexStyle.color} mb={5} fontSize={{ base: 'xl', md: '3xl' }}>
                    Revolutionizing Course Selection
                  </Heading>
                  <Text fontSize={{ base: 'md', md: 'xl' }} color={flexStyle.color}>
                    At CourseMetrics, we understand the importance of choosing the right courses and
                    professors. Our platform is built by students, for students, to provide
                    transparent and reliable insights into the academic experience at Seneca
                    Polytechnic.
                  </Text>
                </Box>
                <Divider
                  orientation="horizontal"
                  height="30px"
                  mx={1}
                  mb={20}
                  color={flexStyle.color}
                />

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                  {stats.map((stat) => (
                    <Box key={stat.title}>
                      <Text
                        fontFamily={'heading'}
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color={flexStyle.color}
                        mb={3}
                      >
                        {stat.title}
                      </Text>
                      <Text fontSize={{ base: 'md', md: 'xl' }} color={'gray.400'}>
                        {stat.content}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Container>

      {/* "Meet Our Team" Section */}
      <Container
        ref={teamSectionRef}
        minWidth={'95vw'}
        my={10}
        alignContent={'center'}
        justifyContent={'center'}
      >
        <Box p={4}>
          <Heading>Meet Our Team</Heading>
          <Divider orientation="horizontal" height="30px" mx={1} mb={20} />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={BiSupport} w={10} h={10} />}
              title={'Mimi Dang'}
              text={
                'Full-Stack Developer: Bridging the Front-end experience with Robust Back-end Solutions.'
              }
            />
            <Feature
              icon={<Icon as={BiLogoPostgresql} w={10} h={10} />}
              title={'Aryan Khurana'}
              text={'Back-end Architect: Ensuring Scalable and Efficient Server-Side Operations.'}
            />
            <Feature
              icon={<Icon as={FaDatabase} w={10} h={10} />}
              title={'Jeremy Lee'}
              text={'Back-end Developer: Crafting Secure and Reliable Back-end Systems.'}
            />
            <Feature
              icon={<Icon as={FaCode} w={10} h={10} />}
              title={'Vinh Nhan'}
              text={'Front-end SpecialistL Designing Intuitive and Engaging User Interfaces.'}
            />
            <Feature
              icon={<Icon as={SiChakraui} w={10} h={10} />}
              title={'Tomas Rochwerger'}
              text={'UI/UX Developer: Enhancing User Interaction and Visual Appeal'}
            />
            <Feature
              icon={<Icon as={FaGithub} w={10} h={10} />}
              title={'Peter Wan'}
              text={
                'Team Leader & Back-end Strategist: Steering the Project and Optimizing Back-end Infrastructure.'
              }
            />
          </SimpleGrid>
        </Box>
      </Container>
    </>
  );
}

const StatsText = (
  { children }: { children: ReactNode },
  flexStyle: ReturnType<typeof useFlexStyle>
) => (
  <Text as={'span'} fontWeight={700} color={flexStyle.color}>
    {children}
  </Text>
);

const stats = [
  {
    title: 'Student-Driven Reviews',
    content: (
      <>
        Our community of students shares detailed reviews and ratings, helping you navigate the
        complexities of course selection with confidence.
      </>
    ),
  },
  {
    title: 'Your Academic Success, Simplified',
    content: (
      <>
        We believe that informed decisions lead to better outcomes. With CourseMetrics, you can
        tailor your academic path to align with your goals and interests.
      </>
    ),
  },
  {
    title: 'Join the Community',
    content: (
      <>
        Become a part of a growing network of students who are making smarter choices and excelling
        in their studies.
      </>
    ),
  },
];
