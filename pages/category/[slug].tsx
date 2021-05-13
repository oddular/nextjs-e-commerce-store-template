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

interface CategoryPageProps {}


const query = gql` 
  query getCategoryBySlug($slug: String!){ 
    category(slug: $slug){ 
      id
      seoTitle
      seoDescription
      name
      description
      descriptionJson
      slug
      parent{
        name
        slug
      }
      level
      products(first:2){
        edges{
          node{
            id
            name
            category{
              name
            }
            collections{
              name
            }
          }
        }
      }
      children(first:2){
        edges{
          node{
            name
            slug
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

const CategoryPage: NextPage<CategoryPageProps> = ({}) => {
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
      setData(data.category);
    });
  },[])

  if(data){
    return (
    <Box>
      <Text>{JSON.stringify(data)}</Text>
      <Text>{data.name}</Text>
      <Text>{data.description}</Text>
      {!!data.parent && 
      <Box>
        <Text fontWeight="bold">Parent Category</Text>
        <Link href={"/category/" + data.parent.slug}>
          <Text textDecoration="underline" _hover={{"cursor": "grab"}}>{data.parent.name}</Text>
        </Link>
      </Box>
      } 
      {data.products.edges.length > 0 && <Text fontWeight="bold">Products in this Category</Text>}
      {data.products.edges.map((edge, index)=>{
        return (<Link href={"/product/" + edge.node.id}><Text textDecoration="underline" _hover={{"cursor":"grab"}}>
          {edge.node.name}
        </Text></Link>);
      })}
      {data.children.edges.length > 0 && <Text fontWeight="bold">Children of this Category</Text>}
      {data.children.edges.map((edge, index)=>{
        return (
        <Link href={edge.node.slug}>
          <Text textDecoration="underline" _hover={{"cursor":"grab"}}>
            {edge.node.name}
          </Text>
        </Link>);
      })}
      <Image src={data.backgroundImage.url} alt={data.backgroundImage.alt}/>
    </Box>
      );
  }else{
    return <Spinner/>
  }
};

CategoryPage.layout = null;
export default CategoryPage;
