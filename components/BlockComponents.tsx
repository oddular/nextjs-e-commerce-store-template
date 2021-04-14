import {
  Alert,
  Box,
  chakra,
  Heading,
  Text,
  HTMLChakraProps,
  Kbd,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

const Pre = (props) => <chakra.div my="2em" borderRadius="sm" {...props} />;

const Table = (props) => (
  <chakra.div overflowX="auto">
    <chakra.table textAlign="left" mt="32px" width="full" {...props} />
  </chakra.div>
);

const THead = (props) => (
  <chakra.th
    bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
    fontWeight="semibold"
    p={2}
    fontSize="sm"
    {...props}
  />
);

const TData = (props) => (
  <chakra.td
    p={2}
    borderTopWidth="1px"
    borderColor="inherit"
    fontSize="sm"
    whiteSpace="normal"
    {...props}
  />
);

const InlineCode = (props: any) => (
  <chakra.code
    apply="mdx.code"
    color={useColorModeValue('purple.500', 'purple.200')}
    {...props}
  />
);

const BlockComponents = {
  h1: (block) => <Heading as="h1" children={block.data.text} />,
  h2: (block) => <Heading as="h2" children={block.data.text} />,
  h3: (block) => <Heading as="h3" children={block.data.text} />,
  h4: (block) => <Heading as="h4" children={block.data.text} />,
  hr: (props) => <chakra.hr apply="mdx.hr" {...props} />,
  strong: (props) => <Box as="strong" fontWeight="semibold" {...props} />,
  inlineCode: InlineCode,
  code: (props) => <Box as="code" {...props} />,
  pre: Pre,
  kbd: Kbd,
  br: ({ reset, ...props }) => (
    <Box
      as={reset ? 'br' : undefined}
      height={reset ? undefined : '24px'}
      {...props}
    />
  ),
  table: Table,
  th: THead,
  td: TData,
  a: (props) => <chakra.a apply="mdx.a" {...props} />,
  p: (block) => <Text children={block.data.text} />,
  ul: (props) => <chakra.ul apply="mdx.ul" {...props} />,
  ol: (props) => <chakra.ol apply="mdx.ul" {...props} />,
  li: (props) => <chakra.li pb="4px" {...props} />,
  blockquote: (props) => (
    <Alert
      mt="4"
      role="none"
      status="warning"
      variant="left-accent"
      as="blockquote"
      rounded="4px"
      my="1.5rem"
      {...props}
    />
  ),
};

export default BlockComponents;
