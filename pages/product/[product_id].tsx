import React from 'react';
import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';
import {gql, GraphQLClient} from 'graphql-request';
import { NextPage } from '@lib/types';
import { Box } from '@chakra-ui/react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = {};
  return { props: { data } };
};

const TOKEN = "__DEMO__ODDULAR_PUBLIC_TOKEN_00000";
const GRAPHQL_URL = "http://localhost:8000/storefront/";

interface ProductPageProps {}

const ProductPage: NextPage<ProductPageProps> = ({}) => {
  const router = useRouter()
  const {product_id} = router.query
  console.log(product_id)
  const query = gql`
    query getProduct($product_id: ID!){
      Product(id: $product_id){
        name
        description
        descriptionJson
        hasVariants
        thumbnail(size: 255) {
          url
          alt
        }
        listing {
          hasVariants
          price {
            amount
            currency
          }
        }
        variants {
          id
          sku
          name
          images {
            id
            url
            alt
          }
          listing {
            price {
              amount
              currency
            }
          }
          pricing {
            onSale
            priceUndiscounted {
              currency
              gross
              net
            }
          }
        }
      }
    }
  `
  
  const client = new GraphQLClient(GRAPHQL_URL);

  const variables = {
    product_id: product_id
  }

  client.request(query, variables);

  return <Box>{product_id}</Box>;
};

ProductPage.layout = null;
export default ProductPage;
