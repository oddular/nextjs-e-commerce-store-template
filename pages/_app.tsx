import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';

import { OddCommerceProvider } from '@oddular/commerce-react';

import {
  ODDULAR_STOREFRONT_TOKEN,
  ODDULAR_STOREFRONT_GRAPHQL_ENDPOINT,
} from '../utils/constants';

const ODDULAR_OPTIONS = {
  dev: true,
  ssr: true,
  graphql: {
    uri: ODDULAR_STOREFRONT_GRAPHQL_ENDPOINT,
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <OddCommerceProvider
      storefrontToken={ODDULAR_STOREFRONT_TOKEN}
      options={ODDULAR_OPTIONS}
    >
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </OddCommerceProvider>
  );
}

export default MyApp;
