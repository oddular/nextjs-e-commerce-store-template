import React from "react";
import {useCategoryListQuery} from "@oddular/graphql-client-apollo";
import CategoryCard from "../../components/CategoryCard";
import {Box} from "@chakra-ui/react";
interface CategoryProps{

}

const Category:React.FC<CategoryProps> = ({}) => {
  const {data, loading, error} = useCategoryListQuery({variables:{first:10}});
  if(!!!data) return <>Loading</>;
  return (
	  <Box m={2}>
	    {data.categories.edges.map((node)=>{return <CategoryCard category={node.node}/>;})}
	  </Box>);
};

export default Category;
