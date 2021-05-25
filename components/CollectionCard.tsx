import React from 'react';
import { Box, Text, Heading, Button, Stack, Image, Wrap, WrapItem} from '@chakra-ui/react';

import Link from 'next/link'

interface CollectionCardProps {
  collection: any;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Box
      borderWidth="1px"
      borderColor="gray.100"
      boxShadow="sm"
      borderRadius="2xl"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      mb={3}
    >
        {!!collection.backgroundImage &&
        <Link href={"/collection/" + collection.slug}>
          <Box h="250px" overflow="hidden" roundedTop="2xl" mb="-1em" zIndex={1}>
            <Image src={collection.backgroundImage.url} alt={collection.backgroundImage.alt} w="100%" objectFit="contain"/>
          </Box>
        </Link>
        }
      <Box p={3} rounded="2xl" overflow="hidden" bg="white" zIndex={2} display="flex" justifyContent="space-between" flexDirection="column" height="calc(100% - 250px + 1em)" borderColor="gray.100" borderTopWidth="2px">
          <Link href={"/collection/" + collection.slug}>
            <Heading mb={2}>{collection.name}</Heading>
          </Link>
        </Box>
    </Box>
  );
};

export default CollectionCard;
