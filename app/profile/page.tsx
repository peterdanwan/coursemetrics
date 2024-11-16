'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Heading,
  Stack,
  Spinner,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import defaultAvatar from '@/assets/images/profile.png';
import type { StaticImageData } from 'next/image';
import { useFlexStyle } from '@/styles/styles';

export default function Profile() {
  const styles = useFlexStyle();
  const { user, isLoading } = useUser();
  const [avatarError, setAvatarError] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [userPicture, setUserPicture] = useState<string | undefined>();
  const fallbackAvatarUrl = (defaultAvatar as StaticImageData).src;

  useEffect(() => {
    // Prevent executing if no user
    if (!user) return;

    const img = new window.Image();

    if (user.picture) {
      img.src = user.picture;
    } else {
      setAvatarError(true);
      setAvatarLoading(false);
      return;
    }

    img.onload = () => {
      // Check if picture is still valid string before setting
      if (typeof user.picture === 'string') {
        setUserPicture(user.picture);
      }
      setAvatarLoading(false);
    };

    img.onerror = () => {
      setAvatarError(true);
      setAvatarLoading(false);
    };

    // Cleanup function to prevent memory leaks
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [user]); // Include user in dependency array

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      {user && (
        <Box my={'auto'}>
          <Center py={6}>
            <Box
              maxW={'270px'}
              w={'full'}
              bg={styles.cardBg}
              boxShadow={'2xl'}
              rounded={'md'}
              overflow={'hidden'}
            >
              <Image
                h={'120px'}
                w={'full'}
                src={
                  'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
                }
                objectFit="cover"
                alt="Profile background"
              />
              <Flex justify={'center'} mt={-12}>
                {avatarLoading ? (
                  <Spinner size="xl" />
                ) : (
                  <Avatar
                    size={'xl'}
                    src={avatarError ? fallbackAvatarUrl : userPicture}
                    name={user.name || 'User'}
                    css={{
                      border: `2px solid ${styles.bgColor}`,
                      backgroundColor: styles.bgColor,
                    }}
                  />
                )}
              </Flex>
              <Box p={6}>
                <Stack spacing={0} align={'center'} mb={5}>
                  <Heading
                    fontSize={'2xl'}
                    textColor={styles.color}
                    fontWeight={500}
                    fontFamily={'body'}
                  >
                    {user.name ?? ''}
                  </Heading>
                </Stack>

                <Stack direction={'column'} justify={'center'} spacing={1}>
                  <Heading fontSize={'sm'} textColor={styles.headingColor}>
                    Username
                  </Heading>
                  <Text fontSize={'sm'} textColor={styles.color}>
                    {user.nickname ?? ''}
                  </Text>
                  <Heading fontSize={'sm'} textColor={styles.headingColor}>
                    Email
                  </Heading>
                  <Text fontSize={'sm'} textColor={styles.color}>
                    {user.email ?? ''}
                  </Text>
                </Stack>
              </Box>
            </Box>
          </Center>
        </Box>
      )}
    </>
  );
}
