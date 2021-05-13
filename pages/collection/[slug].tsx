import React from 'react';
import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';
import {gql, GraphQLClient} from 'graphql-request';
import Spinner from "../../components/spinner"
import { NextPage } from '@lib/types';
import { Box, Image, Text} from '@chakra-ui/react';
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = {};
  return { props: { data } };
};

const TOKEN = "__DEMO__ODDULAR_PUBLIC_TOKEN_00000";
const GRAPHQL_URL = "http://localhost:8000/storefront/";

interface CollectionPageProps {}


const query = gql` 
  query getCollectionBySlug($slug: String!){ 
    collection(slug: $slug){ 
      id
      seoTitle
      seoDescription
      name
      description
      descriptionJson
      slug
      products(first:2){
        edges{
          node{
            name
          }
        }
      }
      backgroundImage(size: 500){
        url
        alt
      }
    } 
  } 
` 

const CollectionPage: NextPage<CollectionPageProps> = ({}) => {
  const [data, setData] = React.useState(null);

  const router = useRouter()
  const {slug} = router.query

  
  const client = new GraphQLClient(GRAPHQL_URL, {
    headers: {
      "x-oddular-storefront-token": TOKEN,
    },
    credentials: "include",
    mode: "cors",
  });

  const variables = {
    slug: slug,
  }

  React.useEffect(()=>{
    client.request(query, variables).then((data)=>{
      setData(data.collection);
    });
  },[])

  if(data){
    return (
    <Box>
      <Text>{JSON.stringify(data)}</Text>
      <Text>{data.name}</Text>
      <Text>{data.description}</Text>
      {data.products.edges.length > 0 && <Text fontWeight="bold">Products in this Collection</Text>}
      {data.products.edges.map((edge, index)=>{
        return (<Link href={"/product/" + edge.node.id}><Text textDecoration="underline" _hover={{"cursor":"grab"}}>
          {edge.node.name}
        </Text></Link>);
      })}
      <Image src={data.backgroundImage.url} alt={data.backgroundImage.alt}/>
    </Box>
      );
  }else{
    return <Spinner/>
  }
};

CollectionPage.layout = null;
export default CollectionPage;
