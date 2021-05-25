import React from "react";
import { Flex, Box, Button, Text } from "@chakra-ui/react";
import { useGetCartQuery } from "@oddular/graphql-client-apollo";
import { getCartToken } from "../pages/api/tokens";
import { PaymentComponent } from "../components/Payment";

interface CheckoutProps {}

const checkout: React.FC<CheckoutProps> = ({}) => {
  const [paying, setPaying] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const { data, loading, error } = useGetCartQuery({
    variables: { token: getCartToken() },
  });
  if (!!!data) return <></>;
  return (
    <Flex flexDirection="column">
      {data.cart.lines.map((line, index) => {
        return (
          <Box key={index}>
            {line.product.name}: ${line.totalPrice.gross}
          </Box>
        );
      })}
      <Text>Subtotal: ${data.cart.totals.subtotal}</Text>
      <Text>Tax: ${data.cart.totals.tax}</Text>
      <Text>Total: ${data.cart.totals.grandTotal}</Text>
      <Button onClick={() => setPaying(true)}>Checkout</Button>
      <Box display={paying ? "display" : "none"}>
        <PaymentComponent
          onUpdate={() => {console.log("update")}}
          onCheckout={() => {setPaid(true)}}
          payButtonDisabled={paid}
        />
	<Text color="green" display={paid?"display":"none"}>Paid!</Text>
      </Box>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Flex>
  );
};

export default checkout;
