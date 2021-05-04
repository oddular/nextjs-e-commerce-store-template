import React from 'react';
import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';
import {gql, GraphQLClient} from 'graphql-request';
import Spinner from "../../components/spinner"
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
  const [data, setData] = React.useState({});

  const router = useRouter()
  const {product_id} = router.query

  const query = gql` 
    query getProduct($product_id: ID!){ 
      product(id: $product_id){ 
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
  
  const client = new GraphQLClient(GRAPHQL_URL, {
    headers: {
      "x-oddular-storefront-token": TOKEN,
    },
    credentials: "include",
    mode: "cors",
  });

  const variables = {
    product_id: product_id
  }

  React.useEffect(()=>{
    client.request(query, variables).then((data)=>{
      setData(data);
    });
  },[])

  if(data){
    return <Box>{JSON.stringify(data)}</Box>;
  }else{
    return <Spinner/>
  }
};

ProductPage.layout = null;
export default ProductPage;
