import React from 'react';
import { Box, Text, Heading, Button, Stack } from '@chakra-ui/react';

import { OddularStorefrontClient, gql } from '@oddular/commerce-core';

import { GraphQLClient } from 'graphql-request';

interface ProductCardProps {
  product: any;
}

export const cartErrorFragment = gql`
  fragment CartError on CartError {
    code
    field
    message
  }
`;

export const paymentGatewayFragment = gql`
  fragment PaymentGateway on PaymentGateway {
    id
    name
    config {
      field
      value
    }
    currencies
  }
`;

export const cartPriceFragment = gql`
  fragment Price on TaxedMoney {
    currency
    gross
    net
    tax
  }
`;

export const cartAddressFragment = gql`
  fragment Address on Address {
    id
    firstName
    lastName
    companyName
    streetAddress1
    streetAddress2
    city
    postalCode
    country {
      code
      country
    }
    countryArea
    phone
    isDefaultBillingAddress
    isDefaultShippingAddress
  }
`;

export const cartProductVariantFragment = gql`
  ${cartPriceFragment}
  fragment ProductVariant on ProductVariant {
    id
    name
    sku
    quantityAvailable
    pricing {
      onSale
      priceUndiscounted {
        ...Price
      }
      price {
        ...Price
      }
    }
    attributes {
      attribute {
        id
        name
      }
      values {
        id
        name
        value: name
      }
    }
    product {
      id
      name
      slug
      thumbnail {
        url
        alt
      }
      thumbnail2x: thumbnail(size: 510) {
        url
      }
      productType {
        id
        isShippingRequired
      }
    }
  }
`;

export const cartShippingMethodFragment = gql`
  fragment ShippingMethod on ShippingMethod {
    id
    name
    price {
      currency
      amount
    }
  }
`;

export const cartLineFragment = gql`
  ${cartPriceFragment}
  fragment CartLine on CartLine {
    id
    quantity
    totalPrice {
      ...Price
    }
  }
`;

export const cartFragment = gql`
  ${cartLineFragment}
  ${cartAddressFragment}
  ${cartShippingMethodFragment}
  ${paymentGatewayFragment}
  fragment Cart on Cart {
    token
    id

    shippingAddress {
      ...Address
    }
    email
    availableShippingMethods {
      ...ShippingMethod
    }

    lines {
      ...CartLine
    }
    availablePaymentGateways {
      ...PaymentGateway
    }
    totals {
      currency
      subtotal
      shipping
      delivery
      pickup
      fee
      promotion
      weightHold
      tip
      donation
      tax
      pendingTax
      grandTotal
    }
  }
`;

export const createCartMutation = gql`
  ${cartFragment}
  ${cartErrorFragment}
  mutation CreateCart($cartInput: CartCreateInput!) {
    cartCreate(input: $cartInput) {
      created
      cartErrors {
        ...CartError
      }
      cart {
        ...Cart
      }
    }
  }
`;
const TOKEN = '__DEMO__ODDULAR_PUBLIC_TOKEN_00000';
const GRAPHQL_URL = 'http://localhost:8000/storefront/';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = React.useState('');

  const handleAddToCart = (e) => {
    const client = new GraphQLClient(GRAPHQL_URL, {
      headers: {
        'x-oddular-storefront-token': TOKEN,
        'x-oddular-cart-token': '',
      },
      credentials: 'include',
      mode: 'cors',
    });

    const lineItem = {
      quantity: 1,
      note: 'a note',
      choice: 'a choice',
      productId: product.id,
      variantId: selectedVariant,
    };

    const variables = {
      cartInput: {
        localToken: '12j1239jf0942',
        lines: [lineItem],
        email: '',
        phone: '',
        phoneTransactionalSmsAgree: false,
      },
    };

    let mutation = createCartMutation;

    client.request(mutation, variables).then((result) => {
      JSON.stringify(result);
    });

    // const OddularClient = new OddularStorefrontClient(
    //   TOKEN,
    //   {},
    //   '',
    //   GRAPHQL_URL,
    //   true,
    //   true,
    // );

    // OddularClient.addProductToCart({
    //   quantity: 1,
    //   variantId,
    //   note: 'a note',
    //   choice: 'a choice',
    // }).then((data) => {
    //   console.log(data);
    // });

    // setTimeout(() => {
    //   setCart(cart + 1);
    // }, 200);
  };

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.100"
      boxShadow="sm"
      p={2}
      borderRadius="lg"
      width="full"
      display="flex"
      flexDirection="column"
    >
      <Stack>
        <Heading>{product.name}</Heading>
        <Box
          display={product.hasVariants ? 'flex' : 'none'}
          flexDirection="column"
        >
          <Text fontSize="xs" fontWeight={400}>
            Choose One
          </Text>
          <Stack direction="row" spacing={2}>
            {product.variants.map((variant) => {
              return (
                <Box
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  borderWidth="2px"
                  borderRadius="xl"
                  bg="gray.50"
                  px={2}
                  py={1}
                  borderColor={
                    selectedVariant === variant.id ? 'blue.500' : 'transparent'
                  }
                >
                  {variant.name}
                </Box>
              );
            })}
          </Stack>
        </Box>
        <Button type="button" size="xs" onClick={handleAddToCart}>
          Add to cart
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductCard;
