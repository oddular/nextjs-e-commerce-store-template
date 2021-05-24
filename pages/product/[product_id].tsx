import React from 'react';
import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';
import Spinner from "../../components/spinner"
import { NextPage } from '@lib/types';
import { Box, Image, Text} from '@chakra-ui/react';
import Link from "next/link"
import {useGetProductQuery} from "@oddular/graphql-client-apollo"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = {};
  return { props: { data } };
};

interface ProductPageProps {}

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const ProductPage: NextPage<ProductPageProps> = ({}) => {
  const router = useRouter()
  const {product_id} = router.query;

  let id:string;
  if(typeof product_id === "string"){
    id = product_id;
  }else if(typeof product_id[0] === "string"){
    id = product_id[0];
  }
  const {data, loading, error} = useGetProductQuery({
    variables:{ "product_id": id  }});


  if(!!!loading){
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" py={3}>
      <Box h="75vh" w="65%" roundedTop="2xl" overflow="hidden" display="flex" justifyContent="center" mb="-1em" borderColor="gray.100" borderWidth="1px" boxShadow="sm">
         <Image src={data.product.thumbnail?.url} alt={data.product.thumbnail?.alt} w="100%" objectFit="cover"/>
      </Box>
      <Box w="65%" bg="white" rounded="2xl" p={3} borderColor="gray.100" borderWidth="1px" boxShadow="sm">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Text fontSize="4xl" fontWeight="800">{data.product.name}</Text>
          <Text fontSize="3xl" fontWeight="800">{moneyFormatter.format(data.product.listing.price.amount)}</Text>
        </Box>
        <Text fontSize="xl" fontWeight="400">{data.product.description}</Text>
        {data.product.hasVariants 
            && 
            <Box>
              <Text fontSize="2xl" fontWeight="600">Variants</Text> 
              {data.product.variants.map((variant: any, index: number)=>{
                return (
                <Box key={index} display="flex" flexDirection="row" justifyContent="space-between">
                  <Text fontSize="xl" fontWeight="500">{variant.name}</Text>
                  <Text fontSize="lg" fontWeight="500">{moneyFormatter.format(variant?.listing?.price?.amount)}</Text>
                </Box>
                );
        })}
      </Box>
      }
        {!!data.product.category && 
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="600">Category</Text>
            <Link href={"/category/" + data.product.category.slug}>
              <Text textDecoration="underline" _hover={{"cursor": "grab"}}>
                {data.product.category.name}
              </Text>
            </Link>
          </Box>
        }
        {!!data.product.collections && data.product.collections.length > 0 && 
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="600">Collections</Text>
            {data.product.collections.map((collection, index)=>{
              return (
                <Link href={"/collection/" + collection.slug}>
                  <Text textDecoration="underline" _hover={{"cursor": "grab"}}>
                    {collection.name}
                  </Text>
                </Link>
              );
            })
            }
          </Box>
        }
      </Box>
    </Box>);

  }else{
    return <Spinner/>
  }
};

ProductPage.layout = null;
export default ProductPage;
