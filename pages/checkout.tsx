import React from 'react';
import {Flex, Box, Button, Text} from "@chakra-ui/react";

interface CheckoutProps{

}

const checkout:React.FC<CheckoutProps> = ({}) => {
  const cart = [{"name": "product1", "price":2.45}, {"name":"product2", "price": 3.45}];//dummy cart
  return (
  <Flex flexDirection="column">
    {cart.length} items
    {cart.map((product, index) => {
      return <Box key={index}>{product.name}: ${product.price}</Box>
    })}
    <Text>Subtotal: ${cart.reduce((accumulator, product)=>{})}</Text>
    <Button>Checkout</Button>
  </Flex>
  );
}

export default checkout;

