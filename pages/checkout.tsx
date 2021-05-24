import React from 'react';
import {Flex, Box, Button, Text} from "@chakra-ui/react";
import {useGetCartQuery} from "@oddular/graphql-client-apollo";

interface CheckoutProps{

}

const checkout:React.FC<CheckoutProps> = ({}) => {
  const {data, loading, error} = useGetCartQuery({variables:{token:""}});
  const cart = [{"name": "product1", "price":2.45}, {"name":"product2", "price": 3.45}];//dummy cart
  return (
  <Flex flexDirection="column">
    {JSON.stringify(data)}
    {cart.length} items
    {cart.map((product, index) => {
      return <Box key={index}>{product.name}: ${product.price}</Box>
    })}
    <Button>Checkout</Button>
  </Flex>
  );
}

export default checkout;

