import React from "react";
import { setCustomerProfile } from "./api/profile";
import { setCustomerTokens } from "./api/tokens";
import { useCustomerAuthenticateMutation } from "@oddular/graphql-client-apollo";
import { Input, Button, Box, Text } from "@chakra-ui/react";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [customerUsername, setCustomerUsername] = React.useState(
    "customer.0@example.com"
  );
  const [customerPassword, setCustomerPassword] = React.useState("oddular");
  const [authenticateCustomer, { data, loading, error }] =
    useCustomerAuthenticateMutation();

  const handleSubmit = () => {
    authenticateCustomer({
      variables: {
        email: customerUsername,
        password: customerPassword,
      },
    }).then((result) => {
      setCustomerTokens({
        csrf: result.data.tokenCreate.csrfToken,
        refresh: result.data.tokenCreate.refreshToken,
        access: result.data.tokenCreate.token,
      });
      setCustomerProfile(result.data.tokenCreate.customer);
    });
  };
  return (
    <Box>
      <Text>Login</Text>
      <Input type="text" value={customerUsername} onChange={(event)=>{setCustomerUsername(event.target.value)}}/>
      <Input type="password" value={customerPassword} onChange={(event)=>{setCustomerPassword(event.target.value)}}/>
      <Button onClick={handleSubmit}>Sign in</Button>
    </Box>
  );
};

export default Login;
