import React from 'react';
import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';
import {gql, GraphQLClient} from 'graphql-request';
import Spinner from "../../components/spinner"
import { NextPage } from '@lib/types';
import { Box, Image, Text} from '@chakra-ui/react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = {};
  return { props: { data } };
};

const TOKEN = "__DEMO__ODDULAR_PUBLIC_TOKEN_00000";
const GRAPHQL_URL = "http://localhost:8000/storefront/";

interface ProductPageProps {}


const query = gql` 
  query getProduct($product_id: ID!){ 
    product(id: $product_id){ 
      name 
      description
      descriptionJson
      hasVariants
      thumbnail(size: 1000) {
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

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const ProductPage: NextPage<ProductPageProps> = ({}) => {
  const [data, setData] = React.useState(null);

  const router = useRouter()
  const {product_id} = router.query

  
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
      setData(data.product);
    });
  },[])

  if(data){
    return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" py={3}>
      <Image src={data.thumbnail?.url} alt={data.thumbnail?.alt} w="65%" mb={2} rounded="lg"/>
      <Box w="65%">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Text fontSize="4xl" fontWeight="800">{data.name}</Text>
          <Text fontSize="3xl" fontWeight="800">{moneyFormatter.format(data.listing.price.amount)}</Text>
        </Box>
        <Text fontSize="xl" fontWeight="400">{data.description}</Text>
        {data.hasVariants 
            && <Text fontSize="2xl" fontWeight="600">Variants</Text> 
            && data.variants.map((variant: any, index: number)=>{
          return (
          <Box key={index} display="flex" flexDirection="row" justifyContent="space-between">
            <Text fontSize="xl" fontWeight="500">{variant.name}</Text>
            <Text fontSize="lg" fontWeight="500">{moneyFormatter.format(variant.listing.price.amount)}</Text>
          </Box>
        );
      })}
      </Box>
    </Box>);
  }else{
    return <Spinner/>
  }
};

ProductPage.layout = null;
export default ProductPage;
