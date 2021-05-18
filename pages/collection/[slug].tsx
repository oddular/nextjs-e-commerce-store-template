import React from 'react';
import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';
import {gql, GraphQLClient} from 'graphql-request';
import Spinner from "../../components/spinner"
import { NextPage } from '@lib/types';
import { Box, Image, Text} from '@chakra-ui/react';
import Link from "next/link";
import {useGetCollectionBySlugQuery} from "@oddular/graphql-client-apollo";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = {};
  return { props: { data } };
};

interface CollectionPageProps {}

const CollectionPage: NextPage<CollectionPageProps> = ({}) => {

  const router = useRouter()
  const {slug} = router.query
  let safeSlug: string;
  if(typeof slug === "string"){
    safeSlug = slug;
  }else if(typeof slug[0] === "string"){
    safeSlug = slug[0];
  }

  const {data, loading, error} = useGetCollectionBySlugQuery({variables:{slug:safeSlug}});

  if(data){
    return (
    <Box>
      <Text>{JSON.stringify(data.collection)}</Text>
      <Text>{data.collection.name}</Text>
      <Text>{data.collection.description}</Text>
      {data.collection.products.edges.length > 0 && <Text fontWeight="bold">Products in this Collection</Text>}
      {data.collection.products.edges.map((edge, index)=>{
        return (<Link href={"/product/" + edge.node.id}><Text textDecoration="underline" _hover={{"cursor":"grab"}}>
          {edge.node.name}
        </Text></Link>);
      })}
      <Image src={data.collection.backgroundImage.url} alt={data.collection.backgroundImage.alt}/>
    </Box>
      );
  }else{
    return <Spinner/>
  }
};

CollectionPage.layout = null;
export default CollectionPage;
