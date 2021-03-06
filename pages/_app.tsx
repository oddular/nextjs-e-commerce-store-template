import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

import { OddCommerceProvider } from "@oddular/commerce-react";

import { createClient } from "@oddular/graphql-client-apollo";
import { ApolloProvider } from "@apollo/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLIC_KEY } from "../constants"

import {
  ODDULAR_STOREFRONT_TOKEN,
  ODDULAR_STOREFRONT_GRAPHQL_ENDPOINT,
} from "../utils/constants";

const ODDULAR_OPTIONS = {
  dev: true,
  ssr: true,
  graphql: {
    uri: ODDULAR_STOREFRONT_GRAPHQL_ENDPOINT,
  },
};

const OddularClient = createClient({
  uri: "http://localhost:8000/storefront/",
  token: ODDULAR_STOREFRONT_TOKEN,
  headers: {
    "x-oddular-storefront-token": ODDULAR_STOREFRONT_TOKEN,
  },
});

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={OddularClient}>
      <OddCommerceProvider
        storefrontToken={ODDULAR_STOREFRONT_TOKEN}
        options={ODDULAR_OPTIONS}
      >
        <ChakraProvider>
          <Elements stripe={stripePromise}>
            <Component {...pageProps} />
          </Elements>
        </ChakraProvider>
      </OddCommerceProvider>
    </ApolloProvider>
  );
}

export default MyApp;
