import React from 'react';
import { GetServerSideProps } from 'next';
import { NextPage } from '@lib/types';
import { Box } from '@chakra-ui/react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = {};
  return { props: { data } };
};

interface ProductPageProps {}

const ProductPage: NextPage<ProductPageProps> = ({}) => {
  return <Box>hi</Box>;
};

ProductPage.layout = null;
export default ProductPage;
