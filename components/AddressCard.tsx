import React from 'react';
import {Box, Text} from "@chakra-ui/react";

interface AddressCardProps{
  address: any,
  label: string
}

const AddressCard: React.FC<AddressCardProps> = ({address, label}) => {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" rounded="lg" p={2} m={2} w="300px" borderColor="black" borderWidth="1px">
      <Text fontWeight="bold">{label}</Text>
      <Text>{address.firstName + " " + address.lastName}</Text> 
      <Text>{address.companyName}</Text> 
      <Text>{address.streetAddress1}</Text> 
      <Text>{address.city + ", " + (address.countryArea ? address.countryArea + ", " : "") + address.country.code + " " + address.postalCode }</Text> 
      <Text>{address.phone}</Text> 
    </Box>
  )
}

export default AddressCard;
