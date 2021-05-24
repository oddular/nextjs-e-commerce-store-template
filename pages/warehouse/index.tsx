import React from "react";
import {Box} from "@chakra-ui/react";
import {useWarehouseListQuery} from "@oddular/graphql-client-apollo"
import WarehouseCard from "../../components/WarehouseCard"

interface WarehousesProps {}

const Warehouses: React.FC<WarehousesProps> = ({}) => {
  const {data, loading, error} = useWarehouseListQuery({variables:{first:3}});
  return (
    <Box>
      {data?.warehouses.edges.map((node, index) => {
        return <WarehouseCard key={node.node.id} warehouse={node.node}/>
      })}
    </Box>
  );
};

export default Warehouses;
