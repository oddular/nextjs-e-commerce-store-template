import React from 'react';
import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';
import { NextPage } from '@lib/types';
import { Box } from '@chakra-ui/react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = {};
  return { props: { data } };
};

interface ProductPageProps {}

const ProductPage: NextPage<ProductPageProps> = ({}) => {
  const router = useRouter()
  const {product_id} = router.query
  console.log(product_id)
  return <Box>{product_id}</Box>;
};

ProductPage.layout = null;
export default ProductPage;
