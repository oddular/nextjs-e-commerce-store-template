import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Link from "next/link"

interface WarehouseCardProps {
  warehouse: any;
}
const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse }) => {
  return (
    <Box>
      <Link href={"/warehouse/" + warehouse.id}>
        <Text>{warehouse.companyName}</Text>
      </Link>
      Shipping Zones:
      {warehouse.shippingZones.edges.map((node, index) => {
	return <>{(index > 0 ? ", " : " ") + node.node.name}</>
      })}
      <Text>{warehouse.address.firstName + " " + warehouse.address.lastName}</Text>
      <Text>{warehouse.address.streetAddress1}</Text>
      <Text>{warehouse.address.streetAddress2}</Text>
      <Text>{warehouse.address.city + ", " + (warehouse.address.countryArea !== ""  ? warehouse.address.countryArea + ", " : "" )+ warehouse.address.country.code}</Text>
      <hr/>
    </Box>
  );
};

export default WarehouseCard;
