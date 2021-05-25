import React from "react";
import { Flex, Box, Button, Text, HStack } from "@chakra-ui/react";
import { useGetCartQuery } from "@oddular/graphql-client-apollo";
import { getCartToken } from "../pages/api/tokens";
import { PaymentComponent } from "../components/Payment";
import Link from "next/link";

interface CheckoutProps {}

const checkout: React.FC<CheckoutProps> = ({}) => {
  const [paying, setPaying] = React.useState(false);
  const [platform, setPlatform] = React.useState("stripe");
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
      <Button
        id="checkout"
        onClick={(event) => {
	  if(event.target.id!=="checkout") setPlatform(event.target.id);
	  else if(platform !== "") setPaying(true);
        }}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
	p={2}
      >
        <Box />
        <Text>Checkout</Text>
        <HStack>
          <Button id="stripe" borderColor={platform === "stripe" ? "black" : "gray.200"} borderWidth="1px">Stripe</Button>
          <Button id="apple" borderColor={platform === "apple" ? "black" : "gray.200"} borderWidth="1px">Apple Pay</Button>
        </HStack>
      </Button>
      <Box display={paying ? "display" : "none"}>
	<Box display={platform==="stripe" ? "display" : "none"}>
        <PaymentComponent
          onUpdate={() => {
            console.log("update");
          }}
          onCheckout={() => {
            setPaid(true);
          }}
          payButtonDisabled={paid}
        />
	</Box>
      </Box>
      <Text color="green" display={paid ? "display" : "none"}>
        Paid!
      </Text>
      <Box display={paid ? "display" : "none"}>
        <Link href={"/order/" + data.cart.token}>
          Continue to Order Confirmation
        </Link>
      </Box>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Flex>
  );
};

export default checkout;
