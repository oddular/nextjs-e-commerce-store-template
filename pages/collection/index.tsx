import React from "react";
import {useCollectionListQuery} from "@oddular/graphql-client-apollo";
import CollectionCard from "../../components/CollectionCard";
import {Box} from "@chakra-ui/react";
interface CollectionProps{

}

const Collection:React.FC<CollectionProps> = ({}) => {
  const {data, loading, error} = useCollectionListQuery({variables:{first:10}});
  if(!!!data) return <>Loading</>;
  return (
	  <Box m={2}>
	    {data.collections.edges.map((node)=>{return <CollectionCard collection={node.node}/>;})}
	  </Box>);
};

export default Collection;
