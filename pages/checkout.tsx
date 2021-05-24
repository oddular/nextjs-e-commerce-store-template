import React from 'react';
import {Flex, Box, Button, Text} from "@chakra-ui/react";
import {useGetCartQuery} from "@oddular/graphql-client-apollo";
import {getCartToken} from "../pages/api/tokens"

interface CheckoutProps{

}

const checkout:React.FC<CheckoutProps> = ({}) => {
  const {data, loading, error} = useGetCartQuery({variables:{token: getCartToken()}});
  if(!!!data) return <></>;
  return (
  <Flex flexDirection="column">
    {data.cart.lines.map((line, index) => {
      return <Box key={index}>{line.product.name}: ${line.totalPrice.gross}</Box>
    })}
     <Text>Subtotal: ${data.cart.totals.subtotal}</Text>
     <Text>Tax: ${data.cart.totals.tax}</Text>
     <Text>Total: ${data.cart.totals.grandTotal}</Text>
    <Button>Checkout</Button>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </Flex>
  );
}

export default checkout;

