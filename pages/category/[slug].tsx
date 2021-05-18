import React from 'react';
import { GetServerSideProps } from 'next';
import {useRouter} from 'next/router';
import Spinner from "../../components/spinner"
import { NextPage } from '@lib/types';
import { Box, Image, Text} from '@chakra-ui/react';
import Link from "next/link";
import {useGetCategoryBySlugQuery} from "@oddular/graphql-client-apollo"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = {};
  return { props: { data } };
};

interface CategoryPageProps {}



const CategoryPage: NextPage<CategoryPageProps> = ({}) => {

  const router = useRouter()
  const {slug} = router.query
  let safeSlug: string;
  if(typeof slug === "string"){
    safeSlug = slug;
  }else if (typeof slug[0] === "string"){
    safeSlug = slug[0];
  }
  const {data, loading, error} = useGetCategoryBySlugQuery({
    variables: {slug:safeSlug}
  })

  if(data){
    return (
    <Box>
      <Text>{JSON.stringify(data.category)}</Text>
      <Text>{data.category.name}</Text>
      <Text>{data.category.description}</Text>
      {!!data.category.parent && 
      <Box>
        <Text fontWeight="bold">Parent Category</Text>
        <Link href={"/category/" + data.category.parent.slug}>
          <Text textDecoration="underline" _hover={{"cursor": "grab"}}>{data.category.parent.name}</Text>
        </Link>
      </Box>
      } 
      {data.category.products.edges.length > 0 && <Text fontWeight="bold">Products in this Category</Text>}
      {data.category.products.edges.map((edge, index)=>{
        return (<Link href={"/product/" + edge.node.id}><Text textDecoration="underline" _hover={{"cursor":"grab"}}>
          {edge.node.name}
        </Text></Link>);
      })}
      {data.category.children.edges.length > 0 && <Text fontWeight="bold">Children of this Category</Text>}
      {data.category.children.edges.map((edge, index)=>{
        return (
        <Link href={edge.node.slug}>
          <Text textDecoration="underline" _hover={{"cursor":"grab"}}>
            {edge.node.name}
          </Text>
        </Link>);
      })}
      <Image src={data.category.backgroundImage.url} alt={data.category.backgroundImage.alt}/>
    </Box>
      );
  }else{
    return <Spinner/>
  }
};

CategoryPage.layout = null;
export default CategoryPage;
