import React from 'react';

import {Box, Text, Image} from "@chakra-ui/react";

interface ShippingCardProps{
  rate: any;
  selected: boolean;
  handleSelect: () => void;
}

const ShippingCard:React.FC<ShippingCardProps> = ({rate, selected, handleSelect}) => {
  return (
  <Box 
    borderWidth="1px"
    borderColor={selected ? "black" : "gray.100"}
    boxShadow="sm"
    borderRadius="lg"
    p={1}
    m={1}
    onClick={handleSelect}
    bg={selected ? "gray.100" : "white"}
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
  >
    {/* <Text as="pre">{JSON.stringify(rate, null, 2)}</Text> */}
    <Box display="flex" flexDirection="row" alignItems="center">
      <Image src={rate.provider_image_200} alt={rate.provider} w="40px" m={2}/>
      <Text>${rate.amount_local}</Text>
    </Box>
    <Text fontSize="xs" width="50%" align="right">{rate.duration_terms}</Text>
  </Box>
  );
}

export default ShippingCard;
